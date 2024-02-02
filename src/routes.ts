import { matchRoutes } from "react-router-dom"
export default class AppRoutes {
  public static readonly ROOT = "/"
  public static readonly OTP = "/otp"

  // Rewaste
  public static readonly UPLOADED_REPORTS = "/uploaded-reports"
  public static readonly UPLOAD_DATA = "/uploaded-reports/add"
  public static readonly UPLOADED_DATA_REVIEW = "/uploaded-reports/add/review"
  public static readonly UPLOAD_COMPLETED =
    "/uploaded-reports/add/review/completed"

  // Rewaste
  public static readonly PARTNERS = "/partners"
  public static readonly PARTNER_DETAILS = "/partners/:partnerId"
  public static readonly NEW_PARTNER = "/partners/add"

  // Rewaste, Waste Management
  public static readonly ACCOUNTS = "/accounts"
  public static readonly ACCOUNT_DETAILS = "/accounts/:accountId"
  public static readonly NEW_ACCOUNT = "/accounts/add"

  // Rewaste, Waste Management, IKEA
  public static readonly LOCATIONS = "/locations"
  public static readonly LOCATION_DETAILS = "/locations/:locationId"
  public static readonly NEW_LOCATION = "/locations/add"

  // Rewaste, Waste Management, IKEA
  public static readonly USERS = "/users"
  public static readonly USER_DETAILS = "/users/:userId"
  public static readonly NEW_USER = "/users/add"

  // Rewaste, Waste Management, IKEA
  public static readonly REPORTS = "/reports"
  public static readonly REPORT_DETAILS = "/reports/:reportId"
  public static readonly NEW_REPORT = "/reports/add"
  public static readonly REPORT_PUBLISH = "/reports/publish"
  public static readonly REPORT_PUBLISHED = "/reports/published"

  // Rewaste
  public static readonly MATERIALS = "/materials"
  public static readonly MATERIAL_DETAILS = "/materials/:materialId"
  public static readonly NEW_MATERIAL = "/materials/add"

  // Track and Trace
  public static readonly TAGS = "/tags"
  public static readonly TAG_DETAILS = "/tags/:tagId"

  // Material Types
  public static readonly MATERIAL_TYPES = "/materials/material-types"

  private constructor() {}

  private static routes: any[] = [
    {path: AppRoutes.ROOT, strict: true, exact: true},
    {path: AppRoutes.OTP, strict: true, exact: true},
    {path: AppRoutes.UPLOADED_REPORTS, strict: true, exact: true},
    {path: AppRoutes.UPLOAD_DATA, strict: true, exact: true},
    {path: AppRoutes.UPLOADED_DATA_REVIEW, strict: true, exact: true},
    {path: AppRoutes.UPLOAD_COMPLETED, strict: true, exact: true},
    {path: AppRoutes.PARTNERS, strict: true, exact: true},
    {path: AppRoutes.PARTNER_DETAILS, strict: true, exact: true},
    {path: AppRoutes.NEW_PARTNER, strict: true, exact: true},
    {path: AppRoutes.ACCOUNTS, strict: true, exact: true},
    {path: AppRoutes.ACCOUNT_DETAILS, strict: true, exact: true},
    {path: AppRoutes.NEW_ACCOUNT, strict: true, exact: true},
    {path: AppRoutes.LOCATIONS, strict: true, exact: true},
    {path: AppRoutes.LOCATION_DETAILS, strict: true, exact: true},
    {path: AppRoutes.NEW_LOCATION, strict: true, exact: true},
    {path: AppRoutes.USERS, strict: true, exact: true},
    {path: AppRoutes.USER_DETAILS, strict: true, exact: true},
    {path: AppRoutes.NEW_USER, strict: true, exact: true},
    {path: AppRoutes.REPORTS, strict: true, exact: true},
    {path: AppRoutes.REPORT_DETAILS, strict: true, exact: true},
    {path: AppRoutes.NEW_REPORT, strict: true, exact: true},
    {path: AppRoutes.REPORT_PUBLISH, strict: true, exact: true},
    {path: AppRoutes.REPORT_PUBLISHED, strict: true, exact: true},
    {path: AppRoutes.MATERIALS, strict: true, exact: true},
    {path: AppRoutes.MATERIAL_DETAILS, strict: true, exact: true},
    {path: AppRoutes.NEW_MATERIAL, strict: true, exact: true},
    {path: AppRoutes.TAGS, strict: true, exact: true},
    {path: AppRoutes.TAG_DETAILS, strict: true, exact: true},
    {path: AppRoutes.MATERIAL_TYPES, strict: true, exact: true}
  ]

  public static matchRoute(routes: any[], location: any) {
    const matchedRoutes = matchRoutes(routes, location.pathname)
    if (!Array.isArray(matchedRoutes) || matchedRoutes.length === 0) {
      return false
    }
    return true
  }

  public static isRouteMatched(location: any) {
    let isRouteValid = this.matchRoute(AppRoutes.routes,location)
    return isRouteValid
  }

  public static matchedRoutes(pathname: any) {
    const matchedRoutesItems = matchRoutes(AppRoutes.routes, pathname)
    if (!Array.isArray(matchedRoutesItems) || matchedRoutesItems.length === 0) {
      return undefined
    }
    return matchedRoutesItems;
  }
}
