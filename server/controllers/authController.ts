import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

         // Password validation
         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
         if (!passwordRegex.test(password)) {
             res.status(400).json({
                 message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
             });
             return;
         }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
         res.status(400).json({ message: 'Email is already in use' });
         return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and save to database
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log("reqbody:",req.body)
    try {
        // Find the user by email
        const user: IUser | null = await User.findOne({ email });
        console.log("user...............",user)
        if (!user) {
            console.log("not user")
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("isMatch",isMatch)
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET environment variable is not set');
        }        

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );
        console.log("token",token)
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);  // Pass errors to error-handling middleware
    }
};
