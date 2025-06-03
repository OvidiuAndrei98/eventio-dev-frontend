import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormProps, Input } from 'antd';
import LoginImage from '../../../public/LoginImage.svg';
import Image from 'next/image';
import {
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup,
} from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase/firebaseConfig';

export interface LoginPageProps {
  /**
   * Invoked when the sign in button is pressed. Must start the authentication
   * flow.
   */
  onLogin(email: string, password: string): void;
  /** Invoked when the login with google button is clicked */
  onLoginWithGoogle: (userCredential: UserCredential) => void;
  /**
   * When set to `true`, a loading indicator is displayed over the login form.
   */
  loggingIn?: boolean;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'> & LoginPageProps) {
  type FieldType = {
    email: string;
    password: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    props.onLogin(values.email, values.password);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo
  ) => {
    console.log('Failed:', errorInfo);
  };

  const loginWithGooglePopUp = async () => {
    try {
      const result = await signInWithPopup(
        firebaseAuth,
        new GoogleAuthProvider()
      );

      props.onLoginWithGoogle(result);
    } catch (error) {
      console.error('Eroare la autentificarea cu Google:' + error);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
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
                    label="Parola"
                    name="password"
                    rules={[
                      { required: true, message: 'Parola este obligatorie.' },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item label={null}>
                    <Button type="submit" className="w-full">
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
                    onClick={() => {
                      try {
                        signInWithPopup(
                          firebaseAuth,
                          new GoogleAuthProvider()
                        ).then((result) => {
                          props.onLoginWithGoogle(result);
                        });
                      } catch (error) {
                        console.error(
                          'Eroare la autentificarea cu Google:' + error
                        );
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 24">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Conecteză-te cu Google</span>
                  </Button>
                </div>
              </div>
              <div className="text-center text-sm">
                Nu ai cont?{' '}
                <a href="/register" className="underline underline-offset-4">
                  Inregistrează-te
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
        By clicking continue, you agree to our <a href="#">Terms of Service</a>
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
