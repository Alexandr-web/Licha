import { TEmptyObject, TTypeChart, } from "../types/index";
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
    readonly selectorCanvas: string;
    readonly background?: string | Array<string>;
    readonly title?: IChartTitle | TEmptyObject;
    readonly theme?: ITheme | TEmptyObject;
    readonly data: IData;
    readonly axisY?: IAxisY | TEmptyObject;
    readonly axisX?: IAxisX | TEmptyObject;
    readonly line?: ILine | TEmptyObject;
    readonly cap?: ICap | TEmptyObject;
    readonly grid?: IGrid | TEmptyObject;
    readonly legend?: ILegend | TEmptyObject;
    readonly blockInfo?: IBlockInfo | TEmptyObject;
    readonly type?: TTypeChart;
    readonly padding?: IPadding | TEmptyObject | number;
    readonly hideGroups?: Array<string>;
    readonly fontFamily?: string;
}

export interface ISineraClass extends ISineraConstructor {
    update(): ISineraClass;
    init(): ISineraClass;
}