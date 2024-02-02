import User, { AccountType, UserRole } from "./User"
import AppRoutes from "../../routes"

export enum MenuItem {
  HOME = "Home",
  TAGS = "Track and Trace",
  UPLOADS = "Uploads",
  CLIENTS = "Clients",
  ACCOUNTS = "Accounts",
  LOCATIONS = "Locations",
  USERS = "Users",
  REPORTS = "Reports",
  MATERIALS = "Materials",
  SETTINGS = "Settings",
}

export const getMenuItemsByRole = (user: User) => {
  let arrItems: MenuItem[] = []

  if (!user) {
    return arrItems
  }

  if (user.isSuperAdminRole()) {
    arrItems = [
      MenuItem.HOME,
      MenuItem.TAGS,
      MenuItem.UPLOADS,
      MenuItem.SETTINGS
    ]
  } else if (user.isSuperAdminUserRole()) {
    arrItems = [
      MenuItem.HOME,
      MenuItem.TAGS,
      MenuItem.UPLOADS,
      MenuItem.SETTINGS
    ]
  } else if (user.isPartnerAdminRole()) {
    arrItems = [
      MenuItem.HOME,
      MenuItem.ACCOUNTS,
      MenuItem.LOCATIONS,
      MenuItem.USERS,
    ]
  } else if (user.isPartnerUserRole()) {
    arrItems = [MenuItem.HOME, MenuItem.ACCOUNTS, MenuItem.LOCATIONS]
  } else if (user.isAccountAdminRole()) {
    arrItems = [MenuItem.HOME, MenuItem.LOCATIONS, MenuItem.USERS]
  } else if (user.isAccountUserRole()) {
    arrItems = [MenuItem.HOME, MenuItem.LOCATIONS]
  }
  return arrItems
}

export const getSettingsMenuItemsByRole = (user: User) => {
  let arrItems: MenuItem[] = []

  if (!user) {
    return arrItems
  }

  if (user.isSuperAdminRole()) {
    arrItems = [
      MenuItem.CLIENTS,
      MenuItem.ACCOUNTS,
      MenuItem.LOCATIONS,
      MenuItem.USERS,
      MenuItem.MATERIALS
    ]
  } else if (user.isSuperAdminUserRole()) {
    arrItems = [
      MenuItem.CLIENTS,
      MenuItem.ACCOUNTS,
      MenuItem.LOCATIONS,
      MenuItem.MATERIALS
    ]
  }
  return arrItems
}

export const getCurrentMenuItemsByRole = (pathName: string, user: User) => {
  let path = ""
  const match = AppRoutes.matchedRoutes(pathName)
  if (match) {
    let route = match[0]
    path = route.route.path
  }

  if (
    path === AppRoutes.REPORTS ||
    path === AppRoutes.REPORT_DETAILS ||
    path === AppRoutes.NEW_REPORT ||
    path === AppRoutes.REPORT_PUBLISH ||
    path === AppRoutes.REPORT_PUBLISHED
  ) {
    if (
      user &&
      (user.accountType === AccountType.PARTNER ||
        user.accountType === AccountType.ACCOUNT) &&
      (user.userRole === UserRole.SUPER_ADMIN ||
        user.userRole === UserRole.ADMIN ||
        user.userRole === UserRole.USER)
    ) {
      return MenuItem.HOME
    }
    return MenuItem.HOME
  }

  if (path === AppRoutes.TAGS || path === AppRoutes.TAG_DETAILS) {
    return MenuItem.TAGS
  }

  if (
    path === AppRoutes.UPLOADED_REPORTS ||
    path === AppRoutes.UPLOAD_DATA ||
    path === AppRoutes.UPLOADED_DATA_REVIEW ||
    path === AppRoutes.UPLOAD_COMPLETED
  ) {
    return MenuItem.UPLOADS
  }

  if (
    path === AppRoutes.PARTNERS ||
    path === AppRoutes.PARTNER_DETAILS ||
    path === AppRoutes.NEW_PARTNER
  ) {
    return MenuItem.CLIENTS
  }

  if (
    path === AppRoutes.ACCOUNTS ||
    path === AppRoutes.ACCOUNT_DETAILS ||
    path === AppRoutes.NEW_ACCOUNT
  ) {
    return MenuItem.ACCOUNTS
  }

  if (
    path === AppRoutes.LOCATIONS ||
    path === AppRoutes.LOCATION_DETAILS ||
    path === AppRoutes.NEW_LOCATION
  ) {
    return MenuItem.LOCATIONS
  }

  if (
    path === AppRoutes.USERS ||
    path === AppRoutes.USER_DETAILS ||
    path === AppRoutes.NEW_USER
  ) {
    return MenuItem.USERS
  }

  if (
    path === AppRoutes.MATERIALS ||
    path === AppRoutes.MATERIAL_DETAILS ||
    path === AppRoutes.NEW_MATERIAL ||
    path === AppRoutes.MATERIAL_TYPES
  ) {
    return MenuItem.MATERIALS
  }

}
