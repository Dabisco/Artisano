import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production';

export interface JwtPayload {
    userId: string;
    role: 'artisan' | 'client' | 'admin';
}

export const generateToken = (payload: JwtPayload, expiresIn: string = '7d'): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
};
