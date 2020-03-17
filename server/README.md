# 博客服务端

采用nestjs + mongo + redis

### 表设计

### 实体

文章（article）
```
id # id
title # 标题
info # 简介
pic # 头图
content # 内容
createAt # 创建时间
updateAt # 更新时间

commentCount # 评论数量
likeCount # 喜欢数量
articleViewCount # 文章查看数量

user # 用户信息
port # 关联类目
tags # 标签

```

类目（port）

```
id
name # 名称
info # 简介
url # 路径
is_new # 是否新窗口打开
is_part # 是否标注类目
createAt # 创建时间
updateAt # 更新时间

# articles # 文章列表
articleCount # 文章数量
```

标签

```
id
name # 名称
createAt # 创建时间
updateAt # 更新时间

followerCount # 关注数量
articleCount # 文章数量
```

用户

```
id
createAt # 创建时间
updateAt # 更新时间

username # 用户名 
email # 邮箱
phone # 手机
pass # 密码
role # 角色
status # 状态
avatar # 头像
sex # 性别
introduce # 介绍
personalHomePage # 个人主页

articleCount # 文章数量
articleViewCount # 文章被查看了
commentCount # 评论数量
wordCount # 字数
likedCount # 被喜欢的数量
uLikeCount # 点过多少喜欢

githubID # github登陆

# followCount # 
# followerCount # 
# followTagCount #
```

评论

```
id
rId # 回复的id
uId # 用户id
content # 评论内容

createAt # 创建时间
updateAt # 更新时间

likedCount # 被喜欢的数量
user # 用户

```