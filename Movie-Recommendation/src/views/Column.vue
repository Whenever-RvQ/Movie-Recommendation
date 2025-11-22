<template>
  <div class="movie-filter">
    <!-- 年份筛选 -->
    <div class="filter-group">
      <div class="filter-label">年份</div>
      <div class="filter-options">
        <span v-for="year in yearOptions" :key="year.value"
          :class="['filter-option', { active: selectedOptions.year === year.label }]"
          @click="handleFilterSelect('year', year.label, year.value)">
          {{ year.label }}
        </span>
      </div>
    </div>

    <!-- 类型筛选（关联columns分类数据） -->
    <div class="filter-group">
      <div class="filter-label">类型</div>
      <div class="filter-options">
        <span v-for="item in columnWords" :key="item.value"
          :class="['filter-option', { active: selectedType === item.id }]"
          @click="handleFilterSelect('type', item.label, item.id)">
          {{ item.name }}
        </span>
      </div>
    </div>
    <div class="blog-content" v-if="!show404 && movies">
      <div class="blog-content--item" v-for="item in movies" :key="item.id">
        <router-link :to="{ name: 'movie', params: { id: item._id } }">
          <MovieItem :movie="item" />
        </router-link>
      </div>
    </div>
    <div class="base404" v-else>
      <Base404  />

    </div>
  </div>
</template>

<script>
import MovieItem from '@/components/movie/MovieItem'
import Base404 from '@/components/base/Base404.vue';
import QS from 'qs'
export default {
  name: 'MovieFilter',
  inject: ['closeLoadClock'],
  data() {
    return {
      // 年份选项（2000-2025，包含区间）
      yearOptions: [
        { label: '全部', value: null },
        { label: '2025', value: '2025' },
        { label: '2024', value: '2024' },
        { label: '2023', value: '2023' },
        { label: '2022', value: '2022' },
        { label: '2021', value: '2021' },
        { label: '2020', value: '2020' },
        { label: '2010-2019', value: '2010-2019', start: 2010, end: 2019 },
        { label: '2000-2009', value: '2000-2009', start: 2000, end: 2009 }
      ],
      // 选中的筛选条件
      selectedOptions: {
        year: '全部',
        type: ''
      },
      selectedYear: null,
      selectedType: '',
      columns: [],
      movies: [],
      // 添加缺失的属性
      size: 20,
      page: 1,
      show404: false,
      query: {
        column: '',
        date: ''
      }
    };
  },
  components: {
    MovieItem, Base404
  },
  activated() {
    if (this.$route.query?.columnId) {
      this.query.column = this.$route.query?.columnId
    }
  },

  deactivated() {
    this.query = {
      column: '',
      date: '',
    }
  },
  created() {
    this.getColumns()
    this.getMovies()
  },
  mounted() {
    this.$EventBus.$on('updateView', () => {
      this.getColumns()
      this.getMovies()
    })
  },
  watch: {
    $route: {
      handler() {
        this.handleRouteChange()

      },

      immediate: true
    }
  },
  computed: {
    columnWords() {
      return this.columns.map(item => {

        return {
          name: item.name,
          value: item.aids.length || 0,
          id: item._id
        }
      })
    },

  },
  methods: {
    async wordClickHandler(name) {

      // let columnId = this.columns.find(item => {
      //   return item.name === name
      // })?._id
      // console.log(this.$store.state.userInfo)
      // if (!this.$store.state.userInfo) {
      //   try {
      //     await this.$store.dispatch('getUserInfo')
      //     // 再次检查是否获取到用户信息
      //     if (!this.$store.state.userInfo) {
      //       this.$notify.warning({
      //         title: '提示',
      //         message: '请先登录以获取完整功能'
      //       })
      //       // 可以选择是否继续跳转
      //     }
      //   } catch (err) {
      //     this.$notify.error({
      //       title: '错误',
      //       message: '获取用户信息失败，请稍后重试'
      //     })
      //     return // 获取失败则不继续
      //   }
      // }
      // console.log(columnId)

      // this.$router.push({ name: 'index', query: { columnId: columnId } })
    },


    async getColumns() {
      try {
        let columns = await this.$api({ type: 'columns' })
        this.columns = columns.list
      } catch (err) {
        console.log(err)
      }
    },

    // 筛选选择处理
    async handleFilterSelect(type, label, value) {
      if (type === 'year') {
        // 检查是否为区间值
        this.selectedOptions.year = label;
        if (value && value.includes('-')) {
          this.selectedYear = value;
        } else if (value) {
          // 单一年份值
          this.selectedYear = parseInt(value);
        } else {
          // 全部或其他空值
          this.selectedOptions.year = label;

          this.selectedYear = value;
        }
      } else if (type === 'type') {
        this.selectedType = value;
      }
      // 触发筛选变化
      await this.emitFilterChange();
    },
    // 发送筛选条件
    async emitFilterChange() {
      const filters = {
        date: this.selectedYear,
        columnId: this.selectedType
      };

      this.$router.push({ name: 'column', query: filters });
    },
    handleRouteChange() {
      // 检查查询参数是否发生变化
      const newColumn = this.$route.query?.columnId || '';
      const newDate = this.$route.query?.date || undefined;

      // 如果查询参数发生了变化，重新加载数据
      if (this.query.column !== newColumn || this.query.date !== newDate) {
        console.log('查询参数发生了变化，重新加载数据');
        this.query.column = newColumn;
        this.query.date = newDate;
        this.cancelMovies();
        console.log('加载电影列表');
        this.getMovies();
        console.log('加载完成')
      }
    },

    getMovies() {
      console.log('开始加载电影列表')
      let data = { size: this.size, page: this.page }
      let query = this.setQuery()
      if (Object.entries(query).length > 0) {
        data.query = QS.stringify(query)
      }
      console.log(data)
      this.$api({ type: 'movies', data }).then(result => {
        // 关键修改：在这里判断是否显示404页面
        if (result.list.length === 0 && this.page === 1) {
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
          console.log(this.movies)
          this.closeLoadClock() //调用父组件provide传递的关闭load锁方法
          this.page++
        }
      }).catch(err => {
        this.$notify.error({
          title: '获取失败',
          message: err.message
        })
      })
    },

    setQuery() {
      const date = this.$route.query?.date ? String(this.$route.query.date) : undefined;
      const column = this.$route.query?.columnId || undefined;

      let query = {};

      // 处理栏目筛选
      if (column) {
        query.column = column;
      }

      // 处理年份筛选
      if (date) {
        // 检查是否为区间值
        if (date.includes('-')) {
          // 解析区间值，如 '2010-2019'
          const [start, end] = date.split('-').map(Number);
          query.date = {
            $gte: start,  // 大于等于开始年份
            $lte: end     // 小于等于结束年份
          };
        } else {
          // 单一年份
          const year = parseInt(date);
          if (!isNaN(year)) {
            query.date = year;
          }
        }
      }

      return query;
    },

    cancelMovies() {
      this.page = 1
      this.movies = []
    },
  },


};
</script>

<style lang="stylus" scoped>
// 主题变量（与网站统一）
$primary = #E50914
$light-black = #252525 // 浅黑背景
$lighter-black = #333333 // 更浅黑色
$light = #F8F8F8 // 浅色文字
$gray = #AAAAAA // 次级文字
$transition = all 0.2s ease

// 筛选容器
.movie-filter
  background-color: $lighter-black
  border-radius: 8px
  padding: 20px
  margin: 20px 0
  box-shadow: 0 3px 10px rgba(0,0,0,0.2)

// 单个筛选组
.filter-group
  margin-bottom: 25px
  &:last-of-type
    margin-bottom: 0

// 筛选标签（年份/类型）
.filter-label
  font-size: 18px
  font-weight: 600
  color: $primary
  margin-bottom: 15px
  display: block

// 筛选选项容器
.filter-options
  display: flex
  flex-wrap: wrap
  gap: 12px

// 筛选选项（标签式）
.filter-option
  padding: 8px 16px
  background-color: $light-black
  border-radius: 20px
  color: $light
  font-size: 14px
  cursor: pointer
  transition: $transition
  border: 1px solid transparent
  &:hover
    background-color: #444
    color: $primary
  // 选中状态（参考示例红色背景）
  &.active
    background-color: $primary
    color: white
    border-color: $primary
    &:hover
      background-color: #C00812

// 响应式适配
@media (max-width: 768px) 
  .movie-filter
    padding: 15px
  .filter-label
    font-size: 16px
  .filter-option
    padding: 6px 12px
    font-size: 13px
  .filter-options
    gap: 8px
  
</style>