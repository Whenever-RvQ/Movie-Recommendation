<template>

  <div class="article-wrap" v-if="movies && !show404">
    <Scroll @handle-scroll="loadMore" ref="scrollView">
      <div class="blog-content--item" v-for="item in movies" :key="item.id">
        <router-link :to="{ name: 'movie', params: { id: item._id } }">
          <MovieItem :movie="item" />
        </router-link>
      </div>
    </Scroll>
  </div>
  <Base404 v-else-if="show404" />
</template>

<script>
import MovieItem from '@/components/movie/MovieItem'
import Base404 from '@/components/base/Base404.vue';
import QS from 'qs'
import _ from 'loadsh'
const TH = 200;
export default {
  name: 'MovieList',
  inject: ['closeLoadClock'],
  components: {
    MovieItem, Base404
  },
  props: {
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      movies: [],
      page: 1,
      size: 200,
      scrollTop: 0,
      show404: false,
      q:'',
      query: {
        column: '',
        q: ''
      }
    };
  },
  watch: {
    loading(load) {
      if (load) {
        this.getMovies()
      }
    },
    $route: {
      handler() {
        this.handleRouteChange()

      },

      immediate: true
    }
  },
  activated() {
    if (this.scrollTop) {
      this.$refs['scrollView'].scrollTo({
        y: this.scrollTop
      }, 300)
    }

    if (this.$route.query?.columnId) {
      this.query.column = this.$route.query?.columnId
    }
  },

  deactivated() {
    this.query = {
      column: '',
      q: ''
    }
  },
  created() {
    this.getMovies()

  },
  mounted() {
    this.$EventBus.$on('updateView', () => {
      this.getMovies()

    })

    this.$EventBus.$on('activeSearch', (q) => {
      this.q = q
      this.cancelMovies()
      this.getMovies()
      setTimeout(() => {
        this.refreshSearch()
      }, 500)
    })
  },
  methods: {
    handleRouteChange() {
      // 检查查询参数是否发生变化
      const newColumn = this.$route.query?.columnId || '';
      const newQ = this.$route.query?.q || '';

      // 如果查询参数发生了变化，重新加载数据
      if (this.query.column !== newColumn || this.query.q !== newQ) {
        console.log('查询参数发生了变化，重新加载数据');
        this.query.column = newColumn;
        this.query.q = newQ;
        this.cancelMovies();
        this.getMovies();
      }
    },
    routeMovie(id) {
      this.$router.push({ name: 'movie', params: { id: id } })
    },
    refreshSearch(){
      this.q=''
    },
    setQuery() {
      let column = this.$route.query?.columnId
      let q = this.$route.query?.q || this.q || undefined;
      let query = JSON.parse(JSON.stringify({
        column, q
      }))
      return query
    },
    cancelMovies() {
      this.page = 1
      this.movies = []
    },

    loadMore: _.throttle(function (vertical, horizontal, nativeEvent) {
      this.scrollTop = vertical.scrollTop

      if (this.loading) {
        return
      }
      let st = vertical.scrollTop
      let sh = nativeEvent.srcElement.scrollHeight - nativeEvent.srcElement.clientHeight

      if (st + TH > sh) {
        console.log('加载更多')
        this.loading = true
        this.getMovies()
      }
    }, 500, false),
    async getMovies() {

      let data = { size: this.size, page: this.page }
      let query = this.setQuery()
      if (Object.entries(query).length > 0) {
        data.query = QS.stringify(query)
      }
      console.log(data)
      await this.$api({ type: 'movies', data }).then(result => {
        // 关键修改：在这里判断是否显示404页面
        if (result.list.length === 0 && this.page === 1) {
          // 搜索但没有结果，显示404
          this.show404 = true;
          this.movies = [];
        } else if (this.movies.length >= result.total) {
          // 没有更多了
          console.log('没有更多了')
          return
        } else {
          // 正常显示文章
          this.show404 = false;
          this.movies.push(...result.list)
          this.closeLoadClock() //调用父组件provide传递的关闭load锁方法
          this.page++
        }
      }).catch(err => {
        this.$notify.error({
          title: '获取失败',
          message: err.message
        })
      })
    }
  },
};
</script>

<style lang="stylus">
.article-wrap
  overflow hidden
  height 100%
</style>