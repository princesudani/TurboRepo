import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";

type CustomButtonProps = MuiButtonProps & {
  isLoading?: boolean; // Custom prop to show a loading state
};

export const Button = ({
  children,
  isLoading = false,
  disabled,
  ...props
}: CustomButtonProps) => {
  return (
    <MuiButton
      disabled={disabled || isLoading} // Disable the button if loading
      {...props} // Spread all additional props
    >
      {isLoading ? "Loading..." : children} {/* Show loading text if isLoading */}
    </MuiButton>
  );
};
