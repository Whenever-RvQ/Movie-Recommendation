<template>
  <!-- 外层容器：包裹胶卷边框和编辑器 -->
  <div class="movie-editor-wrap">
    <!-- 左侧胶卷边框 -->
    <div class="film-border left-film"></div>

    <!-- 编辑器主体（保持原有内容） -->
    <el-card class="movie-editor">
      <div class="editor-section">
        <h3 class="movie-editor-title">
          <i class="el-icon-film title-icon"></i> 电影名
        </h3>
        <el-input ref="title" v-model="title" class="movie-editor-input" size="medium" placeholder="请输入电影名"></el-input>
      </div>

      <div class="editor-section">
        <h3 class="movie-editor-title">
          <i class="el-icon-user title-icon"></i> 导演
        </h3>
        <el-input v-model="director" class="movie-editor-input" size="medium" placeholder="请输入导演名字"></el-input>
      </div>

      <div class="editor-section">
        <h3 class="movie-editor-title">
          <i class="el-icon-tickets title-icon"></i> 电影简介
        </h3>
        <div id="blog-editor-textarea" class="editor-container" placeholder="请输入电影简介并附带电影封面"></div>
      </div>

      <div class="editor-section">
        <h3 class="movie-editor-title">
          <i class="el-icon-collection-tag title-icon"></i> 分类
        </h3>
        <div class="movie-editor-columns">
          <div v-for="tag in columns" :key="tag.id" class="movie-editor-tag" :class="{ 'selected': column === tag.id }"
            @click="selectColumn(tag.id)">
            {{ tag.name }}
          </div>
        </div>
      </div>

      <div class="movie-editor-button">
        <el-button type="primary" @click="submitEditor" class="btn-submit">提交</el-button>
        <el-button type="default" @click="cancelEditor" class="btn-reset">重置</el-button>
      </div>
    </el-card>

    <!-- 右侧胶卷边框 -->
    <div class="film-border right-film"></div>
  </div>
</template>

<script>
import wangEditor from 'wangeditor'
const COLUMN_ID = '5fe756e7dcda945a1cbf6ff6'

export default {
  name: 'MovieEditor',
  data() {
    return {
      editor: null,
      title: '',
      content: '',
      columns: [],
      column: '',
      director: '',
      score: 0
    };
  },
  created() {
    this.getColumns()
  },
  mounted() {
    const editor = new wangEditor(`#blog-editor-textarea`)
    const URL = 'http://127.0.0.1:3000/upload/article'

    // 编辑器配置（保持原有功能）
    editor.config.onchange = (newHtml) => {
      this.content = newHtml
    }
    this.editor = editor
    this.editor.config.uploadImgServer = URL
    this.editor.config.uploadImgMaxSize = 100 * 1024 * 1024 // 100M
    this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    this.editor.config.uploadImgMaxLength = 5
    this.editor.config.uploadFileName = 'file'
    this.editor.config.uploadImgHeaders = {
      'Authorization': `Bearer ${this.$store.state.token}`,
    }

    // 编辑器样式适配浅黑主题
    editor.config.menuBarBackgroundColor = '#2D2D2D'
    editor.config.editorContainerBackgroundColor = '#252525'
    editor.config.textColor = '#F5F5F5'
    editor.config.placeHolder = '请输入电影简介（支持图片上传）'
    editor.config.placeholder = '请输入电影简介并附带电影封面'
    editor.create()
  },
  methods: {
    async getColumns() {
      try {
        let columns = await this.$api({ type: 'columns' })
        this.columns = columns.list.map(item => {
          return {
            id: item._id,
            name: item.name
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    selectColumn(id) {
      this.column = this.column === id ? '' : id
    },
    submitEditor() {
      if (!this.validateEditor()) {
        return
      }
      this.postEditorData()
    },
    cancelEditor() {
      this.editor.txt.clear()
      this.title = ''
      this.column = ''
    },
    getCover() {
      let coverSrc = this.content.match(/src="([^"']*?)"/)?.[1] || undefined
      return coverSrc
    },
    validateEditor() {
      if (this.title.trim().length === 0) {
        this.$notify.error({
          title: '错误',
          message: '请填写电影名'
        })
        this.$refs.title.focus()
        return false
      }
      if (this.director.trim().length === 0) {
        this.$notify.error({ title: '错误', message: '请填写导演名字' });
        return false;
      }
      if (this.content.trim().length === 0) {
        this.$notify.error({
          title: '错误',
          message: '电影简介不能为空'
        })
        return false
      }
      return true
    },

    getContentText() {
      let tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.content;
      return tempDiv.textContent || tempDiv.innerText || '';
    },
    async postEditorData() {
      let postData = {
        title: this.title,
        body: this.getContentText(),
        cover: this.getCover(),
        column: this.column || COLUMN_ID,
        director: this.director,
        score: this.score
      }
      try {
        await this.$api({
          type: 'postMovie',
          data: JSON.parse(JSON.stringify(postData))
        })
        this.$notify.success({
          title: '成功',
          message: '电影信息提交成功'
        })
        this.$router.push('/index')
      } catch (err) {
        this.$notify.error({
          title: '错误',
          message: '提交失败：' + (err.message || '服务器异常')
        })
      }
    }
  },

  beforeDestroy() {
    this.editor.destroy()
    this.editor = null
  }
};
</script>

<style lang="stylus" scoped>
// 浅黑主题变量
$primary = #E50914
$light-black = #252525 // 浅黑背景（主背景）
$lighter-black = #333333 // 更浅的黑色（输入框/卡片背景）
$light = #F8F8F8 // 浅色文字
$gray = #AAAAAA // 次级文字
$border-color = #444444 // 边框颜色
$transition = all 0.3s ease

// 胶卷边框外层容器
.movie-editor-wrap
  display: flex
  align-items: stretch
  width: 100%
  min-height: 100vh
  background-color: #1A1A1A // 最外层深色背景，突出胶卷边框
  padding: 20px 0

// 胶卷边框样式（核心新增）
.film-border
  width: 60px
  background-color: #0F0F0F
  background-image: 
    radial-gradient(circle, #333 10px, transparent 12px),
    radial-gradient(circle, #333 10px, transparent 12px)
  background-size: 40px 60px
  background-position: 0 0, 20px 30px
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5)
  // 胶卷齿孔动画（缓慢滚动，增强质感）
  animation: filmRoll 20s linear infinite

// 左右边框对称
.left-film
  border-right: 2px solid #444

.right-film
  border-left: 2px solid #444

// 胶卷滚动动画
@keyframes filmRoll
  0%
    background-position: 0 0, 20px 30px
  100%
    background-position: 0 60px, 20px 90px

// 编辑器主体
.movie-editor
  background-color: $lighter-black
  border: 1px solid $border-color
  border-radius: 8px
  padding: 30px
  margin: 0 auto
  max-width: 1000px
  box-shadow: 0 5px 15px rgba(0,0,0,0.2)
  flex: 1
  overflow: hidden

// 每个编辑区块间距
.editor-section
  margin-bottom: 35px
  &:last-of-type
    margin-bottom: 30px

// 醒目标题样式
.movie-editor-title
  display: flex
  align-items: center
  gap: 12px
  padding: 10px 0
  font-size: 20px
  color: $primary // 标题文字红色，醒目突出
  font-weight: 700
  border-bottom: 2px solid $primary // 红色下划线强化视觉
  margin-bottom: 20px
  position: relative
  &::after
    content: ''
    position: absolute
    bottom: -2px
    left: 0
    width: 60px
    height: 2px
    background-color: #FF4444 // 渐变红色下划线
    border-radius: 1px

// 标题图标
.title-icon
  font-size: 22px
  color: $primary
  background-color: rgba(229,9,20,0.1)
  width: 40px
  height: 40px
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center

// 电影名输入框
.movie-editor-input
  .el-input__inner
    background-color: $light-black
    border-color: $border-color
    color: $light
    font-size: 16px
    height: 48px
    border-radius: 6px
    &:focus
      border-color: $primary
      box-shadow: 0 0 0 2px rgba(229,9,20,0.2)

// 编辑器容器
.editor-container
  background-color: $light-black
  border: 1px solid $border-color
  border-radius: 6px
  min-height: 300px
  padding: 15px
  // 适配wangEditor内部样式
  >>> .w-e-text-container
    background-color: transparent !important
    color: $light !important
  >>> .w-e-toolbar
    background-color: $lighter-black !important
    border-bottom: 1px solid $border-color !important
  >>> .w-e-menu
    color: $light !important
    &:hover
      background-color: #444444 !important
  >>> .w-e-selected
    background-color: rgba(229,9,20,0.2) !important
    color: $light !important

// 分类标签
.movie-editor-columns
  display: flex
  flex-wrap: wrap
  gap: 15px

.movie-editor-tag
  position: relative
  padding: 8px 16px
  font-size: 14px
  font-weight: 500
  color: $light
  background-color: $light-black
  border: 1px solid $border-color
  border-radius: 24px
  cursor: pointer
  transition: $transition
  z-index: 1
  &.selected
    color: white
    background-color: $primary
    border-color: $primary
    box-shadow: 0 4px 12px rgba(229,9,20,0.3)
    transform: scale(1.05)
  &:hover:not(.selected)
    border-color: $primary
    color: $primary
  &::before
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: $primary
    opacity: 0
    filter: blur(20px)
    z-index: -1
    transition: $transition
    transform: scale(0.8)
  &:hover::before
    opacity: 0.2
    transform: scale(1.2)

// 按钮区域
.movie-editor-button
  display: flex
  gap: 20px
  justify-content: center

.btn-submit, .btn-reset
  width: 160px
  height: 48px
  font-size: 16px
  font-weight: 600
  border-radius: 6px
  transition: $transition

// 提交按钮
.btn-submit
  background-color: $primary
  border-color: $primary
  color: white
  &:hover
    background-color: #C00812
    border-color: #C00812
    transform: translateY(-2px)
    box-shadow: 0 4px 12px rgba(229,9,20,0.3)
  &:active
    transform: translateY(0)
    box-shadow: 0 2px 8px rgba(229,9,20,0.2)

// 重置按钮
.btn-reset
  background-color: $light-black
  border-color: $border-color
  color: $light
  &:hover
    background-color: #3A3A3A
    border-color: #555555
    transform: translateY(-2px)
    box-shadow: 0 4px 12px rgba(0,0,0,0.2)
  &:active
    transform: translateY(0)
    box-shadow: 0 2px 8px rgba(0,0,0,0.1)

// 响应式适配（移动端隐藏胶卷边框，避免挤压）
@media (max-width: 992px)
  .film-border
    display: none
  .movie-editor
    margin: 20px
    padding: 20px
  .movie-editor-title
    font-size: 18px
  .title-icon
    width: 36px
    height: 36px
    font-size: 18px
  .movie-editor-button
    flex-direction: column
    gap: 15px
  .btn-submit, .btn-reset
    width: 100%
</style>