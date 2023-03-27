import { IPos, } from "./global";
import { ICap, } from "./cap";
import { ILine, } from "./line";

export interface IGroupDataCoordinates extends IPos {
    name: number | string;
    value: number;
}

export interface IDataAtItemData {
    name: string | number;
    value: number;
}

interface IItemData {
    data: Array<IDataAtItemData>;
    cap?: ICap;
    line?: ILine;
}

export interface IData {
    [key: string]: IItemData
}