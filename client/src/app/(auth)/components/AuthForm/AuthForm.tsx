'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuth from '../../../../hooks/auth/useAuth';
import useUser from '@/src/hooks/auth/useUser';
import { useRouter } from 'next/navigation';

import './_authform.scss';

interface Props {
  type: 'register' | 'login';
}

const AuthForm = (props: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const router = useRouter();

  const auth = useAuth();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      console.log('user', user);
      router.push('/browse');
    }
  }, [user, router]);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const authData = {
      username,
      password,
    };

    try {
      if (props.type === 'login') {
        await auth.login(authData);
      } else {
        if (confirmPassword !== password) {
          throw new Error('Boo');
        }
        await auth.register(authData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="auth-form__title">
        {props.type === 'login' ? 'Login' : 'Sign up for an account'}
      </h2>
      <div className="auth-form__input-group">
        <label htmlFor="username" className="auth-form__input-label">
          Username
        </label>
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-form__input-field"
          type="text"
          id="username"
          autoComplete="off"
        />
      </div>

      <div className="auth-form__input-group">
        <label className="auth-form__input-label">Password</label>
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-form__input-field"
          type="password"
          id="password"
          autoComplete="off"
          required
        />
      </div>
      {props.type === 'register' && (
        <div className="auth-form__input-group">
          <label className="auth-form__input-label">Confirm password</label>
          <input
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-form__input-field"
            type="password"
            id="confirmPassword"
            autoComplete="off"
            required
          />
        </div>
      )}
      <div className="auth-form__text">
        <button className="auth-form__button">
          {props.type === 'login' ? 'Login' : 'Sign Up'}
        </button>
        {props.type === 'login' ? (
          <div>
            <p>Don&apos;t have an account?</p>
            <Link href={'/register'}>Register</Link>
          </div>
        ) : (
          <div>
            <p>Already have an account?</p>
            <Link href="/login">Log In</Link>
          </div>
        )}
      </div>
    </form>
  );
};
export default AuthForm;
