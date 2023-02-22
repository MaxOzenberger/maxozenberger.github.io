import { React } from 'jimu-core';
import { Select } from 'jimu-ui';
export const Statistics = {
    count: 'COUNT',
    avg: 'AVERAGE',
    sum: 'SUM',
    max: 'MAX',
    min: 'MIN',
    percentile_cont: 'MEDIAN'
};
const StatisticsSelector = (props) => {
    const { supportCount = true, supportPercentile = true, value, onChange } = props;
    const statistics = React.useMemo(() => {
        return Object.keys(Statistics).filter((statistic) => {
            const unsupported = (!supportCount && statistic === 'count') ||
                (!supportPercentile && statistic === 'percentile_cont');
            return !unsupported;
        });
    }, [supportCount, supportPercentile]);
    const handleChange = (evt) => {
        const value = evt === null || evt === void 0 ? void 0 : evt.currentTarget.value;
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
    };
    return (React.createElement(Select, { size: 'sm', value: value, onChange: handleChange }, statistics.map((st, i) => (React.createElement("option", { value: st, key: i, className: 'text-truncate' }, Statistics[st])))));
};
export default StatisticsSelector;
//# sourceMappingURL=statistics-selector.js.map