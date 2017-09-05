import createHistory from 'history/createBrowserHistory';
import R from 'ramda';

import client from '../api';
import endpointSchema from '../../configurations/apiSchema'; // @TODO: REMOVE
import {
    DELETE_ENDPOINT_START,
    DELETE_ENDPOINT_SUCCESS,
    FETCH_ENDPOINT_START,
    FETCH_ENDPOINT_SUCCESS,
    FETCH_ENDPOINT_SCHEMA_START,
    FETCH_ENDPOINT_SCHEMA_SUCCESS,
    SAVE_ENDPOINT_START,
    SAVE_ENDPOINT_SUCCESS,
    EXCLUDE_PLUGIN,
    SELECT_PLUGIN,
    RESET_ENDPOINT,
    WILL_CLONE,
} from '../constants';
import {
    openResponseModal,
  // closeResponseModal, // @TODO: will need thi a bit later
} from './index';

const history = createHistory({
    forceRefresh: true,
});

export const deleteEndpointRequest = () => ({
    type: DELETE_ENDPOINT_START,
});

export const deleteEndpointSuccess = () => ({
    type: DELETE_ENDPOINT_SUCCESS,
});

export const getEndpointRequest = () => ({
    type: FETCH_ENDPOINT_START,
});

export const getEndpointSuccess = api => ({
    type: FETCH_ENDPOINT_SUCCESS,
    payload: api,
});

export const getEndpointSchemaRequest = () => ({
    type: FETCH_ENDPOINT_SCHEMA_START,
});

export const getEndpointSchemaSuccess = api => ({
    type: FETCH_ENDPOINT_SCHEMA_SUCCESS,
    payload: api,
});

export const saveEndpointRequest = () => ({
    type: SAVE_ENDPOINT_START,
});

export const saveEndpointSuccess = () => ({
    type: SAVE_ENDPOINT_SUCCESS,
});

export const selectPlugin = pluginName/*: string*/ => ({
    type: SELECT_PLUGIN,
    payload: pluginName,
});

export const excludePlugin = pluginName/*: string*/ => ({
    type: EXCLUDE_PLUGIN,
    payload: pluginName,
});

export const resetEndpoint = () => ({
    type: RESET_ENDPOINT,
});

export const willClone = data => ({
    type: WILL_CLONE,
    payload: data,
});

export const deleteEndpoint = (apiName, callback) => async (dispatch) => {
    dispatch(deleteEndpointRequest());

    try {
        const response = await client.delete(`apis/${apiName}`);

        dispatch(deleteEndpointSuccess());
        dispatch(openResponseModal({ // @FIXME: move to reducers
            status: response.status,
            message: 'Successfuly deleted',
            statusText: response.statusText,
        }));
        dispatch(callback(apiName));
    } catch (error) {
        dispatch(openResponseModal({
            status: error.response.status,
            statusText: error.response.statusText,
            message: error.response.data.error,
        }));
    }
};

export const fetchEndpoint = pathname => async dispatch => {
    dispatch(getEndpointRequest());

    try {
        const response = await client.get(`apis${pathname}`);

        dispatch(getEndpointSuccess(response.data));
    } catch (error) {
        console.log('FETCH_ENDPOINT_ERROR', 'Infernal server error', error);
    }
};

export const fetchEndpointSchema = () => (dispatch) => {
    dispatch(getEndpointSchemaRequest());

  // return client.get(`apis${pathname}`) // @TODO: RESTORE when endpoint will be ready
  //   .then((response) => {
  //     dispatch(getApiSchemaSuccess(response.data));
  //   })
  //   .catch((e) => {
  //     console.log('FETCH_API_SCHEMA_ERROR', 'Infernal server error', e);
  //   });

    dispatch(getEndpointSchemaSuccess(endpointSchema)); // @TODO: REMOVE when endpoint will be ready
};

export const updateEndpoint = (pathname, api) => async dispatch => {
    dispatch(saveEndpointRequest());

    try {
        const response = await client.put(`apis${pathname}`, api);

        dispatch(saveEndpointSuccess());
        dispatch(openResponseModal({ // @FIXME: move to reducers
            status: response.status,
            message: 'Successfuly saved',
            statusText: response.statusText,
        }));
    } catch (error) {
        if (error.response) {
            dispatch(openResponseModal({
                status: error.response.status,
                statusText: error.response.statusText,
                message: error.response.data,
            }));
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // More info about error handling in Axios: https://github.com/mzabriskie/axios#handling-errors
            // eslint-disable-next-line
            console.error(error.response.data);
        } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
            // eslint-disable-next-line
            console.log(error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
            // eslint-disable-next-line
            console.log('Error', error.message);
        }
    }
};

export const saveEndpoint = (pathname, api) => async dispatch => {
    dispatch(saveEndpointRequest());

    const preparedPlugins = api.plugins.map(plugin => {
        if (plugin.name === 'rate_limit') {
            const { value, units } = plugin.config.limit;
            const concatenation = `${value}-${units}`;
            // set the path for the lens
            const lens = R.lensPath(['config', 'limit']);
            // substitude the plugin.config.limit
            const updatedPlugin = R.set(lens, concatenation, plugin);

            return updatedPlugin;
        }
        if (plugin.name === 'request_transformer') {
            // get all options names
            const options = Object.keys(plugin.config);
            // convert all values of plugin's config to array of objects
            // so then we will be able to map through them:
            const config = R.values(plugin.config);
            const allTransformedHeaders = config.map((item, index) => {
                // headers comes as an array of objects:
                /**
                 * @example #1
                 *
                 * add: {
                 *     header: [
                 *         {someKey: 'someValue'},
                 *         {someAnotherKey: 'someAnotherValue'},
                 *     ]
                 * }
                 */
                const headers = item.headers;

                // we will fill this arrays with keys and values respectively
                let keys = [];
                let values = [];

                // fill key/values arrays
                headers.map(item => {
                    const arr = R.values(item);

                    keys.push(arr[0]);
                    values.push(arr[1]);
                });

                // and now we are creating object that should be placed instead of
                // array of the objects from example #1
                /**
                 * @example #2
                 *
                 * add: {
                 *     headers: {
                 *         someKey: 'someValue',
                 *         someAnotherKey: 'someAnotherValue',
                 *     }
                 * }
                 */
                const transformedHeaders = R.zipObj(keys, values);

                return transformedHeaders;
            });

            // step by step we updating plugins config:
            const updatedPlugin = allTransformedHeaders.reduce((acc, item, index) => {
                const lens = R.lensPath(['config', options[index], 'headers']);

                return R.set(lens, item, acc);
            }, plugin);

            return updatedPlugin;
        }

        return plugin;
    });
    // substitude updated list of plugins
    const preparedApi = R.set(R.lensPath(['plugins']), preparedPlugins, api);

    try {
        const response = client.post('apis', preparedApi);

        dispatch(saveEndpointSuccess());
        dispatch(openResponseModal({
            status: response.status,
            message: 'Successfuly saved',
            statusText: response.statusText,
            redirectOnClose: () => (history.push('/')),
        }));
    } catch (error) {
        if (error.response) {
            dispatch(openResponseModal({
                status: error.response.status,
                statusText: error.response.statusText,
                message: error.response.data,
            }));

        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // More info about error handling in Axios: https://github.com/mzabriskie/axios#handling-errors
            // eslint-disable-next-line
            console.error(error.response.data);
        } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
            // eslint-disable-next-line
            console.log(error.request);
        } else {
        // Something happened in setting up the request that triggered an Error
            // eslint-disable-next-line
            console.log('Error', error.message);
        }
    }
};