<template>
  <div class="container">
    <!-- 页面标题 -->
    <div class="page-title">
      <h1>个人信息设置</h1>
      <p>更新您的个人资料和账户信息</p>
    </div>

    <!-- 信息卡片 -->
    <div class="card">
      <!-- 头像上传区域 -->
      <div class="avatar-section">
        <div class="avatar-container" @click="triggerFileInput">
          <img :src="userInfo.avator ? userInfo.avator : defaultAvatar" alt="用户头像" class="avatar-preview">
          <div class="avatar-upload-overlay">
            <i class="fa fa-camera avatar-upload-icon"></i>
          </div>
          <input type="file" ref="fileInput" class="hidden avatar-choose" accept="image/*"
            @change="handleFileSelect">
        </div>

        <div class="avatar-info">
          <h3>头像设置</h3>
          <p>上传清晰的个人照片有助于他人更好地识别您的身份。</p>
          <ul class="avatar-rules">
            <li><i class="fa fa-check-circle"></i> 支持 JPG、PNG 格式</li>
            <li><i class="fa fa-check-circle"></i> 图片大小不超过 5MB</li>
            <li><i class="fa fa-check-circle"></i> 建议尺寸 200×200 像素</li>
          </ul>
        </div>
      </div>

      <!-- 表单区域 -->
      <form class="profile-form">
        <!-- 姓名 -->
        <div class="form-group">
          <label for="fullname" class="form-label">昵称</label>
          <div class="form-input-wrapper">
            <i class="fa fa-user input-icon"></i>
            <input type="text" id="fullname" class="form-input icon-left" :value="userInfo.nikname"
              placeholder="请输入您的昵称" ref="niknameInput">
          </div>
          <p class="error-message">请输入有效的昵称</p>
        </div>

        <!-- 性别 -->
        <div class="form-group">
          <label class="form-label">性别</label>
          <div class="gender-options">
            <label class="gender-option">
              <input type="radio" name="gender" value="male" :checked="userInfo.gender === 'male' || !userInfo.gender" class="gender-input">
              <span class="gender-label">男</span>
            </label>
            <label class="gender-option">
              <input type="radio" name="gender" value="female" :checked="userInfo.gender === 'female'" class="gender-input">
              <span class="gender-label">女</span>
            </label>
            <label class="gender-option">
              <input type="radio" name="gender" value="other" :checked="userInfo.gender === 'other'" class="gender-input">
              <span class="gender-label">保密</span>
            </label>
          </div>
        </div>

        <!-- 手机号码 -->
        <div class="form-group">
          <label for="phone" class="form-label">手机号码</label>
          <div class="form-input-wrapper">
            <i class="fa fa-phone input-icon"></i>
            <input type="tel" id="phone" class="form-input icon-left" :value="userInfo.phone ? userInfo.phone : '138****1234'"
              placeholder="请输入您的手机号码">
          </div>
          <p class="error-message">请输入有效的手机号码</p>
        </div>

        <!-- 电子邮箱 -->
        <div class="form-group">
          <label for="email" class="form-label">电子邮箱</label>
          <div class="form-input-wrapper">
            <i class="fa fa-envelope input-icon"></i>
            <input type="email" id="email" class="form-input icon-left" :value="userInfo.email"
              placeholder="请输入您的电子邮箱" ref="emailInput">
          </div>
          <p class="error-message">请输入有效的电子邮箱</p>
        </div>

        <!-- 出生日期 -->
        <div class="form-group">
          <label for="birthday" class="form-label">出生日期</label>
          <div class="form-input-wrapper">
            <i class="fa fa-calendar input-icon"></i>
            <input type="date" id="birthday" class="form-input icon-left" :value="userInfo.birthday ? userInfo.birthday : '1990-01-01'">
          </div>
        </div>

        <!-- 个人简介 -->
        <div class="form-group">
          <label for="bio" class="form-label">个性签名</label>
          <div class="form-input-wrapper" style="position: relative;">
            <textarea id="bio" class="form-textarea" placeholder="请输入您的个性签名（可选）"
              v-model="signature" ref="signatureInput"></textarea>
            <span class="char-count">{{ signature.length }}/150</span>
          </div>
        </div>

        <!-- 提交按钮区域 -->
        <div class="button-group">
          <button type="button" class="btn btn-cancel" @click="cancelEdit()">取消</button>
          <button type="button" class="btn btn-save" @click="changeUserInfo()">
            <i class="fa fa-save"></i> 保存修改
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseUser',
  data() {
    return {
      userInfo: this.$store.state.userInfo || {},
      form: {
        avator: '',
        nikname: '',
        email: '',
        signature: '',
        gender: '',
        phone: '',
        birthday: ''
      },
      file: null,
      defaultAvatar: 'https://via.placeholder.com/120/333333/FFFFFF?text=默认头像', // 默认头像占位图
      signature: '' // 单独存储个性签名，避免模板中使用可选链
    };
  },
  mounted() {
    // 初始化表单数据
    this.form = {
      ...this.userInfo,
      avator: this.userInfo.avator ? this.userInfo.avator : this.defaultAvatar
    };
    // 初始化个性签名
    this.signature = this.userInfo.signature ? this.userInfo.signature : '';
  },
  methods: {
    // 取消编辑
    cancelEdit() {
      this.$router.go(-1); // 返回上一页
    },
    // 触发文件选择
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    // 处理文件选择
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        // 验证文件类型和大小
        if (!this.validateFile(file)) {
          this.$notify.warning({
            title: '提示',
            message: '请选择有效的图片文件（JPG/PNG，大小不超过5MB）'
          });
          return;
        }
        // 创建文件预览
        const reader = new FileReader();
        reader.onload = (e) => {
          this.$el.querySelector('.avatar-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
        this.file = file;
      }
    },
    // 验证文件
    validateFile(file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    },
    async changeUserInfo() {
      await this.getInputValue();
      try {
        const res = await this.$api({
          type: 'putUserInfo',
          data: this.form,
          params: {
            id: this.userInfo._id
          }
        });
        if (res) {
          // 更新Vuex中的用户信息
          const updatedUserInfo = {
            ...this.userInfo,
            ...this.form
          };
          this.$store.commit('SET_USERINFO', updatedUserInfo);
          // 显示成功提示
          this.$notify.success({
            title: '成功',
            message: '用户信息更新成功'
          });
          console.log('用户信息更新成功:', res);
        }
      } catch (err) {
        this.$notify.error({
          title: '失败',
          message: '用户信息更新失败，请稍后重试'
        });
        console.error('更新失败:', err);
      }
    },
    async getInputValue() {
      this.form.nikname = this.$refs.niknameInput.value;
      this.form.email = this.$refs.emailInput.value;
      this.form.signature = this.signature; // 从单独存储的变量获取
      // 获取性别值
      const genderEl = document.querySelector('input[name="gender"]:checked');
      this.form.gender = genderEl ? genderEl.value : 'other';
      // 获取手机号和生日
      this.form.phone = document.getElementById('phone').value;
      this.form.birthday = document.getElementById('birthday').value;
      await this.getAvatarUrl();
    },
    async getAvatarUrl() {
      if (this.file) {
        try {
          const formData = new FormData();
          formData.append('file', this.file);
          formData.append('uid', this.userInfo._id);
          let res = await this.$api({
            type: 'uploadAvatar',
            data: formData,
          });
          this.form.avator = res.fileURL;
        } catch (err) {
          console.error('头像上传失败:', err);
          this.$notify.error({
            title: '失败',
            message: '头像上传失败，请稍后重试'
          });
        }
      } else {
        this.form.avator = this.userInfo.avator ? this.userInfo.avator : this.defaultAvatar;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
// 主题变量（与网站统一）
$primary = #E50914
$primary-dark = #C00812
$light-black = #252525
$lighter-black = #333333
$light = #F8F8F8
$gray = #AAAAAA
$border-color = #444444
$transition = all 0.3s ease

// 全局样式
.container
  max-width 1000px
  margin 0 auto
  padding 20px
  background-color $light-black
  min-height 100vh

// 页面标题样式
.page-title
  text-align center
  margin-bottom 30px
  padding-bottom 15px
  border-bottom 1px solid $border-color

  h1
    font-size clamp(1.8rem, 3vw, 2.2rem)
    color $light
    margin-bottom 8px
    font-weight 600

  p
    color $gray
    font-size 1rem

// 卡片容器样式
.card
  background-color $lighter-black
  border-radius 12px
  box-shadow 0 4px 20px rgba(0, 0, 0, 0.2)
  padding 30px
  margin-bottom 24px
  border 1px solid $border-color

// 头像上传区域
.avatar-section
  display flex
  flex-direction column
  align-items center
  margin-bottom 40px
  gap 20px

.avatar-container
  position relative
  cursor pointer

.avatar-preview
  width 120px
  height 120px
  border-radius 50%
  object-fit cover
  border 4px solid $border-color
  box-shadow 0 4px 10px rgba(0, 0, 0, 0.3)
  background-color $light-black

.avatar-choose
  position absolute
  display none

.avatar-upload-overlay
  position absolute
  top 0
  left 0
  width 120px
  height 120px
  border-radius 50%
  background-color rgba(0, 0, 0, 0.6)
  display flex
  align-items center
  justify-content center
  opacity 0
  transition $transition
  cursor pointer

.avatar-container:hover .avatar-upload-overlay
  opacity 1

.avatar-upload-icon
  color $light
  font-size 24px

.avatar-info
  width 100%
  max-width 400px
  display flex
  flex-direction column
  align-items flex-start

  h3
    font-size 1.1rem
    color $light
    margin-bottom 8px
    font-weight 600

  p
    display block
    color $gray
    font-size 0.9rem
    margin-bottom 12px

.avatar-rules
  display block
  list-style none
  font-size 0.85rem
  color $gray
  padding 0

  li
    margin-bottom 6px
    display flex
    align-items center

  i
    color $primary
    margin-right 8px
    font-size 0.9rem

// 表单样式
.profile-form
  display flex
  flex-direction column
  gap 24px

.form-group
  transition $transition
  display flex
  flex-direction column
  align-items flex-start
  width 100%

.form-group:focus-within
  transform translateY(-2px)

.form-label
  display block
  margin-bottom 8px
  font-weight 500
  color $light
  font-size 0.95rem

.form-input-wrapper
  width 100%
  position relative

.form-input
  width 100%
  padding 12px 16px
  border 1px solid $border-color
  border-radius 8px
  font-size 0.95rem
  color $light
  background-color $light-black
  transition $transition

.form-input.icon-left
  padding-left 44px

.form-input:focus
  outline none
  border-color $primary
  box-shadow 0 0 0 3px rgba(229,9,20,0.2)

.input-icon
  position absolute
  left 16px
  top 50%
  transform translateY(-50%)
  color $gray
  font-size 1rem

.form-textarea
  width 100%
  padding 12px 16px
  border 1px solid $border-color
  border-radius 8px
  font-size 0.95rem
  color $light
  background-color $light-black
  resize none
  min-height 100px
  transition $transition

.form-textarea:focus
  outline none
  border-color $primary
  box-shadow 0 0 0 3px rgba(229,9,20,0.2)

.gender-options
  display flex
  gap 24px
  margin-top 8px

.gender-option
  display flex
  align-items center
  cursor pointer

.gender-input
  margin-right 8px
  accent-color $primary

.gender-label
  color $light
  font-size 0.95rem

.char-count
  position absolute
  right 16px
  bottom 12px
  font-size 0.8rem
  color $gray

.error-message
  color $primary
  font-size 0.85rem
  margin-top 6px
  display none

// 按钮区域样式
.button-group
  display flex
  justify-content flex-end
  gap 16px
  margin-top 16px
  flex-wrap wrap

.btn
  padding 12px 24px
  border-radius 8px
  font-size 0.95rem
  font-weight 500
  cursor pointer
  transition $transition
  border none
  display inline-flex
  align-items center
  justify-content center

.hidden
  display none

.btn i
  margin-right 8px

.btn-cancel
  background-color $light-black
  color $light
  border 1px solid $border-color

.btn-cancel:hover
  background-color #444444
  border-color #555555

.btn-save
  background-color $primary
  color $light

.btn-save:hover
  background-color $primary-dark
  box-shadow 0 4px 12px rgba(229,9,20,0.3)
  transform translateY(-2px)

.btn-save:active
  transform translateY(0)

// 响应式适配
@media (min-width: 768px)
  .avatar-section
    flex-direction row
    align-items center
    gap 32px

  .avatar-info
    margin-top 0

  .button-group
    flex-wrap nowrap

@media (max-width: 767px)
  .card
    padding 20px

  .gender-options
    flex-direction column
    gap 12px

  .btn
    flex 1
    min-width 100%

  .container
    padding 15px

  .page-title
    margin-bottom 20px
</style>