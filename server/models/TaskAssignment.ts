import mongoose,{ Schema, model, Types } from 'mongoose';

interface ITaskAssignment {
    task_id: string;
    status: string;
    created_at: Date;
    qa_id: Types.ObjectId; 
    course_id: Types.ObjectId; 
}

const taskAssignmentSchema = new Schema<ITaskAssignment>({
    task_id: { type: String, required: true },
    status: { type: String, required: true },
    created_at: { type: Date, required: true },
    qa_id: { type: mongoose.Schema.Types.ObjectId, ref: "QA", required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
});

export const TaskAssignment = model<ITaskAssignment>('TaskAssignment', taskAssignmentSchema);
