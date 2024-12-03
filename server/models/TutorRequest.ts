import mongoose,{ Schema, model, Types } from 'mongoose';

interface ITutorRequest {
    request_id: string;
    reason: string;
    request_date: Date;
    status: string;
    qa_id: Types.ObjectId; 
    attachment_url: string;
    Tutor_id: number;
    course_id: Types.ObjectId; 
    chapter_id: number;
}

const tutorRequestSchema = new Schema<ITutorRequest>({
    request_id: { type: String, required: true },
    reason: { type: String, required: true },
    request_date: { type: Date, required: true },
    status: { type: String, required: true },
    qa_id: { type: mongoose.Schema.Types.ObjectId, ref: "QA", required: true },
    attachment_url: { type: String },
    Tutor_id: { type: Number, required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    chapter_id: { type: Number, required: true },
});

export default model<ITutorRequest>('TutorRequest', tutorRequestSchema);
