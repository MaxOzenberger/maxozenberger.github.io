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
import { React, getAppStore, Immutable } from 'jimu-core';
import { withStoreThemeIntlRender, mockTheme } from 'jimu-for-test';
import { ByFieldData } from '../../../src/setting/settings/chart/web-chart/common-sections/data/statistics/by-field';
import { MockNumericInput } from '../mock-numeric-input';
import { NumericFields } from '../mock-field-selector';
import { ByFieldSeriesX, ByFieldSeriesY } from '../../../src/constants';
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
    return (React.createElement(ByFieldData, Object.assign({}, others, { chartDataSource: dataSource, series: series, onChange: handleChange })));
};
const chartDataSource = Immutable({
    query: {
        outStatistics: [{
                statisticType: 'sum',
                onStatisticField: NumericFields[0],
                outStatisticFieldName: NumericFields[0]
            }],
        orderByFields: [`${ByFieldSeriesX} ASC`]
    }
});
describe('<ByFieldData />', () => {
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
            const { getByText, queryBySelector } = render(React.createElement(ByFieldData, Object.assign({}, props)));
            expect(getByText('SUM')).toBeInTheDocument();
            expect(queryBySelector(CategoryFieldSelector)).not.toBeInTheDocument();
        });
    });
    describe('work well for exist series', () => {
        it('normal numeric fields change', () => {
            const onChange = jest.fn();
            const series = ColumnTemplate.series;
            series[0].id = ByFieldSeriesY;
            series[0].x = ByFieldSeriesX;
            series[0].y = ByFieldSeriesY;
            const props = {
                chartDataSource,
                series: Immutable(series),
                useDataSources,
                onChange
            };
            const { getByText, queryByText, getBySelector, getAllBySelector } = render(React.createElement(Container, Object.assign({}, props)));
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category axis');
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getByText(NumericFields[1])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category axis');
            let serie = onChange.mock.calls[0][0][0];
            expect(serie.type).toBe('barSeries');
            expect(serie.stackedType).toBe('sideBySide');
            expect(serie.x).toBe(ByFieldSeriesX);
            expect(serie.y).toBe(ByFieldSeriesY);
            let ds = onChange.mock.calls[0][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: NumericFields[0],
                            outStatisticFieldName: NumericFields[0]
                        }, {
                            statisticType: 'sum',
                            onStatisticField: NumericFields[1],
                            outStatisticFieldName: NumericFields[1]
                        }],
                    orderByFields: [`${ByFieldSeriesX} ASC`],
                    pageSize: undefined
                }
            });
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[0]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(queryByText(NumericFields[0])).not.toBeInTheDocument();
            expect(getByText(NumericFields[1])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category axis');
            serie = onChange.mock.calls[1][0][0];
            expect(serie.type).toBe('barSeries');
            expect(serie.stackedType).toBe('sideBySide');
            expect(serie.x).toBe(ByFieldSeriesX);
            expect(serie.y).toBe(ByFieldSeriesY);
            ds = onChange.mock.calls[1][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: NumericFields[1],
                            outStatisticFieldName: NumericFields[1]
                        }],
                    orderByFields: [`${ByFieldSeriesX} ASC`],
                    pageSize: undefined
                }
            });
        });
        it('uncheck all numeric fields', () => {
            const onChange = jest.fn();
            const series = ColumnTemplate.series;
            series[0].id = ByFieldSeriesY;
            series[0].x = ByFieldSeriesX;
            series[0].y = ByFieldSeriesY;
            const props = {
                chartDataSource,
                series: Immutable(series),
                useDataSources,
                onChange
            };
            const { getByText, queryByText, getBySelector, getAllBySelector } = render(React.createElement(Container, Object.assign({}, props)));
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[0]);
            expect(queryByText(NumericFields[0])).not.toBeInTheDocument();
            expect(queryByText(NumericFields[1])).not.toBeInTheDocument();
            let serie = onChange.mock.calls[0][0][0];
            expect(serie.type).toBe('barSeries');
            expect(serie.stackedType).toBe('sideBySide');
            expect(serie.x).toBe(ByFieldSeriesX);
            expect(serie.y).toBe(ByFieldSeriesY);
            let ds = onChange.mock.calls[0][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [],
                    orderByFields: [`${ByFieldSeriesX} ASC`],
                    pageSize: undefined
                }
            });
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1]);
            expect(getByText('SUM')).toBeInTheDocument();
            expect(queryByText(NumericFields[0])).not.toBeInTheDocument();
            expect(getByText(NumericFields[1])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category axis');
            serie = onChange.mock.calls[1][0][0];
            expect(serie.type).toBe('barSeries');
            expect(serie.stackedType).toBe('sideBySide');
            expect(serie.x).toBe(ByFieldSeriesX);
            expect(serie.y).toBe(ByFieldSeriesY);
            ds = onChange.mock.calls[1][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: NumericFields[1],
                            outStatisticFieldName: NumericFields[1]
                        }],
                    orderByFields: [`${ByFieldSeriesX} ASC`],
                    pageSize: undefined
                }
            });
        });
        it('statistic type change', () => {
            const onChange = jest.fn();
            const propSeries = ColumnTemplate.series;
            propSeries[0].id = ByFieldSeriesY;
            propSeries[0].x = ByFieldSeriesX;
            propSeries[0].y = ByFieldSeriesY;
            const props = {
                chartDataSource,
                series: Immutable(propSeries),
                useDataSources,
                onChange
            };
            const { getByText, getBySelector, getAllBySelector } = render(React.createElement(Container, Object.assign({}, props)));
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category axis');
            fireEvent.click(getBySelector(NumericFieldSelector));
            fireEvent.click(getAllBySelector(NumericFieldSelectItem)[1]);
            expect(getByText(NumericFields[1])).toBeInTheDocument();
            fireEvent.click(getByText('SUM'));
            fireEvent.click(getByText('MAX'));
            expect(getByText('MAX')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            const series = onChange.mock.calls[1][0];
            expect(series.length).toBe(1);
            expect(series[0].type).toBe('barSeries');
            expect(series[0].stackedType).toBe('sideBySide');
            expect(series[0].x).toBe(ByFieldSeriesX);
            expect(series[0].y).toBe(ByFieldSeriesY);
            const ds = onChange.mock.calls[1][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'max',
                            onStatisticField: NumericFields[0],
                            outStatisticFieldName: NumericFields[0]
                        }, {
                            statisticType: 'max',
                            onStatisticField: NumericFields[1],
                            outStatisticFieldName: NumericFields[1]
                        }],
                    orderByFields: [`${ByFieldSeriesX} ASC`],
                    pageSize: undefined
                }
            });
        });
        it('order by fields change', () => {
            const onChange = jest.fn();
            const series = ColumnTemplate.series;
            series[0].id = ByFieldSeriesY;
            series[0].x = ByFieldSeriesX;
            series[0].y = ByFieldSeriesY;
            const props = {
                chartDataSource,
                series: Immutable(series),
                useDataSources,
                onChange
            };
            const { getByText, getBySelector, getAllBySelector } = render(React.createElement(Container, Object.assign({}, props)));
            expect(getByText('SUM')).toBeInTheDocument();
            expect(getByText(NumericFields[0])).toBeInTheDocument();
            expect(getBySelector(SortFieldSelector)).toHaveTextContent('Category axis');
            fireEvent.click(getBySelector(SortFieldSelector));
            fireEvent.click(getAllBySelector(SortFieldSelectorItem)[1]);
            expect(getBySelector(SortFieldSelector)).toHaveTextContent('Value axis');
            const ds = onChange.mock.calls[0][1];
            expect(ds).toEqual({
                query: {
                    outStatistics: [{
                            statisticType: 'sum',
                            onStatisticField: NumericFields[0],
                            outStatisticFieldName: NumericFields[0]
                        }],
                    orderByFields: [`${ByFieldSeriesY} ASC`],
                    pageSize: undefined
                }
            });
        });
    });
});
//# sourceMappingURL=by-field.test.js.map