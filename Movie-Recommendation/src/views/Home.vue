<template>
  <div class="blog-page">
    <el-container class="blog-container" v-if="welcome">
      
      <el-header class="blog-header">
        <BaseHeader />
      </el-header>
      <el-container class="blog-middle">

        <el-row class="blog-middle--wrap" type="flex" justify="flex-wrap" align="center">
          <el-col :span="6" class="hidden-md-and-down" v-if="isUserRoute">
            <BaseAside v-if="$store.state.userInfo" />
          </el-col>

          <el-col :span="24" :lg="{ span: 24 }">
            <el-main class="blog-main">
              <keep-alive include="MovieIndex">
                <router-view v-if="isRouteLoading" :loading="loading"></router-view>
              </keep-alive>
            </el-main>
          </el-col>
          <el-col :span="1" v-if="menu">
            <!-- <CircleMenu type='bottom' :number='3' :colors="['#ebc08e', '#ebc08e', '#ebc08e', '#ebc08e', '#ebc08e']"
              circle btn class="circle-menu" v-if="index">
              <router-link tag="i" slot="item_1" class="el-icon-edit" to="/editor"></router-link>
              <router-link tag="i" slot="item_2" class="el-icon-star-on" to="/like"></router-link>
              <i slot="item_3" class="el-icon-refresh-left" @click="refreshAll()"></i>

            </CircleMenu> -->
            <CircleMenu type='bottom' :number='3' :colors="['#ebc08e', '#ebc08e', '#ebc08e', '#ebc08e', '#ebc08e']"
              circle btn class="circle-menu" v-if="articletools">
              <router-link tag="i" slot="item_1" class="el-icon-edit" to="/editor"></router-link>
              <i slot="item_2" class="el-icon-star-on" @click="incMovieLikeNum"></i>
              <router-link tag="i" slot="item_3" class="el-icon-download" to="/download"></router-link>
            </CircleMenu>
            <CircleMenu type='bottom' :number='2' :colors="['#ebc08e', '#ebc08e', '#ebc08e', '#ebc08e', '#ebc08e']"
              circle btn class="circle-menu" v-if="columntools">
              <i tag="i" slot="item_1" class="el-icon-circle-plus-outline" @click="addColumn"></i>
              <i tag="i" slot="item_2" class="el-icon-delete" @click="deleteColumn"></i>
            </CircleMenu>
          </el-col>
        </el-row>
      </el-container>
      <!-- <el-footer class="blog-footer" v-if="isFoot">底部</el-footer> -->
    </el-container>
    <div v-else class="blog-welcome">
      <BaseWelcome />
    </div>
    <BaseModal />
    <Live2D v-if="!welcome" />
  </div>

</template>

<script>
// @ is an alias to /src
import BaseModal from '@/components/base/BaseModal'
import BaseHeader from '@/components/base/BaseHeader'
import BaseAside from '@/components/base/BaseAside'
import BaseWelcome from '@/components/base/BaseWelcome'
import CircleMenu from 'vue-circle-menu'
import Live2D from '@/components/Live2d'  
import MINXIN from '@/core/minxin'
export default {
  name: 'Home',
  mixins: [MINXIN],
  components: {
    BaseModal, BaseHeader, BaseAside, BaseWelcome, CircleMenu,Live2D
  },
  data() {
    return {
      loading: false,
      isRouteLoading: true,
    }
  },

  provide() {
    return {
      'closeLoadClock': this.closeLoadClock
    }
  },
  computed: {
    welcome() {
      return this.$store.state.welcome
    },
    index() {
      return this.$route.path === '/index'
    },
    articletools() {
      const basicPath = /^\/article\/.*/
      return basicPath.test(this.$route.path)
    },
    columntools() {
      return this.$route.path === '/column'
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    isUserRoute() {
      return this.$route.path === '/user'
    },
    isFoot() {
      return false
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.path === '/index') {
        vm.refreshData();
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.path === '/index') {
      this.reload()

    }
    if (this.$route.path === '/index') {
      this.reload()
    }
    next();
  },
  mounted() {
    // 页面挂载时也可以检查一次
    if (this.$route.path === '/index') {

      this.reload()
    }
  },
  watch: {
    userInfo: {
      deep: true,
    }
  },
  methods: {
    //重载route-view
    reload() {
      this.isRouteLoading = false
      this.$nextTick(() => {
        this.isRouteLoading = true
      });
    },
    closeLoadClock() {
      this.loading = false
    },
    addColumn() {
      this.refreshModal('postColumn')
    },
    async incMovieLikeNum() {
      // 获取当前文章的点赞数，确保是数字类型
      let currentLikeNum = 0;

      // 从当前路由参数获取文章ID
      const movieId = this.$route.params.id;

      if (!movieId) {
        this.$notify.error({
          message: '无法获取电影信息'
        });
        return;
      }

      try {
        // 首先获取文章当前的点赞数
        const movieRes = await this.$api({
          type: 'getMoiveById',
          data: { id: movieId }
        });

        currentLikeNum = parseInt(movieRes.like_num) || 0;

        // 增加点赞数
        const res = await this.$api({
          type: 'putMovieLikeNum',
          data: {
            like_num: currentLikeNum + 1  // 确保是数字
          },
          params: {
            id: movieId
          }
        });

        if (res) {
          console.log(res);
          // 确保存储的是数字类型
          const newLikeNum = parseInt(res.like_num) || 0;
          localStorage.setItem('like_num', newLikeNum.toString());

          this.$notify.success({
            message: '已点赞！'
          });

          // 通知其他组件更新数据
          this.$EventBus.$emit('Movie-like-updated', {
            id: movieId,
            like_num: newLikeNum
          });
        }
      } catch (error) {
        console.error('点赞失败:', error);
        this.$notify.error({
          message: '点赞失败: ' + error.message
        });
      }
    },
    deleteColumn() {
      this.refreshModal('deleteColumn')
    },
    refreshData() {
      if (this.$store.state.token) {
        this.$store.dispatch('getUserInfo');
      }
    },
    refreshAll() {
      console.log('refreshAll')
      location.reload()
    }
  }
}
</script>
<style lang="stylus">
.blog-container {
  overflow: hidden;
}

.blog-middle {
  height: calc(100vh - 60px);
  background-color: #1A1A1A;
}

.el-main.blog-main {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  
  // Webkit浏览器滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #2D2F33;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #d0a87d;
  }
}
.blog-middle--wrap
  min-width: 1220px
  width: 100%

.blog-footer
  height: 10vh
  background-color: #2D2F33

.circle-menu
  margin-top: 1vh
  width: 55%
  scale: 0.8

.circle-menu i
  color: white
  scale: 1.2
  transform: transition(all 0.3s ease)

.circle-menu i:hover
  scale: 1.5
  transform: transition(all 0.3s ease)
</style>
