/* eslint-disable no-await-in-loop */
import { foodModel, categoryModel } from '../db/index.js';

class FoodService {
    constructor() {
        this.foodModel = foodModel;
        this.categoryModel = categoryModel;
    }

    // 전체 음식 목록 확인
    async getFoods() {
        const foods = await this.foodModel.findAll();

        if (foods.length < 1) {
            throw new Error('음식 정보가 없습니다.');
        }
        return foods;
    }

    // 카테고리로 음식 목록 확인
    async getFoodsByCategory(category) {
        const categoryInfo = await this.categoryModel.findByName(category);

        if (!categoryInfo) {
            throw new Error(
                '해당 카테고리 내역이 없습니다. 다시 한 번 확인해 주세요.',
            );
        }
        // eslint-disable-next-line no-underscore-dangle
        const categoryId = categoryInfo._id;

        const foods = await this.foodModel.findByCategory(categoryId);
        return foods;
    }

    // 카테고리로 음식 목록 확인
    async isExist(categoryId) {
        const foods = await this.foodModel.findByCategory(categoryId);
        return foods;
    }

    // 음식 id로 상세정보 확인
    async getFood(foodId) {
        const food = await this.foodModel.findById(foodId);

        if (!food) {
            throw new Error(
                '해당 음식에 대한 정보가 없습니다. 다시 한 번 확인해 주세요.',
            );
        }
        return food;
    }

    // 음식 이름으로 상세정보 확인
    async getFoodByName(name) {
        const food = await this.foodModel.findByName(name);

        if (!food) {
            throw new Error(
                '해당 음식에 대한 정보가 없습니다. 다시 한 번 확인해 주세요.',
            );
        }
        return food;
    }

    // 해당 이름이 있는지 확인
    async checkByName(name) {
        const food = await this.foodModel.findByName(name);
        return food;
    }

    // 음식 한글 이름으로 영어 이름 찾기
    async getFoodNameEng(foodInfo) {
        let result = '';

        for (let i = 0; i < foodInfo.length; i += 1) {
            // 숫자가 있을때는 그냥 기록
            if (/^[0-9]/.test(foodInfo[i])) {
                result += `${foodInfo[i]} `;

                // 음식 이름 문자가 있을 때는 db에서 영문이름 반환
            } else {
                const food = await this.foodModel.findByName(foodInfo[i]);

                if (food) {
                    result += `${food.nameEng} `;
                }
            }
        }
        return result;
    }

    // 외부 API에서 받아온 정보를 가공하여 반환
    async formatFoodInfo(foodInfo) {
        const conversion = JSON.parse(foodInfo);
        const initialInfo = conversion.items;

        for (let i = 0; i < initialInfo.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            const food = await this.foodModel.findByNameEng(
                initialInfo[i].name,
            );

            initialInfo[i].name = food.name;
            initialInfo[i].category = food.category.name;
            initialInfo[i].image = food.image;
        }

        return initialInfo;
    }

    // 음식 추가
    async addFood(foodInfo) {
        const { name, nameEng, image, category, info } = foodInfo;

        const isExist = await this.foodModel.findByName(name);
        if (isExist) {
            throw new Error(
                '해당 이름으로 생성된 음식이 있습니다. 다른 이름을 지어주세요.',
            );
        }
        const newFoodInfo = {
            name,
            nameEng,
            image,
            category,
            info,
        };

        // db에 저장
        const createdNewfood = await this.foodModel.create(newFoodInfo);
        return createdNewfood;
    }

    // 음식 정보 수정
    async setFood(foodId, toUpdate) {
        let food = await this.foodModel.findById(foodId);

        if (!food) {
            throw new Error(
                '해당 음식에 대한 정보가 없습니다. 다시 한 번 확인해 주세요.',
            );
        }

        food = await this.foodModel.update({
            foodId,
            update: toUpdate,
        });

        return food;
    }

    // 음식 삭제
    async deleteFood(foodId) {
        const food = await this.foodModel.findById(foodId);

        if (!food) {
            throw new Error(
                '해당 음식에 대한 정보가 없습니다. 다시 한 번 확인해 주세요.',
            );
        }

        const del = await this.foodModel.delete(foodId);
        return del;
    }
}

const foodService = new FoodService();

export default foodService;
