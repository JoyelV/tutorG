import mongoose, { Schema, Document } from 'mongoose';

export interface Lesson {
  lessonTitle : string;
  lessonDescription : string;
  lessonVideo : string;
  lessonPdf:string;
  courseId : string;
  createdAt:Date;
}

export interface LessonDocument extends Lesson, Document {}

const LessonSchema: Schema = new Schema({
  lessonTitle: { type: String, required: true },
  lessonDescription: { type: String, required: true },
  lessonVideo: { type: String },
  lessonPdf:{ type: String },
  courseId : {type:String , required :true},
  createdAt:{type:Date,default:Date.now}
});

export default mongoose.model<LessonDocument>('Lesson', LessonSchema);