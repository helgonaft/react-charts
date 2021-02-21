import React, { useState, useEffect } from "react";
import MultilineChart from "./views/MultiLineChart";
import Legend from "./components/chartComponents/Legend";
import PortSelection from './components/PortSelection';
import { marketAverage, marketHigh, marketLow } from './constants';
import { loadRates, loadPorts } from './api/calls';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import "./styles.css";


const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const formatChartItems = (data, level) => {
  return data.length ? data.map((d) => ({ value: d[level], date: new Date(d.day) })) : []
}

export default function App() {
  // by default market average data is selected
  const [selectedItems, setSelectedItems] = useState(['Market Average']);
  const legendData = [marketAverage, marketHigh, marketLow];
  const [rates, setRates] = useState([]);
  const [ports, setPorts] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [errorMessage, setErrorMessage] = useState(false);
  const [dates, setDates] = useState(null);
  const classes = useStyles();
  let chartData = [
    ...[marketAverage, marketHigh, marketLow].filter((d) => selectedItems.includes(d.name))
  ];

  // when component did mount - load ports
  useEffect(() => {
    loadPorts().then(
      res => {
        setPorts(res.data);
      }
    )
  }, []);

  // when select checkbox to show/hide rates data
  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  const onPortChange = (origin, destination) => {
    loadRates(origin, destination).then(
      res => {
        setRates(res.data);
        setTotalPoints(res.data.length);
        setDates({ startDate: res.data[0].day, endDate: res.data[res.data.length - 1].day })
        marketAverage.items = formatChartItems(res.data, 'mean');
        marketLow.items = formatChartItems(res.data, 'low');
        marketHigh.items = formatChartItems(res.data, 'high');
        chartData = [
          ...[marketAverage, marketHigh, marketLow].filter((d) => selectedItems.includes(d.name))
        ];
        onChangeSelection('marketAverage');
        setErrorMessage(false);
      },
      err => {
        if (err.response.status == 404) {
          setErrorMessage("We are sorry, but there is no data for selected ports. Please change origin or/and destination port.");
        } else {
          setErrorMessage(err.message);
        }
        setTotalPoints(0);
        marketAverage.items = formatChartItems([], 'mean');
        marketLow.items = formatChartItems([], 'low');
        marketHigh.items = formatChartItems([], 'high');
      }
    )
  }

  return (
    <div className="App container">
      {ports.length && (
        <React.Fragment>
          <div className="row d-flex">
            <div className="col-12">
              <PortSelection selectLabel="Origin Port" ports={ports} onChange={onPortChange}></PortSelection>
            </div>
          </div>
          <div className="row mb-5">
            {dates &&
              <div className="col-auto">
                <TextField
                  id="date1"
                  label="from"
                  type="date"
                  disabled
                  defaultValue={dates.startDate}
                  className={classes.textField}
                />
                <TextField
                  id="date2"
                  label="to"
                  type="date"
                  disabled
                  defaultValue={dates.endDate}
                  className={classes.textField}
                />
              </div>
            }
            <div className="col-auto">
              {totalPoints > 0 && <span className="alert bg-warning">{totalPoints} data points</span>}
            </div>
          </div>
          {!errorMessage &&
            <div>
              <Legend
                data={legendData}
                selectedItems={selectedItems}
                onChange={onChangeSelection}
              />
              <MultilineChart data={chartData} />
            </div>
          }
          {errorMessage && <p className="alert bg-warning my-5">{errorMessage}</p>}
        </React.Fragment>
      )}
    </div>
  );
}
