import React, { useState, useEffect } from "react";
import MultilineChart from "./views/MultiLineChart";
import Legend from "./components/chartComponents/Legend";
import "./styles.css";
import PortSelection from './components/PortSelection';
import { API_KEY, marketAverage, marketHigh, marketLow } from './constants';
import { loadRates, loadPorts } from './api/calls';


const formatChartItems = (data, level) => {
  return data.length ? data.map((d) => ({ value: d[level], date: new Date(d.day) })) : []
}

export default function App() {
  // by default market average data is selected
  const [selectedItems, setSelectedItems] = useState(['Market Average']);
  const legendData = [marketAverage, marketHigh, marketLow];
  let chartData = [
    ...[marketAverage, marketHigh, marketLow].filter((d) => selectedItems.includes(d.name))
  ];
  const [rates, setRates] = useState([]);
  const [ports, setPorts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);

  // when component did mount - load ports
  useEffect(() => {
    loadPorts().then(
      res => {
        setPorts(res.data);
      }
    )
  }, []);

  // when select checkbox to show/hide rates data
  // TODO: handle case when all checkboxes are unselected
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
        }

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
            <div className="col-auto">
              <PortSelection selectLabel="Origin Port" ports={ports} onChange={onPortChange}></PortSelection>
            </div>
          </div>
          {!errorMessage && <div>
            <Legend
              data={legendData}
              selectedItems={selectedItems}
              onChange={onChangeSelection}
            />
            <MultilineChart data={chartData} />
          </div>}
          {errorMessage && <p className="alert bg-warning my-5">{errorMessage}</p>}
        </React.Fragment>
      )}
    </div>
  );
}
