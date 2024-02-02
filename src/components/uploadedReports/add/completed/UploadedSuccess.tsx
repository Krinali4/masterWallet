import { NavigationProps, NavigationState } from "../../../../navigation/Navigation.types";
import withRouter from "../../../../withRouter";
import Navigation from "../../../../navigation/Navigation";
import SucessLoading from "../../../common/sucessLoading/SucessLoading";
interface IProps {
    router: NavigationProps
    states: NavigationState
}

function UploadedSuccess(props: IProps) {
    return (
        <SucessLoading pageHeading="Upload Completed" buttonLabel="View Reports"
            onClick={() => { Navigation.toReports({router:props.router,toBeReplaced:true}) }}
        />
    )
}
export default withRouter(UploadedSuccess);