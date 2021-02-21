/* eslint-disable no-bitwise */
import * as d3 from "d3";

export const formatPriceUSD = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        price
    );

export const getXTicks = () => {
    return d3.timeDay.every(1);
};

export const getXTickFormat = () => {
    return d3.timeFormat("%a %d");
};
