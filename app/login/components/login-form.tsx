'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormProps, Input } from 'antd';
import LoginImage from '../../../public/LoginImage.svg';
import Image from 'next/image';
import Link from 'next/link';
import PlanyviteLogo from '@/public/planyvite_logo.svg';
import { useRouter } from 'next/navigation';
import { GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '@/core/context/authContext';
import { trackTikTokEvent } from '@/lib/tik-tok/tiktok-events';

type FieldType = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const { login, loginWithGoogle, isProcessingLogin, isAuthReady } = useAuth();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    login(values.email, values.password);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={cn('flex flex-col gap-4 md:gap-6')}>
      <div className="flex justify-center mb-4">
        <Image
          className="cursor-pointer"
          onClick={() => router.push('/')}
          src={PlanyviteLogo}
          alt="planyvite-logo"
          width={200}
          height={50}
        />
      </div>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bine ai venit</h1>
                <p className="text-slate-500 text-balance dark:text-slate-400">
                  Conectează-te pentru a continua
                </p>
              </div>
              <div className="grid gap-3">
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
                      {
                        required: true,
                        message: 'Adresa de email este obligatorie.',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item<FieldType>
                    label="Parolă"
                    name="password"
                    rules={[
                      { required: true, message: 'Parola este obligatorie.' },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item label={null}>
                    <Button
                      type="submit"
                      className="w-full bg-[var(--primary-color)] hover:bg-[#a235c6] text-white"
                      disabled={!isAuthReady || isProcessingLogin}
                    >
                      Autentificare
                    </Button>
                  </Form.Item>
                </Form>
                <div className="after:border-slate-200 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t dark:after:border-slate-800">
                  <span className="bg-white text-slate-500 relative z-10 px-2 dark:bg-slate-950 dark:text-slate-400">
                    Sau conectează-te cu
                  </span>
                </div>
                <div className="w-full">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={!isAuthReady || isProcessingLogin}
                    onClick={() => {
                      loginWithGoogle().then(() => {
                        trackTikTokEvent('CompleteRegistration', {
                          content_type: 'user',
                        });
                      });
                    }}
                  >
                    <GoogleOutlined />
                    <span>Conectează-te cu Google</span>
                  </Button>
                </div>
              </div>
              <div className="text-center text-sm">
                Nu ai cont?{' '}
                <a href="/register" className="underline underline-offset-4">
                  Înregistrează-te
                </a>
              </div>
            </div>
          </div>
          <div className="bg-[#f8e0ff] relative hidden md:block dark:bg-slate-800 p-5">
            <Image
              src={LoginImage}
              alt="login-image"
              className="align-center h-full w-full"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-slate-500 *:[a]:hover:text-slate-900 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 dark:text-slate-400 dark:*:[a]:hover:text-slate-50">
        Continuând, ești de acord cu{' '}
        <a className="font-semibold" href="#">
          Termenii și condițiile
        </a>{' '}
        și{' '}
        <a className="font-semibold" href="#">
          Politica de confidențialitate
        </a>
        .
      </div>
      <div className="text-slate-500 *:[a]:hover:text-slate-900 text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 dark:text-slate-400 dark:*:[a]:hover:text-slate-50">
        <ul className="flex flex-row items-center justify-center gap-2">
          <li className="font-semibold">
            <Link href={'/'}>Acasă</Link>
          </li>
          <li>contact@planyvite.ro</li>
          <li>+40741448739</li>
        </ul>
      </div>
    </div>
  );
}
