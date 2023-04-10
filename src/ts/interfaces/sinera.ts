import { TEmptyObject, } from "../types/index";
import { IChartTitle, } from "./chart";
import { ITheme, } from "./utils";
import { IData, } from "./data";
import { IAxisX, } from "./axisX";
import { IAxisY, } from "./axisY";
import { ILine, } from "./line";
import { ICap, } from "./cap";
import { IGrid, } from "./grid";
import { ILegend, } from "./legend";
import { IPadding, } from "./global";
import { IBlockInfo, } from "./blockInfo";

export interface ISineraConstructor {
    selectorCanvas: string;
    background?: string | Array<string>;
    title?: IChartTitle | TEmptyObject;
    theme?: ITheme | TEmptyObject;
    data: IData;
    axisY?: IAxisY | TEmptyObject;
    axisX?: IAxisX | TEmptyObject;
    line?: ILine | TEmptyObject;
    cap?: ICap | object;
    grid?: IGrid | TEmptyObject;
    legend?: ILegend | TEmptyObject;
    blockInfo?: IBlockInfo | TEmptyObject;
    type?: "line";
    padding?: IPadding | TEmptyObject | number;
    hideGroups?: Array<string>;
}

export interface ISineraClass extends ISineraConstructor {
    update(): ISineraClass;
    init(): ISineraClass;
}