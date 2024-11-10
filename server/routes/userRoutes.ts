import { Router, Request, Response, RequestHandler } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController';

const router = Router();

interface UserProfileParams {
    userId: string;
}

router.get('/profile/:userId', async (req: Request<UserProfileParams>, res: Response) => {
    try {
        const user = await getUserProfile(req.params.userId);
        res.json(user);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

router.put('/update/:userId', async (req: Request<UserProfileParams>, res: Response) => {
    try {
        const updatedUser = await updateUserProfile(req.params.userId, req.body);
        console.log("updatedUser",updatedUser);

        res.json(updatedUser);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router;
