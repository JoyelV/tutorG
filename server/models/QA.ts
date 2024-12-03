import mongoose, { Schema, model, Types } from 'mongoose';

interface IQA {
    qaname: string;
    role: string; 
    email_id: string;
    phone_number: string;
    image: string;
    password: string;
    qualification: string;
    experience: number;
    date_of_join: Date;
    task_count: number;
    is_blocked: boolean;
    lead_uid: string | null; 
    task_assignment: Types.ObjectId; 
    instructorId: Types.ObjectId; 
}

const qaSchema = new Schema<IQA>({
    qaname: { type: String, required: true },
    role: { type: String, enum: ["Lead", "Specialist"], required: true },
    email_id: { type: String, required: true },
    phone_number: { type: String, required: true },
    image: { type: String },
    password: { type: String, required: true },
    qualification: { type: String, required: true },
    experience: { type: Number, required: true },
    date_of_join: { type: Date, required: true },
    task_count: { type: Number},
    is_blocked: { type: Boolean, default: false },
    lead_uid: { type: String, default: null },
    task_assignment: { type: mongoose.Schema.Types.ObjectId, ref: "TaskAssignment"},
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor"},
});

export default model<IQA>('QA', qaSchema);
