import React, { useState, useEffect } from "react";
import MultilineChart from "./views/MultiLineChart";
import Legend from "./components/chartComponents/Legend";
import "./styles.css";
import axios from 'axios';
import PortSelection from './components/PortSelection';
import { API_KEY, PORTS_ENDPOINT, RATES_ENDPOINT, marketAverage, marketHigh, marketLow } from './constants';

// response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // TODO: send notification about NO DATA FOUND
  return Promise.reject(error);
});

const formatChartItems = (data, level) => {
  return data.map((d) => ({ value: d[level], date: new Date(d.day) }))
}



const loadRates = (originPort, destinationPort) => {
  if (originPort && destinationPort) {
    return axios.get(RATES_ENDPOINT, {
      params: {
        origin: originPort,
        destination: destinationPort
      }
    });
  }
};

const loadPorts = () => {
  return axios.get(PORTS_ENDPOINT);
};



export default function App() {
  axios.defaults.headers.common['X-Api-Key'] = API_KEY;
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
      },
      err => {
        // setErrorMessage(err.message);
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
          <Legend
            data={legendData}
            selectedItems={selectedItems}
            onChange={onChangeSelection}
          />
          <MultilineChart data={chartData} />
        </React.Fragment>
      )}
    </div>
  );
}
