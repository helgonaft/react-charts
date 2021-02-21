import React from 'react';
import * as d3 from 'd3';
 
export const useD3 = (renderChartCallback, dependencies) => {
    const ref = React.useRef();

    React.useEffect(() => {
        renderChartCallback(d3.select(ref.current));
        return () => { };
    }, dependencies); // for preventing unnecessary re-rendering and updating the chart correctly when new data arrives.
    return ref;
}