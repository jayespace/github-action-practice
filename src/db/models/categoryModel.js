import mongoose from 'mongoose';
import CategorySchema from '../schemas/categorySchema.js';

const { model } = mongoose;

const Category = model('categories', CategorySchema);

export class CategoryModel {
    constructor() {
        this.category = Category;
    }

    async findAll() {
        const categories = await this.category.find({});
        return categories;
    }

    async findById(categoryId) {
        const category = await this.category.findById({ _id: categoryId });
        return category;
    }

    async findByName(categoryName) {
        const category = await this.category.findOne({ name: categoryName });
        return category;
    }

    async countCategories() {
        const counts = await this.category.countDocuments({});
        return counts;
    }

    async create(categoryId) {
        const createdNew = await this.category.create(categoryId);
        return createdNew;
    }

    async update({ categoryId, update }) {
        const filter = { _id: categoryId };
        const option = { returnOriginal: false };

        const updatedCategory = await this.category.findOneAndUpdate(
            filter,
            update,
            option,
        );
        return updatedCategory;
    }

    async delete(categoryId) {
        const del = await this.category.findOneAndDelete({ _id: categoryId });
        return del;
    }
}

const categoryModel = new CategoryModel();
export default categoryModel;
