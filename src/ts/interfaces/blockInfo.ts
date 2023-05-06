import { IPointX, } from "./axisX";
import { IPos, IPadding, ISize, IBounds, IGaps, } from "./global";
import { ILineTo, ILineTheme, } from "./line";
import { IFont, } from "./text";
import { IData, } from "./data";
import { TEmptyObject, TEditName, TEditValue, TOnFocus, TOnHide, } from "../types/index";
import { IElementClass, } from "./element";

export interface IBlockInfoThemeWindow {
    color: Array<string> | string;
}

export interface IBlockInfoThemeTitle {
    color: string;
}

export interface ITriangleData extends IPos {
    lineTo: Array<ILineTo>,
    startY: number;
    endY: number;
}

export interface IBlockInfoThemeGroup {
    color: string;
}

export interface IBlockInfoTheme {
    window: IBlockInfoThemeWindow;
    title: IBlockInfoThemeTitle;
    group: IBlockInfoThemeGroup;
}

export interface IGroupsBlockInfo {
    font?: IFont;
    gaps: IGaps;
}

export interface IEventsBlockInfo {
    onFocus?: TOnFocus;
    onHide?: TOnHide;
}

export interface ITitleBlockInfo {
    font?: IFont;
    gaps: IGaps;
}

export interface ITriangleChangedData {
    x: number;
    y: number;
    lineTo: Array<ILineTo>;
}

export interface IBlockInfo {
    readonly background?: string | Array<string>;
    readonly groups: IGroupsBlockInfo;
    readonly title: ITitleBlockInfo;
    readonly padding?: IPadding | TEmptyObject | number;
    readonly events?: IEventsBlockInfo | TEmptyObject;
}

export interface IBlockInfoElementWithSizeGroup extends ISize {
    name: string;
    color: string | Array<string>;
}

export interface IBlockInfoElementWithSizeValue extends ISize {
    name: string;
}

export interface IBlockInfoElementWithSize {
    group: IBlockInfoElementWithSizeGroup;
    value: IBlockInfoElementWithSizeValue;
}

export interface IBlockInfoClass extends IElementClass {
    readonly editValue: TEditValue;
    readonly editName: TEditName;
    readonly data: IData;
    readonly bounds: IBounds;
    readonly elements: Array<IPointX>;
    readonly padding?: IPadding | TEmptyObject | number;
    readonly titleData: ITitleBlockInfo;
    readonly groupsData: IGroupsBlockInfo;
    readonly groupLineWidth: number;
    readonly triangleSizes: ISize;
    readonly title: string | number;
    readonly themeForWindow: IBlockInfoThemeWindow | TEmptyObject;
    readonly themeForLine: ILineTheme | TEmptyObject;
    readonly themeForTitle: IBlockInfoThemeTitle | TEmptyObject;
    readonly themeForGroup: IBlockInfoThemeGroup | TEmptyObject;
    readonly fontFamily: string;

    init(): void;
}