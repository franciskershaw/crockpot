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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = {
      username,
      password,
    };

    const registerData = {username, password, confirmPassword}

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        // error handling logic here
        throw new Error('Error during login');
      }

      const data = await response.json();
      console.log(data); // log the received data
      // handle the received data (e.g., save token in the local storage, navigate to another page, etc.)
    } catch (err) {
      console.error(err);
      // handle error, for example show a notification or change some state
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
