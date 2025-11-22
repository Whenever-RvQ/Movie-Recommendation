<template>
    <!-- 新增：打分弹窗 -->
    <div class="rating-modal">
        <div class="rating-overlay"></div>
        <div class="rating-content">
            <h3 class="rating-title">为《{{ movie.title || '未知电影' }}》评分</h3>
            <div class="rating-score">
                <span v-for="score in 10" :key="score" :class="['score-item', { active: selectedScore === score }]"
                    @click="getScore(score)">{{ score }}</span>
            </div>
            <div class="rating-score-desc">
                <span>1分</span>
                <span>5分</span>
                <span>10分</span>
            </div>
            <div class="rating-note">
                <textarea class="rating-note-input" placeholder="添加评分备注（可选）" maxlength="150"></textarea>
            </div>
            <div class="rating-tip">
                您的评分将帮助我们为您推荐更合心意的电影
            </div>
            <div class="rating-buttons" @click="$emit('close')">
                <button class="rating-btn cancel" @click="$emit('close')">取消</button>
                <button class="rating-btn confirm" @click="changeMovieScore()">提交评分</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MovieScore',
    props: {
        movie: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            form: {
                score: 0,
            },
            selectedScore: 0
        };
    },
    methods: {
        getScore(score) {
            this.selectedScore = score;
            this.form.score = score;
            console.log('评分', this.form.score);
        },

        async changeMovieScore() {
            try {
                const res = await this.$api({
                    type: 'putMovieInfo',
                    data: this.form,
                    params: {
                        id: this.movie._id
                    }
                });
                let articleCount= this.$store.state.userInfo.articleCount+=1
                // 更新文章评分统计
                await this.$api({
                    type: 'putArticleCount',
                    data: {
                        articleCount: articleCount
                    },
                    params: {
                        id: this.$store.state.userInfo._id
                    }
                });
                if (res) {
                    // 显示成功提示
                    this.$notify.success({
                        title: '成功',
                        message: '评分成功！感谢您的反馈'
                    });
                    this.$emit('updateScore', this.form.score); // 通知父组件更新评分显示
                    this.$emit('close');
                    console.log('评分成功', res);
                }
            } catch (err) {
                this.$notify.error({
                    title: '失败',
                    message: '评分失败，请稍后重试'
                });
                console.error('更新失败:', err);
            }
        },
    }
}
</script>

<style lang="stylus" scoped>
/* 新增：打分弹窗样式 */
.rating-modal {
    position: fixed 
    top: 0 
    left: 0 
    width: 100vw 
    height: 100vh 
    z-index: 9999 
    display: flex 
    align-items: center 
    justify-content: center 
    overflow: hidden 
}

.rating-overlay {
    position: absolute 
    top: 0 
    left: 0 
    width: 100% 
    height: 100% 
    background-color: rgba(0, 0, 0, 0.8) 
    backdrop-filter: blur(3px) 
    transition: var(--transition);
}

.rating-content {
    background-color: var(--lighter-black);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 35px 40px;
    width: 100%;
    max-width: 600px;
    position: relative;
    z-index: 10000 
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    animation: fadeInUp 0.3s ease;
}

.rating-title {
    font-size: 22px;
    color: var(--light);
    text-align: center;
    margin-bottom: 30px;
    font-weight: 600;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
}

.rating-score {
  display: flex
  justify-content center
  gap 11px
  margin-bottom 15px
  flex-wrap wrap
}

.score-item
  width: 40px
  height: 40px
  line-height: 40px
  text-align: center
  background-color: var(--light-black)
  border: 1px solid var(--border-color)
  border-radius: 50%
  color: var(--gray)
  font-size: 16px
  font-weight: 600
  cursor: pointer
  transition: var(--transition)

// 选中/hover状态
.score-item.active,
.score-item:hover
  background-color: var(--primary)
  border-color: var(--primary)
  color: white
  transform: scale(1.1)
  box-shadow: 0 0 10px rgba(229,9,20,0.4)

// 分数描述
.rating-score-desc
  display: flex
  justify-content: space-between
  margin-bottom: 25px
  color: var(--gray)
  font-size: 13px
  padding: 0 20px

/* 星星下方描述 */
.rating-desc {
    display: flex;
    justify-content: center;
    gap: 35px;
    margin-bottom: 25px;
    color: var(--gray);
    font-size: 13px;
}

/* 评分备注 */
.rating-note {
    margin-bottom: 25px;
}

.rating-note-input {
    width: 100%;
    padding: 12px 16px;
    background-color: var(--light-black);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--light);
    font-size: 14px;
    resize: none;
    min-height: 80px;
    transition: var(--transition);
}

.rating-note-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(229, 9, 20, 0.2);
}

.rating-note-input::placeholder {
    color: var(--gray);
}

/* 打分提示 */
.rating-tip {
    text-align: center;
    color: var(--gray);
    font-size: 14px;
    margin-bottom: 30px;
    line-height: 1.5;
}

/* 弹窗按钮区域 */
.rating-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.rating-btn {
    padding: 12px 35px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border: none;
}

/* 取消按钮 */
.rating-btn.cancel {
    background-color: var(--light-black);
    color: var(--light);
    border: 1px solid var(--border-color);
}

.rating-btn.cancel:hover {
    background-color: #444444;
    transform: translateY(-2px);
}

/* 确认按钮 */
.rating-btn.confirm {
    background-color: var(--primary);
    color: white;
}

.rating-btn.confirm:hover {
    background-color: var(--primary-light);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(229, 9, 20, 0.3);
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