import { Router } from 'express';
import is from '@sindresorhus/is';
import { asyncHandler } from '../middlewares/index.js';
import { categoryService, foodService } from '../services/index.js';

const categoryRouter = Router();

// 모든 카테고리 정보를 가져옴
categoryRouter.get(
    '/',
    asyncHandler(async (req, res) => {
        const categories = await categoryService.getCategories();
        res.status(200).json(categories);
    }),
);

// 카테고리 id로 검색 후 상세 정보 가져옴
categoryRouter.get(
    '/:categoryId',
    asyncHandler(async (req, res) => {
        const { categoryId } = req.params;
        const category = await categoryService.getCategory(categoryId);
        res.status(200).json(category);
    }),
);

// 카테고리 추가
categoryRouter.post(
    '/',
    asyncHandler(async (req, res) => {
        // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
            throw new Error(
                'headers의 Content-Type을 application/json으로 설정해주세요',
            );
        }

        const { name, desc } = req.body;

        const newCategory = await categoryService.addCategory({
            name,
            desc,
        });
        res.status(201).json(newCategory);
    }),
);

// 카테고리 정보 수정
categoryRouter.patch(
    '/:categoryId',
    asyncHandler(async (req, res) => {
        // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
            throw new Error(
                'headers의 Content-Type을 application/json으로 설정해주세요',
            );
        }

        const { categoryId } = req.params;
        const { name, desc } = req.body;

        // 이름이 있을 경우 에러 발생
        const isExist = await categoryService.getCategoryByName(name);
        if (isExist && isExist.name === name) {
            throw new Error(
                '이 이름으로 생성된 카테고리가 있습니다. 다른 이름을 지어주세요.',
            );
        }

        // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
        // 보내주었다면, 업데이트용 객체에 삽입함.
        const toUpdate = {
            ...(name && { name }),
            ...(desc && { desc }),
        };
        // 상품 정보를 업데이트함.
        const updatedCategoryInfo = await categoryService.setCategory(
            categoryId,
            toUpdate,
        );

        // 업데이트 이후의 데이터를 프론트에 보내 줌
        res.status(200).json(updatedCategoryInfo);
    }),
);

//  카테고리 삭제
categoryRouter.delete(
    '/:categoryId',
    asyncHandler(async (req, res) => {
        const { categoryId } = req.params;

        const isExistInFoods = await foodService.isExist(categoryId);
        if (isExistInFoods.length >= 1) {
            throw new Error(
                '해당 카테고리에 속해 있는 음식이 있어 삭제 할 수 없습니다.',
            );
        }

        const del = await categoryService.deleteCategory(categoryId);
        res.status(200).json(del);
    }),
);

export default categoryRouter;
