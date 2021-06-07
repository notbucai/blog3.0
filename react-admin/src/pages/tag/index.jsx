import { Button, message, Space, Table, Tag, Form, Input, Popconfirm, Row, Col } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { EditOutlined } from '@ant-design/icons'
import useRequest from '../../plugins/useRequest';
import { date } from '../../utils';
import Modal from 'antd/lib/modal/Modal';

function TagPage () {
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(1000);
  const [current, setCurrent] = useState(1);
  const [list, setList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentData, setCurrentData] = useState();

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
      title: '图标',
      dataIndex: 'iconURL',
      width: 80,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
      render (value) {
        return date.format(value);
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      width: 120,
      render (value) {
        return date.format(value);
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 160,
      fixed: 'right',
      render (_, row) {
        return <Space>
          <Button size="small"
            type="primary"
            onClick={() => {
              setIsModalVisible(true);
              setCurrentData(row);
            }}>修改</Button>
          <Popconfirm
            title="删除后无法修复                                                                                                                                                                                                                                                "
            onConfirm={async () => {
              await delRun({
                id: row._id
              });
              reloadData();
              message.success("成功");
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button
              danger
              loading={delLoading}
              type="primary"
              size="small">删除</Button>
          </Popconfirm>
        </Space>
      }
    }
  ];

  const { loading: delLoading, run: delRun } = useRequest(({ id }) => {
    return {
      url: `/tag/${id}`,
      method: "DELETE",
      data: {}
    }
  }, {
    manual: true
  })

  const { data, run, loading } = useRequest(({ size = 20, index = 1 }) => {
    return {
      url: `/tag/list`,
      params: {
        page_size: size,
        page_index: index
      }
    }
  }, {
    manual: true
  });

  const { dataDate, run, loading } = useRequest(({ size = 20, index = 1 }) => {
    return {
      url: `/tag/list`,
      params: {
        page_size: size,
        page_index: index
      }
    }
  }, {
    manual: true
  });

  useEffect(() => {
    if (data) {
      setList(data || [])
      // setTotal(data.total)
    }
    return () => {

    };
  }, [data]);

  const reloadData = useCallback(() => {
    run({
      size: pageSize,
      index: current,
    });
  }, [run, current, pageSize])

  useEffect(() => {
    reloadData();
    return () => { };
  }, [reloadData]);

  const handleTableChange = ({ current = 0, pageSize = 0, total = 0 } = {}) => {
    setCurrent(current);
    setPageSize(pageSize);
  }

  const handleAddOrEdit = () => {
    setIsModalVisible(true);
  }

  const handleEditOrAddConfirm = async () => {
    await form.validateFields();



  }

  const handleEditOrAddCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button type="primary" icon={<EditOutlined />} onClick={() => handleAddOrEdit()}>添加</Button>

      <Table
        loading={loading}
        size="middle"
        rowKey={row => row._id}
        columns={columns}
        dataSource={list}
        pagination={{
          // current: current,
          // pageSize: pageSize,
          // total: total,
        }}
        scroll={{ x: 800 }}
        onChange={handleTableChange}
      ></Table>

      <Modal title="编辑/添加 标签"
        visible={isModalVisible}
        onOk={handleEditOrAddConfirm}
        onCancel={handleEditOrAddCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEditOrAddConfirm}
        >
          <Form.Item name="name" label="名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称"></Input>
          </Form.Item>
          <Form.Item name="iconURL" label="图标"
            rules={[{ required: true, message: '请输入图标名' }]}
          >
            <Input placeholder="请输入图标名"></Input>
          </Form.Item>
          <Row justify="center" align="middle">
            <Col >
              <Space>
                <Button type="primary" htmlType="submit">提交</Button>
                <Button type="default" onClick={handleEditOrAddCancel}>取消</Button>
              </Space>
            </Col>
          </Row>
        </Form>

      </Modal>

    </Space>
  );
}

export default TagPage;
