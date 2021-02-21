import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

export default function PortSelection(props) {
  const { ports } = props;
  const classes = useStyles();
  // set Shanghai and Rotterdam as default ports, because they contain data
  const [originPort, setOriginPort] = React.useState(ports[1].code);
  const [destinationPort, setDestinationPort] = React.useState(ports[3].code);


  const handleOriginChange = event => {
    setOriginPort(event.target.value);
  };

  const handleDestinationChange = event => {
    setDestinationPort(event.target.value);
  };

  useEffect(() => {
    props.onChange(originPort, destinationPort);
  }, [originPort, destinationPort])

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select value={originPort} onChange={handleOriginChange}>
          {ports.map((port, index) => {
            return <MenuItem value={port.code} key={index}>{port.name}</MenuItem>;
          })}
        </Select>
        <FormHelperText>Origin Port</FormHelperText>
      </FormControl>
      <FormControl className={classes.formControl}>
        <Select value={destinationPort} onChange={handleDestinationChange}>
          {ports.map((port, index) => {
            return <MenuItem value={port.code} key={index}>{port.name}</MenuItem>;
          })}
        </Select>
        <FormHelperText>Destination Port</FormHelperText>
      </FormControl>
    </div>
  );
}
