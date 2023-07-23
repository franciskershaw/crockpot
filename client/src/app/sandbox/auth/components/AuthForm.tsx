'use client';

import { useState } from 'react';
import Link from 'next/link';

import './_authform.scss';

interface Props {
  type: 'register' | 'login';
}

const AuthForm = (props: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  return (
    <form className="auth-form">
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
            <Link href={'/'}>Log In</Link>
          </div>
        )}
      </div>
    </form>
  );
};
export default AuthForm;
