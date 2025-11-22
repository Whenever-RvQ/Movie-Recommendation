<template>
  <div v-if="commentLength" class="comment-list-card">
    <div class="blog-comment blog-comment--list">
      <h3 class="comment-list-title">
        <i class="el-icon-message title-icon"></i> 评论区 ({{ commentLength }})
      </h3>
      <ul>
        <CommentItem v-for="comment in comments" :key="comment.id" :uid="comment.uid" :content="comment.content"
          :date="comment.date" />
      </ul>
    </div>
  </div>
</template>

<script>
import CommentItem from '@/components/comment/CommentItem'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    comments: {
      type: Array,
    }
  },
  data() {
    return {

    };
  },
  computed: {
    commentLength() {
      return this.comments?.length || 0
    },
    uid() {
      return this.comments
    }
  },
  mounted() {

  },
  methods: {

  },
};
</script>

<style lang="stylus">
@import '~assets/css/base.styl'

// 主题变量（与网站统一）
$primary = #E50914
$light-black = #252525 // 浅黑背景
$lighter-black = #333333 // 更浅黑色
$light = #d0e0f0 // 浅色文字
$gray = #AAAAAA // 次级文字
$border-color = #444444 // 边框颜色
$transition = all 0.3s ease

// 评论列表卡片
.comment-list-card
  background-color: $lighter-black !important
  border: 1px solid $border-color !important
  border-radius: 8px !important
  padding: 25px !important
  box-shadow: 0 3px 10px rgba(0,0,0,0.2) !important
  margin-top: 20px !important
// 评论列表标题
.comment-list-title
  display: flex
  align-items: center
  gap: 10px
  font-size: 18px
  font-weight: 600
  color: $primary
  padding-bottom: 15px
  margin-bottom: 20px
  border-bottom: 1px solid $border-color

// 标题图标
.title-icon
  font-size: 20px
  background-color: rgba(229,9,20,0.1)
  width: 36px
  height: 36px
  border-radius: 50%
  display: flex !important
  align-items: center
  justify-content: center

.blog-comment
  display: flex
  background-color: transparent !important // 继承卡片背景
  flex-direction: column
  gap: 15px
  height: auto
  font-size: 16px

.blog-comment--list
  padding: 0 !important
  background-color: transparent !important

// 评论列表ul
.blog-comment--list ul
  list-style: none
  padding: 0
  margin: 0

.blog-comment--editor
  padding 20px
  display flex
  flex-direction column
  justify-content space-between
  text-align center
  height 240px
  &>textarea
    padding padding-space
    height 120px
    resize none
.blog-comment--list
  padding 20px 0
  background-color bg-theme-color
.blog-comment--item
  margin-bottom padding-space
  padding padding-space * 2
  background-color line-modifier-color
.blog-comment--user
  display flex
  align-items center
  padding padding-space 0
  font-size 14px
  line-height 24px
.blog-comment--avatar
  overflow hidden
  width 24px
  height 24px
  border-radius 50%
  &>img
    width 24px
    height auto
.blog-comment--name
  padding-top 6px
  padding-left padding-space
  color font-theme-color
.blog-comment-content
  overflow hidden
  padding 20px 0
  word-wrap break-word
  word-break break-word
  color #666
.blog-comment-date
  text-align right
</style>