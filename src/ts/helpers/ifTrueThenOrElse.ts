/**
 * Возвращает значение в зависимости от булева значения
 * @param {boolean | Array<boolean>} data Булево значение
 * @param {any} returnedDataIfTrue Значение, которое будет возвращаться, если data правдиво
 * @param {any} returnedDataIfFalse Значение, которое будет возвращаться, если data ложно
 * @returns {any}
 */
export default (data: boolean | Array<boolean>, returnedDataIfTrue: any, returnedDataIfFalse: any): any => {
    if (Array.isArray(data)) {
        return data.every((item: boolean) => item) ? returnedDataIfTrue : returnedDataIfFalse;
    }

    return data ? returnedDataIfTrue : returnedDataIfFalse;
};