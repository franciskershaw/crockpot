import { JWTPayload, jwtVerify } from 'jose';

interface refreshTokenPayload {
	jti: string;
	iat: number;
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
		return verified.payload as refreshTokenPayload;
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
