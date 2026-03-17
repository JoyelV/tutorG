import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { generateZegoToken } from '../utils/zegoToken';
import { AppError } from '../utils/AppError';

export const getZegoToken = asyncHandler(async (req: Request, res: Response) => {
    const { userId, roomId } = req.query;

    if (!userId || !roomId) {
        throw new AppError(400, 'userId and roomId are required');
    }

    const appId = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SERVER_SECRET;

    if (!appId || !serverSecret) {
        throw new AppError(500, 'ZegoCloud configuration missing on server');
    }

    const payload = JSON.stringify({
        room_id: roomId,
        privilege: {
            1: 1, // login
            2: 1  // publish
        }
    });

    // Token valid for 1 hour
    const token = generateZegoToken(appId, userId as string, serverSecret, 3600, payload);

    res.status(200).json(new ApiResponse(200, { token }, 'Token generated successfully'));
});
