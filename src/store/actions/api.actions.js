import client from '../api';
import apiSchema from '../../configurations/apiSchema'; // @TODO: REMOVE
import {
  FETCH_API_REQUEST,
  FETCH_API_SUCCESS,
  FETCH_API_SCHEMA_REQUEST,
  FETCH_API_SCHEMA_SUCCESS,
  SAVE_API_REQUEST,
  SAVE_API_SUCCESS,
  RESET_API,
} from '../constants';

export const getAPIRequest = () => ({
  type: FETCH_API_REQUEST,
});

export const getAPISuccess = api => ({
  type: FETCH_API_SUCCESS,
  payload: api,
});

export const getApiSchemaRequest = () => ({
  type: FETCH_API_SCHEMA_REQUEST,
});

export const getApiSchemaSuccess = api => ({
  type: FETCH_API_SCHEMA_SUCCESS,
  payload: api,
});

export const saveAPIRequest = () => ({
  type: SAVE_API_REQUEST,
});

export const saveAPISuccess = api => ({
  type: SAVE_API_SUCCESS,
  payload: api,
});

export const resetAPI = () => ({
  type: RESET_API,
});

export const fetchAPI = (pathname) => dispatch => {
  dispatch(getAPIRequest());
  
  return client.get(`apis${pathname}`)
    .then((response) => {
      dispatch(getAPISuccess(response.data));
    })
    .catch((e) => {
      console.log('FETCH_API_ERROR', 'Infernal server error', e);
    });
};

export const fetchApiSchema = (pathname) => dispatch => {
  dispatch(getApiSchemaRequest());
  
  // return client.get(`apis${pathname}`) // @TODO: RESTORE when endpoint will be ready
  //   .then((response) => {
  //     dispatch(getApiSchemaSuccess(response.data));
  //   })
  //   .catch((e) => {
  //     console.log('FETCH_API_SCHEMA_ERROR', 'Infernal server error', e);
  //   });
  
  dispatch(getApiSchemaSuccess(apiSchema)); // @TODO: REMOVE when endpoint will be ready
};

export const updateAPI = (pathname, api) => dispatch => {
  dispatch(saveAPIRequest());
  
  return client.put(`apis${pathname}`, api)
    .then((response) => {
      dispatch(saveAPISuccess(JSON.parse(response.config.data)));
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // More info about error handling in Axios: https://github.com/mzabriskie/axios#handling-errors
        console.error(error.response.data);
      } 
      else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      }
      else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
};

export const saveAPI = (pathname, api) => dispatch => {
  dispatch(saveAPIRequest());
  
  return client.post('apis', api)
    .then((response) => {
      dispatch(saveAPISuccess(JSON.parse(response.config.data)));
    })
    .catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // More info about error handling in Axios: https://github.com/mzabriskie/axios#handling-errors
        console.error(error.response.data);
      } 
      else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      }
      else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });

};
