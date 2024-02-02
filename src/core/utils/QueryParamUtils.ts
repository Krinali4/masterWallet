import queryString from "query-string"
import TextUtils from "./TextUtils"

export type IQueryParams = {
    page: number,
    clientIds: number[]
    accountIds: number[]
    locationIds: number[]
    tagTypes: string[]
    searchQuery: string
}

export default class QueryParamUtils {
    public static getQueryParams(urlSearchString: string|null|undefined): IQueryParams {
        let page = 0
        let clientIds: number[] = []
        let accountIds: number[] = []
        let locationIds: number[] = []
        let tagTypes: string[] = []
        let searchQuery: string = ''
        try {
            const parsedQs = queryString.parse(urlSearchString, {arrayFormat: 'index', parseNumbers: true})
            if(parsedQs) {
                // page
                let qPage = (parsedQs.page) ? parsedQs.page : 0
                if(isNaN(Number(qPage))) {
                    qPage = 0
                }
                page = Number(qPage)
                if(parsedQs.clientIds && Array.isArray(clientIds)) {
                    clientIds = parsedQs.clientIds as number[]
                }
                if(parsedQs.accountIds && Array.isArray(accountIds)) {
                    accountIds = parsedQs.accountIds as number[]
                }
                if(parsedQs.locationIds && Array.isArray(locationIds)) {
                    locationIds = parsedQs.locationIds as number[]
                }
                if(parsedQs.tagTypes && Array.isArray(tagTypes)) {
                    tagTypes = parsedQs.tagTypes as string[]
                }
                if(parsedQs.searchQuery) {
                    searchQuery = parsedQs.searchQuery as string
                }
                console.log('parsedQs =>'+parsedQs)
            }
        } catch (e: any) {
            
        }
        const queryParams = {
            page, clientIds, accountIds, locationIds, tagTypes, searchQuery
        }

        console.log('urlSearchString =>'+urlSearchString)
        console.log('queryParams =>'+JSON.stringify(queryParams))
        console.log("+++++++++")
        return queryParams
    }

    public static getQueryString(newQueryParams: IQueryParams|null|undefined): string {
        if(!newQueryParams) return ''
        let newQS = queryString.stringify({page: newQueryParams.page,
            clientIds: newQueryParams.clientIds,
            accountIds: newQueryParams.accountIds,
            locationIds: newQueryParams.locationIds,
            tagTypes: newQueryParams.tagTypes,
            searchQuery: newQueryParams.searchQuery}, {arrayFormat: 'index'});
        if(TextUtils.isEmpty(newQueryParams.searchQuery)) {
            newQS = queryString.stringify({page: newQueryParams.page,
                clientIds: newQueryParams.clientIds,
                accountIds: newQueryParams.accountIds,
                locationIds: newQueryParams.locationIds,
                tagTypes: newQueryParams.tagTypes}, {arrayFormat: 'index'});
        }
        

        if(newQS && !TextUtils.isEmpty(newQS)) {
            newQS = '?'+newQS
        } else {
            newQS = ''
        }
        console.log('getQueryString :'+newQS)
        return newQS
    }
}