import React from "react";
import Button from "@mui/material/Button";


const baseButtonStyle = {
    fontWeight: "bold",
    border: "solid",
    borderColor: "#000000",
    borderWidth: "1px",
    color: "#000000",
}


function WideButton(props) {
  return (
    <Button
      variant="contained"
      color="primary"
      style={{
        ...baseButtonStyle,
        width: "27.5%",
        backgroundColor: props.backgroundColor
      }}
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  );
}

function StandardButton(props) {
  return (
    <Button
      variant="contained"
      color="primary"
      style={{
        ...baseButtonStyle,
        width: "150px",
        backgroundColor: props.backgroundColor,
        padding: "10px",
        color: props.disabled ? "#777777" : "#000000",
        borderColor: props.disabled ? "#777777" : "#000000",
      }}
      onClick={props.onClick}
      disabled={props.disabled || false}
    >
      {props.label}
    </Button>
  );
}

function InvertedButton(props) {
    return (
      <Button
        variant="contained"
        color="primary"
        style={{
          ...baseButtonStyle,
          width: "150px",
          backgroundColor: props.backgroundColor,
          color: "#ffffff",
          padding: "10px",
        }}
        onClick={props.onClick}
      >
        {props.label}
      </Button>
    );
  }

function StandardIconButton(props) {

    return (
      <Button
        variant="contained"
        color="primary"
        style={{
          ...baseButtonStyle,
          width: props.width || "150px",
          backgroundColor: props.backgroundColor,
          overflowX: "hidden"
        }}
        startIcon={props.startIcon}
        onClick={props.onClick}
      >
        {props.label}
      </Button>
    )
}

function InvertedIconButton(props) {
  return (
    <Button
      variant="contained"
      color="primary"
      style={{
        ...baseButtonStyle,
        fontWeight: "normal",
        width: props.width || "150px",
        color: "#ffffff",
        backgroundColor: props.backgroundColor,
        overflowX: "hidden",
        marginRight: "25px"
      }}
      startIcon={props.startIcon}
      onClick={props.onClick}
    >
      {props.label}
    </Button>
  )
}

export { InvertedButton, InvertedIconButton, StandardButton, StandardIconButton, WideButton };
