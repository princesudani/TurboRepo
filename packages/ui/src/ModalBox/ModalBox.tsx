import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  DialogProps,
} from "@mui/material";

type ModalBoxProps = DialogProps & {
  title: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (index: number) => void;
  confirmText?: string;
  cancelText?: string;
  titleTextStyle?: React.CSSProperties;
  modalBoxStyle?: React.CSSProperties;
};

const ModalBox = ({
  title,
  open,
  onClose,
  onConfirm,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  titleTextStyle,
  modalBoxStyle,
  ...props
}: ModalBoxProps) => {
  return (
    <Dialog open={open} onClose={onClose} {...props} style={modalBoxStyle}>
      <DialogTitle style={titleTextStyle}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          sx={{
            flex: 1,
            margin: "0 5px",
            color: "red",
            fontWeight: "bold",
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => onConfirm(1)}
          variant="contained"
          color="primary"
          sx={{
            flex: 1,
            margin: "0 5px",
            backgroundColor: "green",
            fontWeight: "bold",
            ":hover": {
              backgroundColor: "darkgreen",
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalBox;
