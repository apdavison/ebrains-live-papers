import React from "react";
import Grid from "@material-ui/core/Grid";
import MaterialIconSelector from "./MaterialIconSelector";
import HelpIcon from "@material-ui/icons/Help";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import ModalDialog from "./ModalDialog";

function HelpContentTraces() {
  return (
    <div>
      The traces data can be input in any one of the following formats:
      <br />
      <br />
      <h6>
        <b>One URL per line</b>
      </h6>
      You should enter a single URL per line. This format will automatically use
      the file names as labels for each entry.
      <i>Example:</i>
      <br />
      <code>
        https://www.datasource.com/traces/oh140807_A0_idB.abf
        https://www.datasource.com/traces/oh140807_A0_idC.abf
        https://www.datasource.com/traces/oh140807_A0_idF.abf
        https://www.datasource.com/traces/oh140807_A0_idG.abf
        https://www.datasource.com/traces/oh140807_A0_idH.abf
      </code>
      <br />
      <br />
      <h6>
        <b>List of URLs</b>
      </h6>
      This format will automatically use the file names as labels for each
      entry.
      <i>Example:</i>
      <br />
      <code>
        [ "https://www.datasource.com/traces/oh140807_A0_idB.abf",
        "https://www.datasource.com/traces/oh140807_A0_idC.abf",
        "https://www.datasource.com/traces/oh140807_A0_idF.abf",
        "https://www.datasource.com/traces/oh140807_A0_idG.abf",
        "https://www.datasource.com/traces/oh140807_A0_idH.abf", ]
      </code>
      <br />
      <br />
      <h6>
        <b>List of sub-lists with two elements</b>
      </h6>
      This format allows you to specify the labels for each entry. The first
      item in sub-list is the URL and the second item is the label.
      <i>Example:</i>
      <br />
      <code>
        {JSON.stringify([
          [
            "https://www.datasource.com/traces/oh140807_A0_idB.abf",
            "file_A",
          ],
          [
            "https://www.datasource.com/traces/oh140807_A0_idC.abf",
            "file_B",
          ],
          [
            "https://www.datasource.com/traces/oh140807_A0_idF.abf",
            "file_C",
          ],
          [
            "https://www.datasource.com/traces/oh140807_A0_idG.abf",
            "file_D",
          ],
          [
            "https://www.datasource.com/traces/oh140807_A0_idH.abf",
            "file_E",
          ],
        ])}
      </code>
      <br />
      <br />
      <h6>
        <b>List of dicts/objects</b>
      </h6>
      This format allows you to specify the labels for each entry. Each dict in
      the list should have keys named 'url' and 'label'.
      <i>Example:</i>
      <br />
      <code>
        {JSON.stringify([
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idB.abf",
            label: "file_A",
          },
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idC.abf",
            label: "file_B",
          },
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idF.abf",
            label: "file_C",
          },
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idG.abf",
            label: "file_D",
          },
          {
            url: "https://www.datasource.com/traces/oh140807_A0_idH.abf",
            label: "file_E",
          },
        ])}
      </code>
    </div>
  );
}

export default class SectionTraces extends React.Component {
  constructor(props) {
    super(props);

    if (!this.props.loadData) {
      this.state = {
        uuid: this.props.uuid ? this.props.uuid : null,
        type: "section_traces",
        title: "Recordings / Traces",
        icon: "timeline",
        description: "",
        data: "",
        dataOk: true,
        dataFormatted: [],
        showHelp: false,
      };
    } else {
      this.state = {
        ...props.data,
      };
    }

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.clickHelp = this.clickHelp.bind(this);
    this.handleHelpClose = this.handleHelpClose.bind(this);
    this.setIcon = this.setIcon.bind(this);
    this.handleDataInputOnBlur = this.handleDataInputOnBlur.bind(this);
  }

  componentDidMount() {
    this.props.storeSectionInfo(this.state);
  }

  handleFieldChange(event) {
    console.log(event);
    const target = event.target;
    let value = target.value;
    const name = target.name;
    // console.log(name + " => " + value);
    this.setState(
      {
        [name]: value,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  setIcon(icon_name) {
    this.setState(
      {
        icon: icon_name,
      },
      () => {
        this.props.storeSectionInfo(this.state);
      }
    );
  }

  clickHelp() {
    this.setState({
      showHelp: true,
    });
  }

  handleHelpClose() {
    this.setState({
      showHelp: false,
    });
  }

  handleDataInputOnBlur(event) {
    // check data input format
    console.log(event.target.value);

    function IsJsonString(str) {
      try {
        var json = JSON.parse(str);
        return typeof json === "object";
      } catch (e) {
        return false;
      }
    }

    if (IsJsonString(event.target.value)) {
      console.log("Input: JSON");
      // input is a JSON
      var data_json = JSON.parse(event.target.value);

      // check if it is a list of lists, or a list of dicts
      function checkIfArrayUrlLabel(item) {
        return (
          Array.isArray(item) &&
          item.length === 2 &&
          typeof item[0] === "string" &&
          typeof item[1] === "string"
        );
      }
      function checkIfArrayOnlyUrl(item) {
        return typeof item === "string";
      }
      function checkIfObject(item) {
        return (
          typeof item === "object" &&
          item !== null &&
          "url" in item &&
          "label" in item &&
          typeof item["url"] === "string" &&
          typeof item["label"] === "string"
        );
      }

      if (Array.isArray(data_json) && data_json.every(checkIfArrayUrlLabel)) {
        //   data is a list of lists with both url and label
        console.log("Input: JSON - list of lists - URL, label");
        let data_formatted = [];
        data_json.forEach(function (item) {
          data_formatted.push({
            url: item[0].trim(),
            label: item[1].trim(),
          });
        });
        this.setState(
          {
            dataFormatted: data_formatted,
            dataOk: true,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      } else if (
        Array.isArray(data_json) &&
        data_json.every(checkIfArrayOnlyUrl)
      ) {
        //   data is a list of lists with only url
        console.log("Input: JSON - list of lists - only URL");
        let data_formatted = [];
        data_json.forEach(function (item) {
          console.log(item);
          data_formatted.push({
            url: item.trim(),
            label: item.match(/([^/]+)(?=\.\w+$)/)[0].trim(),
          });
        });
        this.setState(
          {
            dataFormatted: data_formatted,
            dataOk: true,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      } else if (Array.isArray(data_json) && data_json.every(checkIfObject)) {
        // data is a list of dicts
        console.log("Input: JSON - list of dicts");
        this.setState(
          {
            dataFormatted: data_json,
            dataOk: true,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      } else {
        console.log("Input: JSON - invalid format");
        this.setState(
          {
            dataFormatted: [],
            dataOk: false,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      }
    } else {
      // input is just string
      // Aim: convert to list of dicts with keys "url" and "label"
      let data_formatted = [];
      // break string into lines
      try {
        var items = event.target.value.match(/[^\r\n]+/g);
        if (items) {
          items.forEach(function (item) {
            let part_url = item.split(",")[0];
            let part_label = item.split(",")[1];
            console.log(part_url, part_label);
            if (!part_label) {
              part_label = item.match(/([^/]+)(?=\.\w+$)/)[0];
            }
            console.log(part_url, part_label);
            data_formatted.push({
              url: part_url.trim(),
              label: part_label.trim(),
            });
          });
        }
        this.setState(
          {
            dataOk: true,
            dataFormatted: items ? data_formatted : [],
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      } catch (error) {
        console.error(error);
        this.setState(
          {
            dataFormatted: [],
            dataOk: false,
          },
          () => {
            this.props.storeSectionInfo(this.state);
          }
        );
      }
    }
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            paddingLeft: "2.5%",
            paddingRight: "2.5%",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderStyle: "solid",
            borderColor: "#194D1B",
            borderWidth: "2px",
            backgroundColor: "#C8E6C9",
            borderRadius: "20px",
            fontWeight: "bold",
            color: "#000000",
          }}
        >
          Section: Recordings / Traces
        </div>
        <br />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "50px" }}>
            <MaterialIconSelector
              size="35px"
              icon={this.state.icon}
              setIcon={this.setIcon}
            />
          </div>
          <div style={{ paddingLeft: "20px", flexGrow: 1 }}>
            <TextField
              label="Section Title"
              variant="outlined"
              fullWidth={true}
              name="title"
              value={this.state.title}
              onChange={this.handleFieldChange}
              InputProps={{
                style: {
                  padding: "5px 15px",
                },
              }}
            />
          </div>
          <div
            style={{
              width: "50px",
              paddingLeft: "20px",
              paddingTop: "10px",
              paddingBottom: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip title="Click for info on input format">
              <HelpIcon
                style={{ width: 30, height: 30 }}
                onClick={this.clickHelp}
              />
            </Tooltip>
          </div>
        </div>
        <br />

        <Grid item xs={12}>
          <TextField
            multiline
            rows="2"
            label="Description of electrophysiological traces (optional)"
            variant="outlined"
            fullWidth={true}
            helperText="The description may be formatted with Markdown"
            name="description"
            value={this.state.description}
            onChange={this.handleFieldChange}
            InputProps={{
              style: {
                padding: "15px 15px",
              },
            }}
          />
        </Grid>

        <br />

        <Grid item xs={12}>
          <TextField
            multiline
            rows="8"
            label="Input all electrophysiological traces (with labels optionally)"
            variant="outlined"
            fullWidth={true}
            helperText={
              this.state.dataOk
                ? "Click on ? icon for info on input format."
                : "Data not in expected format! Click on '?' for more info."
            }
            name="data"
            value={this.state.data}
            onChange={this.handleFieldChange}
            onBlur={this.handleDataInputOnBlur}
            error={!this.state.dataOk}
            InputProps={{
              style: {
                padding: "15px 15px",
              },
            }}
          />
        </Grid>
        <br />
        <br />
        {this.state.showHelp ? (
          <ModalDialog
            title="Electrophysiological Traces Input"
            open={this.state.showHelp}
            handleClose={this.handleHelpClose}
            content={<HelpContentTraces />}
          />
        ) : null}
      </div>
    );
  }
}