import React from "react";
import { makeStyles } from "@mui/styles";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 700,
    maxWidth: 900,
  },
}));

export default function TypeAheadSelect(props) {
  const classes = useStyles();
  const fieldName = props.name.replace(" ", "_");
  const fieldId = "select-" + props.label.replace(" ", "-");
  const fieldLabelId = fieldId + "-label";

  function handleChange(event, newValue) {
    props.handleChange({ target: { name: fieldName, value: newValue || "" } });
  }

  return (
    <div>
      <FormControl className={classes.formControl} disabled={props.disabled || false}>
        <InputLabel id={fieldLabelId}>{props.label}</InputLabel>
        <Autocomplete
          options={props.itemNames || []}
          value={props.value || null}
          onChange={handleChange}
          disabled={props.disabled || false}
          renderInput={(params) => (
            <Input
              ref={params.InputProps.ref}
              className={params.InputProps.className}
              startAdornment={params.InputProps.startAdornment}
              endAdornment={params.InputProps.endAdornment}
              inputProps={params.inputProps}
              fullWidth
            />
          )}
        />
        {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
