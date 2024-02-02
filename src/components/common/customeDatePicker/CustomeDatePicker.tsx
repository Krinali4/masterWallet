import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Typography } from '@mui/material';
import "./CustomeDatePicker.scss";
import { Box } from '@mui/system';
export default function BasicDatePicker(props: any) {
    return (
        <>
            {props.heading && <Typography
                sx={{
                    fontWeight: 600,
                    fontSize: "18px",
                    color: "#171B1E",
                    marginBottom: "18px"
                }}
            >
                {props.heading}<span style={{ color: "#EE4444" }}>*</span>
            </Typography>}
            <Box className="customDatePicker">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        {...props}
                        renderInput={(params) => <TextField
                            {...params} />}
                    />
                </LocalizationProvider>
                {props.errorMsg && <Typography sx={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "red",
                    marginTop:"12px"
                }}>
                    {props.errorMsg}
                </Typography>}
            </Box>
        </>
    );
}