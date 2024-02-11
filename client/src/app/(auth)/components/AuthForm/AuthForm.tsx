'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useAuth from '@/src/hooks/auth/useAuth';
import useUser from '@/src/hooks/auth/useUser';

import Button from '@/src/components/Button/Button';

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
	const { user } = useUser();

	useEffect(() => {
		if (user) {
			router.push('/your-crockpot');
		}
	}, [user, router]);

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
		<form onSubmit={handleSubmit} className="auth-form">
			<h2 className="text-center">
				{`${props.type === 'login' ? 'Login' : 'Register'} to Crockpot!`}
			</h2>
			<div className="space-y-1">
				<div>
					<label htmlFor="username">Username</label>
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
				<div>
					<label>Password</label>
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
					<div>
						<label>Confirm password</label>
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
			</div>
			<div className="text-center w-full flex flex-col justify-around items-center space-y-1 mt-4">
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
