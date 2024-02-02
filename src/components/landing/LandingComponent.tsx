import React from "react";
import {Box} from "@mui/material";
import { NavigationProps } from "../../navigation/Navigation.types";
import { ApiError } from "../../core/webservice/ApiError";
import withRouter from "../../withRouter";
import SessionManager from "../../core/utils/SessionManager";
import Loader from "../common/loader/Loader";
import AuthService from "../../services/AuthService";

interface LandingComponentProps {
  router: NavigationProps;
  onInitailDataLoadSuccess(): void;
  onInitailDataLoadingFailure(e: ApiError): void;
}

interface LandingComponentState {
  sLoadingError: boolean;
  sLoadingErrorTitle: string;
  sLoadingErrorMessage: string;
}

class LandingComponent extends React.Component<
  LandingComponentProps,
  LandingComponentState
> {
  constructor(props: LandingComponentProps) {
    super(props);
    this.state = {
      sLoadingError: false,
      sLoadingErrorTitle: "",
      sLoadingErrorMessage: "",
    };
  }

  componentDidMount() {
    if(SessionManager.shared().isTokenAvailable()) {
        // get user profile
        AuthService.getUserProfile()
        .then((result) => {
            this.props.onInitailDataLoadSuccess();
        })
        .catch((apiError: ApiError) => {
            this.handleApiFailure(apiError);
        })
    } else {
        // navigate to login/root.
        this.props.onInitailDataLoadSuccess();
        // setTimeout(() => {
        //     this.props.onInitailDataLoadSuccess();
        // }, 200)
    }
  }

  private handleApiFailure = (apiError: ApiError) => {
    this.setState({
      sLoadingError: true,
      sLoadingErrorMessage:
        apiError && apiError.message ? apiError.message : "",
    });
    this.props.onInitailDataLoadingFailure(apiError);
  };

  render() {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!this.state.sLoadingError && <Loader pshow={true} />}
      </Box>
    );
  }
}

export default withRouter(LandingComponent);