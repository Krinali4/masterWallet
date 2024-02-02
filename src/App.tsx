import { useEffect, useState } from "react"
import "./App.scss"
import { ThemeProvider } from "@mui/material/styles"
import SessionManager from "./core/utils/SessionManager"
import { Route, Routes } from "react-router-dom"
import AppRoutes from './routes';
import theme from "./theme"
import Header from "./components/common/header/Header"
import { Box } from "@mui/material"
import Footer from "./components/common/footer/Footer"
import withRouter from "./withRouter"
import { NavigationProps, NavigationState } from "./navigation/Navigation.types"
import Protected from "./Protected"
import { ApiError } from "./core/webservice/ApiError"
import LandingComponent from "./components/landing/LandingComponent"
import MessageNotifier from "./components/common/customeToast/MessageNotifier"
import PageNotFound from "./components/notfound/PageNotFound"
import Login from "./components/login/Login"
import Otp from "./components/otp/Otp"
import UploadedReports from "./components/uploadedReports/UploadedReports"
import UploadReport from "./components/uploadedReports/add/UploadReport"
import UploadedDataReview from "./components/uploadedReports/add/review/UploadedDataReview"
import UploadedSuccess from "./components/uploadedReports/add/completed/UploadedSuccess"
import Tags from "./components/tags/Tags"
import ViewTag from "./components/tags/view/ViewTag"
import Reports from "./components/reports/Reports"
import ViewReport from "./components/reports/view/ViewReport"
import NewReport from "./components/reports/add/NewReport"
import ReportPublished from "./components/reports/success/ReportPublished"
import Partners from "./components/partners/Partners"
import NewPartner from "./components/partners/add/NewPartner"
import Accounts from "./components/accounts/Accounts"
import NewAccount from "./components/accounts/add/NewAccount"
import Users from "./components/users/Users"
import NewUser from "./components/users/add/NewUser"
import Locations from "./components/locations/Locations"
import NewLocation from "./components/locations/add/NewLocation"
import Materials from "./components/materials/Materials"
import NewMaterial from "./components/materials/add/NewMaterial"
import MaterialTypesListComp from "./components/materialTypes/MaterialTypesListComp"
interface IProps {
  router: NavigationProps
  states: NavigationState
}

function App(props: IProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    SessionManager.shared().isTokenAvailable()
  )
  const [isInitialDataLoaded, setInitialDataLoadedFlag] = useState(false)
  const path = props.router.location.pathname

  const checkUserToken = () => {
    setIsLoggedIn(SessionManager.shared().isTokenAvailable())
  }

  useEffect((): void => {
    setIsLoggedIn(SessionManager.shared().isTokenAvailable())
  }, [])

  useEffect(() => {
    checkUserToken()
  }, [isLoggedIn])

  const handleInitailDataLoadSuccess = () => {
    setIsLoggedIn(SessionManager.shared().isTokenAvailable() ? true : false)
    setInitialDataLoadedFlag(true)
  }

  const handleInitailDataLoadFailure = (apiError: ApiError) => {}

  const handleOnLoginSuccess = () => {
    setIsLoggedIn(SessionManager.shared().isTokenAvailable() ? true : false)
  }

  const handleOnLogoutSuccess = () => {
    setIsLoggedIn(SessionManager.shared().isTokenAvailable() ? true : false)
  }

  const authRoutes = () => {
    return (
      <Routes>
        <Route path={AppRoutes.ROOT} element={<Login />} />
        <Route path={AppRoutes.OTP} element={<Otp onLoginSuccess={handleOnLoginSuccess}/>} />
        {/* Page not found in case of 404 */}
        <Route
            path="*"
            element={
              <PageNotFound />
            }
          />
      </Routes>
    )
  }

  const unknownRoute = () => {
    return(
      <Routes>
        <Route
              path="*"
              element={
                <PageNotFound />
              }
            />
      </Routes>
    )
  }

  const protectedRoutes = () => {
    return (
      <>
        <Header router={props.router} onLogoutSuccess={handleOnLogoutSuccess}/>
        <Box
          className="contentWarpper"
          sx={{
            minHeight: "calc(100vh - 196px)",
            background: "#F5F5F5",
            padding: "30px 51px 50px 51px",
            margin:"0 auto",
            maxWidth:"1920px",
            width:"100%",
          }}
        >
          <Routes>
            {/* Home For Admin */}
            <Route
              path={AppRoutes.UPLOADED_REPORTS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <UploadedReports />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.UPLOAD_DATA}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <UploadReport />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.UPLOADED_DATA_REVIEW}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <UploadedDataReview />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.UPLOAD_COMPLETED}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <UploadedSuccess />
                </Protected>
              }
            />

            {/* Clients */}
            <Route
              path={AppRoutes.PARTNERS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Partners />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.PARTNER_DETAILS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewPartner />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.NEW_PARTNER}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewPartner />
                </Protected>
              }
            />

            {/* Accounts */}
            <Route
              path={AppRoutes.ACCOUNTS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Accounts />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.ACCOUNT_DETAILS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewAccount />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.NEW_ACCOUNT}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewAccount />
                </Protected>
              }
            />

            {/* Locations */}
            <Route
              path={AppRoutes.LOCATIONS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Locations />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.NEW_LOCATION}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewLocation />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.LOCATION_DETAILS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewLocation />
                </Protected>
              }
            />

            {/* Users */}
            <Route
              path={AppRoutes.USERS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Users />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.NEW_USER}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewUser />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.USER_DETAILS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewUser />
                </Protected>
              }
            />

            {/* Report paths */}
            <Route
              path={AppRoutes.REPORTS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Reports />
                </Protected>
              }
            />

            <Route
              path={AppRoutes.REPORT_DETAILS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <ViewReport />
                </Protected>
              }
            />

            <Route
              path={AppRoutes.NEW_REPORT}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewReport />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.REPORT_PUBLISH}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <ViewReport />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.REPORT_PUBLISHED}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <ReportPublished />
                </Protected>
              }
            />

            {/* Materials */}
            <Route
              path={AppRoutes.MATERIALS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Materials />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.NEW_MATERIAL}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewMaterial />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.MATERIAL_DETAILS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <NewMaterial />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.MATERIAL_TYPES}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <MaterialTypesListComp />
                </Protected>
              }
            />

            {/* Track & Trace */}
            <Route
              path={AppRoutes.TAGS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <Tags />
                </Protected>
              }
            />
            <Route
              path={AppRoutes.TAG_DETAILS}
              element={
                <Protected isLoggedIn={isLoggedIn}>
                  <ViewTag />
                </Protected>
              }
            />
          </Routes>
        </Box>
        <Footer />
      </>
    )
  }

  const renderRoutes = () => {
    const isRouteValid = AppRoutes.isRouteMatched(props.router.location)
    if(!isRouteValid) {
      return unknownRoute()
    }
    return path === AppRoutes.ROOT || path === AppRoutes.OTP
      ? authRoutes()
      : protectedRoutes()
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        {isInitialDataLoaded ? (
          renderRoutes()
        ) : (
          <LandingComponent
            onInitailDataLoadSuccess={handleInitailDataLoadSuccess}
            onInitailDataLoadingFailure={handleInitailDataLoadFailure}
          />
        )}
        <MessageNotifier />
      </ThemeProvider>
    </div>
  )
}

export default withRouter(App)
