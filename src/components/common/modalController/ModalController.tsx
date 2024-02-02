import {Box, Dialog, DialogActions, DialogContent} from "@mui/material"
import "./ModalController.scss"
import { PrimaryBtn } from "../button/PrimaryBtn"
import { InverseBtn } from "../button/InverseBtn"
import { DialogTitle } from "@mui/material"

interface Iprops {
  pShow: boolean
  children: any
  pTitle: string
  pYesButtonTitle: string
  pCancelButtonTitle: string
  pLoading: boolean
  pYesDisabled: boolean
  onYesClick(value: any): void
  onCancelClick(value: any): void
}

export default function ModalController(props: Iprops) {
  const { children, pYesDisabled = false } = props
  return (
    <Dialog open={props.pShow} className="modal-controller-container" aria-labelledby="alert-dialog-title">
      <Box className="modal-controller-content">
        <DialogTitle id="alert-dialog-title" className="model-title">{props.pTitle}</DialogTitle>
        <DialogContent sx={{
            marginTop: "20px",
          }}>{children}</DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "38px",
          }}
        >
          <PrimaryBtn
            buttonWidth="189px"
            label={props.pYesButtonTitle}
            onClick={props.onYesClick}
            loading={props.pLoading}
            disabled={pYesDisabled}
          />
          <InverseBtn
            buttonWidth="189px"
            label={props.pCancelButtonTitle}
            onClick={props.onCancelClick}
          />
        </DialogActions>
      </Box>
    </Dialog>
  )
}
