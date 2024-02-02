import { NavigationParams, NavigationProps, NavigationState, ViewReportNavigationState } from "./Navigation.types";
import AppRoutes from '../routes';
import { MenuItem } from "../core/models/MenuItem";
import UserManager from "../core/utils/UserManager";
import { AccountType } from "../core/models/User";
import SessionManager from '../core/utils/SessionManager';
import { IUploadBatch } from '../core/models/UploadBatch';
import { IReportData } from '../core/models/ReportData';
import QueryParamUtils from '../core/utils/QueryParamUtils';

export default class Navigation {

  public static logOut(router: NavigationProps) {
    UserManager.shared().resetUser()
    SessionManager.shared().clearSession()
    const { navigate } = router;
    navigate(AppRoutes.ROOT, { replace: true });
  }

  public static forceLogout() {
    UserManager.shared().resetUser()
    SessionManager.shared().clearSession()
    window.location.reload();
  }

  /* navigate to Root or login */
  public static toLogin(router: NavigationProps) {
    const { navigate } = router;
    navigate(AppRoutes.ROOT, { replace: true });
  }

  /* navigate back to page */
  public static back(router: NavigationProps) {
    const { navigate } = router;
    navigate(-1);
  }

  public static refreshPage(router: NavigationProps) {
    const { navigate } = router;
    navigate(0);
  }

  /* navigate to otp page */
  public static toOtp(router: NavigationProps, params: any) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.OTP,
    },
      { state: params }
    );
  }

  /* navigate to home of admin/partner/account */
  public static toHome(router: NavigationProps) {
    this.toReports({router:router,toBeReplaced:true})
  }

  /* navigate to admin home */
  public static toMenuItem(router: NavigationProps, menuItem: MenuItem) {
    const user = UserManager.shared().user
    if (menuItem === MenuItem.HOME) {
      this.toReports({router:router,toBeReplaced:false})
    } else if (menuItem === MenuItem.TAGS) {
      this.toTags({router:router,toBeReplaced:false})
    } else if(menuItem === MenuItem.UPLOADS) {
      this.toUplodedReports({router, toBeReplaced:false})
    } else if (menuItem === MenuItem.CLIENTS) {
      this.toClients({router:router,toBeReplaced:false})
    } else if (menuItem === MenuItem.ACCOUNTS) {
      this.toAccounts({router:router,toBeReplaced:false})
    } else if (menuItem === MenuItem.LOCATIONS) {
      this.toLocations({router:router,toBeReplaced:false})
    } else if (menuItem === MenuItem.USERS) {
      this.toUsers({router:router,toBeReplaced:false})
    } else if (menuItem === MenuItem.REPORTS) {
      this.toReports({router:router,toBeReplaced:false})
    } else if (menuItem === MenuItem.MATERIALS) {
      this.toMaterials({router:router,toBeReplaced:false})
    }
  }


  // Uploaded-Reports
  /* navigate to uploaded-reports listing page*/
  public static toUplodedReports(params: NavigationParams) {
    const { navigate } = params.router;
    let qs = QueryParamUtils.getQueryString(params.queryParams)
    navigate(AppRoutes.UPLOADED_REPORTS+qs, { replace: params.toBeReplaced });
  }

  /* navigate to uploaded-reports add page*/
  public static toNewUploadReport(router: NavigationProps) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.UPLOAD_DATA,
    });
  }

  /* navigate to uploaded-reports review page*/
  public static toUploadedReportReview(router: NavigationProps, params: IUploadBatch) {
    const { navigate } = router;
    navigate(
      { pathname: AppRoutes.UPLOADED_DATA_REVIEW },
      { state: params }
    );
  }

  /* navigate to uploaded-reports complete page*/
  public static toUploadedReportComplete(router: NavigationProps) {
    const { navigate } = router;
    // navigate({
    //   pathname: AppRoutes.UPLOAD_COMPLETED,
    // });
    navigate(AppRoutes.UPLOAD_COMPLETED, { replace: true });
  }

  // Clients
  /* navigate to clients listing page*/
  public static toClients(params: NavigationParams) {
    const { navigate } = params.router;
    let qs = QueryParamUtils.getQueryString(params.queryParams)
    navigate(AppRoutes.PARTNERS+qs, { replace: params.toBeReplaced });
  }

  /* navigate to add-Client  page*/
  public static toAddClient(router: NavigationProps) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.NEW_PARTNER,
    });
  }
  /* navigate to View-Client  page*/
  public static toViewClient(router: NavigationProps, id: number) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.PARTNERS + "/" + id,
    });
  }

  // Accounts
  /* navigate to accounts listing page*/
  public static toAccounts(params: NavigationParams) {
    const { navigate } = params.router;
    let qs = QueryParamUtils.getQueryString(params.queryParams)
    navigate(AppRoutes.ACCOUNTS+qs, { replace: params.toBeReplaced });
  }

  /* navigate to add-Account  page*/
  public static toAddAccount(router: NavigationProps) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.NEW_ACCOUNT,
    });
  }
  /* navigate to View-Account  page*/
  public static toViewAccount(router: NavigationProps, id: number) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.ACCOUNTS + "/" + id,
    });
  }

  // Locations
  /* navigate to location listing page*/
  public static toLocations(params: NavigationParams) {
    const { navigate } = params.router;
    let qs = QueryParamUtils.getQueryString(params.queryParams)
    navigate(AppRoutes.LOCATIONS+qs, { replace: params.toBeReplaced });
  }

  /* navigate to view location page*/
  public static toViewLocation(router: NavigationProps, id: number) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.LOCATIONS + "/" + +id,
    });
  }

  /* navigate to add new location page*/
  public static toAddLocation(router: NavigationProps) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.NEW_LOCATION,
    });
  }

  // Users
  /* navigate to user listing page*/
  public static toUsers(params: NavigationParams) {
    const { navigate } = params.router;
    let qs = QueryParamUtils.getQueryString(params.queryParams)
    navigate(AppRoutes.USERS+qs, { replace: params.toBeReplaced });
  }

  /* navigate to add new user page*/
  public static toNewUser(router: NavigationProps) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.NEW_USER,
    });
  }

  /* navigate to view user page*/
  public static toViewUser(router: NavigationProps, id: number) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.USERS + "/" + id,
    });
  }


  //  Reports
  /* navigate to reports listing page*/
  public static toReports(params: NavigationParams) {
    const { navigate } = params.router;
    let qs = QueryParamUtils.getQueryString(params.queryParams)
    navigate(AppRoutes.REPORTS+qs, { replace: params.toBeReplaced });
  }

  /* navigate to add new report  page*/
  public static toAddReport(router: NavigationProps) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.NEW_REPORT,
    });
  }

  /* navigate to view report page*/
  public static toViewReport(router: NavigationProps, params: ViewReportNavigationState) {
    const { navigate } = router;
      navigate({
        pathname: AppRoutes.REPORTS + "/" + params.id,
      },
        { state: params }
      );
  }

  public static toPublishCurrentReportPage(router: NavigationProps, params: ViewReportNavigationState) {
    const { navigate } = router;
      navigate({
        pathname: AppRoutes.REPORT_PUBLISH,
      },
        { state: params }
      );
  }

  /* navigate to published report page*/
  public static topublishReport(router: NavigationProps) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.REPORT_PUBLISHED,
    });
  }

  //  Materials
  /* navigate to material listing page*/
  public static toMaterials(params: NavigationParams) {
    const { navigate } = params.router;
    let qs = QueryParamUtils.getQueryString(params.queryParams)
    navigate(AppRoutes.MATERIALS+qs, { replace: params.toBeReplaced });
  }

  /* navigate to add new material  page*/
  public static toAddNewMaterial(params: NavigationParams) {
    const { navigate } = params.router;
    navigate(AppRoutes.NEW_MATERIAL, { replace: params.toBeReplaced });
  }

  /* navigate to view material page*/
  public static toViewMaterial(router: NavigationProps, id: number) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.MATERIALS + "/" + id,
    });
  }

  // Track & Trace (Tags)
  /* navigate to track & trace listing page*/
  public static toTags(params: NavigationParams) {
    const { navigate } = params.router;
    let qs = QueryParamUtils.getQueryString(params.queryParams)
    navigate(AppRoutes.TAGS+qs, { replace: params.toBeReplaced });
  }

  /* navigate to view tag detail page*/
  public static toViewTag(router: NavigationProps, id: number) {
    const { navigate } = router;
    navigate({
      pathname: AppRoutes.TAGS + "/" + id,
    });
  }

  // Material Types
  /* navigate to material types listing page*/
  public static toMaterialTypes(params: NavigationParams) {
    const { navigate } = params.router;
    let qs = QueryParamUtils.getQueryString(params.queryParams)
    navigate(AppRoutes.MATERIAL_TYPES+qs, { replace: params.toBeReplaced });
  }



}
