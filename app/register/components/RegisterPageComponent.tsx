'use client'

import './RegisterPageComponent.css'
import { Button, Divider, Form, FormProps, Input } from 'antd'
import GoogleLogo from '../../../public/Google.svg'
import LoginBackgorund from '../../../public/login-backgorund.png'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const RegisterPageComponent = () => {
  const router = useRouter()

  type FieldType = {
    name?: string
    surname: string
    email?: string
    password?: string
    repeatPassword?: string
  }

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values)
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className="register-page-container">
      <Image className="background" src={LoginBackgorund} alt={'backgorund'} />
      <h1 onClick={() => router.push('/')}>EVENTIO</h1>
      {/* {error && <p>{error}</p>} */}
      <div className="register-wrapper">
        <span className="primary-title">Creează cont nou</span>
        <span className="secondary-title">
          Ai deja cont?
          <span
            className="primary-color-text"
            onClick={() => router.push('/login')}
          >
            Intră în cont.
          </span>
        </span>
        <Form
          name="register-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <div className="name-group">
            <Form.Item<FieldType>
              label="Nume"
              name="name"
              rules={[{ required: true, message: 'Numele este obligatoriu.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Prenume"
              name="surname"
              rules={[
                { required: true, message: 'Prenumele este obligatoriu.' },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

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

          <Form.Item<FieldType>
            label="Verificare parola"
            name="repeatPassword"
            rules={[
              {
                required: true,
                message: 'Verificarea parolei este obligatorie.',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" size="large">
              Înregistrează-te
            </Button>
          </Form.Item>
        </Form>
        <Divider plain>Or</Divider>
        <div className="google-login">
          <Image className="google" src={GoogleLogo} alt={'google'} />
          Autentificare cu Google
        </div>
      </div>
      <div className="register-footer">FOOTER</div>
    </div>
  )
}

export default RegisterPageComponent
