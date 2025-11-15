<template>
  <article class="movie-item">
    <div class="item-media">
      <img :src="movie.cover" :alt="movie.title" class="item-poster">
    </div>
    <div class="item-info">
      <h3 class="item-title">{{ movie.title }}</h3>
      <div class="item-meta">
        <span class="meta-item director">导演：{{ director }}</span>
        <span class="meta-item date">{{ movie.date }}</span>
      </div>
      <div class="item-desc">
       简介： {{ content }}...
      </div>
      <div class="item-stats">
        <span class="stat-item hit">
          <i class="el-icon-view"></i> 浏览 ({{ movie.hit_num }})
        </span>
        <span class="stat-item like">
          <i class="el-icon-star-on"></i> 点赞 ({{ like_num }})
        </span>
        <span class="stat-item comment">
          <i class="el-icon-message"></i> 评论 ({{ movie.comment_num }})
        </span>
      </div>
      <div class="item-actions">
        <el-button type="primary" class="action-btn">
          <i class="el-icon-play"></i> 查看详情
        </el-button>
        <el-button type="default" class="action-btn collect-btn">
          <i class="el-icon-star-off" v-if="!movie.isCollected"></i><i class="el-icon-star-on" v-else></i> 收藏
        </el-button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'MovieItem',
  props: {
    movie: {
      type: Object
    }
  },
  computed: {
    content() {
      let content = this.movie.body.match(/>([^<>]+)</)?.[1]
      return content || '默认内容'
    },
    director() {
      return this.movie.director || '默认导演'
    },
    like_num() {
      return this.movie?.like_num || '0'
    }
  }
};
</script>

<style lang="stylus" scoped>
// 主题变量（与网站统一）
$primary = #E50914
$light-black = #252525
$lighter-black = #333333
$light = #F8F8F8
$gray = #AAAAAA
$border-color = #444444
$transition = all 0.3s ease

// 电影项容器
.movie-item
  display: flex
  gap: 20px
  background-color: $lighter-black
  border-radius: 8px
  padding: 20px
  margin-bottom: 20px
  border: 1px solid $border-color
  transition: $transition
  &:hover
    scale: 1.01
    border-color: $primary
    box-shadow: 0 5px 15px rgba(229,9,20,0.15)

// 媒体区域（海报）
.item-media
  flex: 0 0 200px
  position: relative

.item-poster
  width: 100%
  height: 300px
  object-fit: cover
  border-radius: 6px
  box-shadow: 0 3px 10px rgba(0,0,0,0.3)

// 海报标签（状态）
.poster-label
  position: absolute
  top: 10px
  left: 10px
  background-color: $primary
  color: white
  font-size: 12px
  padding: 4px 8px
  border-radius: 4px
  z-index: 1

// 信息区域
.item-info
  flex: 1

// 标题
.item-title
  font-size: 22px
  font-weight: 700
  color: #d0e0f0
  margin-bottom: 15px
  border-bottom: 1px solid $border-color
  padding-bottom: 10px

// 元数据
.item-meta
  display: flex
  gap: 15px
  margin-bottom: 15px
  color: $gray
  font-size: 14px

.meta-item
  display: flex
  align-items: center
  gap: 5px

// 简介
.item-desc
  font-size: 16px
  color: $light
  line-height: 1.6
  margin 20px 0
  display: flex
  justify-content: flex-start
  overflow: hidden

// 统计信息
.item-stats
  display: flex
  gap: 20px
  margin-top: 10vh
  margin-bottom: 20px
  color: $gray

.stat-item
  display: flex
  align-items: center
  gap: 5px
  &.hit i
    color: #66b1ff
  &.like i
    color: #f9ae3d
  &.comment i
    color: #42b983

// 操作按钮
.item-actions
  display: flex
  gap: 10px

.action-btn
  background-color: $primary !important
  border-color: $primary !important
  color: white !important
  &:nth-child(2)
    background-color: $light-black !important
    border-color: $border-color !important
    color: $light !important
  &:hover
    opacity: 0.9
    transform: translateY(-2px)
.collect-btn i
    color: red !important
    scale: 1.2
// 响应式适配
@media (max-width: 768px)
  .movie-item
    flex-direction: column
    align-items: center
  .item-media
    width: 100%
    max-width: 300px
  .item-info
    width: 100%
  .item-stats
    flex-wrap: wrap
  .action-btn
    width: 100%
</style>