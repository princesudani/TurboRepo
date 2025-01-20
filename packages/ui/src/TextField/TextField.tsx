import React from "react";
import {
  TextField as MuiTextField,
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material";

type TextFieldProps = MuiTextFieldProps & {
  errorMessage?: string;
};

const TextField = ({ label, errorMessage, ...props }: TextFieldProps) => {
  return (
    <MuiTextField
      label={label}
      error={!!errorMessage}
      helperText={errorMessage}
      fullWidth
      {...props}
    />
  );
};

export default TextField;
