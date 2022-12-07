import mongoose from 'mongoose';

const { Schema } = mongoose;

const FoodSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        nameEng: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'categories',
            required: true,
        },
        desc: {
            type: String,
            required: false,
        },
    },
    {
        collection: 'foods',
        timestamps: true,
    },
);

export default FoodSchema;
