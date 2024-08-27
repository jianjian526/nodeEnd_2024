import { UniqueFieldDefinitionNamesRule } from "graphql";

/**
 * 封装RestFul的controller的实现
 */
exports.asyncHandler = (handler: Function) => {
    return async (req: any, res: any, next: Function) => {
        try {
            const result = await handler(req, res, next);
            res.send(exports.getResult(result));
        } catch (err) {
            next(err);
        }
    };
};

/**
 * 把结果封装成默认的response结构
 */
exports.getResult = function (result: any) {
    return {
        code: 0,
        msg: "",
        data: result,
    };
};

/**
 * 根据key，从入力JSON中筛选出需要的成员
 * 
 * @param inputJSON 入力JSON
 * @param keys 需要筛选出的key集合
 */
exports.createNewObjectByKeys = function (inputJSON: any, keys: string[]): any {
    const outputJSON: { [key: string]: any } = {};

    // 根据keys的内容筛选出inputJSON中存在的元素，并将其赋给outputJSON
    keys.forEach(key => {
        if (inputJSON.hasOwnProperty(key)) {
            outputJSON[key] = inputJSON[key];
        }
    });

    return outputJSON;
};

/**
 * 去掉JSON中值为空的key（包括NULL、undefined、空字符串）
 * 
 * @param inputJSON 入力JSON
 * @param keys 需要筛选出的key集合
 */
exports.removeNoValueKeys = function (inputJSON: any): { [key: string]: any } {
    const outputJSON: { [key: string]: any } = {};
    for (const key in inputJSON) {
        if (inputJSON[key] !== null && inputJSON[key] !== undefined && inputJSON[key] !== '') {
            outputJSON[key] = inputJSON[key];
        }
    }
    return outputJSON;
};
