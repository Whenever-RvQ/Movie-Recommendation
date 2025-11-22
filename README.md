# Movie-Recommendation
## 项目简介

Movie-Recommendation是一个集**前端展示平台、后端数据服务、后台管理系统**于一体的全栈项目，旨在为用户提供个性化电影推荐、电影数据浏览、电影信息上传审核等核心功能。系统采用现代化技术栈开发，支持多端适配，具备良好的可扩展性和维护性，适用于电影爱好者、影视平台运营者等用户群体。

## 核心功能

### 1. 前端展示平台

- **电影推荐**：基于用户偏好、热门榜单、类型标签等多维度推荐电影
- **电影榜单**：展示全球热门、影史经典、分类排行等电影榜单（支持热度、票房、评分排序）
- **电影详情**：展示电影基本信息（名称、导演、年份、类型、简介）、海报、评分、评论等
- **数据可视化**：通过图表展示电影类型分布、票房趋势、用户偏好等数据
- **用户交互**：支持电影收藏、点赞、评论、浏览历史记录
- **数据上传**：支持用户 / 运营者上传电影数据（需后台审核）

### 2. 后台管理平台

- **数据审核**：审核用户上传的电影数据（支持通过 / 驳回操作，附带审核记录）
- **电影管理**：增删改查电影基础信息、海报、分类标签等
- **用户管理**：管理平台注册用户信息，支持权限分配（普通用户 / 管理员）
- **数据统计**：统计平台访问量、电影上传量、审核通过率、用户活跃度等数据
- **系统配置**：配置推荐算法参数、页面展示规则、权限管理规则等

### 3. 后端服务

- **接口服务**：提供前端与后台管理系统的所有数据接口（RESTful 风格）
- **数据存储**：管理电影数据、用户数据、交互数据、审核记录等
- **推荐算法**：实现基于协同过滤、内容匹配、热门推荐的混合推荐策略
- **数据校验**：对上传数据进行格式校验、合法性验证，确保数据质量
- **权限控制**：基于 JWT 的接口权限认证，区分普通用户、管理员操作权限

## 技术栈

### 前端技术栈

- **核心框架**：Vue 2 + JavaScript
- **UI 组件库**：Element Plus（适配深色主题）,tailwindcss,vant
- **数据可视化**：ECharts（电影榜单、数据统计图表）
- **路由管理**：Vue Router
- **状态管理**：Pinia（可选）
- **网络请求**：Axios
- **样式预处理**：SCSS,Stylus
- **构建工具**：Vue-Cli

### 后端技术栈

- **开发语言**：Node.js（Express/NestJS）
- **数据库**：MongoDB（关系型数据存储）
- **认证授权**：JWT（JSON Web Token）
- **推荐算法**：协同过滤算法 + 内容基于推荐算法+ALS矩阵算法
- **API 文档**：Swagger / Knife4j /Eco-Link（自动生成接口文档）

### 开发 / 部署工具

- **版本控制**：Git + GitHub/GitLab
- **代码规范**：ESLint + Prettier + Husky（提交校验）
- **部署方式**：Docker 容器化部署 / 云服务器部署（Nginx + 后端服务 + 数据库）

## 项目结构

plaintext

```plaintext
movie-recommendation-system/
├── frontend/                # 前端展示平台
│   ├── public/              # 静态资源（图标、全局样式）
│   ├── src/
│   │   ├── api/             # 接口请求封装
│   │   ├── assets/          # 图片、图标、样式文件
│   │   ├── components/      # 公共组件（电影卡片、榜单组件、图表组件）
│   │   ├── views/           # 页面组件（首页、榜单页、详情页、上传页）
│   │   ├── router/          # 路由配置
│   │   ├── store/           # 状态管理（Pinia）
│   │   ├── types/           # TypeScript类型定义
│   │   ├── utils/           # 工具函数（格式化、校验、权限）
│   │   ├── App.vue          # 根组件
│   │   └── main.ts          # 入口文件
│   ├── .eslintrc.js         # ESLint配置
│   ├── package.json         # 依赖配置
│   └── vite.config.ts       # Vite配置
│
├── admin/                   # 后台管理平台（复用前端技术栈）
│   ├── src/
│   │   ├── views/           # 管理页面（数据审核、电影管理、用户管理等）
│   │   ├── components/      # 管理端专用组件（审核组件、数据表格等）
│   │   └── ...              # 其余结构与前端平台一致
│
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── controller/      # 接口控制器
│   │   ├── service/         # 业务逻辑层
│   │   ├── model/           # 数据模型（数据库实体）
│   │   ├── router/          # 接口路由配置
│   │   ├── middleware/      # 中间件（权限校验、数据校验、异常处理）
│   │   ├── utils/           # 工具函数（加密、算法、格式化）
│   │   ├── config/          # 配置文件（数据库、JWT、端口）
│   │   └── main.js          # 入口文件
│   ├── package.json         # 依赖配置
│   └── .env                 # 环境变量配置
│
├── docs/                    # 项目文档（接口文档、部署文档、开发指南）
└── README.md                # 项目说明文档（本文档）
```

## 快速开始

### 前提条件

- 安装 Node.js（v16+）、npm/yarn（包管理工具）
- 安装 MongoDB（v4.2+）、Redis（可选，用于缓存）
- 安装 Git（版本控制工具）
- 安装 Docker（可选，用于容器化部署）

### 1. 项目克隆

```bash
git clone https://github.com/Whenever-RvQ/Movie-Recommendation.git
cd movie-recommendation
```

### 2. 后端服务启动

```bash
# 进入后端目录
cd blog-server

# 安装依赖
npm install

# 配置环境变量（复制.env.example为.env，修改数据库连接信息）
cp .env.example .env
# 编辑.env文件：配置MySQL主机、端口、用户名、密码、数据库名；JWT密钥等

# 数据库初始化（创建数据库表结构，导入初始数据）
npm run init-db

# 启动后端服务（开发环境）
npm run start
# 服务启动后，默认端口：3000（可在.env中修改）
```

### 3. 前端展示平台启动

```bash
# 进入前端目录
cd ../frontend

# 安装依赖
npm install

# 配置环境变量（修改接口请求基础地址）
# 编辑src/api/request.ts，修改baseURL为后端服务地址（如：http://localhost:3000/api）

# 启动前端服务
npm run serve
# 服务启动后，访问：http://localhost:8080
```

### 4. 后台管理平台启动

```bash
详见https://github.com/Whenever-RvQ/Geeker-Admin
```

## 核心页面展示

### 1. 前端展示平台

- **首页**：推荐电影轮播、热门榜单、分类导航、数据可视化看板
- **电影榜单**：渐变风格排行榜（支持热度、票房、评分排序）
- **电影详情页**：电影海报、基本信息、简介、评分、评论区
- **数据上传页**：电影信息表单（名称、导演、年份、类型、简介、海报 URL）

### 2. 后台管理平台

- **数据审核页**：待审核电影列表（电影卡片式展示，包含通过 / 驳回按钮）
- **电影管理页**：电影数据表格（支持搜索、筛选、批量操作）
- **数据统计页**：电影类型分布饼图、票房趋势折线图、用户活跃度柱状图

## 接口文档

- 接口分类：电影接口、用户接口、审核接口、统计接口、系统配置接口

核心接口示例：

- 电影列表：`GET /api/movie/list`（支持分页、筛选、排序）
- 电影详情：`GET /api/movie/:id`
- 电影上传：`POST /api/movie/upload`（需登录，管理员 / 授权用户）
- 审核电影：`PUT /api/movie/audit/:id`（需管理员权限）

## 部署说明

### 1. 开发环境部署

- 按照「快速开始」步骤启动各服务即可，适用于开发调试
- 数据库默认使用本地 MySQL，可通过`npm run init-db`初始化测试数据

### 2. 生产环境部署（Docker 容器化）

```bash
# 1. 构建后端Docker镜像
cd backend
docker build -t movie-backend:latest .

# 2. 构建前端Docker镜像
cd ../frontend
docker build -t movie-frontend:latest .

# 3. 构建管理端Docker镜像
cd ../admin
docker build -t movie-admin:latest .

# 4. 使用Docker Compose启动所有服务
cd ..
docker-compose up -d
```

- 部署完成后，访问：
  - 前端平台：http:// 服务器 IP:80
  - 后台管理：http:// 服务器 IP:81
  - 后端服务：http:// 服务器 IP:3000

### 3. 注意事项

- 生产环境需修改`.env`文件中的 JWT 密钥、数据库密码等敏感信息
- 建议配置 Nginx 反向代理，优化静态资源访问速度，配置 HTTPS
- 定期备份数据库数据，避免数据丢失

## 开发规范

### 1. 代码规范

- 前端：遵循 ESLint + Prettier 规则，组件化开发，TypeScript 类型定义完整
- 后端：RESTful 接口设计规范，分层架构（控制器 - 服务 - 模型），异常统一处理
- 数据库：表结构设计合理（主键、索引、外键约束），字段命名规范

### 2. 提交规范

- 代码提交前需通过 ESLint 校验：`npm run lint`

- Git 提交信息格式：

  ```
  type(scope): description
  ```

  - type：feat（新功能）、fix（修复 bug）、docs（文档）、style（样式）、refactor（重构）、test（测试）、chore（构建 / 依赖）
  - 示例：`feat(movie): 新增电影推荐算法`、`fix(admin): 修复审核按钮点击无响应问题`

## 项目扩展

- **推荐算法优化**：集成机器学习模型（如协同过滤、深度学习推荐），提升推荐精准度
- **多端适配**：开发移动端 H5、小程序版本，实现跨端访问
- **视频播放功能**：集成视频播放组件，支持电影预告片、片段播放
- **社交功能**：新增用户关注、私信、电影分享等社交互动功能
- **付费会员体系**：新增会员权限（无广告、高清资源、专属推荐）

## 问题反馈

- 若遇到功能 bug、部署问题或需求建议，可通过以下方式反馈：
  - GitHub Issues：https://github.com/你的用户名 / 电影推荐系统仓库地址 /issues
  - 联系邮箱：你的邮箱地址
  - 项目交流群：你的交流群号（可选）

## 贡献指南

1. Fork 本仓库到个人账号
2. 创建 feature 分支：`git checkout -b feat/xxx`
3. 提交代码：`git commit -m "feat(xxx): 新增xxx功能"`
4. 推送分支：`git push origin feat/xxx`
5. 提交 Pull Request，描述功能实现细节与测试情况



**最后更新时间**：2025 年 XX 月 XX 日

**版本**：v1.0.0
