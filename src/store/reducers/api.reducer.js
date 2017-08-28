import R from 'ramda';

import {
    DELETE_ENDPOINT_START,
    DELETE_ENDPOINT_SUCCESS,
    //   DELETE_ENDPOINT_FAILURE, // @TODO: implement
    FETCH_ENDPOINT_START,
    FETCH_ENDPOINT_SUCCESS,
    FETCH_ENDPOINT_SCHEMA_START,
    FETCH_ENDPOINT_SCHEMA_SUCCESS,
    FILL_SELECTED_PLUGINS,
    SAVE_ENDPOINT_START,
    SAVE_ENDPOINT_SUCCESS,
    EXCLUDE_PLUGIN,
    SELECT_PLUGIN,
    RESET_ENDPOINT,
    WILL_CLONE,
} from '../constants';

const initialState = {
    api: {},
    apiSchema: {},
    selectedPlugins: [],
    isFetching: false,
};

export const adjust = api => api;
export const fillSelectedPlugins = api => api.plugins.map(item => item.name);

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case DELETE_ENDPOINT_START:
        case FETCH_ENDPOINT_START:
        case FETCH_ENDPOINT_SCHEMA_START:
        case SAVE_ENDPOINT_START: {
            return {
                ...state,
                isFetching: true,
            };
        }
        case DELETE_ENDPOINT_SUCCESS: {
            return {
                ...state,
                isFetching: false,
            };
        }
        case FETCH_ENDPOINT_SCHEMA_SUCCESS: {
            return {
                ...state,
                api: action.payload,
                apiSchema: action.payload,
                isFetching: false,
            };
        }
        case FETCH_ENDPOINT_SUCCESS: {
            // console.error('FETCH_ENDPOINT_SUCCESS', action.payload);
            return {
                ...state,
                api: adjust(action.payload),
                selectedPlugins: fillSelectedPlugins(action.payload),
                // selectedPlugins: action.payload,
                isFetching: false,
            };
        }
        // case FILL_SELECTED_PLUGINS: {
        //     return {
        //         ...state,
        //         selectedPlugins: action.payload,
        //     };
        // }
        case SAVE_ENDPOINT_SUCCESS: {
            return {
                ...state,
                isFetching: false,
            };
        }
        case EXCLUDE_PLUGIN: {
            return {
                ...state,
                selectedPlugins: R.without(action.payload, state.selectedPlugins),
            };
        }
        case SELECT_PLUGIN: {
            return {
                ...state,
                selectedPlugins: state.selectedPlugins.concat(action.payload),
            };
        }
        case WILL_CLONE: {
            return {
                ...state,
                api: action.payload,
            };
        }
        case RESET_ENDPOINT: {
            return initialState;
        }
        default:
            return state;
    }
}
