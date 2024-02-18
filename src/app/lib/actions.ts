'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { generateRefreshToken } from '../utils/auth';

export async function login(formData: FormData) {
	const userLogin = {
		username: formData.get('username'),
		password: formData.get('password'),
	};

	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userLogin),
			},
		);

		if (!response.ok) {
			throw new Error('Login failed');
		}

		const user = await response.json();

		const refreshToken = await generateRefreshToken(user);

		cookies().set('refreshToken', refreshToken);

		return user;
	} catch (error) {
		console.error(error);
		return new NextResponse('Login failed', { status: 500 });
	}
}
