import { Button, message, Space, Table, Tag, Form, Input } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons'
import useRequest from '../../plugins/useRequest';
import { date } from '../../utils';
import ChangeStatusModal from './components/ChangeStatusModal';

function Article () {
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(10);
  const [current, setCurrent] = useState(1);
  const [list, setList] = useState([]);
  const [showChangeStatusModel, setShowChangeStatusModel] = useState(false);
  const [currentArticle, setCurrentArticle] = useState();

  const [form] = Form.useForm();

  const columns = [
    {
      title: '编号',
      dataIndex: '_id',
      width: 100,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 200,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '简介/摘要',
      dataIndex: 'summary',
      width: 220,
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'user',
      width: 68,
      ellipsis: true,
      render (value, index) {
        return value.username || '匿名';
      }
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 160,
      // ellipsis: true,
      render (tags, index) {
        return tags.map(tag => <Tag color="blue" key={tag._id}>{tag.name}</Tag>);
      }
    },
    {
      title: '文章字数',
      dataIndex: 'wordCount',
      width: 88,
      align: 'center',
    },
    {
      title: '评论数量',
      dataIndex: 'commentCount',
      width: 88,
      align: 'center',
    },
    {
      title: '浏览数量',
      dataIndex: 'browseCount',
      width: 88,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      render (value) {
        return date.format(value);
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 180,
      render (value) {
        return date.format(value);
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      fixed: 'right',
      align: 'center',
      render (value = 1) {
        return <Tag color={['#108ee9', '#87d068', '#f50'][value - 1]}>{['审核中', '审核通过', '审核拒绝'][value - 1]}</Tag>
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 160,
      fixed: 'right',
      render (_, row) {
        return <Space>
          <Button size="small" onClick={() => {
            setShowChangeStatusModel(true);
            setCurrentArticle(row);
          }}>改变状态</Button>
          {
            row.status === 2 ?
              <Button
                loading={upLoading}
                onClick={async () => {
                  await runUp({
                    id: row._id,
                    status: row.up ? 0 : 1,
                  });
                  reloadData();
                  message.success("成功");
                }}
                size="small" type={row.up ? 'default' : 'primary'}>{row.up ? '取消置顶' : '设为置顶'}</Button>
              : null
          }
        </Space>
      }
    }
  ];

  const { loading: upLoading, run: runUp } = useRequest(({ id, status }) => {
    return {
      url: `/article/${id}/upstatus`,
      method: "PUT",
      data: {
        status
      }
    }
  }, {
    manual: true
  })

  const { data, run, loading } = useRequest(({ size = 20, index = 1, keyword = '' }) => {
    return {
      url: `/article/list`,
      params: {
        keyword,
        page_size: size,
        page_index: index
      }
    }
  }, {
    manual: true
  });

  useEffect(() => {
    if (data) {
      setList(data.list || [])
      setTotal(data.total)
    }
    return () => {

    };
  }, [data]);

  const reloadData = useCallback(() => {
    run({
      size: pageSize,
      index: current,
      keyword: form.getFieldValue('keyword')
    });
  }, [run, current, pageSize, form])

  useEffect(() => {
    reloadData();
    return () => { };
  }, [reloadData]);

  const handleTableChange = ({ current = 0, pageSize = 0, total = 0 } = {}) => {
    setCurrent(current);
    setPageSize(pageSize);
  }

  const onFinish = (e) => {
    console.log('e', e,);
    reloadData()
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Form
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 14 }}
        layout={'inline'}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="关键词" name="keyword"
          // rules={[{ required: true, message: '请输入关键词' }]}
        >
          <Input placeholder="请输入关键词" />
        </Form.Item>
        <Form.Item label="" name="keyword">
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>搜索</Button>
        </Form.Item>
      </Form>
      <Table
        loading={loading}
        size="middle"
        rowKey={row => row._id}
        columns={columns}
        dataSource={list}
        pagination={{
          current: current,
          pageSize: pageSize,
          total: total,
        }}
        scroll={{ x: 1900 }}
        onChange={handleTableChange}
      ></Table>
      {/* changeStatusModal */}
      <ChangeStatusModal
        onCancel={() => {
          setShowChangeStatusModel(false);
        }}
        onConfirm={() => {
          setShowChangeStatusModel(false);
          reloadData();
        }}
        data={currentArticle} visible={showChangeStatusModel} />
    </Space>
  );
}

export default Article;
