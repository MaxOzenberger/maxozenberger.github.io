import { JimuFieldType } from 'jimu-core';
import checkChartSpec from '../../../src/setting/settings/chart-type-selector/utils/check-chart-spec';
jest.mock('../../../src/utils/common', () => {
    return Object.assign(Object.assign({}, jest.requireActual('../../../src/utils/common')), { getFieldType: (jimuFieldName, dataSourceId) => {
            if (jimuFieldName === 'date') {
                return JimuFieldType.Date;
            }
            else {
                return JimuFieldType.String;
            }
        } });
});
describe('checkChartSpec', () => {
    it('Check series type', () => {
        expect(checkChartSpec({
            series: []
        }).error).toBe('Invalid series type');
        expect(checkChartSpec({
            series: [{ type: 'histogramSeries' }]
        }).error).toBe('Unsupported type: histogramSeries.');
        expect(checkChartSpec({
            series: [{ type: 'barSeries' }]
        }).valid).toBe(true);
    });
    it('Check series where', () => {
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    query: {
                        where: '1=1'
                    }
                }]
        }).valid).toBe(true);
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    query: {}
                }]
        }).valid).toBe(true);
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    query: {
                        where: 'field="foo"'
                    }
                }]
        }).error).toBe('Check that there is where in the series: field="foo", split by field is not supported now');
    });
    it('Check series color type', () => {
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    colorType: 'singleColor'
                }]
        }).valid).toBe(true);
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    colorType: 'colorMatch'
                }]
        }).warning).toBe('Unsupported color type: colorMatch, will fallback to "singleColor"');
    });
    it('Check series field', () => { });
    it('Check chart query', () => {
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    query: {
                        groupByFieldsForStatistics: ['foo'],
                        outStatistics: [{
                                statisticType: 'sum',
                                onStatisticField: 'bar',
                                outStatisticFieldName: 'bar_sum'
                            }]
                    }
                }]
        }).valid).toBe(true);
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    query: {
                        groupByFieldsForStatistics: ['foo']
                    }
                }]
        }).error).toBe('No aggregation is not supported now.');
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    query: {
                        groupByFieldsForStatistics: ['foo'],
                        outStatistics: [{
                                statisticType: 'percentile_cont',
                                onStatisticField: 'bar',
                                outStatisticFieldName: 'bar_percentile_cont'
                            }]
                    }
                }]
        }).error).toBe('Unsupported statistic type: percentile_cont.');
    });
    it('Check chart query with date field', () => {
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    x: 'foo'
                }]
        }).valid).toBe(true);
        expect(checkChartSpec({
            series: [{
                    type: 'barSeries',
                    x: 'date'
                }]
        }).error).toBe('Date field is not supported.');
    });
});
//# sourceMappingURL=check-chart-spec.test.js.map