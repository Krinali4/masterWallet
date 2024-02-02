export default class Strings {
  
  /* Login screen */
  /* End Login screen */

  /* OTP screen */
  public static OTP_TITLE = "Verify Code"
  public static OTP_SUB_TITLE = "Enter the 4 digit verification code sent to your number"
  public static OTP_CODE_RESENT = "Code has been resent to your email"
  public static OTP_INCORRECT_CODE = "Incorrect/Expired Verification Code"
  public static MOBILE_USER_RESTRICTED_MESSAGE = "Email ID is not registered. Please contact us at info@rewaste.ca"
  /* End OTP screen */

  /* Clients screen */
  public static CLIENTS_LIST_HEADER_TITLE = 'All Clients'
  public static ADD_CLIENT_BTN_TITLE = 'Add Client +'
  /* End Clients screen */

  /* Add/Edit/View Client screen */
  public static NEW_CLIENT_HEADER_TITLE = 'Add New Client'
  public static EDIT_CLIENT_HEADER_TITLE = 'Edit Client'
  public static VIEW_CLIENT_HEADER_TITLE = 'View Client'
  /* End Add/Edit/View Client screen */

  /* Accounts screen */
  public static ACCOUNTS_LIST_HEADER_TITLE = 'All Accounts'
  public static ADD_ACCOUNT_BTN_TITLE = 'Add Account +'
  /* End Accounts screen */

  /* Add/Edit/View Account screen */
  public static NEW_ACCOUNT_HEADER_TITLE = 'Add New Account'
  public static EDIT_ACCOUNT_HEADER_TITLE = 'Edit Account'
  public static VIEW_ACCOUNT_HEADER_TITLE = 'View Account'
  /* End Add/Edit/View Account screen */

  /* Users screen */
  public static USERS_LIST_HEADER_TITLE = 'All Users'
  public static ADD_USER_BTN_TITLE = 'Add User +'
  /* End Users screen */

  /* Add/Edit/View User screen */
  public static NEW_USER_HEADER_TITLE = 'Add New User'
  public static EDIT_USER_HEADER_TITLE = 'Edit User'
  public static VIEW_USER_HEADER_TITLE = 'View User'
  /* End Add/Edit/View User screen */

  /* Locations screen */
  public static LOCATIONS_LIST_HEADER_TITLE = 'All Locations'
  public static ADD_LOCATION_BTN_TITLE = 'Add Location +'
  /* End Locations screen */

  /* Add/Edit/View Location screen */
  public static NEW_LOCATION_HEADER_TITLE = 'Add New Location'
  public static EDIT_LOCATION_HEADER_TITLE = 'Edit Location'
  public static VIEW_LOCATION_HEADER_TITLE = 'View Location'
  /* End Add/Edit/View Location screen */

    /* Reports screen */
    public static REPORTS_LIST_HEADER_TITLE = 'All Reports'
    public static ADD_REPORT_BTN_TITLE = 'Add Report +'
    public static NEW_REPORT_HEADER_TITLE ='Add New Report'
    /* End Reports screen */

    /* Tags screen */
    public static TAGS_LIST_HEADER_TITLE = 'All Tag IDs' 
    public static TBL_HEADER_TAG_ID = 'Tag ID' 
    public static TBL_HEADER_TAG_TYPE = 'Tag Type'
    public static TBL_HEADER_TOTAL_WEIGHT = 'Total Weight (in KG)'
    public static TBL_HEADER_LAST_SCANNED_ON = 'Last Scanned On' 
    public static TBL_HEADER_LAST_SCANNED_AT = 'Last Scanned At' 
    public static TBL_HEADER_STATUS = 'Status'  
    public static TBL_HEADER_SCAN_DATE_AND_TIME = 'Scan Date And Time' 
    public static TBL_HEADER_EVENT = 'Event' 
    public static TBL_HEADER_GEOLOCATION = 'Geolocation' 
    public static TBL_HEADER_USER_EMAIL = 'User Email' 
    public static VIEW_HEADER_TITLE = 'Scan History' 
    public static VIEW_TAG_ID = 'Tag ID:' 
    public static VIEW_TAG_TYPE = 'Tag Type:' 
    public static VIEW_TAG_TOTAL_WEIGHT = 'Total Weight:' 
    public static VIEW_TAG_ACCOUNT = 'Account:' 
    public static VIEW_TAG_MATERIAL_NAME = 'Material Name:' 
    public static VIEW_TAG_LINK_VIEW_DETAILS = 'View Details' 
    /* End Tags screen */

    public static TAG_HISTORY_HEADER_TITLE = 'Tag History' 

  /* Material screen */
  public static MATERIALS_LIST_HEADER_TITLE = 'All Materials'
  public static ADD_MATERIAL_BTN_TITLE = 'Add Material +'
  /* End Material screen */

  /* Add/Edit/View Account screen */
  public static NEW_MATERIAL_HEADER_TITLE = 'Add New Material'
  public static EDIT_MATERIAL_HEADER_TITLE = 'Edit Material'
  public static VIEW_MATERIAL_HEADER_TITLE = 'View Material'
  /* End Add/Edit/View Account screen */

  /* Table header/content titles */
  public static TBL_HEADER_CLIENT_NAME = 'Client Name'
  public static TBL_HEADER_NAME = 'Name'
  public static TBL_HEADER_EMAIL = 'Email'
  public static TBL_HEADER_MATERIAL_NAME = 'Material Name'
  public static TBL_HEADER_MATERIAL_DEFAULT_SCALE = 'Default Scale'
  public static TBL_HEADER_MATERIAL_TYPE = 'Type'
  public static TBL_HEADER_LOCATION_NAME = 'Location Name'
  public static TBL_HEADER_LOCATION_COUNTRY = 'Country'
  public static TBL_HEADER_LOCATION_ACCOUNT = 'Account'
  public static TBL_HEADER_ACCOUNT_TITLE = 'Account'
  public static TBL_HEADER_REPORTED_ON_TITLE = 'Reported On'
  public static TBL_HEADER_FILE_NAME = 'File Name'
  public static TBL_HEADER_DATE = 'Date'
  public static TBL_HEADER_UPLOADED_BY = 'Uploaded By'
  public static TBL_HEADER_STATUS_BY = 'Status'
  public static TBL_HEADER_ACTION = 'Action'
  public static TBL_VIEW_LINK_TITLE = 'View'
  public static TBL_REVOKE_ACCESS_LINK_TITLE = 'Revoke Access'
  public static TBL_GRANT_ACCESS_LINK_TITLE = 'Grant Access'
  public static TBL_DOWNLOAD_LINK_TITLE = 'Download'
  /* End Table header/content titles */

  /* Common */
  public static SAVE = "Save"
  public static UPDATE = "Update"
  public static CANCEL = "Cancel"
  public static PLEASE_WAIT = "Please wait "
  public static GENERATE_ROPORT = "Generate Report "


  /* Error messages */
  public static DEFAULT_ERROR_MSG = "Something went wrong, Please try again."
  public static NETWORK_ERROR =
    "Lost internet connection. Please check and try again."
  public static FIELD_IS_EMPTY = "Field is empty"
  public static UNAUTHORIZED_ERROR = "unauthorized"
  public static MISSING_CLIENT_ID_ERROR =
    "Please provide client_id and client_secret."
  public static BEARER_TOKEN_NOT_AVAILABLE_ERROR =
    "Please include valid access_token value in the Authorization header field as an HTTP bearer authorization scheme."
  public static MISSING_SEND_OTP_PARAMS_ERROR = "Please provide email."
  public static MISSING_VERIFY_OTP_PARAMS_ERROR =
    "Please provide email and otp."
  public static ALGOLIA_NOT_CONFIGURED_ERROR =
    "Please configure algoliaAppId and algoliaAppKey."
  public static INVALID_FILE_ERROR =
    "Invalid file extention found.Please select valid file."
  public static INVALID_UPLOAD_DATA_FILE_ERROR =
    "Invalid file extention found. Allowed file extensions(.xlsx, .xls, .csv)."
  public static PARTNER_ALREADY_CREATED_ERROR = "Partner already created."
  public static REQUEST_PARAMS_MISSING = "Request parameters missing."
  public static USER_NOT_EXISTS = "User doesn't exist in the system."
  public static NO_DATA_AVAILABLE = "No data available."

  public static NO_PARTNER_FOUND = "No client found with the provided Id."
  public static NO_ACCOUNT_FOUND = "No account found with the provided Id."
  public static NO_USER_FOUND = "No user found with the provided Id."

  private constructor() {}
}
