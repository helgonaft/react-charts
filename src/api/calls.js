import axios from 'axios';
import { PORTS_ENDPOINT, RATES_ENDPOINT, API_KEY } from '../constants';

axios.defaults.headers.common['X-Api-Key'] = API_KEY;
// response interceptor
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status === 404) {
        console.log('Not found data')
    }
    return Promise.reject(error);
});

export const loadRates = (originPort, destinationPort) => {
    if (originPort && destinationPort) {
        return axios.get(RATES_ENDPOINT, {
            params: {
                origin: originPort,
                destination: destinationPort
            }
        });
    }
};

export const loadPorts = () => {
    return axios.get(PORTS_ENDPOINT);
};