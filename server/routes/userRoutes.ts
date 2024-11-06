import { Router, Request, Response } from 'express';
import { getUserProfile } from '../controllers/userController';

const router = Router();

router.get('/profile/:userId', async (req: Request, res: Response) => {
    try {
        const user = await getUserProfile(req.params.userId);
        res.json(user);
    } catch (error:any) {
        res.status(404).json({ message: error.message });
    }
});

export default router;
