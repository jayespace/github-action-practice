import mongoose from 'mongoose';
import FoodSchema from '../schemas/foodSchema.js';

const { model } = mongoose;
const Food = model('food', FoodSchema);

class FoodModel {
    constructor() {
        this.food = Food;
    }

    async findAll() {
        const foods = await this.food.find({});
        return foods;
    }

    async findById(foodId) {
        const food = await this.food.findById({ _id: foodId });
        return food;
    }

    async findByName(foodName) {
        const food = await this.food
            .findOne({ name: foodName })
            .populate('category', 'name');
        return food;
    }

    async findByNameEng(foodNameEng) {
        const food = await this.food
            .findOne({ nameEng: foodNameEng })
            .populate('category', 'name');
        return food;
    }

    async findByCategory(categoryId) {
        const foods = await this.food.find({ category: categoryId });
        return foods;
    }

    async countfood() {
        const counts = await this.food.countDocuments({});
        return counts;
    }

    async create(foodId) {
        const createdNew = await this.food.create(foodId);
        return createdNew;
    }

    async update({ foodId, update }) {
        const filter = { _id: foodId };
        const option = { returnOriginal: false };

        const updatedfood = await this.food.findOneAndUpdate(
            filter,
            update,
            option,
        );
        return updatedfood;
    }

    async delete(foodId) {
        const del = await this.food.findOneAndDelete({ _id: foodId });
        return del;
    }
}

const foodModel = new FoodModel();

export default foodModel;
