import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

type CustomButtonProps = MuiButtonProps & {
  isLoading?: boolean;
};

export const Button = ({
  children,
  isLoading = false,
  disabled,
  ...props
}: CustomButtonProps) => {
  return (
    <MuiButton disabled={disabled || isLoading} {...props}>
      {isLoading ? "Loading..." : children}
    </MuiButton>
  );
};
