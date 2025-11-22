<template>
  <li class="blog-comment--item">
    <div class="blog-comment--user blog-line blog-line--row ">
      <div class="blog-comment--avatar">
        <img :src="uid.avator"
             alt="!">
      </div>
      <span class="blog-comment--name">{{uid.nikname}}</span>
    </div>
    <p class="blog-comment-content">{{content}}</p>
    <p class="blog-comment-date">{{date}}</p>
  </li>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    uid: {
      type: Object
    },
    content: {
      type: String
    },
    date: {
      type: String
    }
  },
  data () {
    return {

    };
  },
  mounted () {
    console.log(this.uid);

  },
  methods: {

  },
};
</script>

<style lang="stylus" scoped>
// 主题变量（与网站统一）
$primary = #E50914
$light-black = #252525 // 浅黑背景
$lighter-black = #333333 // 更浅黑色
$light = #d0e0f0 // 浅色文字
$gray = #AAAAAA // 次级文字
$border-color = #444444 // 边框颜色
$transition = all 0.3s ease
.blog-comment--item
  margin-bottom: 20px
  padding: 20px
  background-color: #252525
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0,0,0,0.1)
  transition: $transition
  &:hover
    transform: translateY(-3px)
    box-shadow: 0 4px 12px rgba(0,0,0,0.15)
.blog-comment-content
  overflow: hidden
  padding: 10px 0 15px 0
  word-wrap: break-word
  word-break: break-word
  color: $light
  line-height: 1.8
  font-size: 15px
.blog-comment--name
  padding: 0 12px
  color: $light
  font-weight: 500
  // 若有用户名颜色需求，可改为$primary
  // color: $primary
.blog-comment--avatar>img
  width: 100%
  height: 100%
</style>