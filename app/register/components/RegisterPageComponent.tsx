'use client';

import { Form, FormProps, Input } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { firebaseAuth } from '@/lib/firebase/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { User } from '@/core/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LoginImage from '../../../public/LoginImage.svg';
import { toast } from 'sonner';
import { addUser } from '@/service/user/addUser';
import Link from 'next/link';
import PlanyviteLogo from '@/public/planyvite_logo.svg';

type FieldType = {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
};

const RegisterPageComponent = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  const router = useRouter();
  const auth = firebaseAuth;

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        const userDoc: User = {
          userId: user.uid,
          email: user.email as string,
          name: values.name,
          surname: values.surname,
          displayName: values.surname + ' ' + values.name,
          photoURL: userCredential.user.photoURL,
        };
        await addUser(userDoc);
        localStorage.setItem(
          'auth_token',
          JSON.stringify(await user.getIdToken())
        );
        if (firebaseAuth.currentUser) {
          await updateProfile(firebaseAuth.currentUser, {
            displayName: values.name + ' ' + values.surname,
          });
        }

        router.push('/dashboard');
      })
      .catch((error) => {
        const errorMessage = error.message;
        if (error.code === 'auth/email-already-in-use') {
          toast.error('Email-ul este deja folosit');
        }
        console.log(errorMessage);
      });
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
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
                <h1 className="text-2xl font-bold">Înregistrare</h1>
                <p className="text-slate-500 text-balance dark:text-slate-400">
                  Creează-ți cont pentru a continua
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
                  <div className="grid gap-3 md:grid-cols-2">
                    <Form.Item<FieldType>
                      label="Nume"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: 'Numele este obligatoriu.',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                      label="Prenume"
                      name="surname"
                      rules={[
                        {
                          required: true,
                          message: 'Prenumele este obligatoriu.',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
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
                      {
                        type: 'string',
                        min: 6,
                        message: 'Parola trebuie să conțină minim 6 caractere.',
                      },
                      {
                        pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*/,
                        message:
                          'Parola trebuie să conțină: cifre, litere mari și mici.',
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Confirmă parola"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Vă rugăm să vă confirmați parola!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error('Parolele nu se potrivesc!')
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item label={null}>
                    <Button
                      type="submit"
                      className="w-full bg-[var(--primary-color)] hover:bg-[#a235c6] text-white"
                    >
                      Înregistrează-te
                    </Button>
                  </Form.Item>
                </Form>
                <div className="text-center text-sm">
                  Ai deja cont?{' '}
                  <a href="/login" className="underline underline-offset-4">
                    Autentifică-te
                  </a>
                </div>
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
};

export default RegisterPageComponent;
