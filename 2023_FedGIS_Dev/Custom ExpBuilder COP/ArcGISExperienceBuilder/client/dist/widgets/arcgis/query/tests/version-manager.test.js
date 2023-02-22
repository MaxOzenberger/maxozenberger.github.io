var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Immutable } from 'jimu-core';
import { versionManager } from '../src/version-manager';
import { ListDirection, PagingType } from '../src/config';
describe('test 1.5.0', () => {
    it('should add default value for new props', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            queryItems: [{
                    useAttributeFilter: false
                }, {
                    useSpatialFilter: true
                }, {
                    useDataSource: '1'
                }]
        });
        yield versionManager.upgrade(oldConfig, '1.4.0', '1.5.0', 'widget0').then((newConfig) => {
            const queryItems = newConfig.queryItems;
            expect(queryItems[0].useAttributeFilter).toBe(false);
            expect(queryItems[0].useSpatialFilter).toBe(true);
            expect(queryItems[1].useAttributeFilter).toBe(true);
            expect(queryItems[1].useSpatialFilter).toBe(true);
            expect(queryItems[2].useAttributeFilter).toBe(true);
            expect(queryItems[2].useSpatialFilter).toBe(true);
        });
    }));
});
describe('test 1.6.0', () => {
    it('should not change if there is no queryItems', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            queryItems: []
        });
        yield versionManager.upgrade(oldConfig, '1.4.0', '1.6.0', 'widget0').then((newConfig) => {
            expect(newConfig.resultListDirection).toBeUndefined();
            expect(newConfig.resultPagingStyle).toBeUndefined();
        });
    }));
    it('should use the config from the first query item', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            queryItems: [
                { resultListDirection: ListDirection.Horizontal, resultPagingStyle: PagingType.LazyLoad },
                { resultListDirection: ListDirection.Vertical, resultPagingStyle: PagingType.MultiPage }
            ]
        });
        yield versionManager.upgrade(oldConfig, '1.4.0', '1.6.0', 'widget0').then((newConfig) => {
            expect(newConfig.resultListDirection).toBe(ListDirection.Horizontal);
            expect(newConfig.resultPagingStyle).toBe(PagingType.LazyLoad);
        });
    }));
});
//# sourceMappingURL=version-manager.test.js.map