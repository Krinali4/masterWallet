import { TextField,Typography } from "@mui/material";
import "./inputField.scss";
import React from "react"
export const InputField = (props: any) => {
  return (
    <>
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
      variant="standard" className="inputField" {...props}
      hiddenLabel
      sx={{
        background: '#EEEEEE',
        borderRadius: '50px',
        width: '100%',
        fontSize: "20px"
      }}
    />
    </>

  );
};
