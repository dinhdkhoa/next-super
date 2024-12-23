import { setRequestLocale } from 'next-intl/server';
import LoginForm from './login-form';

export default function Login({params: {locale}} : {params: {locale: string}}) {
  setRequestLocale(locale);

  return (
    <div className='min-h-screen flex items-center justify-center'>
        <LoginForm />
    </div>
  )
}
