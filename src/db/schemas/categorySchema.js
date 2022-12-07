import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        desc: {
            type: String,
            required: false,
        },
    },
    {
        collection: 'categories',
        timestamps: true,
    },
);

export default CategorySchema;
