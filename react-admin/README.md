# bucai - admin


## 路由配置
后期考虑进行一个抽离
```javascript
{
  path: '/login', // 路径 需要绝对路径 且 与父级存在关联
  component: import('../pages/auth/login'), // 路由
  title: "页面标题", // 页面标题
  noCache: true, // 是否不缓存  默认 false
  // -- 布局 不存在就是普通页面  默认不配置
  layout: {
    affix: true, // 是否固定在tabView ( 不可关闭/默认显示 )
    hiddenTab: true, // 不在tabView中展示
    full: true, // 全屏 开启将忽略其他配置
    noAside: true, // 布局是否不显示侧边
    noHeader: true,// 布局是否不显示头部
  },
  // -- 菜单 配置存在将显示菜单 否则当作普通页面处理
  // 如果上一级没有 menu 将会忽略 children -> menu 配置
  menu: {
    title: '',  // 标题 默认为 页面标题
    icon: '', // 图标 允许是组件 可能是 iconfont 字符串
  },
  // -- 权限 不存在将不鉴权
  // 如果 rule 和 permissions 都不存在且auth不为undefined 则表示只对是否登录进行鉴权
  auth: {
    rule: ['admin'], // 匹配角色 权限点 和 角色只能存在一个 需要在配置项中进行配置
    permissions: ['xxx', 'aaa'], // 同时包含权限，必须包含aaa权限和xxx权限才匹配  默认 all 模式
    permissions: {// 复杂配置
      type: 'all', // all 表示必须比配全部的, include 表示匹配一个即有权限
      value: ['xxx', 'aaa'],
    },
  },
  // 子
  children: []
}
```


## 数据结构
```javascript
// 菜单
{
  title: "", // 标题
  path: "", // key or 基础路径
  query: null, // query 参数
  params: null, // params 参数
  fullPath: "", // 路径
  icon: "", // 图标 字符串 or 组件
  affix: false, // 是否固定 固定将不允许关闭
  activeTime: 222222, // 激活时间
}

// breadcrumb
{
  title: "", // 标题
  path: "", // key or 基础路径
  fullPath: "", // 路径
  icon: "", // 图标 字符串 or 组件
}
```