import { model, Schema } from "mongoose";
import { ICategory } from "../../schema/category/category.schema";

const categorySchema = new Schema<ICategory>(
  {
    key: {
      type: String,
      required: [true, "Category key is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
      required: [true, "Category image URL is required"],
    },
    editable_fields: {
      type: [String],
      default: ["title", "description", "image"],
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = model<ICategory>("Category", categorySchema);

export default CategoryModel;
