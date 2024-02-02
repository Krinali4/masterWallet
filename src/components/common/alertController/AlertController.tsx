
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import "./AlertController.scss";
import { PrimaryBtn } from '../button/PrimaryBtn';
import { InverseBtn } from '../button/InverseBtn';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

interface Iprops {
  pShow: boolean,
  pTitle: string,
  pYesButtonTitle: string,
  pCancelButtonTitle: string,
  pLoading: boolean,
  icon?:string,
  subHeading?:string,
  onYesClick(value: any): void
  onCancelClick(value: any): void   
}

export default function AlertPopup(props: Iprops) {

  return (
    <Dialog open={props.pShow} className="commonPermissionPopUp" >
      <Box className='dialogContent'>
        <DialogContent>
          {props.icon && <Box className="popUpImage"> 
            <img src={props.icon} alt="Alert icon" />
          </Box>}
          <DialogContentText>
            <Typography variant='h2'>
              {props.pTitle}
            </Typography>
            {props.subHeading && <Box className="popUpSubHeading"> 
              <Typography>
                {props.subHeading}
              </Typography>
            </Box>}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-between", marginTop: "38px" }}>
          <PrimaryBtn buttonWidth="189px" label={props.pYesButtonTitle} onClick={props.onYesClick} loading={props.pLoading} />
          <InverseBtn buttonWidth="189px" label={props.pCancelButtonTitle} onClick={props.onCancelClick} />
        </DialogActions>
      </Box>
    </Dialog>
  );
}