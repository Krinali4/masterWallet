import { Box, Typography, Stack, Grid } from "@mui/material"
import {
  NavigationProps,
  NavigationState,
} from "../../navigation/Navigation.types"
import withRouter from "../../withRouter"
import "./login.scss"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import logo from "../../statics/svgs/rewastelogo.svg"
import logoBgIMG from "../../statics/svgs/loginBg_img.svg"
import loginRightICON from "../../statics/svgs/login_icon_right.svg"
import loginFooterLeftIcon from "../../statics/svgs/loginFooter_icon_left.svg"
import { InputField } from "../common/inputfield/inputField"
import { PrimaryBtn } from "../common/button/PrimaryBtn"
import { useState, useEffect } from 'react';
import GeneralUtils from '../../core/utils/GeneralUtils';
import Navigation from '../../navigation/Navigation';
import AuthService from "../../services/AuthService"
import { ApiError } from "../../core/webservice/ApiError"
import SessionManager from '../../core/utils/SessionManager';
import { showErrorMessage } from "../common/customeToast/MessageNotifier"
import Strings from '../../core/utils/Strings';

const theme = createTheme()
interface IProps {
  router: NavigationProps
  states: NavigationState
}
function Login(props: IProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState<boolean>(false)

  function validateForm() {
    return email.length > 0 && GeneralUtils.isValidEmailId(email)
  }

  useEffect(() => {
    if(SessionManager.shared().isTokenAvailable()) {
      Navigation.toHome(props.router)
    }
  },[])

  const handleEmail = (e: any) => {
    let emailIDStr = e.target.value || ""
    setEmail(emailIDStr.toLowerCase())
  }

  const loginSubmit = (e: any): void => {
    e.preventDefault()
    if(loading) return;
    setLoading(true)
    AuthService.sendAuthCodeByEmail(email)
    .then((isAuthCodeSent: boolean) => {
      setLoading(false)
      if(isAuthCodeSent) {
        Navigation.toOtp(props.router,{Email:email});
      } else {
        // error
      }
    })
    .catch((apiError: ApiError) => {
      setLoading(false)
      console.log(apiError.message)
      showErrorMessage(apiError ? apiError.message : Strings.DEFAULT_ERROR_MSG)
    })
  }

  return (
    <Box className="wrapLayout">
      <ThemeProvider theme={theme}>
        <Grid container sx={{ height: "100vh" }}>
          <Stack sx={{ width: "60%" }}>
            <Stack
              direction={{ xs: "row", sm: "column" }}
              sx={{
                width: "100%",
                height: "100vh",
                backgroundColor: "#F6FFEE",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  flexDirection: "row",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <img
                    className="rewaste-logo"
                    src={logo}
                    alt="rewaste logo"
                  />
                </Box>

                <Box>
                  <img
                    className="rewaste-round-icon"
                    src={loginRightICON}
                    alt="rewaste round icon"
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <img className="rewaste-bg-img" src={logoBgIMG} alt="Rewaste background"/>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                  }}
                  className="wrapfootelbl-container"
                >
                  <Typography className="wrapfootelbl">
                    Track and trace your waste in an easy way
                  </Typography>
                </Box>

                <Box sx={{ width: "40%" }}>
                  <img
                    src={loginFooterLeftIcon}
                    className="rewaste-footer-left-icon"
                    alt="rewaste footer icon"
                  />
                </Box>
              </Box>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              width: "40%",
              height: "100vh",
              backgroundColor: "#FFF",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "70%!important",
                margin: "auto",
              }}
            >
              <Box sx={{ width: "100%!important" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography className="Loginheading">Welcome</Typography>
                </Box>
                <Box sx={{ marginTop: "50px" }}>
                  <Box>
                    <InputField
                      onChange={handleEmail}
                      inputLabel="Your Email Address"
                      placeholder="Enter Email"
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter" && validateForm()) {
                          loginSubmit(e)
                        }
                     }}
                    />
                    <Box marginTop={"30px"}>
                      <PrimaryBtn
                        loading={loading}
                        onClick={loginSubmit}
                        disabled={!validateForm()}
                        label="Sign in"
                      />
                    </Box>
                    <Box marginTop={"30px"}>
                      <Typography variant="h6" className="version-label">{GeneralUtils.getAppVersion()}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </ThemeProvider>
    </Box>
  )
}

export default withRouter(Login)
