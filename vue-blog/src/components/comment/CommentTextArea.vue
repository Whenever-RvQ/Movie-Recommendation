<template>
  <div class="blog-comment blog-comment--editor">
    <h2 class="section-title">
      <i class="el-icon-s-comment"></i> 评论
    </h2>
    <!-- 评论输入框 -->
    <textarea ref="textarea" class="blog-comment--input" v-model="commentVal" name="comment" autofocus
      placeholder="分享你的观影感受..."></textarea>
    <!-- 提交按钮 -->
    <el-button type="primary" @click="submitComment" class="submit-btn">提交评论</el-button>
  </div>
</template>

<script>
export default {
  name: 'CommentTextArea',
  inject: ['getMovieById'],
  props: {
    aid: {
      type: String
    }
  },
  data() {
    return {
      commentVal: ''
    };
  },
  methods: {
    focusTextarea() {
      this.$refs.textarea.placeholder = '';

      this.$refs.textarea.focus();
    },
    async submitComment() {
      if (this.commentVal.trim().length === 0) {
        this.$notify.info({
          title: '请填写评论内容',
        })
        this.focusTextarea()
        return
      }
      try {
        await this.$api({ type: 'postComment', data: { aid: this.aid, content: this.commentVal } })
        this.$notify.success({
          title: '评论成功',
        })
        this.getMovieById()
      } catch (err) {
        this.$notify.error({
          title: '评论失败',
          message: err.message
        })
      }
      this.commentVal = ''
    }
  },
};
</script>

<style lang="stylus" scoped>
// 主题变量（与网站统一）
$primary: #E50914
$light-black: #252525
$lighter-black: #333333
$gray: #AAAAAA
$border-color: #444444
$transition: all 0.3s ease

// 评论输入区域
.blog-comment--editor {
  display: flex;
  background-color: #2D2D2D;
  flex-direction: column;
  gap: 15px;
  height: auto;
}

// 评论输入框
.blog-comment--input {
  width: 100%;
  min-height: 120px;
  background-color: $lighter-black;
  border: 1px solid $border-color;
  border-radius: 8px;
  padding: 15px;
  color: black;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  transition: $transition;

  // 占位符样式
  &::placeholder {
    color: $gray;
    opacity: 0.8;
  }

  // 聚焦效果
  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 2px rgba(229,9,20,0.2);
  }
}

// 提交按钮
.submit-btn {
  align-self: flex-end;
  background-color: $primary !important;
  border-color: $primary !important;
  color: white !important;
  padding: 10px 24px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  border-radius: 6px !important;
  transition: $transition !important;

  &:hover {
    background-color: #C00812 !important;
    border-color: #C00812 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(229,9,20,0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(229,9,20,0.2);
  }
}

// 响应式适配
@media (max-width: 768px) {
  .comment-card {
    padding: 15px !important;
  }

  .blog-comment--input {
    min-height: 100px;
    font-size: 14px;
  }

  .submit-btn {
    width: 100%;
    align-self: stretch;
  }
}
</style>