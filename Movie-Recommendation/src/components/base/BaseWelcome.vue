<template>
  <!-- 背景装饰点 -->
  <el-container class="welcome-page">
    <!-- 瀑布流容器：增加子元素数量（16个），支持更多纵向图片 -->
    <!-- 隐藏的预加载容器，辅助浏览器缓存图片 -->
    <div class="preload-images" style="display: none;"></div>
    <div class="movie-waterfall">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="logo">
      <i class="fas fa-film"></i>
      <span>CineMatch</span>
    </div>
    <div class="auth-buttons">
      <button class="auth-btn auth-btn-login" @click="refreshModal('login')">
        <i class="fas fa-sign-in-alt"></i> 登录
      </button>
      <button class="auth-btn auth-btn-register" @click="refreshModal('register')">
        <i class="fas fa-user-plus"></i> 注册
      </button>
    </div>
    <!-- 主内容 -->
    <div class="welcome-container">

      <!-- 个人标识（可替换为头像） -->
      <div class="personal-mark">
        <img src="@/assets/img/avatar.jpg">
      </div>
      <!-- 欢迎语 -->
      <h1 class="greeting">发现属于你的<span>电影宇宙</span></h1>
      <p class="intro">
        基于你的喜好，智能推荐优质影片，解锁更多精彩视听体验
      </p>
      <!-- 行动按钮 -->
      <div class="action-buttons">
        <a href="#about" class="btn btn-primary">
          <i class="fas fa-user-circle"></i>探索影片
        </a>
        <a href="#works" class="btn btn-secondary">
          <i class="fas fa-briefcase"></i>智能推荐
        </a>
      </div>
      <!-- 社交链接 -->
      <div class="social-links">
        <a href="https://github.com/Whenever-RvQ/Movie-Recommendation" aria-label="GitHub"><i class="fab fa-github"></i></a>
        <a href="#" aria-label="LinkedIn"><i class="fab fa-qq"></i></a>
        <a href="#" aria-label="微博"><i class="fab fa-weixin"></i></a>
        <a href="#" aria-label="邮箱"><i class="fas fa-envelope"></i></a>
      </div>
      <!-- 版权信息 -->
      <div class="copyright">© 2025 Whevener_RvQ. All rights reserved.</div>
    </div>
  </el-container>
</template>

<script>
import MINXIN from '@/core/minxin'
export default {
  name: 'Welcome',
  mixins: [MINXIN],
  components: {},
  data() {
    return {
      // 所有背景图片URL集合
      backgroundImages: [
        require('@/assets/img/agzz.jpg'),
        require('@/assets/img/bb.jpg'),
        require('@/assets/img/bdps.webp'),
        require('@/assets/img/bfx.jpg'),
        require('@/assets/img/dmkj.jpg'),
        require('@/assets/img/hb.jpeg'),
        require('@/assets/img/jf.jpeg'),
        require('@/assets/img/jsc.jpeg'),
        require('@/assets/img/ls.jpeg'),
        require('@/assets/img/max.jpg'),
        require('@/assets/img/qybs.jpg'),
        require('@/assets/img/sq.jpg'),
        require('@/assets/img/sxqyz.jpg'),
        require('@/assets/img/ttnkh.webp'),
        require('@/assets/img/xjcy.jpg'),
        require('@/assets/img/xxkdjs.png'),
        require('@/assets/img/yhhwd.webp'),
        require('@/assets/img/zhw.png'),
        require('@/assets/img/zzx.jpg'),
        require('@/assets/img/abhm.jpg')
      ],
      isImagesLoaded: false
    }
  },
  mounted() {
    this.preloadBackgroundImages().then(() => {
      // 预加载完成后添加 loaded 类
      this.$nextTick(() => {
        const waterfall = document.querySelector('.movie-waterfall');
        if (waterfall) {
          waterfall.classList.add('loaded');
        }
        this.isImagesLoaded = true;
      });
    });
  },
  methods: {
    preloadBackgroundImages() {
      // 创建图片预加载队列
      const preloadQueue = [];

      this.backgroundImages.forEach((url, index) => {
        const img = new Image();
        console.log(`开始预加载图片: ${url}`);
        img.src = url;

        // 添加加载完成的 Promise 到队列
        preloadQueue.push(
          new Promise((resolve) => {
            img.onload = () => {
              console.log(`图片预加载成功: ${url}`);
              resolve();
            };
            img.onerror = () => {
              console.warn(`图片加载失败，使用默认图片: ${url}`);
              resolve(); // 即使失败也继续
            };
          })
        );
      });

      // 等待所有图片预加载完成
      Promise.all(preloadQueue).then(() => {
        console.log('所有背景图片预加载完成');
      });
    }
  }

}
</script>
<style lang="stylus">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 全局变量（保持不变） */
:root {
  --primary: #2d7ff9;
  --accent: #6c5ce7;
  --neutral: #f8f9fa;
  --text-dark: #2d3436;
  --text-light: #636e72;
  --shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  --transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --bg-gradient: linear-gradient(120deg, #fafafa 0%, #f5f6f7 100%);
}

/* 全局样式（提亮背景） */
body {
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  background-color: #1e293b; /* 从#0f172a提亮为#1e293b */
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  position: relative;
}

/* 电影瀑布流背景 - 核心优化：增加列数+提亮+多图密度 */
.movie-waterfall {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* 列数从8列增加到12列，更密集 */
  gap: 8px; /* 缩小间距，增加填充感 */
  padding: 15px;
  z-index: -1;
  overflow: hidden;
}

/* 瀑布流容器：硬件加速+避免布局抖动 */
.movie-waterfall {
  will-change: transform;
  backface-visibility: hidden;
  transform: translateZ(0); /* 启用GPU渲染 */
}

/* 背景图片：改进渐进式加载+平滑过渡 */
.movie-waterfall::before,
.movie-waterfall::after,
.movie-waterfall > div::before,
.movie-waterfall > div::after {
  /* 初始状态：高模糊+透明，避免加载闪烁 */
  filter: blur(15px) brightness(0.3) contrast(0.8);
  opacity: 0;
  /* 硬件加速 */
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: filter, opacity, transform;
  /* 加载完成平滑过渡 */
  transition: filter 1s ease-out, opacity 1s ease-out;
  /* 延迟动画启动，等待图片加载 */
  animation: scroll 15s linear infinite;
  animation-delay: calc(var(--animation-delay, 0s) + 0.5s);
}

/* 图片加载完成后：恢复正常样式 */
.movie-waterfall.loaded::before,
.movie-waterfall.loaded::after,
.movie-waterfall.loaded > div::before,
.movie-waterfall.loaded > div::after {
  filter: blur(3px) brightness(0.5) contrast(0.95);
  opacity: 0.9;
}

/* 滚动动画：使用transform，性能优于top/left */
@keyframes scroll {
  0% { 
    transform: translateY(-100%); 
    opacity: 0.7;
  }
  10% {
    opacity: 0.9;
  }
  90% {
    opacity: 0.9;
  }
  100% { 
    transform: translateY(100%); 
    opacity: 0.7;
  }
}
/* 瀑布流子容器：支持多伪元素叠加 */
.movie-waterfall > div {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 20px 20px
}

/* 瀑布流图片样式 - 核心提亮：brightness从0.3提升到0.5，降低模糊度 */
.movie-waterfall::before,
.movie-waterfall::after,
.movie-waterfall > div::before,
.movie-waterfall > div::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  filter: blur(2px) brightness(0.5) contrast(0.95); /* 提亮+降低模糊 */
  animation: scroll 10s linear infinite; /* 加快滚动速度，更灵动 */
  opacity: 0.9;
}

/* 纵向多图配置：每列3-4张图，错落叠加（共32张图，12列纵向密集分布） */
/* 第1列 */
.movie-waterfall::before {
  grid-column: 8/9;
  grid-row: 8/9;
  background-image: url('../../assets/img/abhm.jpg');
  animation-duration: 12s;
  animation-delay: 0.5s;
}
.movie-waterfall > div:nth-child(1)::before {
  grid-column: 1;
  grid-row: 3 / 6;
  background-image: url('../../assets/img/agzz.jpg');
  animation-duration: 14s;
  animation-delay: 0.5s;
}
.movie-waterfall > div:nth-child(1)::after {
  grid-column: 1;
  grid-row: 5 / 8;
  background-image: url('../../assets/img/bb.jpg');
  animation-duration: 13s;
  animation-delay: 1s;
}

/* 第2列 */
.movie-waterfall::after {
  grid-column: 9 /10;
  grid-row: 9 / 10;
  background-image: url('../../assets/img/bdps.webp');
  animation-duration: 15s;
  animation-delay: 0.3s;
}
.movie-waterfall > div:nth-child(2)::before {
  grid-column: 2;
  grid-row: 4 / 7;
  background-image: url('../../assets/img/bfx.jpg');
  animation-duration: 11s;
  animation-delay: 0.8s;
}
.movie-waterfall > div:nth-child(2)::after {
  grid-column: 2;
  grid-row: 6 / 9;
  background-image: url('../../assets/img/dmkj.jpg');
  animation-duration: 16s;
  animation-delay: 1.2s;
}

/* 第3列 */
.movie-waterfall > div:nth-child(3)::before {
  grid-column: 3;
  grid-row: 1 / 4;
  background-image: url('../../assets/img/hb.jpeg');
  animation-duration: 13s;
  animation-delay: 0.2s;
}
.movie-waterfall > div:nth-child(3)::after {
  grid-column: 3;
  grid-row: 3 / 6;
  background-image: url('../../assets/img/jf.jpeg');
  animation-duration: 14s;
  animation-delay: 0.7s;
}
.movie-waterfall > div:nth-child(4)::before {
  grid-column: 3;
  grid-row: 5 / 8;
  background-image: url('../../assets/img/jsc.jpeg');
  animation-duration: 12s;
  animation-delay: 1.1s;
}

/* 第4列 */
.movie-waterfall > div:nth-child(4)::after {
  grid-column: 4;
  grid-row: 2 / 5;
  background-image: url('../../assets/img/ls.jpeg');
  animation-duration: 15s;
  animation-delay: 0.4s;
}
.movie-waterfall > div:nth-child(5)::before {
  grid-column: 4;
  grid-row: 4 / 7;
  background-image: url('../../assets/img/max.jpg');
  animation-duration: 13s;
  animation-delay: 0.9s;
}
.movie-waterfall > div:nth-child(5)::after {
  grid-column: 4;
  grid-row: 6 / 9;
  background-image: url('../../assets/img/qybs.jpg');
  animation-duration: 16s;
  animation-delay: 1.3s;
}

/* 第5列 */
.movie-waterfall > div:nth-child(6)::before {
  grid-column: 5;
  grid-row: 1 / 3;
  background-image: url('../../assets/img/sq.jpg');
  animation-duration: 14s;
  animation-delay: 0.1s;
}
.movie-waterfall > div:nth-child(6)::after {
  grid-column: 5;
  grid-row: 3 / 6;
  background-image: url('../../assets/img/sxqyz.jpg');
  animation-duration: 12s;
  animation-delay: 0.6s;
}
.movie-waterfall > div:nth-child(7)::before {
  grid-column: 5;
  grid-row: 5 / 8;
  background-image: url('../../assets/img/ttnkh.webp');
  animation-duration: 15s;
  animation-delay: 1s;
}

/* 第6列 */
.movie-waterfall > div:nth-child(7)::after {
  grid-column: 6;
  grid-row: 2 / 5;
  background-image: url('../../assets/img/xjcy.jpg');
  animation-duration: 13s;
  animation-delay: 0.5s;
}
.movie-waterfall > div:nth-child(8)::before {
  grid-column: 6;
  grid-row: 4 / 7;
  background-image: url('../../assets/img/xxkdjs.png');
  animation-duration: 14s;
  animation-delay: 0.8s;
}
.movie-waterfall > div:nth-child(8)::after {
  grid-column: 6;
  grid-row: 6 / 9;
  background-image: url('../../assets/img/yhhwd.webp');
  animation-duration: 11s;
  animation-delay: 1.2s;
}

/* 第7列 */
.movie-waterfall > div:nth-child(9)::before {
  grid-column: 7;
  grid-row: 1 / 4;
  background-image: url('../../assets/img/zhw.png');
  animation-duration: 16s;
  animation-delay: 0.2s;
}
.movie-waterfall > div:nth-child(9)::after {
  grid-column: 7;
  grid-row: 3 / 6;
  background-image: url('../../assets/img/zzx.jpg');
  animation-duration: 13s;
  animation-delay: 0.7s;
}
.movie-waterfall > div:nth-child(10)::before {
  grid-column: 7;
  grid-row: 5 / 8;
  background-image: url('../../assets/img/abhm.jpg');
  animation-duration: 15s;
  animation-delay: 1.1s;
}

/* 第8列 */
.movie-waterfall > div:nth-child(10)::after {
  grid-column: 8;
  grid-row: 2 / 5;
  background-image: url('../../assets/img/bdps.webp');
  animation-duration: 12s;
  animation-delay: 0.4s;
}
.movie-waterfall > div:nth-child(11)::before {
  grid-column: 8;
  grid-row: 4 / 7;
  background-image: url('../../assets/img/abhm.jpg');
  animation-duration: 14s;
  animation-delay: 0.9s;
}
.movie-waterfall > div:nth-child(11)::after {
  grid-column: 8;
  grid-row: 6 / 9;
  background-image: url('../../assets/img/bdps.webp');
  animation-duration: 13s;
  animation-delay: 1.3s;
}

/* 第9列 */
.movie-waterfall > div:nth-child(12)::before {
  grid-column: 9;
  grid-row: 1 / 3;
  background-image: url('../../assets/img/yhhwd.webp');
  animation-duration: 15s;
  animation-delay: 0.3s;
}
.movie-waterfall > div:nth-child(12)::after {
  grid-column: 9;
  grid-row: 3 / 6;
  background-image: url('../../assets/img/zhw.png');
  animation-duration: 11s;
  animation-delay: 0.8s;
}
.movie-waterfall > div:nth-child(13)::before {
  grid-column: 9;
  grid-row: 5 / 8;
  background-image: url('../../assets/img/zzx.jpg');
  animation-duration: 16s;
  animation-delay: 1.2s;
}

/* 第10列 */
.movie-waterfall > div:nth-child(13)::after {
  grid-column: 10;
  grid-row: 2 / 5;
  background-image: url('../../assets/img/sq.jpg');
  animation-duration: 13s;
  animation-delay: 0.5s;
}
.movie-waterfall > div:nth-child(14)::before {
  grid-column: 10;
  grid-row: 4 / 7;
  background-image: url('../../assets/img/sxqyz.jpg');
  animation-duration: 14s;
  animation-delay: 0.9s;
}
.movie-waterfall > div:nth-child(14)::after {
  grid-column: 10;
  grid-row: 6 / 9;
  background-image: url('../../assets/img/ttnkh.webp');
  animation-duration: 12s;
  animation-delay: 1.4s;
}

/* 第11列 */
.movie-waterfall > div:nth-child(15)::before {
  grid-column: 11;
  grid-row: 1 / 4;
  background-image: url('../../assets/img/xjcy.jpg');
  animation-duration: 15s;
  animation-delay: 0.2s;
}
.movie-waterfall > div:nth-child(15)::after {
  grid-column: 11;
  grid-row: 3 / 6;
  background-image: url('../../assets/img/xxkdjs.png');
  animation-duration: 13s;
  animation-delay: 0.7s;
}
.movie-waterfall > div:nth-child(16)::before {
  grid-column: 11;
  grid-row: 5 / 8;
  background-image: url('../../assets/img/yhhwd.webp');
  animation-duration: 14s;
  animation-delay: 1.1s;
}

/* 第12列 */
.movie-waterfall > div:nth-child(16)::after {
  grid-column: 12;
  grid-row: 2 / 5;
  background-image: url('../../assets/img/dmkj.jpg');
  animation-duration: 12s;
  animation-delay: 0.4s;
}
.movie-waterfall > div:nth-child(17)::before {
  grid-column: 8;
  grid-row: 4 / 7;
  background-image: url('../../assets/img/abhm.jpg');
  animation-duration: 14s;
  animation-delay: 0.9s;
}
.movie-waterfall > div:nth-child(17)::after {
  grid-column: 8;
  grid-row: 6 / 9;
  background-image: url('../../assets/img/bdps.webp');
  animation-duration: 13s;
  animation-delay: 1.3s;
}

/* 第9列 */
.movie-waterfall > div:nth-child(18)::before {
  grid-column: 9;
  grid-row: 1 / 3;
  background-image: url('../../assets/img/yhhwd.webp');
  animation-duration: 15s;
  animation-delay: 0.3s;
}
.movie-waterfall > div:nth-child(18)::after {
  grid-column: 9;
  grid-row: 3 / 6;
  background-image: url('../../assets/img/zhw.png');
  animation-duration: 11s;
  animation-delay: 0.8s;
}
.movie-waterfall > div:nth-child(19)::before {
  grid-column: 9;
  grid-row: 5 / 8;
  background-image: url('../../assets/img/zzx.jpg');
  animation-duration: 16s;
  animation-delay: 1.2s;
}

/* 第10列 */
.movie-waterfall > div:nth-child(19)::after {
  grid-column: 11;
  grid-row: 2 / 5;
  background-image: url('../../assets/img/sq.jpg');
  animation-duration: 13s;
  animation-delay: 0.5s;
}
.movie-waterfall > div:nth-child(1)::before {
  grid-column: 12;
  grid-row: 4 / 7;
  background-image: url('../../assets/img/hb.jpeg');
  animation-duration: 16s;
  animation-delay: 0.9s;
}
.movie-waterfall > div:nth-child(2)::before {
  grid-column: 12;
  grid-row: 6 / 9;
  background-image: url('../../assets/img/jf.jpeg');
  animation-duration: 11s;
  animation-delay: 1.3s;
}

/* 瀑布流滚动动画 */
@keyframes scroll {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

/* 页面容器 */
.welcome-page{
  position: relative;
  height: 100%;
  color: #fff;
  padding: 0 20px;
  display: flex;
  justify-content: center;
}

/* 主内容容器（提亮背景遮罩） */
.welcome-container {
  text-align: center;
  max-width: 700px;
  width: 100%;
  padding: 60px 25px;
  position: relative;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}
.logo {
  position : absolute;
  left: 20px
  top: 20px;
  font-family: 'Inter', 'Microsoft YaHei', 'PingFang SC', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 2rem;
  font-weight: 700;
  color: #f09421;
}

.logo span {
    color: #fff !important;
    font-size: 1.8rem !important;
}
/* 个人标识（电影主题橙色渐变） */
.personal-mark {
  width: 100px;
  height: 100px;
  margin: 0 auto 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f97316, #fb923c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  box-shadow: 0 10px 25px rgba(249, 115, 22, 0.3);
  transition: var(--transition);
  overflow: hidden;
}

.personal-mark:hover {
  transform: scale(1.08) rotate(5deg);
  box-shadow: 0 15px 30px rgba(249, 115, 22, 0.4);
}

.personal-mark>img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 文字样式 */
.greeting {
  font-size: 3.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 15px;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.greeting span {
  background: linear-gradient(90deg, #f97316, #fb923c);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: none;
}

.intro {
  font-size: 1.2rem;
  color: #e2e8f0;
  margin-bottom: 50px;
  line-height: 1.8;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);
}

/* 行动按钮 */
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-bottom: 60px;
}

.btn {
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: var(--transition);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(90deg, #f97316, #fb923c);
  color: white;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4);
  background: linear-gradient(90deg, #ea580c, #f97316);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #f97316;
  transform: translateY(-3px);
}

/* 社交链接 */
.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-links a {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.social-links a:hover {
  color: #f97316;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(249, 115, 22, 0.2);
}

/* 底部版权 */
.copyright {
  display: block;
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  color: #94a3b8;
  font-size: 0.9rem;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

/* 动画效果 */
@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(15px, -15px) rotate(5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.welcome-container > * {
  animation: fadeIn 0.8s ease forwards;
  opacity: 0;
}

.personal-mark { animation-delay: 0.2s; }
.greeting { animation-delay: 0.4s; }
.intro { animation-delay: 0.6s; }
.action-buttons { animation-delay: 0.8s; }
.social-links { animation-delay: 1s; }

/* 响应式设计 - 适配不同屏幕的瀑布流密度 */
@media (max-width: 1440px) {
  .movie-waterfall {
    grid-template-columns: repeat(10, 1fr); /* 中大屏10列 */
  }
}

@media (max-width: 1200px) {
  .greeting {
    font-size: 3rem;
  }
  .movie-waterfall {
    grid-template-columns: repeat(8, 1fr); /* 大屏8列 */
  }
}

@media (max-width: 768px) {
  .welcome-header {
    flex-direction: column;
    gap: 20px;
    padding: 20px 0;
  }

  .greeting {
    font-size: 2.2rem;
  }

  .intro {
    font-size: 1.1rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .welcome-content {
    margin: 40px auto;
  }

  .movie-waterfall {
    grid-template-columns: repeat(6, 1fr); /* 平板6列 */
    gap: 6px;
    padding: 10px;
  }

  /* 小屏幕下保持提亮效果 */
  .movie-waterfall::before,
  .movie-waterfall::after,
  .movie-waterfall > div::before,
  .movie-waterfall > div::after {
    filter: blur(2px) brightness(0.55) contrast(0.95); /* 进一步提亮，提升可见度 */
  }
}

@media (max-width: 480px) {
  .greeting {
    font-size: 1.8rem;
  }

  .logo {
    font-size: 1.5rem;
  }

  .auth-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .tag {
    padding: 6px 14px;
    font-size: 0.85rem;
  }

  .movie-waterfall {
    grid-template-columns: repeat(4, 1fr); /* 手机4列 */
  }
}

/* 登录注册按钮容器 */
.auth-buttons {
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  scale: 0.9;
}

/* 核心按钮样式 */
.auth-btn {
  height: auto;
  padding: 16px 36px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: var(--transition);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

/* 登录按钮 */
.auth-btn-login {
  background: linear-gradient(90deg, #f97316, #fb923c);
  color: white;
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.3);
}

.auth-btn-login:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(249, 115, 22, 0.4);
  background: linear-gradient(90deg, #ea580c, #f97316);
}

/* 登录按钮发光动画 */
.auth-btn-login::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 140%;
  height: 140%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.6s ease;
}

.auth-btn-login:hover::after {
  transform: translate(-50%, -50%) scale(1);
  opacity: 0;
}

/* 注册按钮 */
.auth-btn-register {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.auth-btn-register:hover {
  transform: translateY(-4px);
  border-color: #f97316;
  box-shadow: 0 10px 25px rgba(249, 115, 22, 0.2);
}

/* 注册按钮填充动画 */
.auth-btn-register::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(249, 115, 22, 0.1), rgba(251, 146, 60, 0.1));
  transition: width 0.5s ease;
  z-index: -1;
}

.auth-btn-register:hover::before {
  width: 100%;
}

/* 图标样式 */
.auth-btn i {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.auth-btn:hover i {
  transform: translateX(3px);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .auth-btn {
    padding: 14px 30px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .auth-buttons {
    flex-direction: column;
    gap: 15px;
    width: 100%;
    right: 0;
    top: 20px;
  }

  .auth-btn {
    width: 100%;
    justify-content: center;
    padding: 14px 20px;
  }
}


        .copyright {
      display: block;
      position: absolute;
      margin: 0 auto
      bottom: 25px;
      left: 30%;
      color: #fff;
      font-size: 0.9rem;
      opacity: 0.7;
    }
</style>
