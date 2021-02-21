import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';

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
    const newOriginPort = event.target.value;
    // origin and dest ports should be different
    if (newOriginPort === destinationPort) {
      setDestinationPort(ports.filter(p => p.code !== newOriginPort)[0].code);
    }
    setOriginPort(event.target.value);
  }

  const handleDestinationChange = event => {
    const newDestionationPort = event.target.value;
    if (newDestionationPort === originPort) {
      setOriginPort(ports.filter(p => p.code !== newDestionationPort)[0].code);
    }
    setDestinationPort(event.target.value);
  }

  const swapPorts = () => {
    const firstPort = originPort;
    const secondPort = destinationPort;
    setOriginPort(secondPort);
    setDestinationPort(firstPort);
  }

  useEffect(() => {
    props.onChange(originPort, destinationPort);
  }, [originPort, destinationPort])

  return (
    <div className="my-3 d-flex align-items-center">
      <FormControl className={classes.formControl}>
        <Select value={originPort} onChange={handleOriginChange}>
          {ports.map((port, index) => {
          return <MenuItem value={port.code} key={index}>{port.name} ({port.code})</MenuItem>;
          })}
        </Select>
        <FormHelperText>Origin Port</FormHelperText>
      </FormControl>
      <SwapHorizIcon className="mx-4" onClick={swapPorts}></SwapHorizIcon>
      <FormControl className={classes.formControl}>
        <Select value={destinationPort} onChange={handleDestinationChange}>
          {ports.map((port, index) => {
            return <MenuItem value={port.code} key={index}>{port.name} ({port.code})</MenuItem>;
          })}
        </Select>
        <FormHelperText>Destination Port</FormHelperText>
      </FormControl>
    </div>
  );
}
