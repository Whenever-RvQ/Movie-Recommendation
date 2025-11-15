<template>
  <div class="err-container">
    <!-- 胶片背景装饰（呼应电影主题） -->
    <div class="film-bg top-film"></div>
    <div class="film-bg bottom-film"></div>
    
    <!-- 主内容区域 -->
    <div class="container">
      <!-- 电影元素装饰 -->
      <div class="film-icon">
        <i class="fas fa-film"></i>
      </div>
      
      <div class="error-code">404</div>
      <h1 class="error-title">哎呀，页面迷失啦～</h1>
      <p class="error-desc">
        你访问的页面好像不见了，可能是地址错误或页面已迁移。<br>
        不如回到主页，重新开启你的探索之旅吧！
      </p>
      <router-link to="/index" class="btn-back">
        <i class="fas fa-arrow-left"></i> 返回主页
      </router-link>
    </div>

    <!-- 底部小提示 -->
    <div class="footer-note">
      请检查URL是否正确，或联系管理员获取帮助
    </div>
  </div>
</template>

<script>
export default {
  name: 'Base404',
}
</script>

<style>
/* 主题变量（与网站统一） */
:root {
  --primary: #E50914;
  --light-black: #252525;
  --lighter-black: #333333;
  --light: #F8F8F8;
  --gray: #AAAAAA;
  --border-color: #444444;
  --transition: all 0.3s ease;
}

.err-container {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  background-color: var(--light-black); /* 浅黑背景，与网站统一 */
  min-height: 100vh;
  position: relative;
  color: var(--light);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* 胶片背景装饰（顶部/底部） */
.film-bg {
  position: absolute;
  left: 0;
  right: 0;
  height: 30px;
  background-image: radial-gradient(circle, transparent 6px, var(--lighter-black) 7px);
  background-size: 28px 30px;
  background-position: 0 0;
  z-index: 1;
}

.top-film {
  top: 0;
  border-bottom: 1px solid var(--border-color);
}

.bottom-film {
  bottom: 0;
  border-top: 1px solid var(--border-color);
}

/* 电影图标装饰 */
.film-icon {
  font-size: 48px;
  color: var(--primary);
  margin-bottom: 20px;
  opacity: 0.8;
  animation: fadeIn 1s ease-in-out;
}

/* 主内容容器 */
.container {
  width: 100%;
  max-width: 600px;
  text-align: center;
  position: relative;
  z-index: 2;
  animation: slideUp 0.8s ease-out;
}

/* 404数字样式（红色渐变，适配主题） */
.error-code {
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(90deg, var(--primary), #FF4444, #FF6666);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1.2;
  position: relative;
  margin-bottom: 15px;
}

.error-code::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 4px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  border-radius: 2px;
}

/* 文字内容样式 */
.error-title {
  font-size: 2rem;
  margin-bottom: 15px;
  color: var(--light);
  font-weight: 600;
}

.error-desc {
  font-size: 1.1rem;
  color: var(--gray);
  margin-bottom: 40px;
  line-height: 1.8;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* 按钮样式（红色主题，与网站按钮统一） */
.btn-back {
  padding: 14px 36px;
  background: linear-gradient(135deg, var(--primary), #C00812);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 6px 20px rgba(229,9,20,0.3);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.btn-back:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 10px 25px rgba(229,9,20,0.4);
  background: linear-gradient(135deg, #C00812, #A00710);
}

.btn-back i {
  transition: var(--transition);
}

.btn-back:hover i {
  transform: translateX(-3px);
}

/* 底部小提示 */
.footer-note {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--gray);
  font-size: 0.9rem;
  opacity: 0.7;
  z-index: 2;
  text-align: center;
  width: 90%;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 0.8; transform: scale(1); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .error-title {
    font-size: 1.7rem;
  }

  .error-desc {
    font-size: 1rem;
  }

  .btn-back {
    padding: 12px 30px;
    font-size: 1rem;
  }

  .film-icon {
    font-size: 40px;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 4.5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-desc {
    font-size: 0.95rem;
  }

  .btn-back {
    width: 100%;
    justify-content: center;
    padding: 12px 0;
  }

  .footer-note {
    font-size: 0.8rem;
    bottom: 30px;
  }

  .film-bg {
    height: 20px;
    background-size: 20px 20px;
  }
}
</style>