import mongoose, { Schema, Document, Model, model } from "mongoose";

interface ORDER extends Document {
  studentId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  tutorId: mongoose.Schema.Types.ObjectId;
  status: string;
  paymentMethod: string;
  amount: number;
  metadata: any; 
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<ORDER>({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", 
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course", 
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Instructor", 
  },
  amount: {
    type: Number,
    required: true, 
  },
  status: {
    type: String,
    default: "pending", 
  },
  paymentMethod: {
    type: String,
    enum: ["Stripe", "Wallet"],
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed, 
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true }); 

const orderModel: Model<ORDER> = mongoose.model<ORDER>("Orders", orderSchema);

export default orderModel;
