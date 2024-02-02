import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";
import "./MessageNotifier.scss";
import { ApiError } from "../../../core/webservice/ApiError";
import Strings from '../../../core/utils/Strings';

let showMessageFn = (msg: string) => { };
let showErrorMessageFn = (msg: string) => { };
let hideMessageFn = () => { };

function MessageNotifier() {

    const [message, setMessage] = useState("");
    const [show, setShow] = useState(false);
    const [isError, setIsError] = useState(false);

    const hideMessage = () => {
        setMessage(undefined);
        setShow(false);
        setIsError(false);
    }

    const showMessage = (sMessage: string | undefined) => {
        setMessage(sMessage);
        setShow(true);
        setIsError(false);
    }

    const showErrorMessage = (sMessage: string | undefined) => {
        setMessage(sMessage);
        setShow(true);
        setIsError(true);
    }

    showMessageFn = showMessage;
    showErrorMessageFn = showErrorMessage;
    hideMessageFn = hideMessage;


    if (!show || !message) return null;
    return (

        <Snackbar
            open={show}
            autoHideDuration={5000}
            onClose={hideMessage}
            message={message}
            className={!isError ? "successBox" : "failedBox"}
        >
            <Alert onClose={hideMessage} severity={!isError ? "success" : "error"} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>



    )
}
export function showMessage(msg: string) {
    showMessageFn(msg);
};
export function showErrorMessage(msg: string) {
    showErrorMessageFn(msg);
};
export function showApiErrorMessage(apiError: ApiError) {
    showErrorMessageFn((apiError) ? apiError.message : Strings.DEFAULT_ERROR_MSG);
};
export function hideMessage() {
    hideMessageFn();
};
export default MessageNotifier;


