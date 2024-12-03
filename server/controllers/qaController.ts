import QATeam from '../models/QA'
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const addQALead = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Incoming request data:", req.body);
        const {
            qaname,
            email_id,
            phone_number,
            password,
            qualification,
            experience,
            date_of_join,
            role,
          } = req.body;
          
        console.log("Uploaded file:", req.file);

        if (!qaname || !email_id || !phone_number || !password) {
            res.status(400).json({ success: false, message: "Required fields are missing." });
            return;
        }

        if (!req.file) {
            res.status(400).json({ success: false, message: "Profile image is required." });
            return;
        }

        const image = req.file.path;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newQA = new QATeam({
            qaname,
            email_id,
            phone_number,
            password:hashedPassword,
            qualification,
            experience,
            date_of_join,
            role,
            image,
        });

        await newQA.save();

        res.status(201).json({
            success: true,
            message: "QA Lead added successfully!",
            qaSpecialist: newQA,
        });
    } catch (error) {
        console.error("Error adding QA Lead:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


export const addQASpecialist = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Incoming request data in addQASpecialist:", req.body);
        const {
            qaname,
            email_id,
            phone_number,
            password,
            qualification,
            experience,
            date_of_join,
            role,
            lead_uid,
          } = req.body;
          
        console.log("Uploaded file:", req.file);

        if (!qaname || !email_id || !phone_number || !password) {
            res.status(400).json({ success: false, message: "Required fields are missing." });
            return;
        }

        if (!req.file) {
            res.status(400).json({ success: false, message: "Profile image is required." });
            return;
        }

        const image = req.file.path;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newQAEngineer = new QATeam({
            qaname,
            email_id,
            phone_number,
            password:hashedPassword,
            qualification,
            experience,
            date_of_join,
            role,
            lead_uid,
            image,
        });

        await newQAEngineer.save();

        res.status(201).json({
            success: true,
            message: "QA Specialist added successfully!",
            qaSpecialist: newQAEngineer,
        });
    } catch (error) {
        console.error("Error adding QA Specialist:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
