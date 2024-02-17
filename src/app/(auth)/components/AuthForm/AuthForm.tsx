'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

import Link from 'next/link';

import useAuth from '@/hooks/auth/useAuth';

import Button from '@/components/Button/Button';
import TextInput from '@/components/FormComponents/TextInput/TextInput';

import styles from './styles.module.scss';

interface Props {
	type: 'register' | 'login';
}

const AuthForm = (props: Props) => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');

	const auth = useAuth();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const authData = {
			username,
			password,
		};

		if (props.type === 'login') {
			await auth.login(authData);
		} else {
			if (confirmPassword !== password) {
				toast.error('Passwords do not match');
			} else if (confirmPassword === password) {
				await auth.register(authData);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} className={styles.authForm}>
			<h2 className="text-center text-2xl">
				{`${props.type === 'login' ? 'Login' : 'Register'} to Crockpot!`}
			</h2>

			<div className="space-y-6 mt-3">
				<TextInput
					label="Username"
					id="username"
					value={username}
					onChange={(value) => setUsername(value)}
				/>

				<TextInput
					label="Password"
					id="password"
					value={password}
					onChange={(value) => setPassword(value)}
					isPassword
				/>
				{props.type === 'register' && (
					<TextInput
						label="Confirm password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(value) => setConfirmPassword(value)}
						isPassword
					/>
				)}
			</div>

			<div className="text-center w-full flex flex-col justify-around items-center space-y-4 mt-6">
				<Button
					text={props.type === 'login' ? 'Login' : 'Register'}
					type="primary"
				/>
				{props.type === 'login' ? (
					<div>
						<p>Don&apos;t have an account?</p>
						<Link href={'/register'}>
							<span className="underline">Register</span>
						</Link>
					</div>
				) : (
					<div>
						<p>Already have an account?</p>
						<Link href="/">
							<span className="underline">Log In</span>
						</Link>
					</div>
				)}
			</div>
		</form>
	);
};
export default AuthForm;
