'use client';

import * as Form from '@radix-ui/react-form';
import { useState, useEffect } from 'react';

interface Props {
  type: 'register' | 'login';
}

const AuthForm = (props: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  useEffect(() => {
    console.log(username);
  }, [username]);

  const heading =
    props.type === 'register' ? 'Sign up for an account' : 'Login';
  const buttonText = props.type === 'register' ? 'Sign up' : 'Login';
  return (
    <Form.Root className="border border-black rounded-sm px-6 py-8">
      <h2 className="text-center mb-4">{heading}</h2>
      <Form.Field name="username">
        <div className="flex flex-col mb-4">
          <Form.Label className="text-sm">Username</Form.Label>
          <Form.Control asChild>
            <input
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10"
              type="text"
              id="username"
              autoComplete="off"
            />
          </Form.Control>
        </div>
      </Form.Field>
      <Form.Field name="password">
        <div className="flex flex-col mb-4">
          <Form.Label className="text-sm">Password</Form.Label>
          <Form.Control asChild>
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
          </Form.Control>
        </div>
      </Form.Field>
      {props.type === 'register' && (
        <Form.Field name="confirmPassword">
          <div className="flex flex-col mb-4">
            <Form.Label className="text-sm">Confirm password</Form.Label>
            <Form.Control asChild>
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
            </Form.Control>
          </div>
        </Form.Field>
      )}

      <Form.Submit asChild>
        <button className="w-full border border-black h-10 rounded-sm mt-4">
          {buttonText}
        </button>
      </Form.Submit>
    </Form.Root>
  );
};
export default AuthForm;
