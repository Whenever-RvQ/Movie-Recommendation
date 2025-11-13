<template>
  <div class="movie-home-wrap" v-if="!show404">
    <!-- 轮播图模块 -->
    <div class="carousel-container" ref="carousel">
      <div class="carousel-wrapper">
        <div 
          class="carousel-item"
          v-for="(item, index) in carouselMovies"
          :key="index"
          :style="{ transform: `translateX(${(currentIndex - index) * 100}%)` }"
          @mouseenter="showTrailer = index"
          @mouseleave="showTrailer = -1"
        >
          <img :src="item.cover" :alt="item.title" class="carousel-img">
          <div class="carousel-mask"></div>
          <div class="carousel-info">
            <div class="carousel-tags">
              <span class="tag hot" v-if="item.isHot">热映中</span>
              <span class="tag score">{{ item.score||0 }}</span>
              <span class="tag date">{{ item.releaseDate }}</span>
            </div>
            <h2 class="carousel-title">{{ item.title }}</h2>
            <p class="carousel-desc">{{ item.body }}</p>
            <el-button 
              type="primary" 
              size="medium"
              @click="goToDetail(item.id)"
              class="detail-btn"
            >
              <i class="el-icon-play"></i> 查看详情
            </el-button>
          </div>
        </div>
      </div>
      <!-- 轮播控制按钮 -->
      <button class="carousel-control prev" @click="prevSlide">
        <i class="el-icon-arrow-left"></i>
      </button>
      <button class="carousel-control next" @click="nextSlide">
        <i class="el-icon-arrow-right"></i>
      </button>
      <!-- 轮播指示器 -->
      <div class="carousel-indicators">
        <span 
          class="indicator-dot"
          v-for="(item, index) in carouselMovies"
          :key="index"
          :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>

    <!-- 主内容区：推荐模块 + 右侧榜单 -->
    <div class="main-content">
      <!-- 左侧推荐模块 -->
      <div class="recommend-section">
        <div class="section-header">
          <h2 class="section-title">为你推荐</h2>
          <div class="section-operate">
            <el-select 
              v-model="sortType" 
              placeholder="排序方式" 
              size="mini"
              @change="handleSortChange"
            >
              <el-option label="热度优先" value="hot"></el-option>
              <el-option label="评分优先" value="score"></el-option>
              <el-option label="最新上映" value="latest"></el-option>
            </el-select>
            <el-button 
              icon="el-icon-refresh" 
              size="mini"
              @click="refreshRecommend"
              class="refresh-btn"
            ></el-button>
          </div>
        </div>

        <div @handle-scroll="loadMore" ref="scrollView">
          <div class="movie-grid">
            <el-card 
              class="movie-card" 
              v-for="(movie) in recommendMovies"
              :key="movie.id"
              @click="goToDetail(movie.id)"
            >
              <div class="movie-card__poster">
                <img :src="movie.cover" :alt="movie.title" class="poster-img">
                <span class="movie-score">{{ movie.score ||0 }}</span>
                <el-button 
                  icon="el-icon-heart" 
                  size="mini"
                  class="collect-btn"
                  @click.stop="handleCollect(movie.id)"
                ></el-button>
              </div>
              <div class="movie-card__info">
                <h3 class="movie-title">{{ movie.title }}</h3>
                <div class="movie-meta">
                  <span class="movie-type">{{ movie.column.name }}</span>
                  <span class="movie-year">{{ movie.date }}</span>
                </div>
                <p class="movie-brief">{{ movie.brief }}</p>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 加载更多提示 -->
        <div class="load-more-tip" v-if="loadingMore">
          <el-loading-spinner></el-loading-spinner>
          <span>加载中...</span>
        </div>
        <div class="load-more-tip" v-if="noMoreData && recommendMovies.length > 0">
          <span>没有更多电影了</span>
        </div>
      </div>

      <!-- 右侧最近更新榜单 -->
      <div class="rank-section">
        <div class="rank-header">
          <h2 class="rank-title">最近更新</h2>
          <span class="update-tag">实时更新</span>
        </div>
        <div class="rank-list">
          <div 
            class="rank-item"
            v-for="(movie, index) in rankMovies"
            :key="movie.id"
            @mouseenter="activeRankIndex = index"
            @mouseleave="activeRankIndex = -1"
            @click="goToDetail(movie.id)"
          >
            <div class="rank-num" :class="getRankClass(index)">{{ index + 1 }}</div>
            <img :src="movie.cover" :alt="movie.title" class="rank-poster">
            <div class="rank-info">
              <div class="rank-top">
                <h3 class="rank-movie-title">{{ movie.title }}</h3>
                <span class="rank-score">{{ movie.score||0 }}</span>
              </div>
              <div class="rank-meta">
                <span class="rank-type">{{ movie.column.name }}</span>
                <span class="rank-year">{{ movie.date }}</span>
              </div>
              <!-- hover展开的详细信息 -->
              <div class="rank-detail" v-show="activeRankIndex === index">
                <p class="rank-desc">{{ movie.brief||'hhh' }}</p>
                <div class="rank-stat">
                  <span><i class="el-icon-date"></i> {{ movie.date }}</span>
                  <span><i class="el-icon-eye"></i> {{ movie.hit_num }}次观看</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-button 
          type="text" 
          class="see-all-rank"
          @click="goToRankList"
        >
          查看完整榜单 <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </div>
  </div>
  <Base404 v-else />
</template>

<script>
// import Scroll from '@/components/common/Scroll' // 复用你的滚动组件
import Base404 from '@/components/base/Base404.vue'
import QS from 'qs'
import _ from 'lodash'

const TH = 200; // 滚动加载阈值
const CAROUSEL_INTERVAL = 3000; // 轮播图自动切换间隔（3秒）

export default {
  name: 'MovieHome',
  inject: ['closeLoadClock'], // 复用父组件的加载锁方法
  components: {
    Base404
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 轮播图数据
      carouselMovies: [],
      currentIndex: 0,
      showTrailer: -1,
      carouselInterval: null,

      // 推荐模块数据
      recommendMovies: [],
      page: 1,
      size: 20,
      sortType: 'hot',
      loadingMore: false,
      noMoreData: false,

      // 右侧榜单数据
      rankMovies: [],
      activeRankIndex: -1,

      // 搜索相关
      q: '',
      query: {
        column: '',
        q: ''
      },
      show404: false,
      scrollTop: 0
    };
  },
  watch: {
    loading(load) {
      if (load) {
        this.initData();
      }
    },
    $route: {
      handler() {
        this.handleRouteChange();
      },
      immediate: true
    }
  },
  activated() {
    // 恢复滚动位置
    if (this.scrollTop && this.$refs['scrollView']) {
      this.$refs['scrollView'].scrollTo({ y: this.scrollTop }, 300);
    }
    // 重启轮播
    this.startCarousel();
  },
  deactivated() {
    // 暂停轮播
    this.stopCarousel();
    this.query = { column: '', q: '' };
  },
  created() {
    this.initData();
  },
  mounted() {
    // 监听搜索事件（复用你的事件总线）
    this.$EventBus.$on('activeSearch', (q) => {
      this.q = q;
      this.resetRecommend();
      this.getRecommendMovies();
      setTimeout(() => {
        this.refreshSearch();
      }, 1000);
    });

    // 初始化轮播
    this.startCarousel();
  },
  beforeDestroy() {
    this.stopCarousel();
    this.$EventBus.$off('activeSearch');
  },
  methods: {
    // 初始化所有数据
    initData() {
      this.getCarouselMovies();
      this.getRecommendMovies();
      this.getRankMovies();
    },

    // 处理路由变化
    handleRouteChange() {
      const newColumn = this.$route.query?.columnId || '';
      const newQ = this.$route.query?.q || '';

      if (this.query.column !== newColumn || this.query.q !== newQ) {
        this.query.column = newColumn;
        this.query.q = newQ;
        this.resetRecommend();
        this.getRecommendMovies();
      }
    },

    // 轮播图相关方法
    startCarousel() {
      this.stopCarousel();
      this.carouselInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.carouselMovies.length;
      }, CAROUSEL_INTERVAL);
    },
    stopCarousel() {
      if (this.carouselInterval) {
        clearInterval(this.carouselInterval);
        this.carouselInterval = null;
      }
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.carouselMovies.length) % this.carouselMovies.length;
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.carouselMovies.length;
    },
    goToSlide(index) {
      this.currentIndex = index;
    },

    // 推荐模块相关方法
    resetRecommend() {
      this.page = 1;
      this.recommendMovies = [];
      this.loadingMore = false;
      this.noMoreData = false;
    },
    refreshSearch() {
      this.q = '';
    },
    handleSortChange() {
      this.resetRecommend();
      this.getRecommendMovies();
    },
    refreshRecommend() {
      this.resetRecommend();
      this.getRecommendMovies();
    },

    // 滚动加载更多
    loadMore: _.throttle(function (vertical) {
      this.scrollTop = vertical.scrollTop;

      if (this.loadingMore || this.noMoreData) return;

      const scrollDom = this.$refs['scrollView']?.$el;
      if (!scrollDom) return;

      const st = vertical.scrollTop;
      const sh = scrollDom.scrollHeight - scrollDom.clientHeight;

      if (st + TH > sh) {
        this.loadingMore = true;
        this.page++;
        this.getRecommendMovies();
      }
    }, 500, false),

    // 榜单相关方法
    getRankClass(index) {
      if (index === 0) return 'rank-1';
      if (index === 1) return 'rank-2';
      if (index === 2) return 'rank-3';
      return 'rank-other';
    },

    // 跳转相关
    goToDetail(id) {
      this.$router.push({ name: 'movieDetail', params: { id } });
    },
    goToRankList() {
      this.$router.push({ name: 'movieRank' });
    },

    // 接口请求方法
    getCarouselMovies() {
      // 实际项目中替换为真实接口
      this.$api({
        type: 'movies',
        data: { size: 3 }
      }).then(res => {
        this.carouselMovies = res.list || [];
      }).catch(err => {
        this.$notify.error({ title: '获取轮播图失败', message: err.message });
      });
    },

    getRecommendMovies() {
      const query = this.setQuery();
      const data = {
        page: this.page,
        size: this.size,
        sort: this.sortType,
        ...(Object.keys(query).length > 0 && { query: QS.stringify(query) })
      };

      this.$api({
        type: 'movies',
        data: { size: 3 }
      }).then(res => {
        const { list, total } = res;

        if (list.length === 0 && this.page === 1) {
          this.show404 = true;
          this.recommendMovies = [];
        } else if (this.recommendMovies.length >= total) {
          this.noMoreData = true;
        } else {
          this.show404 = false;
          this.recommendMovies.push(...list);
          this.closeLoadClock(); // 关闭加载锁
        }
        this.loadingMore = false;
      }).catch(err => {
        this.$notify.error({ title: '获取推荐电影失败', message: err.message });
        this.loadingMore = false;
      });
    },

    getRankMovies() {
      // 实际项目中替换为真实接口
      this.$api({
        type: 'movies',
        data: { size: 8}
      }).then(res => {
        this.rankMovies = res.list || [];
      }).catch(err => {
        this.$notify.error({ title: '获取榜单失败', message: err.message });
      });
    },

    setQuery() {
      const column = this.$route.query?.columnId || '';
      const q = this.q || undefined;
      return JSON.parse(JSON.stringify({ column, q }));
    },

    // 收藏功能（示例）
    handleCollect(id) {
      // 实际项目中添加收藏接口逻辑
      this.$notify.success({ title: '操作成功', message: '已加入收藏' });
    }
  }
};
</script>

<style lang="stylus" scoped>
.movie-home-wrap
  width: 100%
  height 100%
  background-color: #1A1A1A
  color: #F5F5F5
  box-sizing: border-box
  border: 1px solid #ccc


/* 轮播图样式 */
.carousel-container
  width: 100%
  height: 500px
  position: relative
  overflow: hidden
  border-radius: 8px
  margin: 0 auto 40px
  max-width: 1200px

.carousel-wrapper
  width: 100%
  height: 100%
  position: relative

.carousel-item
  width: 100%
  height: 100%
  position: absolute
  top: 0
  left: 0
  transition: transform 0.5s ease
  overflow: hidden
.carousel-item:hover img
  transform: scale(1.2)
  transition: transform 0.5s ease
.carousel-img
  width: 100%
  height: 100%
  object-fit: cover

.carousel-mask
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)

.carousel-info
  position: absolute
  bottom: 0
  left: 0
  width: 100%
  padding: 40px 60px
  z-index: 10

.carousel-tags
  display: flex
  gap: 12px
  margin-bottom: 16px

.tag
  padding: 4px 12px
  border-radius: 20px
  font-size: 14px
  font-weight: 500

.hot
  background-color: #E50914
  color: #fff

.score
  background-color: #FFC107
  color: #1A1A1A

.date
  background-color: rgba(255,255,255,0.2)
  color: #fff

.carousel-title
  font-size: 32px
  font-weight: bold
  margin-bottom: 12px
  color: #fff

.carousel-desc
  font-size: 16px
  color: #E0E0E0
  line-height: 1.5
  max-width: 800px
  margin-bottom: 24px
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden

.detail-btn
  background-color: #E50914
  border-color: #E50914
  padding: 8px 24px
  font-size: 16px
  border-radius: 30px
  &:hover
    background-color: #C00812
    border-color: #C00812

/* 预告片预览 */
.trailer-preview
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 70%
  height: 60%
  background-color: rgba(0,0,0,0.85)
  border-radius: 8px
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  z-index: 20
  transition: all 0.3s ease

.trailer-content
  display: flex
  align-items: center
  gap: 16px
  margin-bottom: 16px

.trailer-icon
  font-size: 64px
  color: #E50914

.trailer-text
  font-size: 20px
  color: #fff

.trailer-hint
  font-size: 14px
  color: #999

/* 轮播控制 */
.carousel-control
  position: absolute
  top: 50%
  transform: translateY(-50%)
  width: 48px
  height: 48px
  border-radius: 50%
  background-color: rgba(0,0,0,0.5)
  color: #fff
  border: none
  outline: none
  cursor: pointer
  z-index: 15
  display: flex
  align-items: center
  justify-content: center
  font-size: 24px
  &:hover
    background-color: rgba(0,0,0,0.8)

.prev
  left: 20px

.next
  right: 20px

.carousel-indicators
  position: absolute
  bottom: 20px
  left: 50%
  transform: translateX(-50%)
  display: flex
  gap: 8px
  z-index: 15

.indicator-dot
  width: 12px
  height: 12px
  border-radius: 50%
  background-color: rgba(255,255,255,0.3)
  cursor: pointer
  &.active
    background-color: #E50914
    width: 36px
    border-radius: 6px

/* 主内容区 */
.main-content
  width: 100%
  max-width: 1200px
  margin: 0 auto
  display: flex
  gap: 30px

/* 推荐模块 */
.recommend-section
  flex: 2
  background-color: #0F0F0F
  border-radius: 8px
  padding: 24px
  height: calc(100vh - 600px)
  overflow: hidden

.section-header
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 24px

.section-title
  font-size: 24px
  font-weight: bold
  color: #fff

.section-operate
  display: flex
  gap: 12px

.el-select
  width: 120px
  .el-input__inner
    background-color: #1A1A1A
    border-color: #333
    color: #fff
    &:focus
      border-color: #E50914

.refresh-btn
  color: #999
  &:hover
    color: #E50914

.movie-grid
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))
  gap: 24px
  margin-bottom: 20px

.movie-card
  background-color: #1A1A1A
  border: none
  border-radius: 8px
  overflow: hidden
  cursor: pointer
  transition: transform 0.3s ease
  &:hover
    transform: translateY(-5px)
    box-shadow: 0 10px 20px rgba(0,0,0,0.3)

.movie-card__poster
  position: relative
  height: 330px
  overflow: hidden

.poster-img
  width: 100%
  height: 100%
  object-fit: cover
  transition: transform 0.3s ease
  &:hover
    transform: scale(1.05)

.movie-score
  position: absolute
  top: 12px
  right: 12px
  background-color: #FFC107
  color: #1A1A1A
  padding: 4px 8px
  border-radius: 4px
  font-size: 14px
  font-weight: bold

.collect-btn
  position: absolute
  bottom: 12px
  right: 12px
  background-color: rgba(0,0,0,0.5)
  color: #fff
  border-radius: 50%
  width: 36px
  height: 36px
  display: flex
  align-items: center
  justify-content: center
  opacity: 0
  transition: all 0.3s ease
  &:hover
    background-color: #E50914
    color: #fff

.movie-card:hover .collect-btn
  opacity: 1

.movie-card__info
  padding: 16px
  .movie-title
    font-size: 18px
    font-weight: bold
    color: #fff
    margin-bottom: 8px
    display: -webkit-box
    -webkit-line-clamp: 1
    -webkit-box-orient: vertical
    overflow: hidden

.movie-meta
  display: flex
  justify-content: space-between
  font-size: 14px
  color: #999
  margin-bottom: 8px

.movie-brief
  font-size: 14px
  color: #ccc
  line-height: 1.4
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden

.load-more-tip
  text-align: center
  padding: 20px
  color: #999
  font-size: 14px
  display: flex
  align-items: center
  justify-content: center
  gap: 8px

/* 右侧榜单 */
.rank-section
  flex: 1
  background-color: #0F0F0F
  border-radius: 8px
  padding: 24px
  position: sticky
  top: 20px
  height: fit-content

.rank-header
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 20px

.rank-title
  font-size: 24px
  font-weight: bold
  color: #fff

.update-tag
  background-color: rgba(229,9,20,0.2)
  color: #E50914
  font-size: 12px
  padding: 2px 8px
  border-radius: 12px

.rank-list
  display: flex
  flex-direction: column
  gap: 12px
  max-height: 700px
  overflow-y: auto
  &::-webkit-scrollbar
    width: 4px
  &::-webkit-scrollbar-thumb
    background-color: #333
    border-radius: 2px
  &::-webkit-scrollbar-track
    background-color: #1A1A1A

.rank-item
  display: flex
  align-items: center
  background-color: #1A1A1A
  border-radius: 6px
  overflow: hidden
  height: 80px
  transition: height 0.3s ease
  cursor: pointer
  &:hover
    height: 140px

.rank-num
  width: 40px
  height: 100%
  display: flex
  align-items: center
  justify-content: center
  font-size: 20px
  font-weight: bold
  color: #fff

.rank-1
  background-color: #E50914

.rank-2
  background-color: rgba(229,9,20,0.8)

.rank-3
  background-color: rgba(229,9,20,0.6)

.rank-other
  background-color: #333

.rank-poster
  width: 60px
  height: 80px
  object-fit: cover

.rank-info
  flex: 1
  padding: 12px
  display: flex
  flex-direction: column
  justify-content: center

.rank-top
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 4px

.rank-movie-title
  font-size: 16px
  font-weight: bold
  color: #fff
  max-width: 180px
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.rank-score
  background-color: #FFC107
  color: #1A1A1A
  padding: 2px 8px
  border-radius: 4px
  font-size: 12px
  font-weight: bold

.rank-meta
  font-size: 12px
  color: #999
  display: flex
  gap: 8px
  margin-bottom: 8px

.rank-detail
  font-size: 12px
  color: #ccc
  transition: all 0.3s ease
  .rank-desc
    line-height: 1.4
    margin-bottom: 6px
    display: -webkit-box
    -webkit-line-clamp: 2
    -webkit-box-orient: vertical
    overflow: hidden

.rank-stat
  display: flex
  gap: 12px
  color: #999
  font-size: 11px

.see-all-rank
  display: block
  width: 100%
  text-align: center
  color: #E50914
  margin-top: 20px
  &:hover
    color: #C00812
    text-decoration: underline

/* 响应式适配 */
@media (max-width: 1200px)
  .main-content
    flex-direction: column
  .recommend-section
    height: auto
  .rank-section
    position: static
    margin-top: 30px

@media (max-width: 768px)
  .carousel-container
    height: 300px
  .carousel-info
    padding: 20px
  .carousel-title
    font-size: 24px
  .carousel-desc
    font-size: 14px
    -webkit-line-clamp: 1
  .detail-btn
    padding: 6px 16px
    font-size: 14px
  .movie-grid
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))
  .movie-card__poster
    height: 225px
  .rank-item
    height: 70px
    &:hover
      height: 120px
</style>