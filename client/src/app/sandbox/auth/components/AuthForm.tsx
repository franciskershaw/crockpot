'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Props {
  type: 'register' | 'login';
}

const AuthForm = (props: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  return (
    <form className="border border-black rounded-sm px-6 py-8 max-w-2xl">
      <h2 className="text-center mb-4">
        {props.type === 'login' ? 'Login' : 'Sign up for an account'}
      </h2>
      <div className="flex flex-col mb-4">
        <label htmlFor="username" className="text-sm">
          Username
        </label>
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="h-10"
          type="text"
          id="username"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col mb-4">
        <label className="text-sm">Password</label>
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-10"
          type="password"
          id="password"
          autoComplete="off"
          required
        />
      </div>
      {props.type === 'register' && (
        <div className="flex flex-col mb-4">
          <label className="text-sm">Confirm password</label>
          <input
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-10"
            type="password"
            id="confirmPassword"
            autoComplete="off"
            required
          />
        </div>
      )}
      <div className="text-center w-full flex flex-col gap-4 justify-around items-center">
        <button className="w-full border border-black h-10 rounded-sm mt-4">
          {props.type === 'login' ? 'Login' : 'Sign Up'}
        </button>
        {props.type === 'login' ? (
          <div>
            <p>Don't have an account?</p>
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
