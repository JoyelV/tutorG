// models/Category.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface SubCategory {
  name: string;
}

export interface CategoryDocument extends Document {
  categoryName: string;
  subCategories: SubCategory[];
  createdByAdmin: boolean;
  status: 'active' | 'blocked';
}

const SubCategorySchema = new Schema<SubCategory>({
  name: { type: String, required: true },
});

const CategorySchema = new Schema<CategoryDocument>({
  categoryName: { type: String, required: true },
  subCategories: { type: [SubCategorySchema], default: [] },
  createdByAdmin: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }, 
});

export default mongoose.model<CategoryDocument>('Category', CategorySchema);
