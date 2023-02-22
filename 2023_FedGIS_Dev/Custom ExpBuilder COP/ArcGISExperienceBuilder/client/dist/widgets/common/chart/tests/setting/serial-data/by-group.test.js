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
import { fireEvent } from '@testing-library/react';
import { React, getAppStore, Immutable, StatisticType } from 'jimu-core';
import { withStoreThemeIntlRender, mockTheme } from 'jimu-for-test';
import { ByGroupData } from '../../../src/setting/settings/chart/web-chart/common-sections/data/statistics/by-group';
import { MockNumericInput } from '../mock-numeric-input';
import { NumericFields, StringFields } from '../mock-field-selector';
import { getOutStatisticName } from '../../../src/utils/common/serial';
const ColumnTemplate = require('../../../src/setting/template/column.json');
jest.mock('jimu-ui', () => {
    return Object.assign(Object.assign({}, jest.requireActual('jimu-ui')), { NumericInput: () => MockNumericInput });
});
jest.mock('../../../src/utils/common', () => {
    return Object.assign(Object.assign({}, jest.requireActual('../../../src/utils/common')), { getObjectIdField: () => 'FID' });
});
jest.mock('../../../src/setting/settings/chart/web-chart/components', () => {
    return Object.assign(Object.assign({}, jest.requireActual('../../../src/setting/settings/chart/web-chart/components')), { FieldSelector: require('../mock-field-selector').MockFieldSelector });
});
const CategoryFieldSelector = '.category-field-selector .selected-field-item';
const NumericFieldSelector = '.numeric-fields-selector .selected-fields';
const NumericFieldSelectItem = '.numeric-fields-selector .field-selector-item';
const SortFieldSelector = '.sort-select .dropdown-button-content';
const SortFieldSelectorItem = '.dropdown-menu .dropdown-item';
const Container = (props) => {
    const { series: propSeries, chartDataSource: propDataSource, onChange } = props, others = __rest(props, ["series", "chartDataSource", "onChange"]);
    const [series, setSeries] = React.useState(propSeries);
    const [dataSource, setDataSource] = React.useState(propDataSource);
    const handleChange = (series, { chartDataSource }) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(series, chartDataSource);
        setSeries(series);
        setDataSource(chartDataSource);
    };
    return (React.createElement(ByGroupData, Object.assign({}, others, { chartDataSource: dataSource, series: series, onChange: handleChange })));
};
const chartDataSource = Immutable({
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
describe('<ByGroupData />', () => {
    let useDataSources = null;
    let render = null;
    beforeAll(() => {
        useDataSources = [
            {
                dataSourceId: 'ds1',
                mainDataSourceId: 'ds1'
            }
        ];
        render = withStoreThemeIntlRender(getAppStore(), mockTheme);
    });
    describe('work well for empty seies', () => {
        it('should render well', () => {
            const series = Immutable(ColumnTemplate.series);
            const props = {
                chartDataSource: undefined,
                series,
                useDataSources
            };
            const { getByText, queryBySelector } = render(React.createElement(ByGroupData, Object.assign({ type: 'barSeries' }, props)));
            expect(getByText('COUNT')).toBeInTheDocument();
            expect(queryBySelector(NumericFieldSelector)).not.toBeInTheDocument();
        });
        it('category field change', () => {
            const onChange = jest.fn();
            const series = Immutable(ColumnTemplate.series);
            const props = {
                chartDataSource: undefined,
                series,
                useDataSources,
                onChange
            };
            const { getByText, getBySelector } = render(React.createElement(Container, Object.assign({ type: 'barSeries' }, props)));
            fireEvent.click(getBySelector(CategoryFieldSelector));
            fireEvent.click(getByText(StringFields[1]));
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[1]);
            expect(getByText('COUNT')).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[1]);
            const serie = onChange.mock.calls[0][0][0];
            expect(serie.type).toBe('barSeries');
            expect(serie.stackedType).toBe('sideBySide');
            expect(serie.id).toBe('FID');
            expect(serie.x).toBe(StringFields[1]);
            expect(serie.y).toBe('FID_count');
            const ds = onChange.mock.calls[0][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'count',
                            onStatisticField: 'FID',
                            outStatisticFieldName: 'FID_count'
                        }],
                    groupByFieldsForStatistics: [StringFields[1]],
                    orderByFields: [`${StringFields[1]} ASC`],
                    pageSize: undefined
                }
            });
        });
    });
    describe('work well for exist series', () => {
        it('category field change', () => {
            const onChange = jest.fn();
            const series = ColumnTemplate.series;
            series[0].id = NumericFields[0];
            series[0].x = StringFields[0];
            series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum);
            const props = {
                chartDataSource,
                series: Immutable(series),
                useDataSources,
                onChange
            };
            const { getByText, getBySelector } = render(React.createElement(Container, Object.assign({ type: 'barSeries' }, props)));
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[0]);
            fireEvent.click(getBySelector(CategoryFieldSelector));
            fireEvent.click(getByText(StringFields[1]));
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[1]);
            expect(getByText('SUM')).toBeInTheDocument();
            const serie = onChange.mock.calls[0][0][0];
            expect(serie.type).toBe('barSeries');
            expect(serie.stackedType).toBe('sideBySide');
            expect(serie.x).toBe(StringFields[1]);
            expect(serie.y).toBe(`${NumericFields[0]}_sum`);
            const ds = onChange.mock.calls[0][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: NumericFields[0],
                            outStatisticFieldName: `${NumericFields[0]}_sum`
                        }],
                    groupByFieldsForStatistics: [StringFields[1]],
                    orderByFields: [`${StringFields[1]} ASC`],
                    pageSize: undefined
                }
            });
        });
        it('normal numeric fields change', () => {
            const onChange = jest.fn();
            const series = ColumnTemplate.series;
            series[0].id = NumericFields[0];
            series[0].x = StringFields[0];
            series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum);
            const props = {
                chartDataSource,
                series: Immutable(series),
                useDataSources,
                onChange
            };
            const { getByText, queryByText, getBySelector, getAllBySelector } = render(React.createElement(Container, Object.assign({ type: 'barSeries' }, props)));
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[0]);
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1]);
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getByText(NumericFields[1])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[0]);
            let serie = onChange.mock.calls[0][0][1];
            expect(serie.type).toBe('barSeries');
            expect(serie.stackedType).toBe('sideBySide');
            expect(serie.x).toBe(StringFields[0]);
            expect(serie.y).toBe(`${NumericFields[1]}_sum`);
            let ds = onChange.mock.calls[0][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: NumericFields[0],
                            outStatisticFieldName: `${NumericFields[0]}_sum`
                        }, {
                            statisticType: 'sum',
                            onStatisticField: NumericFields[1],
                            outStatisticFieldName: `${NumericFields[1]}_sum`
                        }],
                    groupByFieldsForStatistics: [StringFields[0]],
                    orderByFields: [`${StringFields[0]} ASC`],
                    pageSize: undefined
                }
            });
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[0]);
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(queryByText(NumericFields[0])).not.toBeInTheDocument();
            expect(getByText(NumericFields[1])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[0]);
            serie = onChange.mock.calls[1][0][0];
            expect(serie.type).toBe('barSeries');
            expect(serie.stackedType).toBe('sideBySide');
            expect(serie.x).toBe(StringFields[0]);
            expect(serie.y).toBe(`${NumericFields[1]}_sum`);
            ds = onChange.mock.calls[1][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: NumericFields[1],
                            outStatisticFieldName: `${NumericFields[1]}_sum`
                        }],
                    groupByFieldsForStatistics: [StringFields[0]],
                    orderByFields: [`${StringFields[0]} ASC`],
                    pageSize: undefined
                }
            });
        });
        it('uncheck all numeric fields', () => {
            const onChange = jest.fn();
            const series = ColumnTemplate.series;
            series[0].id = NumericFields[0];
            series[0].x = StringFields[0];
            series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum);
            const props = {
                chartDataSource,
                series: Immutable(series),
                useDataSources,
                onChange
            };
            const { getByText, queryByText, getBySelector, getAllBySelector } = render(React.createElement(Container, Object.assign({ type: 'barSeries' }, props)));
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[0]);
            expect(queryByText(NumericFields[0])).not.toBeInTheDocument();
            expect(queryByText(NumericFields[1])).not.toBeInTheDocument();
            let serie = onChange.mock.calls[0][0][0];
            expect(serie).toBeUndefined();
            let ds = onChange.mock.calls[0][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: '',
                            outStatisticFieldName: ''
                        }],
                    groupByFieldsForStatistics: [StringFields[0]],
                    orderByFields: [`${StringFields[0]} ASC`],
                    pageSize: undefined
                }
            });
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1]);
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(queryByText(NumericFields[0])).not.toBeInTheDocument();
            expect(getByText(NumericFields[1])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[0]);
            serie = onChange.mock.calls[1][0][0];
            expect(serie.type).toBe('barSeries');
            expect(serie.stackedType).toBe('sideBySide');
            expect(serie.x).toBe(StringFields[0]);
            expect(serie.y).toBe(`${NumericFields[1]}_sum`);
            ds = onChange.mock.calls[1][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: NumericFields[1],
                            outStatisticFieldName: `${NumericFields[1]}_sum`
                        }],
                    groupByFieldsForStatistics: [StringFields[0]],
                    orderByFields: [`${StringFields[0]} ASC`],
                    pageSize: undefined
                }
            });
        });
        it('statisticType fields change', () => {
            const onChange = jest.fn();
            const propSeries = ColumnTemplate.series;
            propSeries[0].x = StringFields[0];
            propSeries[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum);
            const props = {
                chartDataSource: chartDataSource.setIn(['query', 'orderByFields'], [`${getOutStatisticName(NumericFields[0], StatisticType.Sum)} ASC`]),
                series: Immutable(propSeries),
                useDataSources,
                onChange
            };
            const { getByText, getAllByText, getBySelector, queryBySelector, getAllBySelector } = render(React.createElement(Container, Object.assign({ type: 'barSeries' }, props)));
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getAllByText(NumericFields[0])[0]).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(NumericFields[0]);
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1]);
            expect(getByText(NumericFields[1])).toBeInTheDocument();
            fireEvent.click(getByText('SUM'));
            fireEvent.click(getByText('MAX'));
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('MAX')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[0]);
            let series = onChange.mock.calls[1][0];
            expect(series.length).toBe(2);
            expect(series[0].type).toBe('barSeries');
            expect(series[0].stackedType).toBe('sideBySide');
            expect(series[0].x).toBe(StringFields[0]);
            expect(series[0].y).toBe(`${NumericFields[0]}_max`);
            let ds = onChange.mock.calls[1][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'max',
                            onStatisticField: NumericFields[0],
                            outStatisticFieldName: `${NumericFields[0]}_max`
                        }, {
                            statisticType: 'max',
                            onStatisticField: NumericFields[1],
                            outStatisticFieldName: `${NumericFields[1]}_max`
                        }],
                    groupByFieldsForStatistics: [StringFields[0]],
                    orderByFields: [`${StringFields[0]} ASC`],
                    pageSize: undefined
                }
            });
            fireEvent.click(getByText('MAX'));
            fireEvent.click(getByText('COUNT'));
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('COUNT')).toBeInTheDocument();
            expect(queryBySelector('.numeric-fields-selector')).not.toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[0]);
            series = onChange.mock.calls[2][0];
            expect(series.length).toBe(1);
            expect(series[0].type).toBe('barSeries');
            expect(series[0].stackedType).toBe('sideBySide');
            expect(series[0].x).toBe(StringFields[0]);
            expect(series[0].y).toBe('FID_count');
            ds = onChange.mock.calls[2][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'count',
                            onStatisticField: 'FID',
                            outStatisticFieldName: 'FID_count'
                        }],
                    groupByFieldsForStatistics: [StringFields[0]],
                    orderByFields: [`${StringFields[0]} ASC`],
                    pageSize: undefined
                }
            });
        });
        it('order by fields change', () => {
            const onChange = jest.fn();
            const series = ColumnTemplate.series;
            series[0].id = NumericFields[0];
            series[0].x = StringFields[0];
            series[0].y = getOutStatisticName(NumericFields[0], StatisticType.Sum);
            const props = {
                chartDataSource,
                series: Immutable(series),
                useDataSources,
                onChange
            };
            const { getByText, getBySelector, getAllBySelector } = render(React.createElement(Container, Object.assign({ type: 'barSeries' }, props)));
            expect(getBySelector(CategoryFieldSelector)).toHaveTextContent(StringFields[0]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(StringFields[0]);
            fireEvent.click(getBySelector(SortFieldSelector));
            fireEvent.click(getAllBySelector(SortFieldSelectorItem)[1]);
            expect(getBySelector(SortFieldSelector)).toHaveTextContent(NumericFields[0]);
            const ds = onChange.mock.calls[0][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: NumericFields[0],
                            outStatisticFieldName: `${NumericFields[0]}_sum`
                        }],
                    groupByFieldsForStatistics: [StringFields[0]],
                    orderByFields: [`${NumericFields[0]}_sum ASC`],
                    pageSize: undefined
                }
            });
        });
    });
});
//# sourceMappingURL=by-group.test.js.map