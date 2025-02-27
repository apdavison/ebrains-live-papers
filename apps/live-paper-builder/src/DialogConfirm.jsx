import React from "react";
import { withStyles } from "@mui/styles";
import Dialog from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import { InvertedButton, StandardButton } from "./Buttons";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon style={{ color: "#000000" }} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default class DialogConfirm extends React.Component {
  render() {
    return (
      <div>
        <Dialog
          onClose={() => this.props.handleClose(false)}
          aria-labelledby="customized-dialog-title"
          open={this.props.open}
          fullWidth={true}
          maxWidth={this.props.size || "md"}
          disableEscapeKeyDown={true}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={() => this.props.handleClose(false)}
            style={{ backgroundColor: this.props.headerBgColor || "#00A595" }}
          >
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>{this.props.title}</span>
          </DialogTitle>
          <DialogContent dividers>
            {typeof this.props.content === "string" ? (
              <Typography gutterBottom>{parse(this.props.content)}</Typography>
            ) : (
              this.props.content
            )}
          </DialogContent>
          <DialogActions>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "20px",
                paddingBottom: "20px",
                width: "100%",
              }}
            >
              <InvertedButton
                backgroundColor="#8b0d0d"
                onClick={() => this.props.handleClose(false)}
                label="Cancel"
              />
              <br />
              <br />
              {this.props.clickHelp && (
                <>
                  <InvertedButton
                    backgroundColor="#525252"
                    onClick={this.props.clickHelp}
                    label="Help"
                  />
                  <br />
                  <br />
                </>
              )}
              {this.props.bulkEntry && (
                <>
                  <Link
                    to={{
                      pathname: window.location.pathname + "BulkEntryWizard",
                      hash: this.props.bulkEntry,
                    }}
                    target="_blank"
                  >
                    <StandardButton
                      backgroundColor="#FF9800"
                      onClick={null}
                      label="Input Tool"
                    />
                  </Link>
                  <br />
                  <br />
                </>
              )}
              <StandardButton
                backgroundColor="#4DC26D"
                onClick={() => this.props.handleClose(true)}
                label="Proceed"
              />
            </div>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
