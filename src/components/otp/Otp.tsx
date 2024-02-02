import { Box, Typography, Stack, Link, Grid } from "@mui/material"

import {
  NavigationProps,
  NavigationState,
} from "../../navigation/Navigation.types"
import withRouter from "../../withRouter"
import "./Otp.scss"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import logo from "../../statics/svgs/rewastelogo.svg"
import otpBg from "../../statics/svgs/otpBg.svg"
import loginRightICON from "../../statics/svgs/login_icon_right.svg"
import loginFooterLeftIcon from "../../statics/svgs/loginFooter_icon_left.svg"
import { PrimaryBtn } from "../common/button/PrimaryBtn"
import OtpInput from "react-otp-input"
import { useEffect, useState, useCallback } from "react"
import Strings from "../../core/utils/Strings"
import Navigation from '../../navigation/Navigation';
import User from '../../core/models/User';
import AuthService from "../../services/AuthService"
import { ApiError } from '../../core/webservice/ApiError';
import { showApiErrorMessage } from '../common/customeToast/MessageNotifier';

const theme = createTheme()
interface IProps {
  router: NavigationProps
  states: NavigationState
  onLoginSuccess(): void
}
function Otp(props: IProps) {

  let pIsOtpGenerated = false
  if(props.router.location.state && props.router.location.state.Email) {
    pIsOtpGenerated = true
  }

  const [isOtpGenerated, setIsOtpGenerated] = useState<boolean>(pIsOtpGenerated)
  const [loading, setLoading] = useState<boolean>(false)
  const [isResendCodeLoading, setResendCodeLoading] = useState<boolean>(false)
  const [OTP, setOTP] = useState<string>("")
  const [wrongOtp, setWrongOtp] = useState<boolean>(false)
  const [resendOtp, setResendOtp] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState(undefined)

  const moveCursorAtFirst = () => {
    document.getElementsByTagName("input")[0].focus()
  }

  const keyDownHandler = useCallback((event : any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      verifyOTP(event)
    }
  },[OTP]);

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      console.log('keydown removeEventListener')
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [keyDownHandler])

  useEffect(() => {
    if(!isOtpGenerated) {
      Navigation.toLogin(props.router)
      return;
    }
    moveCursorAtFirst()
  }, [])

  const ResendCodeBtn = (e: any): void => {
    setErrorMessage(undefined)
    setWrongOtp(false)
    setResendOtp(false)
    if(isResendCodeLoading) return;
    setResendCodeLoading(true)
    const email = props.router.location.state.Email
    AuthService.sendAuthCodeByEmail(email)
    .then((isAuthCodeSent: boolean) => {
      setResendCodeLoading(false)
      if(isAuthCodeSent) {
        setResendOtp(true)
        setOTP("")
        document.getElementsByTagName("input")[0].focus()
      } else {
        // error
      }
    })
    .catch((apiError: ApiError) => {
      setResendCodeLoading(false)
      console.log(apiError.message)
    })
  }

  const verifyOTP = (e: any): void => {
    if(OTP.length !== 4) return
    setResendOtp(false)
    if(loading) return;
    setLoading(true);
    AuthService.verifyAuthCodeByEmail(props.router.location.state.Email, OTP)
      .then((user: User) => {
        props.onLoginSuccess()
        setWrongOtp(false);
        setErrorMessage(undefined);
        setLoading(false);
        setOTP("")
        Navigation.toHome(props.router)        
      })
      .catch((apiError: ApiError) => {
        setLoading(false);
        if(apiError.errorCode === 901) {
          Navigation.toLogin(props.router)
          setTimeout(() => {
            showApiErrorMessage(apiError)
          },250)
          return;
        }
        setWrongOtp(true);
        setErrorMessage((apiError.errorCode === 901) ? apiError.message : Strings.OTP_INCORRECT_CODE)
        setOTP("");
        moveCursorAtFirst();
        document.getElementsByTagName("input")[0].focus()
        console.log(apiError.message);
      });
  }

  if(!isOtpGenerated) return null;

  return (
    <Box
      className="wrapLayout"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 2 }}
            sx={{
              width: "60%",
              height: "100vh",
              backgroundColor: "#F6FFEE",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Stack
              direction={{ xs: "row", sm: "column" }}
              spacing={{ xs: 2, sm: 2 }}
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
                <img className="rewaste-bg-img" src={otpBg} alt="Rewaste background" />
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
                width: "80%!important",
                margin: "auto",
              }}
            >
              <Box sx={{ width: "100%!important" }}>
                <Box sx={{ marginTop: "50px", textAlign: "center" }}>
                  <Box className="emailverify">
                    <Typography
                      className="wrapOtplbl"
                      sx={{ textAlign: "center", fontSize: "36px" }}
                    >
                      Enter code sent to your email to
                      verify identity
                    </Typography>
                  </Box>

                  <Box sx={{maxWidth:"405px", width:"100%", margin:"0 auto"}}>
                    <Box className="otpBox">
                      <OtpInput
                        value={OTP}
                        numInputs={4}
                        className={wrongOtp ? "otpbdr" : "otpcls"}
                        onChange={(otp: any) => setOTP(otp)}
                        inputStyle={{
                          border: "0",
                          lineHeight: 2,
                          backgroundColor: "transparent",
                          width: 60,
                          height: 60,
                          color: "#FFF",
                          outline: "none",
                          fontSize: 20,
                        }}
                        isInputNum={true}
                      />
                    </Box>

                    <Box
                      sx={{
                        marginTop: 2.4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      className="errorMsg"
                      style={{ position: "relative", margin: "0px 0px 0px" }}
                    >
                      {resendOtp && (
                        <Typography
                          sx={{
                            color: "green",
                          }}
                        >
                          {Strings.OTP_CODE_RESENT}
                        </Typography>
                      )}
                      {(wrongOtp && errorMessage) && (
                        <Typography
                          sx={{
                            color: "red",
                          }}
                        >
                          {errorMessage}
                        </Typography>
                      )}
                    </Box>
                    <Box className="submit-container">
                      <PrimaryBtn
                        onClick={verifyOTP}
                        disabled={OTP.length !== 4}
                        loading={loading}
                        loadingText={'Verifying..'}
                        label="Submit"
                      />
                    </Box>
                    

                    <Box
                      className="wrap_resend"
                      sx={{
                        marginTop: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "red",
                        cursor: "pointer",
                      }}
                    >
                      <Typography>
                        <span style={{ color: "#171B1E" }}>
                          Didn’t receive the code?
                        </span>{" "}
                        <Link onClick={ResendCodeBtn} sx={{color: "#66A03B"}}>Resend Code</Link>
                        {/* <a style={{ color: "#66A03B" }} onClick={ResendCodeBtn}>
                          Resend Code
                        </a> */}
                      </Typography>
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

export default withRouter(Otp)
