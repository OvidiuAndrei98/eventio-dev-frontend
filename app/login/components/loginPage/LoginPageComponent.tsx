'use client';

import './LoginPageComponent.css';
import { Button, Divider, Form, FormProps, Input } from 'antd';
import LoginBackgorund from '../../../../public/login-backgorund.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GoogleOutlined } from '@ant-design/icons';

const LoginPageComponent = () => {
  const router = useRouter();

  type FieldType = {
    email?: string;
    password?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = () => {
    router.push('/dashboard');
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-page-container">
      <Image className="background" src={LoginBackgorund} alt={'backgorund'} />
      <h1 onClick={() => router.push('/')}>EVENTIO</h1>
      {/* {error && <p>{error}</p>} */}
      <div className="login-wrapper">
        <span className="primary-title">Intră în contul tău</span>
        <span className="secondary-title">
          Nu ai cont?
          <span
            className="primary-color-text register"
            onClick={() => router.push('/register')}
          >
            Creează acum.
          </span>
        </span>
        <Form
          name="login-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Adresa de email este obligatorie.' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Parola"
            name="password"
            rules={[{ required: true, message: 'Parola este obligatorie.' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" size="large">
              Autentificare
            </Button>
          </Form.Item>
        </Form>
        <Divider plain>Or</Divider>
        <Button type="default" icon={<GoogleOutlined />}>
          Autentifica-te cu google
        </Button>
      </div>
      <div className="login-footer">
        <div className="secondary-text-color-light">Copyright © Eventio.ro</div>
        <div>
          <span>acasa</span>
          <span>0741444444</span>
          <span>contact@eventio.ro</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPageComponent;
