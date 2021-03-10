import { Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import useRequest from '../../plugins/useRequest';
import dayjs from 'dayjs';

function Article () {
  console.log(1)
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(20);
  const [current, setCurrent] = useState(1);
  const [list, setList] = useState([
    { "title": "不才网站的测试标题验证nuxt被浏览器搜索的实例" }, { "title": "2020总结" }, { "title": "由 Vuex 中直接修改State到 “我傻了”" }, { "title": "最近买了..." }, { "title": "大文件分块（切片）断点上传" }, { "title": "小谢同学" }, { "title": "[占山为王]我是如何四步将一个微信小程序请求库改成Taro的" }, { "title": "mysql 基础学习笔记" }, { "title": "Linux下Node.js搭建简述" }, { "title": "憨憨本憨" }, { "title": "我的博客关于第三个版本的介绍" }, { "title": "Hello World!" }, { "title": "每日一题" }, { "title": "JavaScript sourceMap 笔记" }, { "title": "jest 入门笔记" }, { "title": "Vue3 + Vuex4 构建点餐页面" }, { "title": "Linux从安装Nginx到部署前端项目" }, { "title": "由Vant Field组件得到解决IOS输入框 键盘上推问题" }, { "title": "Quill富文本编辑器入坑指北" }, { "title": "本站于2020-02-22转HTTPS" }
  ]);

  // const { data, run, loading } = useRequest(() => {
  //   const size = pageSize;
  //   const index = current;
  //   return {
  //     url: `/article/list?page_size=${size}&page_index=${index}`
  //   }
  // }, {
  //   manual: true
  // });

  // useEffect(() => {
  //   if (data) {
  //     setList(data.list || [])
  //     setTotal(data.total)
  //   }
  //   return () => {

  //   };
  // }, [data]);

  // useEffect(() => {
  //   run();
  //   return () => {

  //   };
  // }, [run]);

  const handleTableChange = (e) => {
    console.log('e', e);
  }

  return (
    <div>
      <Table
        // loading={loading}
        rowKey={row => row.title}
        columns={[{
          title: 'Name',
          dataIndex: 'title',
          // sorter: true,
          // render: name => `${name.first} ${name.last}`,
          width: '20%',
        },]}
        dataSource={list}
        pagination={{
          current: 1,
          pageSize: 2,
          // total: 3000,
        }}
        onChange={handleTableChange}
      ></Table>
    </div>
  );
}

export default Article;
