import { Location, NavigateFunction, Params } from "react-router-dom";
import { IReportData } from '../core/models/ReportData';
import Navigation from './Navigation';
import { IQueryParams } from "../core/utils/QueryParamUtils";
import { IDashboardMetrix } from "../core/models/DashboardMetrix";

export type NavigationParams = {
    router: NavigationProps
    toBeReplaced?: boolean
    id?: number
    queryParams?: IQueryParams
}

export type NavigationProps = {
    location: Location
    navigate: NavigateFunction
    params: Readonly<Params<string>>
}

export type NavigationState = {
    scrollToTop?: boolean
    username?:string
    password?:string
}

export type ViewReportNavigationState = {
    id?: number
    reportData?: IReportData
    dashboardMatrix?: IDashboardMetrix
}