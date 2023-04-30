import { TAxisXPlace, TAxisYPlace, TChartTitlePlace, TGridFormat, TLegendPlace, TSort, TTypeChart, } from "../types/index";

export interface IPadding {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export interface IGaps {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export interface IPos {
    x: number;
    y: number;
}

export interface ISize {
    width: number;
    height: number;
}

export interface IBounds {
    width: number | null;
    height: number | null;
    horizontal: {
        start: number,
        end: number,
    };
    vertical: {
        start: number,
        end: number,
    };
}

export interface IStroke {
    width?: number;
    color?: string;
}

export interface IDefaultParams {
    titleFont: {
        size: number,
        weight: number,
    };
    textFont: {
        size: number,
        weight: number,
    };
    axisX: {
        sort: TSort,
        place: TAxisXPlace,
    };
    axisY: {
        sort: TSort,
        place: TAxisYPlace,
    };
    grid: { format: TGridFormat, };
    legend: { place: TLegendPlace, };
    fontFamily: string;
    typeChart: TTypeChart;
    gapTopAxisX: number;
    chartTitle: { place: TChartTitlePlace, };
}