var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { getAppStore, React, Immutable, StatisticType } from 'jimu-core';
import { withStoreThemeIntlRender, mockTheme } from 'jimu-for-test';
import { StatisticsDataSetting } from '../../../src/setting/settings/chart/web-chart/common-sections/data/statistics';
import { fireEvent } from '@testing-library/react';
import { NumericFields, StringFields } from '../mock-field-selector';
import { getOutStatisticName } from '../../../src/utils/common/serial';
const ColumnTemplate = require('../../../src/setting/template/column.json');
jest.mock('jimu-ui', () => {
    return Object.assign(Object.assign({}, jest.requireActual('jimu-ui')), { NumericInput: require('../mock-numeric-input').MockNumericInput });
});
jest.mock('../../../src/utils/common', () => {
    return Object.assign(Object.assign({}, jest.requireActual('../../../src/utils/common')), { getObjectIdField: () => 'FID' });
});
jest.mock('../../../src/setting/settings/chart/web-chart/components', () => {
    return Object.assign(Object.assign({}, jest.requireActual('../../../src/setting/settings/chart/web-chart/components')), { FieldSelector: require('../mock-field-selector').MockFieldSelector });
});
const CategoryFieldSelector = '.category-field-selector .selected-field-item';
const SortFieldSelector = '.sort-select .dropdown-button-content';
const Container = (props) => {
    const { series: propSeries, chartDataSource: propDataSource, onChange } = props, others = __rest(props, ["series", "chartDataSource", "onChange"]);
    const [series, setSeries] = React.useState(propSeries);
    const [dataSource, setDataSource] = React.useState(propDataSource);
    const handleChange = (series, { chartDataSource }) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(series, chartDataSource);
        setSeries(series);
        setDataSource(chartDataSource);
    };
    return (React.createElement(StatisticsDataSetting, Object.assign({}, others, { chartDataSource: dataSource, series: series, onChange: handleChange })));
};
let chartDataSource = Immutable({
    query: {
        groupByFieldsForStatistics: [StringFields[0]],
        outStatistics: [{
                statisticType: 'sum',
                onStatisticField: NumericFields[0],
                outStatisticFieldName: getOutStatisticName(NumericFields[0], StatisticType.Sum)
            }],
        orderByFields: [`${StringFields[0]} ASC`]
    }
});
describe('<SerialDataSetting />', () => {
    let useDataSources = null;
    let render = null;
    describe('<SerialDataSetting />', () => {
        beforeAll(() => {
            useDataSources = [
                {
                    dataSourceId: 'ds1',
                    mainDataSourceId: 'ds1'
                }
            ];
            render = withStoreThemeIntlRender(getAppStore(), mockTheme);
        });
        it('should render ok', () => {
            const series = Immutable(ColumnTemplate.series);
            const props = {
                chartDataSource: undefined,
                series,
                useDataSources
            };
            const { getByText } = render(React.createElement(StatisticsDataSetting, Object.assign({ type: 'barSeries' }, props)));
            expect(getByText('COUNT')).toBeInTheDocument();
        });
        it('should clean ui when change category type', () => {
            const series = ColumnTemplate.series;
            series[0].id = NumericFields[0];
            series[0].x = StringFields[0];
            series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum);
            const onChange = jest.fn();
            const props = {
                series: Immutable(series),
                useDataSources,
                chartDataSource,
                onChange
            };
            const { getByText, queryByText, queryBySelector, getBySelector } = render(React.createElement(Container, Object.assign({ type: 'barSeries' }, props)));
            expect(getByText('By group')).toBeInTheDocument();
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[0]);
            fireEvent.click(getByText('By group'));
            fireEvent.click(getByText('By field'));
            expect(getByText('By field')).toBeInTheDocument();
            expect(queryBySelector(CategoryFieldSelector)).not.toBeInTheDocument();
            expect(queryByText('SUM')).toBeInTheDocument();
            expect(queryByText(NumericFields[0])).not.toBeInTheDocument();
            const serie = onChange.mock.calls[0][0][0];
            expect(serie.x).toBe('');
            const ds = onChange.mock.calls[0][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: []
                }
            });
        });
        it('test page size change', () => {
            const onChange = jest.fn();
            const series = ColumnTemplate.series;
            series[0].id = NumericFields[0];
            series[0].x = StringFields[0];
            series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum);
            chartDataSource = chartDataSource.setIn(['query', 'pageSize'], '99');
            const props = { series: Immutable(series), useDataSources, chartDataSource, onChange };
            const { getByText, getByDisplayValue, getBySelector } = render(React.createElement(Container, Object.assign({ type: 'barSeries' }, props)));
            const input = getByDisplayValue('99');
            fireEvent.input(input, { target: { value: '10' } });
            fireEvent.blur(input);
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent('Year');
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getByDisplayValue('10')).toBeInTheDocument();
            const pageSize = onChange.mock.calls[0][1].query.pageSize;
            expect(pageSize).toBe(10);
        });
    });
});
//# sourceMappingURL=serial-data-setting.test.js.map