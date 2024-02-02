
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import DropDownData from "./DropDownData";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import "./FilterDropdown.scss";
interface Iprops {
    label?: string,
    buttonWidth?: string,
    data?: string[],
    onSelectedValue?: React.Dispatch<React.SetStateAction<string>>,
}

const FilterDropDown = (props: Iprops) => {
    const [dropdownActive, setDropdownActive] = useState(false);
    return (
        <DropDownData
            data={props.data}
            dropdownActive={dropdownActive}
            setDropdownActive={setDropdownActive}
            onSelectedValue={props.onSelectedValue}
        >
            <Box width={props?.buttonWidth} display="flex" >
                <Button
                    variant="contained"
                    className="InverseBtnDropDown"
                    {...props}
                    sx={{
                        fontSize: "16px",
                        color: "#4C7B29",
                        background: "#F5F5F5",
                        borderRadius: "50px",
                        textTransform: "capitalize",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        fontWeight: "600",
                        lineHeight: "20px",
                        boxShadow: "none",
                        '&:hover': {
                            backgroundColor: "#F5F5F5",
                            color: '#4C7B29',
                            boxShadow: "none",
                        },
                        '&:focus': {
                            backgroundColor: "#F5F5F5",
                            color: '#4C7B29',
                            boxShadow: "none",
                        }
                    }}
                >
                    <Box display="flex" justifyContent={"space-between"} width="100%">
                        <Typography display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            {props?.label}
                        </Typography>
                        <Box display="flex" justifyContent="center" alignContent="center" alignItems="center">
                            {dropdownActive ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </Box>
                    </Box>
                </Button>
            </Box>
        </DropDownData>
    )
}
export default FilterDropDown;