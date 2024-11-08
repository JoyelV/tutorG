import { Router, Request, Response } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';

const router = Router();

// Route to get user profile by userId
router.get('/profile/:userId', async (req: Request, res: Response) => {
    try {
        const user = await getUserProfile(req.params.userId);
        res.json(user);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
});

// Route to update user profile by userId
router.put('/profile/:userId', async (req: Request, res: Response) => {
    try {
        const updatedUser = await updateUserProfile(req.params.userId, req.body);
        res.json(updatedUser);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
