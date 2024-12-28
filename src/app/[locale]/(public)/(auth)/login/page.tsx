import { setRequestLocale } from 'next-intl/server';
import LoginForm from './login-form';

export default async function Login(props: {params: Promise<{locale: string}>}) {
  const params = await props.params;

  const {
    locale
  } = params;

  setRequestLocale(locale);

  return (
    <div className=' flex items-center justify-center'>
        <LoginForm />
    </div>
  )
}
