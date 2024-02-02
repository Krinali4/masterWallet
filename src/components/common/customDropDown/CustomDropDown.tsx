import * as React from "react";
import {Typography, Box, MenuItem, FormControl, Select} from "@mui/material";
import "./DropDown.scss";
import DropdownItem from "../../../core/models/DropdownItem";
interface IProps {
    data: DropdownItem[]
    heading?: string|undefined
    placeholder?: string
    value: any
    disabled?: boolean
    onChange(value: any): void
}


export default function CustomDropDown(props: IProps) {

    const {
        data, heading = undefined, placeholder = '', value, disabled = false, onChange
    } = props

    return (
        <>
            {heading && <Typography
                sx={{
                    fontWeight: '600',
                    fontSize: "18px",
                    color: "#171B1E",
                    lineHeight: "37px",
                    marginBottom:"18px"
                }}
            >
                {heading}<span style={{ color: "#EE4444" }}>*</span>
            </Typography>}

            <Box>
                <FormControl className="selectDropdown">
                    <Select
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        displayEmpty
                        renderValue={value !== "" ? undefined : () => placeholder}
                    >
                        <MenuItem disabled value="">
                            <em style={{color:"#00000080"}}>{placeholder}</em>
                        </MenuItem>
                        {data.map((item: DropdownItem, index: number) => {
                            return (
                                <MenuItem key={`menu_item_${index.toString()}`} value={item.id}>{item.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </Box>

        </>
    );
}
