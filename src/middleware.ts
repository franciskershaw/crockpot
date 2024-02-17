import { NextRequest, NextResponse } from 'next/server';

import { verifyAuth } from './app/utils/auth';

export async function middleware(request: NextRequest) {
	const token = request.cookies.get('refreshToken')?.value;

	const verifiedToken =
		token &&
		(await verifyAuth(token).catch((err) => {
			console.log(err);
		}));

	if (request.nextUrl.pathname === '/' && verifiedToken) {
		return NextResponse.redirect(new URL('/your-crockpot', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/'],
};
