import { NextRequest, NextResponse } from 'next/server';

import { decodeToken, verifyAuth } from './app/utils/auth';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('refreshToken')?.value;
	let userPayload;

	if (token) {
		userPayload = decodeToken(token);
	}

	const verifiedToken =
		token &&
		(await verifyAuth(token).catch((err) => {
			console.log(err);
		}));

	// If the user is trying to access the homepage (login) and has a verified token,
	// redirect them to '/your-crockpot'.
	if (request.nextUrl.pathname === '/' && verifiedToken) {
		return NextResponse.redirect(new URL('/your-crockpot', request.url));
	}

	// If the user is trying to access '/your-crockpot' and does not have a verified token,
	// redirect them to '/' (login).
	if (request.nextUrl.pathname === '/your-crockpot' && !verifiedToken) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	// If the user is trying to access '/admin' but does not have isAdmin flag in JWT
	// Redirect logic for '/admin' access based on isAdmin flag
	if (
		request.nextUrl.pathname.startsWith('/admin') &&
		(!userPayload || !userPayload.isAdmin)
	) {
		return NextResponse.redirect(new URL('/your-crockpot', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/', '/your-crockpot', '/admin'],
};
