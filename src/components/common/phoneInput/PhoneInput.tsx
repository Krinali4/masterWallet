import React from "react"
import { useState } from "react";
import { TextField,Typography, Box } from "@mui/material"; 
import "./PhoneInput.scss";
import CustomDropDown from "../customDropDown/CustomDropDown";
import CountryCodeList from '../../../core/models/CountryCodeList';
 
export const PhoneInput = (props: any) => {
  const countryCodeList: CountryCodeList = new CountryCodeList()
  const { isEditable = true } = props
  return (
    <Box className="PhoneInput">
    {props?.inputLabel && (
      <Typography
        sx={{
          fontFamily: "Montserrat",
          fontStyle: "normal",
          fontWeight: "600",
          fontSize: "18px",
          lineHeight: "37px",
          color: "#171B1E",
          marginBottom:"18px",
        }}
      >
        {props?.inputLabel}
        {props?.required && <span style={{ color: "#EE4444" }}>{"  "}*</span>}
      </Typography>
    )}
    <TextField
      variant="standard" 
      className="inputField" {...props}
      hiddenLabel
      inputProps={{
        inputMode: "numeric",
        maxLength: 10
      }}
      sx={{
        background: '#EEEEEE',
        borderRadius: '50px',
        width: '100%',
        fontSize: "20px"
      }}
    />
    <CustomDropDown 
      data={countryCodeList.dropDownItems} 
      value={props.code}
      disabled={!isEditable}
      onChange={(e:any)=>{props.setCode(e.target.value)}} />
    </Box>

  );
};
