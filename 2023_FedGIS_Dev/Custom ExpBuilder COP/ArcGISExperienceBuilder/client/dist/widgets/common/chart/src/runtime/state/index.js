import { React } from 'jimu-core';
const initialState = {
    chart: null,
    filter: null,
    dataSource: null,
    outputDataSource: null,
    recordsStatus: 'none',
    queryVersion: 0
};
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_CHART':
            return Object.assign(Object.assign({}, state), { chart: action.value });
        case 'SET_FILTER':
            return Object.assign(Object.assign({}, state), { filter: action.value });
        case 'SET_DATA_SOURCE':
            return Object.assign(Object.assign({}, state), { dataSource: action.value });
        case 'SET_OUTPUT_DATA_SOURCE':
            return Object.assign(Object.assign({}, state), { outputDataSource: action.value });
        case 'SET_RECORDS':
            return Object.assign(Object.assign({}, state), { records: action.value });
        case 'SET_RECORDS_STATUS':
            return Object.assign(Object.assign({}, state), { recordsStatus: action.value });
        case 'SET_QUERY_VERSION':
            return Object.assign(Object.assign({}, state), { queryVersion: action.value });
        default:
            return state;
    }
};
const ChartRuntimeStateContext = React.createContext(undefined);
const ChartRuntimeDispatchContext = React.createContext(undefined);
export const ChartRuntimeStateProvider = (props) => {
    const { defaultState, children } = props;
    const [state, dispatch] = React.useReducer(reducer, defaultState || initialState);
    return React.createElement(ChartRuntimeStateContext.Provider, { value: state },
        React.createElement(ChartRuntimeDispatchContext.Provider, { value: dispatch }, children));
};
export const useChartRuntimeState = () => {
    return React.useContext(ChartRuntimeStateContext);
};
export const useChartRuntimeDispatch = () => {
    return React.useContext(ChartRuntimeDispatchContext);
};
//# sourceMappingURL=index.js.map