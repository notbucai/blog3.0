import React from 'react';
import { Form, Input, Button } from 'antd';

import store from "store2";

import './styles.scss';

import logo from '@/assets/image/logo.png'
import { withRouter } from 'react-router';
import useRequest from '../../../plugins/useRequest';

const tailLayout = {
};

const Login = ({ history, location }) => {
  const { loading, run } = useRequest(({ login, pass } = {}) => {
    return {
      method: 'POST',
      url: '/users/signin',
      data: {
        login, pass
      }
    }
  }, {
    manual: true
  });

  const handleLogin = async (login, pass) => {
    const data = await run({ login, pass });
    store.set('token', data);
    // TODO: 这里简单匹配
    const search = location.search || '';
    const url = new URLSearchParams(search.replace(/^\?/, ''));
    // 这里直接刷新页面跳转到指定页面 间接完成路由更新问题
    window.location.replace(url.get('redirect') || '/');
  }
  const onFinish = async ({ username, password }) => {
    // TODO: 验证 调用接口
    await handleLogin(username, password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-wrap">
      <div className="login-form-wrap">
        <div className="login-logo">
          <img src={logo} alt="" />
        </div>
        <Form
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >

          <div className="pb1">
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </div>

          <div className="pb1">
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </div>

          {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>记住密码</Checkbox>
          </Form.Item> */}

          <Form.Item {...tailLayout}>
            <Button type="primary" block htmlType="submit" loading={loading}>
              登录
        </Button>
          </Form.Item>
        </Form>

      </div>
      <div className="login-footer">
        <p>&copy; 2021 不才 </p>
        <p>完整体验 用户名： admin 密码：admin</p>
        <p>体验部分 用户名： test 密码：test</p>
      </div>
    </div>);
};

export default withRouter(Login);
