import { Router } from 'express';
import is from '@sindresorhus/is';
import request from 'request';
import { asyncHandler } from '../middlewares/index.js';
import { foodService } from '../services/index.js';
import { uploadFood } from '../utils/index.js';

const foodRouter = Router();

// 모든 음식 정보를 가져오거나 카테고리 별로 음식정보 가져옴
foodRouter.get(
    '/',
    asyncHandler(async (req, res) => {
        const { category } = req.query;
        const { name } = req.query;

        if (name) {
            const food = await foodService.getFoodByName(name);
            res.status(200).json(food);
        } else if (category) {
            const foods = await foodService.getFoodsByCategory(category);
            res.status(200).json(foods);
        } else {
            const foods = await foodService.getFoods();
            res.status(200).json(foods);
        }
    }),
);

// 외부 API에서 칼로리 정보 가져옴
foodRouter.get(
    '/selected',
    asyncHandler(async (req, res) => {
        const { info } = req.query;

        const { API_KEY } = process.env;
        const infoArray = info.split(' ');

        // db에서 한글이름을 영문명으로 변환
        const convertedInfo = await foodService.getFoodNameEng(infoArray);

        // CalorieNinjas 외부 API에 정보 요청
        request.get(
            {
                url: `https://api.calorieninjas.com/v1/nutrition?query=${convertedInfo}`,
                headers: {
                    'X-Api-Key': API_KEY,
                },
            },
            async (error, response, body) => {
                if (error) {
                    throw new Error('Request failed');
                    // res.status(400).json({
                    //     status: 'Request failed:',
                    //     message: error,
                    // });
                } else if (response.statusCode !== 200) {
                    throw new Error('Request failed');
                    // res.status(404).json({
                    //     status: 'Error:',
                    //     statusCode: response.statusCode,
                    //     message: body.toString('utf8'),
                    // });
                }
                // 돌아온 정보를 다시 한글로 변환하여 프론트로 전달
                const foodInfo = await foodService.formatFoodInfo(body);
                res.status(200).json(foodInfo);
            },
        );
    }),
);

// 음식 id로 검색 후 상세 정보 가져옴
foodRouter.get(
    '/:foodId',
    asyncHandler(async (req, res) => {
        const { foodId } = req.params;
        const food = await foodService.getFood(foodId);
        res.status(200).json(food);
    }),
);

// 음식 추가
foodRouter.post(
    '/',
    uploadFood.single('image'),
    asyncHandler(async (req, res) => {
        // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
            throw new Error(
                'headers의 Content-Type을 application/json으로 설정해주세요',
            );
        }
        /// 이미지 url 주소
        const image = req.file.location;

        const { name, nameEng, category, info } = req.body;

        const newfood = await foodService.addFood({
            name,
            nameEng,
            image,
            category,
            info,
        });
        res.status(201).json(newfood);
    }),
);

// 음식 정보 수정
foodRouter.patch(
    '/:foodId',
    asyncHandler(async (req, res) => {
        // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
            throw new Error(
                'headers의 Content-Type을 application/json으로 설정해주세요',
            );
        }

        const { foodId } = req.params;
        const { name, nameEng, image, category, info } = req.body;

        // 이름이 있을 경우 에러 발생
        const isExist = await foodService.checkByName(name);
        if (isExist && isExist.name === name) {
            throw new Error(
                '해당 이름으로 생성된 음식이 있습니다. 다른 이름을 지어주세요.',
            );
        }

        // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
        // 보내주었다면, 업데이트용 객체에 삽입함.
        const toUpdate = {
            ...(name && { name }),
            ...(nameEng && { nameEng }),
            ...(image && { image }),
            ...(category && { category }),
            ...(info && { info }),
        };
        // 상품 정보를 업데이트함.
        const updatedfoodInfo = await foodService.setFood(foodId, toUpdate);

        // 업데이트 이후의 데이터를 프론트에 보내 줌
        res.status(200).json(updatedfoodInfo);
    }),
);

//  음식 삭제
foodRouter.delete(
    '/:foodId',
    asyncHandler(async (req, res) => {
        const { foodId } = req.params;

        const del = await foodService.deleteFood(foodId);
        res.status(200).json(del);
    }),
);

export default foodRouter;
