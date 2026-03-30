import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { RegisterRequest, LoginRequest } from '@/types/index.js';
import { createUser, getUserByPhone } from '@/models/userModel.js';
import { generateToken } from '@/utils/jwt.js';

export const register = async (req: Request, res: Response) => {
    try {
        const body = req.body as RegisterRequest;

        // 1. Basic Validation
        if (!body.phone_number || !body.username || !body.password_hash || !body.role || !body.full_name) {
             res.status(400).json({ error: 'Missing required fields' });
             return;
        }

        // 2. Check if user already exists
        const existingUser = await getUserByPhone(body.phone_number);
        if (existingUser) {
             res.status(409).json({ error: 'Phone number already registered' });
             return;
        }

        // 3. Hash the Password securely using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(body.password_hash, saltRounds);

        // 4. Create User Request Object
        const userData = {
            phone_number: body.phone_number,
            username: body.username,
            password_hash: hashedPassword,
            role: body.role,
        };

        let profileData: any = {
            full_name: body.full_name,
        };

        if (body.role === 'artisan') {
            if (!body.lga_id) {
                res.status(400).json({ error: 'Artisans must provide an lga_id representing their location' });
                return;
            }
            profileData.lga_id = body.lga_id;
        }

        const newUser = await createUser(userData, profileData);

        // 5. Generate Secure JWT Token for immediate login
        const token = generateToken({ userId: newUser.id, role: newUser.role as 'artisan' | 'client' | 'admin' });

         res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                phone_number: newUser.phone_number,
                role: newUser.role,
            }
        });
        return;

    } catch (error: any) {
        console.error("Register Error:", error);
         res.status(500).json({ error: `Registration failed: ${error.message}` });
         return;
    }
};

export const login = async (req: Request, res: Response) => {
     try {
        const body = req.body as LoginRequest;

        // 1. Validation
        if (!body.phone_number || !body.password_hash) {
             res.status(400).json({ error: 'Missing phone number or password' });
             return;
        }

        // 2. Lookup User
        const user = await getUserByPhone(body.phone_number);
        if (!user) {
             res.status(401).json({ error: 'Invalid credentials' });
             return;
        }

        // 3. Compare passwords safely using bcrypt
        const passwordMatch = await bcrypt.compare(body.password_hash, user.password_hash);
        if (!passwordMatch) {
             res.status(401).json({ error: 'Invalid credentials' });
             return;
        }

        // 4. Generate Token
        const token = generateToken({ userId: user.id, role: user.role as 'artisan' | 'client' | 'admin' });

         res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                phone_number: user.phone_number,
                role: user.role,
            }
        });
        return;

     } catch (error: any) {
        console.error("Login Error:", error);
         res.status(500).json({ error: `Login failed: ${error.message}` });
         return;
     }
};
