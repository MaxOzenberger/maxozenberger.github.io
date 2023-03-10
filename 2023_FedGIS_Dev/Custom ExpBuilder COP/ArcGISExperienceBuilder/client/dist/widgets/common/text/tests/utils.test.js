import * as utils from '../src/runtime/builder/utils';
import { Immutable } from 'jimu-core';
jest.mock('jimu-core', () => {
    return Object.assign(Object.assign({}, jest.requireActual('jimu-core')), { DataSourceManager: {
            getInstance: jest.fn().mockReturnValue({
                getDataSource: (dsid) => {
                    return {
                        id: dsid
                    };
                }
            })
        } });
});
describe('utils test', function () {
    it('test:getUseDataSourceIds', () => {
        const html = `<p> ddd<exp data-uniqueid="e3c" data-dsid="ds_1" data-expression="{name: value}">{Rank}</exp>
    * <a href="#" target="_blank" data-uniqueid="9721" data-dsid="ds_2" data-link="{name:value}">link</a></p>`;
        expect(utils.getUseDataSourceIds(html)).toEqual(['ds_1', 'ds_2']);
    });
    it('test:getInvalidDataSourceIds', () => {
        const html = `<p> ddd<exp data-uniqueid="e3c" data-dsid="ds_1" data-expression="{name: value}">{Rank}</exp>
    * <a href="#" target="_blank" data-uniqueid="9721" data-dsid="ds_2" data-link="{name:value}">link</a></p>`;
        const useDataSources = Immutable([{
                dataSourceId: 'ds_1',
                fields: ['a']
            }]);
        expect(utils.getInvalidDataSourceIds(html, useDataSources)).toEqual(['ds_2']);
    });
    it('test:getExpressionParts', () => {
        const expressions = Immutable({
            exp1: {
                parts: [1]
            },
            exp2: {
                parts: [2]
            }
        });
        expect(utils.getExpressionParts(expressions)).toEqual([1, 2]);
    });
    it('usePlaceholder', () => {
        expect(utils.shouldShowPlaceholder('', 'foo')).toBeTruthy();
        expect(utils.shouldShowPlaceholder('foo', 'bar')).toBeFalsy();
        expect(utils.shouldShowPlaceholder('', 'foo', false)).toBeTruthy();
        expect(utils.shouldShowPlaceholder('', 'foo', true)).toBeFalsy();
    });
    it('useDefaultValue', () => {
        expect(utils.getDefaultValue(true, '', '<strong>foo</strong>')).toBe('<strong>\uFEFF</strong>');
        expect(utils.getDefaultValue(false, '', '<strong>foo</strong>')).toBe('<strong>foo</strong>');
        expect(utils.getDefaultValue(true, 'foo', '<strong>foo</strong>')).toBe('foo');
        expect(utils.getDefaultValue(false, 'foo', '<strong>foo</strong>')).toBe('foo');
    });
});
//# sourceMappingURL=utils.test.js.map