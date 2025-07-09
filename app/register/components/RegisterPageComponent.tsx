'use client';

import { Form, FormProps, Input } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { firebaseAuth } from '@/lib/firebase/firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { User } from '@/core/types'; // Asigură-te că interfața User este definită aici sau importată corect
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import LoginImage from '../../../public/LoginImage.svg'; // Ajustează calea dacă e necesar
import { toast } from 'sonner';
import { addUser } from '@/service/user/addUser';
import Link from 'next/link';
import PlanyviteLogo from '@/public/planyvite_logo.svg';
import { EmailAuthProvider, linkWithCredential } from 'firebase/auth'; // Importă direct
import {
  identifyTikTokUser,
  trackTikTokEvent,
} from '@/lib/tik-tok/tiktok-events';

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
  const auth = firebaseAuth; // Folosește direct firebaseAuth din config

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      let userCredential;

      if (auth.currentUser && auth.currentUser.isAnonymous) {
        console.log(
          'RegisterPage: Linking anonymous user with email/password.'
        );
        const credential = EmailAuthProvider.credential(
          values.email,
          values.password
        );
        userCredential = await linkWithCredential(auth.currentUser, credential);
      } else {
        console.log('RegisterPage: Creating new user with email/password.');
        userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
      }

      const user = userCredential.user;
      console.log(
        `RegisterPage: Firebase user created/linked with UID: ${user.uid}.`
      );

      // Actualizează profilul Firebase cu numele afișat
      await updateProfile(user, {
        displayName: `${values.name} ${values.surname}`,
      });
      console.log('RegisterPage: Firebase user profile updated.');

      // Creează/Actualizează utilizatorul în Firestore
      const userDoc: User = {
        userId: user.uid,
        email: user.email as string,
        name: values.name,
        surname: values.surname,
        displayName: `${values.name} ${values.surname}`, // Nume afișat consistent
        photoURL: user.photoURL || null,
      };
      await addUser(userDoc);
      console.log('RegisterPage: User data added/updated in Firestore.');

      // *** IMPORTANT: NU MAI SETA MANUAL auth_token AICI ***
      // Lasă AuthenticationBoundary să se ocupe de setarea tokenului IQNECT în localStorage.
      // Ascultătorul onAuthStateChanged din AuthenticationBoundary va detecta acest nou utilizator,
      // va genera tokenul IQNECT, îl va salva în localStorage și apoi va redirecționa la /dashboard.
      toast.success('Contul a fost creat cu succes! Te redirecționăm...');

      identifyTikTokUser({ email: user.email });

      trackTikTokEvent('CompleteRegistration', {
        content_type: 'user',
      });

      window.location.href = '/dashboard';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('RegisterPage: Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email-ul este deja folosit. Te rugăm să te autentifici.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Parola este prea slabă. Alege o parolă mai puternică.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Adresă de email invalidă.');
      } else {
        toast.error(
          'A apărut o eroare la înregistrare. Te rugăm să încerci din nou.'
        );
      }
    }
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
                  name="register-form" // Schimbat din login-form pentru claritate
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
                      {
                        type: 'email', // Adaugă validare pentru tipul email
                        message: 'Adresa de email nu este validă.',
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
                    name="repeatPassword" // Redenumit din 'confirm' pentru claritate și potrivire cu FieldType
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
                  <Link href="/login" className="underline underline-offset-4">
                    Autentifică-te
                  </Link>
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
