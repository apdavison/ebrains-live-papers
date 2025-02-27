import React from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from "@material-ui/icons/Cancel";
import ForwardIcon from "@material-ui/icons/Forward";
import Tooltip from "@material-ui/core/Tooltip";
import arrayMove from "array-move";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import StorageIcon from "@material-ui/icons/Storage";
import EditIcon from "@material-ui/icons/Edit";
import AspectRatioIcon from "@material-ui/icons/AspectRatio";
import PhotoSizeSelectSmallIcon from "@material-ui/icons/PhotoSizeSelectSmall";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { InvertedIconButton } from "./Buttons";

const resourseTypeBadgeMappings = {
  URL: ["", "Manual Entry"],
  ModelInstance: ["KG", "Knowledge Graph Entry"],
  Recording: ["KG", "Knowledge Graph Entry"],
  ModelDB: ["MDB", "ModelDB Entry"],
  OSB: ["OSB", "Open Source Brain Entry"],
  NeuroMorpho: ["NMO", "NeuroMorpho.Org Entry"],
  AllenBrain: ["AB", "Allen Brain Atlas Entry"],
  BioModels: ["BM", "BioModels Entry"],
};

const styles = () => ({
  customBadge_KG: {
    backgroundColor: "#388E3C",
    color: "white",
    fontSize: 10,
  },
  customBadge_MDB: {
    backgroundColor: "#F57C00",
    color: "white",
    fontSize: 10,
  },
  customBadge_OSB: {
    backgroundColor: "#03A9F4",
    color: "white",
    fontSize: 10,
  },
  customBadge_NMO: {
    backgroundColor: "#B7BF40",
    color: "white",
    fontSize: 10,
  },
  customBadge_AB: {
    backgroundColor: "#0A3474",
    color: "white",
    fontSize: 10,
  },
  customBadge_BM: {
    backgroundColor: "#194D44",
    color: "white",
    fontSize: 10,
  },
});

function setBadgeClass(type, classes) {
  if (type === "ModelDB") {
    return classes.customBadge_MDB;
  } else if (type === "Open Source Brain") {
    return classes.customBadge_OSB;
  } else if (type === "NeuroMorpho") {
    return classes.customBadge_NMO;
  } else if (type === "AllenBrain") {
    return classes.customBadge_AB;
  } else if (type === "BioModels") {
    return classes.customBadge_BM;
  } else {
    return classes.customBadge_KG;
  }
}

const RowIndex = withStyles(styles)((props) => {
  return (
    <td
      style={{
        width: "35px",
        padding: "5px 5px 5px 0px",
        textAlign: "center",
      }}
    >
      <Tooltip title={resourseTypeBadgeMappings[props.type][1] || ""} placement="left">
        <Badge
          badgeContent={resourseTypeBadgeMappings[props.type][0] || ""}
          // color="default"
          invisible={props.type === "URL"}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          classes={{ badge: setBadgeClass(props.type, props.classes) }}
        >
          <Avatar
            style={{
              width: "25px",
              height: "25px",
              fontSize: 14,
              fontWeight: "bolder",
              backgroundColor: "transparent",
              color: "#000000",
            }}
          >
            {props.ind + 1}
          </Avatar>
        </Badge>
      </Tooltip>
    </td>
  );
});

export class RowURL extends React.Component {
  render() {
    return (
      <tr>
        <RowIndex ind={this.props.ind} type={this.props.item["type"]} />
        <td style={{ padding: "5px 10px 5px 0px" }}>
          <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
            <Tooltip title={this.props.item["label"] || ""}>
              <input
                name="label"
                type="text"
                value={this.props.item["label"]}
                onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
              />
            </Tooltip>
          </div>
        </td>
        <td
          style={{
            width:
              this.props.numCols > 2
                ? this.props.useTabs
                  ? "27.5"
                  : "30%"
                : this.props.useTabs
                  ? "55%"
                  : "60%",
            padding: "5px 10px 5px 0px",
          }}
        >
          <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
            <Tooltip title={this.props.item["url"] || ""}>
              <input
                name="url"
                type="text"
                value={this.props.item["url"]}
                onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
              />
            </Tooltip>
          </div>
        </td>
        {this.props.numCols > 2 && (
          <td
            style={{
              width: this.props.useTabs ? "27.5" : "30%",
              padding: "5px 10px 5px 0px",
            }}
          >
            <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
              <Tooltip title={this.props.item["view_url"] || ""}>
                <input
                  name="view_url"
                  type="text"
                  value={this.props.item["view_url"] || ""}
                  onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
                />
              </Tooltip>
            </div>
          </td>
        )}
        {this.props.useTabs && (
          <td style={{ width: "12.5%", padding: "5px 10px 5px 0px" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
              <Tooltip title={this.props.item["tab_name"] || ""}>
                <input
                  name="tab_name"
                  type="text"
                  value={this.props.item["tab_name"]}
                  onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
                />
              </Tooltip>
            </div>
          </td>
        )}
        <ToolBar
          handleItemMoveDown={this.props.handleItemMoveDown}
          handleItemMoveUp={this.props.handleItemMoveUp}
          handleItemDeleted={this.props.handleItemDeleted}
          ind={this.props.ind}
          numRows={this.props.numRows}
        />
      </tr>
    );
  }
}

export class RowURLExpanded extends React.Component {
  render() {
    return (
      <tr>
        <RowIndex ind={this.props.ind} type={this.props.item["type"]} />
        <td colSpan={this.props.numCols}>
          <table>
            <tbody>
              <tr style={{ border: "None" }}>
                <td style={{ width: "100%", padding: "5px 10px 5px 0px" }}>
                  <Tooltip title={this.props.item["label"] || ""}>
                    <TextField
                      label="Label"
                      variant="outlined"
                      fullWidth={true}
                      name="label"
                      value={this.props.item["label"]}
                      onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
                      InputProps={{
                        style: {
                          backgroundColor: "#FFFFFF",
                          padding: "5px 15px",
                        },
                      }}
                    />
                  </Tooltip>
                </td>
              </tr>
              <tr style={{ border: "None" }}>
                <td
                  style={{
                    width: "100%",
                    padding: "5px 10px 5px 0px",
                  }}
                >
                  <Tooltip title={this.props.item["url"] || ""}>
                    <TextField
                      label="Download URL"
                      variant="outlined"
                      fullWidth={true}
                      name="url"
                      value={this.props.item["url"]}
                      onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
                      InputProps={{
                        style: {
                          backgroundColor: "#FFFFFF",
                          padding: "5px 15px",
                        },
                      }}
                    />
                  </Tooltip>
                </td>
              </tr>
              {this.props.numCols > 2 && (
                <tr style={{ border: "None" }}>
                  <td
                    style={{
                      width: "100%",
                      padding: "5px 10px 5px 0px",
                    }}
                  >
                    <Tooltip title={this.props.item["view_url"] || ""}>
                      <TextField
                        label="View URL"
                        variant="outlined"
                        fullWidth={true}
                        name="view_url"
                        value={this.props.item["view_url"] || ""}
                        onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
                        InputProps={{
                          style: {
                            backgroundColor: "#FFFFFF",
                            padding: "5px 15px",
                          },
                        }}
                      />
                    </Tooltip>
                  </td>
                </tr>
              )}
              {this.props.useTabs && (
                <tr style={{ border: "None" }}>
                  <td
                    style={{
                      width: "100%",
                      padding: "5px 10px 5px 0px",
                    }}
                  >
                    <Tooltip title={this.props.item["tab_name"] || ""}>
                      <TextField
                        label="Tab Name"
                        variant="outlined"
                        fullWidth={true}
                        name="tab_name"
                        value={this.props.item["tab_name"]}
                        onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
                        InputProps={{
                          style: {
                            backgroundColor: "#FFFFFF",
                            padding: "5px 15px",
                          },
                        }}
                      />
                    </Tooltip>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </td>
        <ToolBar
          handleItemMoveDown={this.props.handleItemMoveDown}
          handleItemMoveUp={this.props.handleItemMoveUp}
          handleItemDeleted={this.props.handleItemDeleted}
          ind={this.props.ind}
          numRows={this.props.numRows}
        />
      </tr>
    );
  }
}

export class RowDB extends React.Component {
  render() {
    return (
      <tr>
        <RowIndex ind={this.props.ind} type={this.props.item["type"]} />
        <td style={{ padding: "5px 10px 5px 0px" }}>
          <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
            <Tooltip title={this.props.item["label"] || ""}>
              <input
                name="label"
                type="text"
                value={this.props.item["label"]}
                onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
              />
            </Tooltip>
          </div>
        </td>
        <td
          style={{
            width:
              this.props.numCols > 2
                ? this.props.useTabs
                  ? "27.5"
                  : "30%"
                : this.props.useTabs
                  ? "55%"
                  : "60%",
            padding: "5px 10px 5px 0px",
          }}
        >
          <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
            <Tooltip
              title={this.props.item["url"] || ""}
              onClick={() => navigator.clipboard.writeText(this.props.item["url"])}
            >
              <input
                name="url"
                type="text"
                defaultValue={this.props.item["url"]}
                disabled
                style={{ cursor: "pointer", color: "#808080" }}
              />
            </Tooltip>
          </div>
        </td>
        {this.props.numCols > 2 && (
          <td
            style={{
              width: this.props.useTabs ? "27.5" : "30%",
              padding: "5px 10px 5px 0px",
            }}
          >
            <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
              <Tooltip
                title={this.props.item["view_url"] || ""}
                onClick={() => navigator.clipboard.writeText(this.props.item["view_url"])}
              >
                <input
                  name="view_url"
                  type="text"
                  defaultValue={this.props.item["view_url"]}
                  disabled
                  style={{ cursor: "pointer", color: "#808080" }}
                />
              </Tooltip>
            </div>
          </td>
        )}
        {this.props.useTabs && (
          <td style={{ width: "12.5%", padding: "5px 10px 5px 0px" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "0px 10px" }}>
              <Tooltip title={this.props.item["tab_name"] || ""}>
                <input
                  name="tab_name"
                  type="text"
                  value={this.props.item["tab_name"]}
                  onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
                />
              </Tooltip>
            </div>
          </td>
        )}
        <ToolBar
          handleItemMoveDown={this.props.handleItemMoveDown}
          handleItemMoveUp={this.props.handleItemMoveUp}
          handleItemDeleted={this.props.handleItemDeleted}
          ind={this.props.ind}
          numRows={this.props.numRows}
        />
      </tr>
    );
  }
}

export class RowDBExpanded extends React.Component {
  render() {
    return (
      <tr>
        <RowIndex ind={this.props.ind} type={this.props.item["type"]} />
        <td colSpan={this.props.numCols}>
          <table>
            <tbody>
              <tr style={{ border: "None" }}>
                <td style={{ width: "100%", padding: "5px 10px 5px 0px" }}>
                  <Tooltip title={this.props.item["label"] || ""}>
                    <TextField
                      label="Label"
                      variant="outlined"
                      fullWidth={true}
                      name="label"
                      value={this.props.item["label"]}
                      onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
                      InputProps={{
                        style: {
                          backgroundColor: "#FFFFFF",
                          padding: "5px 15px",
                        },
                      }}
                    />
                  </Tooltip>
                </td>
              </tr>
              <tr style={{ border: "None" }}>
                <td
                  style={{
                    width: "100%",
                    padding: "5px 10px 5px 0px",
                  }}
                >
                  <Tooltip
                    title={this.props.item["url"] || ""}
                    onClick={() => navigator.clipboard.writeText(this.props.item["url"])}
                  >
                    <TextField
                      label="Download URL"
                      variant="outlined"
                      fullWidth={true}
                      name="url"
                      defaultValue={this.props.item["url"]}
                      disabled
                      style={{ cursor: "pointer", color: "#808080" }}
                      InputProps={{
                        style: {
                          backgroundColor: "#FFFFFF",
                          color: "#808080",
                          padding: "5px 15px",
                          cursor: "pointer",
                        },
                      }}
                    />
                  </Tooltip>
                </td>
              </tr>
              {this.props.numCols > 2 && (
                <tr style={{ border: "None" }}>
                  <td
                    style={{
                      width: "100%",
                      padding: "5px 10px 5px 0px",
                    }}
                  >
                    <Tooltip
                      title={this.props.item["view_url"] || ""}
                      onClick={() => navigator.clipboard.writeText(this.props.item["view_url"])}
                    >
                      <TextField
                        label="View URL"
                        variant="outlined"
                        fullWidth={true}
                        name="view_url"
                        defaultValue={this.props.item["view_url"]}
                        disabled
                        style={{ cursor: "pointer", color: "#808080" }}
                        InputProps={{
                          style: {
                            backgroundColor: "#FFFFFF",
                            color: "#808080",
                            padding: "5px 15px",
                            cursor: "pointer",
                          },
                        }}
                      />
                    </Tooltip>
                  </td>
                </tr>
              )}
              {this.props.useTabs && (
                <tr style={{ border: "None" }}>
                  <td
                    style={{
                      width: "100%",
                      padding: "5px 10px 5px 0px",
                    }}
                  >
                    <Tooltip title={this.props.item["tab_name"] || ""}>
                      <TextField
                        label="Tab Name"
                        variant="outlined"
                        fullWidth={true}
                        name="tab_name"
                        value={this.props.item["tab_name"]}
                        onChange={(e) => this.props.handleItemChanged(this.props.ind, e)}
                        InputProps={{
                          style: {
                            backgroundColor: "#FFFFFF",
                            padding: "5px 15px",
                          },
                        }}
                      />
                    </Tooltip>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </td>
        <ToolBar
          handleItemMoveDown={this.props.handleItemMoveDown}
          handleItemMoveUp={this.props.handleItemMoveUp}
          handleItemDeleted={this.props.handleItemDeleted}
          ind={this.props.ind}
          numRows={this.props.numRows}
        />
      </tr>
    );
  }
}

export class ToolBar extends React.Component {
  render() {
    return (
      <td style={{ width: "100px", padding: "5px 0px 5px 10 px" }}>
        <div style={{ textAlign: "center" }}>
          <Tooltip title="Move down">
            <IconButton
              color="primary"
              size="small"
              aria-label="move down"
              component="span"
              style={{ paddingRight: "5px" }}
              onClick={(e) => this.props.handleItemMoveDown(this.props.ind)}
            >
              <ForwardIcon
                stroke={"#000000"}
                strokeWidth={1}
                style={{
                  transform: `rotate(90deg)`,
                  color: this.props.ind === this.props.numRows - 1 ? "#A1887F" : "#000000",
                }}
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move up">
            <IconButton
              color="primary"
              size="small"
              aria-label="move up"
              component="span"
              style={{ paddingRight: "5px" }}
              onClick={(e) => this.props.handleItemMoveUp(this.props.ind, e)}
            >
              <ForwardIcon
                stroke={"#000000"}
                strokeWidth={1}
                style={{
                  transform: `rotate(270deg)`,
                  color: this.props.ind === 0 ? "#A1887F" : "#000000",
                }}
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="secondary"
              size="small"
              aria-label="delete"
              component="span"
              onClick={(e) => this.props.handleItemDeleted(this.props.ind, e)}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </td>
    );
  }
}

export default class DynamicTableItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showHelp: false,
      dataOk: true,
      data: props.data,
      expandTable: false,
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleItemChanged = this.handleItemChanged.bind(this);
    this.handleItemMoveDown = this.handleItemMoveDown.bind(this);
    this.handleItemMoveUp = this.handleItemMoveUp.bind(this);
    this.handleItemDeleted = this.handleItemDeleted.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  handleAdd() {
    var items = this.props.items;
    items.push({
      type: "URL",
      label: "",
      url: "",
      view_url: "",
      tab_name: "",
      identifier: null,
    });
    this.props.onChangeValue(items);
  }

  handleItemChanged(i, event) {
    var items = this.props.items;
    items[i][event.target.name] = event.target.value;
    this.props.onChangeValue(items);
  }

  handleItemMoveDown(ind) {
    console.log("Move down item with index: " + ind);
    const maxInd = this.props.items.length;

    if (ind < maxInd) {
      var items = this.props.items;
      items = arrayMove(items, ind, ind + 1);
      this.props.onChangeValue(items);
    }
  }

  handleItemMoveUp(ind) {
    console.log("Move up item with index: " + ind);

    if (ind > 0) {
      var items = this.props.items;
      items = arrayMove(items, ind, ind - 1);
      this.props.onChangeValue(items);
    }
  }

  handleItemDeleted(ind) {
    var items = this.props.items;
    items.splice(ind, 1);
    this.props.onChangeValue(items);
    if (items.length === 0) {
      this.setState({
        expandTable: false,
      });
    }
  }

  toggleExpand() {
    if (this.props.items.length > 0) {
      this.setState((prevState) => ({
        expandTable: !prevState.expandTable,
      }));
    }
  }

  renderRows(numCols, useTabs) {
    var context = this;
    var items = this.props.items;

    return items.map(function (item, ind) {
      return (
        <React.Fragment key={"item-" + ind}>
          {item["type"] === "URL" ? (
            !context.state.expandTable ? (
              <RowURL
                item={item}
                handleItemChanged={context.handleItemChanged}
                ind={ind}
                numCols={numCols}
                numRows={items.length}
                useTabs={useTabs}
                handleItemMoveDown={context.handleItemMoveDown}
                handleItemMoveUp={context.handleItemMoveUp}
                handleItemDeleted={context.handleItemDeleted}
                type={context.props.type}
              />
            ) : (
              <RowURLExpanded
                item={item}
                handleItemChanged={context.handleItemChanged}
                ind={ind}
                numCols={numCols}
                numRows={items.length}
                useTabs={useTabs}
                handleItemMoveDown={context.handleItemMoveDown}
                handleItemMoveUp={context.handleItemMoveUp}
                handleItemDeleted={context.handleItemDeleted}
                type={context.props.type}
              />
            )
          ) : !context.state.expandTable ? (
            <RowDB
              item={item}
              handleItemChanged={context.handleItemChanged}
              ind={ind}
              numCols={numCols}
              numRows={items.length}
              useTabs={useTabs}
              handleItemMoveDown={context.handleItemMoveDown}
              handleItemMoveUp={context.handleItemMoveUp}
              handleItemDeleted={context.handleItemDeleted}
              type={context.props.type}
            />
          ) : (
            <RowDBExpanded
              item={item}
              handleItemChanged={context.handleItemChanged}
              ind={ind}
              numCols={numCols}
              numRows={items.length}
              useTabs={useTabs}
              handleItemMoveDown={context.handleItemMoveDown}
              handleItemMoveUp={context.handleItemMoveUp}
              handleItemDeleted={context.handleItemDeleted}
              type={context.props.type}
            />
          )}
        </React.Fragment>
      );
    });
  }

  render() {
    // console.log(this.props);
    return (
      <div>
        <table>
          {!this.state.expandTable && (
            <thead>
              <tr>
                <th style={{ padding: "5px 10px", textAlign: "center" }}>#</th>
                <th style={{ padding: "5px 10px" }}>Label</th>
                <th style={{ padding: "5px 10px" }}>Download URL</th>
                {this.props.numCols > 2 && <th style={{ padding: "5px 10px" }}>View URL</th>}
                {this.props.useTabs && <th style={{ padding: "5px 10px" }}>Tab Name</th>}
                <th style={{ padding: "5px 0px 5px 10 px" }}>{/* delete button */}</th>
              </tr>
            </thead>
          )}
          <tbody>{this.renderRows(this.props.numCols, this.props.useTabs)}</tbody>
        </table>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "20px",
          }}
        >
          <InvertedIconButton
            onClick={this.toggleExpand}
            backgroundColor="#795548"
            startIcon={this.state.expandTable ? <PhotoSizeSelectSmallIcon /> : <AspectRatioIcon />}
            width="160px"
            label={this.state.expandTable ? "Collapse" : "Expand"}
          />
          <InvertedIconButton
            onClick={this.props.handleEdit}
            backgroundColor="#B71C1C"
            startIcon={<EditIcon />}
            width="160px"
            label="Edit Source"
          />
          {this.props.handleDB && (
            <InvertedIconButton
              onClick={this.props.handleDB}
              backgroundColor="#388E3C"
              startIcon={<StorageIcon />}
              width="160px"
              label="Add From DB"
            />
          )}
          <InvertedIconButton
            onClick={this.handleAdd.bind(this)}
            width="160px"
            startIcon={<AddCircleOutlineIcon />}
            label="Add Row"
          />
        </div>
      </div>
    );
  }
}
