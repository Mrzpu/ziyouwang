# 自由网精选酒店平台

## 项目结构

```
ziyouwang/
├── frontend/               前端代码
│   ├── pages/
│   │   ├── index.html      主页
│   │   ├── search.html     搜索结果页
│   │   └── hotels/         酒店详情页
│   │       ├── junji.html          君季L·DESIGN酒店
│   │       ├── bainnasit.html      威海百纳瑞汀酒店
│   │       ├── dongshan.html       威海东山宾馆
│   │       └── [未来酒店].html
│   └── assets/
│       └── images/
│           ├── hotels/     各酒店图片（每家一个子文件夹）
│           │   ├── junji/
│           │   ├── bainnasit/
│           │   └── dongshan/
│           └── ui/         界面图片
├── backend/                后端（待开发）
│   ├── api/                REST API 接口
│   ├── database/           数据库脚本
│   └── admin/              后台管理系统
├── mobile/                 App（待开发）
│   ├── ios/
│   └── android/
├── docs/
│   └── CLAUDE.md           详细开发文档
└── README.md               本文件
```

## 快速开始

用浏览器直接打开 `frontend/pages/index.html`

## 新增一家酒店

1. 复制 `frontend/pages/hotels/junji.html` 为新文件
2. 在 `frontend/assets/images/hotels/` 新建同名文件夹存放图片
3. 替换所有文字内容和图片路径
4. 在 `search.html` 的 HOTELS 数组里添加数据
5. 在 `index.html` 的 HOTELS 数组里添加数据

## 技术栈

- 前端：纯 HTML + CSS + JavaScript（无框架依赖）
- 图片轮播：Swiper.js 11（CDN）
- 地图：高德地图 JS API（待接入，Key 填入 search.html 第一行）
- 字体：Noto Sans SC / Noto Serif SC（Google Fonts CDN）

## 待开发

详见 `docs/CLAUDE.md`
