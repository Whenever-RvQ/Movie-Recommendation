<template>
    <Scroll>
        <div class="film-strip">
            <!-- 电影详情主体 -->
            <div class="movie-detail">
                <!-- 头部信息：海报+基本信息 -->
                <div class="detail-header">
                    <div class="poster-area">
                        <img :src="movie.cover" alt="沙丘2" class="movie-poster">
                        <div class="poster-actions">
                            <button class="watch-btn" @click.stop.prevent="handleCollect(movie, movie._id)">
                                <i class="fas fa-star"></i> 收藏
                            </button>
                            <!-- 新增：打分按钮 -->
                            <button class="rate-btn" @click="showRating = true">
                                <i class="fas fa-star-half-alt"></i> 打分
                            </button>
                        </div>
                    </div>

                    <div class="info-area">
                        <h1 class="movie-title">{{ movie.title }}</h1>
                        <div class="movie-meta">
                            <span class="meta-item score">{{ movie.score }} <i class="fas fa-star"></i></span>
                            <span class="meta-item type">{{ movie.column.name }}</span>
                            <span class="meta-item year">{{ movie.date }}</span>
                            <span class="meta-item duration">166 分钟</span>
                            <span class="meta-item director">导演：{{ movie.director }}</span>
                        </div>
                        <div class="movie-tags">
                            <span class="movie-tag">热映</span>
                            <span class="movie-tag">奥斯卡</span>
                            <span class="movie-tag">票房冠军</span>
                            <span class="movie-tag">IMDb Top 250</span>
                        </div>
                        <div class="movie-desc">
                            保罗·厄崔迪与查尼·弗雷曼联手，带领弗雷曼人展开反抗，誓要向哈克南家族复仇。在沙漠星球阿拉基斯的残酷环境中，他们将利用神秘的香料和弗雷曼人的战斗技巧，掀起一场改变宇宙格局的战争。
                        </div>
                    </div>
                </div>

                <!-- 剧情简介 -->
                <div class="section">
                    <h2 class="section-title">
                        <i class="fas fa-book-open title-icon"></i> 剧情简介
                    </h2>
                    <div class="section-content">
                        {{ movie.body }}
                    </div>
                </div>

                <!-- 主演列表 -->
                <div class="section">
                    <h2 class="section-title">
                        <i class="fas fa-users title-icon"></i> 主演
                    </h2>
                    <div class="actor-list">
                        <div class="actor-item">
                            <img src="https://picsum.photos/id/64/200/200" alt="提莫西·查拉梅" class="actor-avatar">
                            <div class="actor-name">提莫西·查拉梅</div>
                            <div class="actor-role">保罗·厄崔迪</div>
                        </div>
                        <div class="actor-item">
                            <img src="https://picsum.photos/id/91/200/200" alt="赞达亚" class="actor-avatar">
                            <div class="actor-name">赞达亚</div>
                            <div class="actor-role">查尼·弗雷曼</div>
                        </div>
                        <div class="actor-item">
                            <img src="https://picsum.photos/id/26/200/200" alt="丽贝卡·弗格森" class="actor-avatar">
                            <div class="actor-name">丽贝卡·弗格森</div>
                            <div class="actor-role">杰西卡夫人</div>
                        </div>
                        <div class="actor-item">
                            <img src="https://picsum.photos/id/177/200/200" alt="哈维尔·巴登" class="actor-avatar">
                            <div class="actor-name">哈维尔·巴登</div>
                            <div class="actor-role">斯蒂加尔</div>
                        </div>
                    </div>
                </div>

                <!-- 相关推荐 -->
                <div class="section">
                    <h2 class="section-title">
                        <i class="fas fa-thumbs-up title-icon"></i> 相关推荐
                    </h2>
                    <div class="recommend-list">
                        <div class="recommend-item">
                            <img src="https://picsum.photos/id/237/400/600" alt="奥本海默" class="recommend-poster">
                            <div class="recommend-info">
                                <div class="recommend-title">奥本海默</div>
                                <div class="recommend-score">9.1 <i class="fas fa-star"></i></div>
                            </div>
                        </div>
                        <div class="recommend-item">
                            <img src="https://picsum.photos/id/119/400/600" alt="瞬息全宇宙" class="recommend-poster">
                            <div class="recommend-info">
                                <div class="recommend-title">瞬息全宇宙</div>
                                <div class="recommend-score">8.8 <i class="fas fa-star"></i></div>
                            </div>
                        </div>
                        <div class="recommend-item">
                            <img src="https://picsum.photos/id/26/400/600" alt="蜘蛛侠：纵横宇宙" class="recommend-poster">
                            <div class="recommend-info">
                                <div class="recommend-title">蜘蛛侠：纵横宇宙</div>
                                <div class="recommend-score">8.9 <i class="fas fa-star"></i></div>
                            </div>
                        </div>
                        <div class="recommend-item">
                            <img src="https://picsum.photos/id/133/400/600" alt="银翼杀手2049" class="recommend-poster">
                            <div class="recommend-info">
                                <div class="recommend-title">银翼杀手2049</div>
                                <div class="recommend-score">8.7 <i class="fas fa-star"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CommentTextArea :aid="movie._id" />
            <CommentList :comments="movie.comments" />
            <MovieScore v-show="showRating" :movie="movie" @close="showRating = false"
                @updateScore="handleUpdateScore" />
        </div>



    </Scroll>
</template>

<script>
// import { get } from 'store';
import CommentTextArea from '@/components/comment/CommentTextArea'
import CommentList from '@/components/comment/CommentList'
import MINXIN from '@/core/minxin'
import MovieScore from '@/components/movie/MovieScore.vue'
export default {
    name: 'Movie',
    components: {
        CommentTextArea, CommentList, MovieScore
    },
    data() {
        return {
            id: '',
            movie: {},
            mixins: [MINXIN],
            isRouteLoading: true,
            userInfo: this.$store.state.userInfo,
            showRating: false // 控制打分弹窗显示/隐藏
        };
    },
    provide() {
        return {
            getMovieById: this.getMovieById
        }
    },
    created() {
        this.id = this.$route.params.id
    },
    watch: {
        showRating: {
            handler(val) {
                console.log('showRating changed:', val);

            },
            immediate: true // 立即执行一次
        }
    },

    mounted() {
        this.getMovieById()
        console.log(this.movie)
        this.$EventBus.$on('movie-like-updated', () => {
            console.log('movie-like-updated')
            this.reload()
        })
    },
    beforeDestroy() {
        this.$EventBus.$off('movie-like-updated')
        // 恢复页面滚动
        document.body.style.overflow = ''
    },
    computed: {
        like_num() {
            localStorage.setItem('like_num', this.movie.like_num)
            return localStorage.getItem('like_num')
        }
    },
    methods: {
        reload() {
            this.$nextTick(() => {
                this.isRouteLoading = true
                this.getMovieById()
            });
        },
        getMovieById() {
            this.$api({ type: 'getMovieById', data: { id: this.id } }).then(result => {
                this.movie = result
            }).catch(err => {
                this.$notify.success({
                    title: '获取失败',
                    message: err.message
                })
            })
        },
        // 监听弹窗显示状态，控制页面滚动
        getCurrentPath() {
            return this.$route.path
        },

        // 处理评分更新事件
        handleUpdateScore(newScore) {
            this.showRating = false;
            console.log('newScore:', newScore);
            this.reload();
        },

        // 收藏功能（示例）
        handleCollect(movie, id) {
            // 实际项目中添加收藏接口逻辑
            let status;
            let updateList = this.userInfo.collectList.map(item => item.toString());;
            console.log(updateList);
            if (this.userInfo.collectList && this.userInfo.collectList.includes(id)) {
                status = true;
                updateList = this.userInfo.collectList.filter(item => item !== id);
                this.$api({
                    type: 'putMovieInfo',
                    data: {
                        collectList: updateList
                    },
                    params: {
                        id: this.userInfo._id,
                    }

                }

                ).then(res => {
                    console.log(res);
                    movie.isCollected = !status;
                    this.$notify.success({ title: '操作成功', message: '已取消收藏' });
                    const updatedUserInfo = { ...this.userInfo, collectList: updateList };
                    this.$store.commit('SET_USERINFO', updatedUserInfo);
                    this.userInfo = this.$store.state.userInfo;
                    this.reload();
                }).catch(err => {
                    this.$notify.error({ title: '收藏失败', message: err.message });
                });
            }
            else {
                status = false;
                updateList = this.userInfo.collectList ? [...this.userInfo.collectList, id] : [id];
                this.$api({
                    type: 'putMovieInfo',
                    data: {
                        collectList: updateList
                    },
                    params: {
                        id: this.userInfo._id,
                    }

                }

                ).then(res => {
                    console.log(res);
                    movie.isCollected = !status;
                    this.$notify.success({ title: '操作成功', message: '已加入收藏' });
                    const updatedUserInfo = { ...this.userInfo, collectList: updateList };
                    this.$store.commit('SET_USERINFO', updatedUserInfo);
                    this.userInfo = this.$store.state.userInfo;
                    this.reload();
                }).catch(err => {
                    this.$notify.error({ title: '收藏失败', message: err.message });
                });
            }
            console.log(status);

        }

    },


};
</script>

<style lang="stylus">
.blog-main--card
  width 100%
:root {
    --primary: #E50914; /* 红色主色调 */
    --primary-light: #FF4444; /* 浅红色 */
    --light-black: #252525; /* 浅黑背景 */
    --lighter-black: #333333; /* 更浅黑色 */
    --gray: #AAAAAA; /* 次级文字 */
    --border-color: #444444; /* 边框颜色 */
    --transition: all 0.3s ease; /* 过渡动画 */
}

/* 胶片边框容器 */
.film-strip {
    position: relative;
    width: 100%;
    color: #F8F8F8; /* 浅色文字 */
    max-width: 1200px;
    margin: 0 auto;
    background-color: #2D2D2D;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

/* 胶片顶部/底部齿孔 */
.film-strip::before{
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 20px;
    background-image: radial-gradient(circle, transparent 5px, #1A1A1A 6px);
    background-size: 24px 20px;
    background-position: 0 0;
}

.film-strip::before {
    top: 0;
}

.film-strip::after {
    bottom: 0;
}

/* 详情页主体 */
.movie-detail {
    background-color: var(--lighter-black);
    padding: 40px;
    margin: 20px;
    position: relative;
    z-index: 1;
}

/* 头部信息区域 */
.detail-header {
    display: flex;
    gap: 40px;
    margin-bottom: 50px;
    flex-wrap: wrap;
}

/* 海报区域 */
.poster-area {
    flex: 0 0 300px;
}

.movie-poster {
    width: 100%;
    height: 450px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.poster-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
}

.poster-actions button {
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.watch-btn {
    background-color: var(--primary);
    color: white;
}

.watch-btn:hover {
    background-color: #C00812;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(229,9,20,0.3);
}

/* 新增：打分按钮样式 */
.rate-btn {
    background-color: var(--light-black);
    color: var(--light);
    border: 1px solid var(--border-color);
}

.rate-btn:hover {
    background-color: #3A3A3A;
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-2px);
}

.collect-btn {
    background-color: var(--light-black);
    color: var(--light);
    border: 1px solid var(--border-color);
}

.collect-btn:hover {
    background-color: #3A3A3A;
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-2px);
}

.share-btn {
    background-color: transparent;
    color: var(--gray);
}

.share-btn:hover {
    color: var(--primary);
}

/* 信息区域 */
.info-area {
    flex: 1;
    min-width: 300px;
}

.movie-title {
    font-size: 36px;
    font-weight: 700;
    color: white;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--primary);
    padding-bottom: 10px;
    display: inline-block;
}

.movie-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 25px;
    color: var(--gray);
    font-size: 14px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.meta-item.score {
    color: #FFC107;
    font-size: 18px;
    font-weight: 600;
}

.meta-item.type,
.meta-item.year,
.meta-item.duration {
    background-color: var(--light-black);
    padding: 4px 12px;
    border-radius: 20px;
}

.movie-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 25px;
}

.movie-tag {
    background-color: rgba(229,9,20,0.1);
    color: var(--primary);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 14px;
    border: 1px solid rgba(229,9,20,0.3);
}

.movie-desc {
    font-size: 16px;
    line-height: 1.8;
    color: var(--light);
    margin-bottom: 20px;
}

/* 章节标题 */
.section-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 2px solid var(--primary);
    padding-bottom: 10px;
}

.title-icon {
    font-size: 22px;
    background-color: rgba(229,9,20,0.1);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 章节内容 */
.section {
    margin-bottom: 50px;
}

.section-content {
    font-size: 16px;
    line-height: 1.8;
    color: var(--light);
}

/* 演员列表 */
.actor-list {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 20px;
}

.actor-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
}

.actor-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--border-color);
    margin-bottom: 10px;
}

.actor-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--light);
    margin-bottom: 4px;
}

.actor-role {
    font-size: 14px;
    color: var(--gray);
}

/* 相关推荐 */
.recommend-list {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    margin-top: 20px;
}

.recommend-item {
    width: calc(25% - 20px);
    min-width: 180px;
    cursor: pointer;
    transition: var(--transition);
}

.recommend-item:hover {
    transform: translateY(-5px);
}

.recommend-poster {
    width: 100%;
    height: 270px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    margin-bottom: 10px;
}

.recommend-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.recommend-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
}

.recommend-score {
    color: #FFC107;
    font-size: 14px;
    font-weight: 600;
}





/* 弹窗动画 */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式适配 */
@media (max-width: 1024px) {
    .recommend-item {
        width: calc(33.333% - 20px);
    }
}

@media (max-width: 768px) {
    .movie-detail {
        padding: 20px;
        margin: 10px;
    }

    .detail-header {
        flex-direction: column;
        gap: 20px;
    }

    .poster-area {
        flex: 0 0 auto;
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
    }

    .movie-title {
        font-size: 28px;
    }

    .recommend-item {
        width: calc(50% - 15px);
    }

    /* 弹窗响应式 */
    .rating-content {
        padding: 25px 20px;
        max-width: 90%;
    }

    .rating-stars {
        gap: 15px;
    }

    .star-item {
        font-size: 38px;
    }

    .rating-desc {
        gap: 25px;
    }

    .rating-btn {
        padding: 10px 25px;
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .poster-actions button {
        font-size: 14px;
        padding: 10px;
    }

    .section-title {
        font-size: 20px;
    }

    .recommend-item {
        width: 100%;
    }

    /* 弹窗响应式 */
    .rating-stars {
        gap: 10px;
    }

    .star-item {
        font-size: 32px;
    }

    .rating-desc {
        gap: 15px;
        font-size: 12px;
    }

    .rating-buttons {
        flex-direction: column;
        gap: 10px;
    }

    .rating-btn {
        width: 100%;
    }
}
</style>