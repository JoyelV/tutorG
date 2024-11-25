import mongoose, { Schema, Document } from 'mongoose';

export interface SubCategory {
  name: string;
}

export interface CategoryDocument extends Document {
  categoryName: string;
  subCategories: SubCategory[];
  createdByAdmin: Boolean;
  status: Boolean;
}

const SubCategorySchema = new Schema<SubCategory>({
  name: { type: String, required: true },
});

const CategorySchema = new Schema<CategoryDocument>({
  categoryName: { type: String, required: true },
  subCategories: { type: [SubCategorySchema], default: [] },
  createdByAdmin: { type: Boolean, default: true },
  status: { type: Boolean, default: true  }, 
});

export default mongoose.model<CategoryDocument>('Category', CategorySchema);
