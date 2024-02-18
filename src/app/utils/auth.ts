import { JWTPayload, SignJWT, jwtVerify } from 'jose';

import { User } from '@/types/types';

interface refreshTokenPayload {
	jti: string;
	iat: number;
	isAdmin: boolean;
}

export const getJwtSecretKey = () => {
	const secret = process.env.JWT_SECRET;

	if (!secret || secret.length === 0) {
		throw new Error('The environment variable JWT_SECRET_KEY is not set');
	}

	return secret;
};

export const verifyAuth = async (token: string) => {
	try {
		const verified = await jwtVerify(
			token,
			new TextEncoder().encode(getJwtSecretKey()),
		);
		return verified.payload as unknown as refreshTokenPayload;
	} catch (error) {
		console.error('Error verifying token:', error);
		throw new Error('Error verifying token.');
	}
};

export const decodeToken = (token: string): JWTPayload => {
	try {
		const base64Payload = token.split('.')[1];
		const payloadBuffer = Buffer.from(base64Payload, 'base64');
		const payload = JSON.parse(payloadBuffer.toString('utf8'));
		return payload as JWTPayload;
	} catch (error) {
		console.error('Error decoding token:', error);
		throw new Error('Error decoding token');
	}
};

export const generateRefreshToken = async (user: User): Promise<string> => {
	const secretKey = getJwtSecretKey();

	const claims = {
		jti: user._id,
		isAdmin: user.isAdmin,
	};

	try {
		const jwt = await new SignJWT(claims)
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setExpirationTime('30d')
			.sign(new TextEncoder().encode(secretKey));

		return jwt;
	} catch (error) {
		console.error('Error generating refresh token:', error);
		throw new Error('Error generating refresh token');
	}
};
