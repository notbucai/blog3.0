import { Button, Space, Table, Tag, Form, Input, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons'
import useRequest from '../../plugins/useRequest';
import { date } from '../../utils';
import ChangeStatusModal from './components/ChangeStatusModal';

function Comment () {
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(10);
  const [current, setCurrent] = useState(1);
  const [list, setList] = useState([]);
  const [showChangeStatusModel, setShowChangeStatusModel] = useState(false);
  const [currentData, setCurrentData] = useState();

  const [form] = Form.useForm();

  const columns = [
    {
      title: '编号',
      dataIndex: '_id',
      width: 180,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '源ID',
      dataIndex: 'sourceID',
      width: 180,
      ellipsis: true,
    },
    {
      title: '父级',
      dataIndex: 'parent',
      width: 180,
      ellipsis: true,
      render (value) {
        return value ? value._id : ''
      }
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
      title: '内容',
      dataIndex: 'content',
      width: 200,
      align: 'center',
      ellipsis: true,
      render (value, index) {
        return value
      }
    },
    {
      title: '喜欢数量',
      dataIndex: 'likes',
      width: 88,
      align: 'center',
      render (value, index) {
        return Array.isArray(value) ? value.length : 0
      }
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
            setCurrentData(row);
          }}>改变状态</Button>
        </Space>
      }
    }
  ];

  const { data, run, loading } = useRequest(({ size = 20, index = 1, keyword = '', type = 'message' }) => {
    return {
      url: `/comment/alllist/${type}`,
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
    return run({
      size: pageSize,
      index: current,
      type: form.getFieldValue('type') || 'message',
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
        layout={'inline'}
        form={form}
        onFinish={onFinish}
        initialValues={{ type: 'message' }}
      >
        <Form.Item label="类型" name="type">
          <Select>
            <Select.Option value="message">留言</Select.Option>
            <Select.Option value="article">文章</Select.Option>
          </Select>
        </Form.Item>
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
      <ChangeStatusModal
        onCancel={() => {
          setShowChangeStatusModel(false);
        }}
        onConfirm={() => {
          setShowChangeStatusModel(false);
          reloadData();
        }}
        type={form.getFieldValue('type') || 'message'}
        data={currentData}
        visible={showChangeStatusModel}
      />
    </Space>
  );
}

export default Comment;
