import React from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import axios from "axios";
import ContextMain from "./ContextMain";
import LoadingIndicatorModal from "./LoadingIndicatorModal";
import ErrorDialog from "./ErrorDialog";
import { InvertedButton, StandardButton } from "./Buttons";
import MaterialTable, { MTableToolbar } from "@material-table/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { baseUrl } from "./globals";

// define the columns for the material data table
const TABLE_COLUMNS = [
  {
    title: "Live Paper Title",
    field: "live_paper_title",
  },
  {
    title: "Collab",
    field: "collab_id",
    width: "250",
  },
  {
    title: "Modified",
    field: "modified_date",
    type: "date",
    defaultSort: "desc",
    width: "100px",
  },
];

const theme = createTheme({
  overrides: {
    MuiTypography: {
      h6: {
        fontWeight: "bolder !important",
        color: "#000000",
      },
      //},
      // MuiTableRow: {
      //   hover: {
      //     "&:hover": {
      //       backgroundColor: "#FFECB3 !important",
      //     },
      //   },
      //},
    },
  },
});

export default class LoadKGProjects extends React.Component {
  signal = axios.CancelToken.source();
  static contextType = ContextMain;

  constructor(props, context) {
    super(props, context);

    this.state = {
      error: null,
      loading: false,
      selectedRow: null,
    };

    // const [authContext,] = this.context.auth;

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelectProject = this.handleSelectProject.bind(this);
    this.checkRequirements = this.checkRequirements.bind(this);
    this.handleErrorDialogClose = this.handleErrorDialogClose.bind(this);
  }

  handleCancel() {
    this.props.onClose(false);
  }

  checkRequirements(data) {
    let error = null;
    // a collab must be specified
    if (!data.collab_id) {
      error = "A Collab must be specified!";
    }

    if (error) {
      console.log(error);
      this.setState({
        error: error,
      });
      return false;
    } else {
      return true;
    }
  }

  handleErrorDialogClose() {
    this.setState({ error: false });
  }

  handleSelectProject() {
    this.setState({ loading: true }, () => {
      let url = baseUrl + "/livepapers/" + this.state.selectedRow;
      let config = {
        cancelToken: this.signal.token,
        headers: {
          Authorization: "Bearer " + this.context.auth[0].token,
        },
      };
      axios
        .get(url, config)
        .then((res) => {
          console.log(res.data);
          this.setState({
            error: null,
            loading: false,
          });
          this.props.onClose(res.data);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log("error: ", err.message);
          } else {
            // Something went wrong. Save the error in state and re-render.
            let error_message = "";
            try {
              error_message = err.response.data.detail;
            } catch {
              error_message = err;
            }
            this.setState({
              error: error_message,
            });
          }
          this.setState({
            loading: false,
          });
        });
    });
  }

  render() {
    // console.log(this.state);
    if (this.state.error) {
      console.log(this.state.error);
      console.log(typeof this.state.error);
      console.log(JSON.stringify(this.state.error, null, 4));
      return (
        <ErrorDialog
          open={Boolean(this.state.error)}
          handleErrorDialogClose={this.handleErrorDialogClose}
          error={
            Array.isArray(this.state.error)
              ? this.state.error[0].msg
              : this.state.error.message || this.state.error
          }
        />
      );
    } else {
      return (
        <Dialog
          onClose={this.handleCancel}
          aria-labelledby="simple-dialog-title"
          open={this.props.open}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle style={{ backgroundColor: "#00A595" }}>
            <span style={{ fontWeight: "bolder", fontSize: 18 }}>
              Load Live Paper Project From EBRAINS Knowledge Graph
            </span>
          </DialogTitle>
          <DialogContent>
            <LoadingIndicatorModal open={this.state.loading} />
            <Box my={2}>
              To have edit permissions on a live paper, you must be a member of the live paper's host Collab.
              You currrently have permissions to edit the below listed live paper projects on the Knowledge
              Graph.
            </Box>
            <Box my={2}>
              <ThemeProvider theme={theme}>
                <MaterialTable
                  title="Live Paper Projects"
                  data={this.props.kg_project_list}
                  columns={TABLE_COLUMNS}
                  onRowClick={(evt, selectedRow) => this.setState({ selectedRow: selectedRow.tableData.id })}
                  options={{
                    search: true,
                    paging: false,
                    filtering: false,
                    exportButton: false,
                    maxBodyHeight: "60vh",
                    headerStyle: {
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#EEEEEE",
                      color: "#000",
                      fontWeight: "bolder",
                      fontSize: 16,
                    },
                    rowStyle: (rowData) => ({
                      backgroundColor: this.state.selectedRow === rowData.tableData.id ? "#FFD180" : "#EFF7E5",
                    }),
                  }}
                  components={{
                    Toolbar: (props) => (
                      <div
                        style={{
                          backgroundColor: "#13AC8B",
                        }}
                      >
                        <MTableToolbar {...props} />
                      </div>
                    ),
                  }}
                />
              </ThemeProvider>
            </Box>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                paddingLeft: "2.5%",
                paddingRight: "2.5%",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
            >
              <InvertedButton
                backgroundColor="#525252"
                onClick={this.handleCancel}
                label="Cancel"
              />
              <br />
              <br />
              <StandardButton
                backgroundColor={this.state.selectedRow ? "#4DC26D" : "#FFFFFF"}
                onClick={this.handleSelectProject}
                disabled={!this.state.selectedRow}
                label="Load Project"
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    }
  }
}

LoadKGProjects.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
