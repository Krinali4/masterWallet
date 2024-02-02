import Navigation from "../../../navigation/Navigation";
import { NavigationProps, NavigationState } from "../../../navigation/Navigation.types";
import withRouter from "../../../withRouter";
import SucessLoading from "../../common/sucessLoading/SucessLoading";
interface IProps {
    router: NavigationProps
    states: NavigationState
}
function ReportPublished(props: IProps) {
    return (
        <SucessLoading pageHeading="Report Published" buttonLabel="View Reports"
            onClick={() => { Navigation.toReports({router:props.router,toBeReplaced:true}) }}
        />
    )
}
export default withRouter(ReportPublished);