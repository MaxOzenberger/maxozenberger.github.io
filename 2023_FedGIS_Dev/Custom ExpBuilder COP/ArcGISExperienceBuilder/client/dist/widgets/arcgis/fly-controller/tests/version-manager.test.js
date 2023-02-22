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
import { FlyItemMode } from '../src/config';
describe('test 1.5.0', () => {
    const TARGET_VER = '1.5.0';
    const WIDGET_ID = 'widget0';
    it('ver. Dec 2019', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            useMapWidgetIds: [],
            itemsList: [{
                    name: 'ROTATE',
                    isInUse: true,
                    direction: 'CCW'
                }, {
                    name: 'PATH',
                    isInUse: true,
                    direction: 'FORWARD',
                    style: 'CURVED'
                }],
            layout: 'HORIZONTAL'
        });
        yield versionManager.upgrade(oldConfig, '1.0.0', TARGET_VER, WIDGET_ID).then((newConfig) => {
            const itemsList = newConfig.itemsList;
            // 1.FlyItemMode.Rotate
            expect(itemsList[0].uuid).toBe('0');
            // 2.FlyItemMode.Path
            expect(itemsList[1].uuid).toBe('1');
            // 3.FlyItemMode.Route
            const routeItem = itemsList[2];
            expect(routeItem.uuid).toBe('2');
            expect(routeItem.name).toBe(FlyItemMode.Route);
            expect(routeItem.isInUse).toBe(false);
            expect(routeItem.routes).toStrictEqual([]);
        });
    }));
    it('ver. 15 Apr 2020', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            useMapWidgetIds: [],
            itemsList: [{
                    name: 'ROTATE',
                    isInUse: true,
                    direction: 'CCW'
                }, {
                    name: 'PATH',
                    isInUse: true,
                    direction: 'FORWARD',
                    style: 'CURVED'
                }, {
                    name: 'RECORD',
                    isInUse: true,
                    records: []
                }
            ],
            layout: 'HORIZONTAL'
        });
        yield versionManager.upgrade(oldConfig, '1.2.0', TARGET_VER, WIDGET_ID).then((newConfig) => {
            const itemsList = newConfig.itemsList;
            // 1.FlyItemMode.Rotate
            expect(itemsList[0].uuid).toBe('0');
            // 2.FlyItemMode.Path
            expect(itemsList[1].uuid).toBe('1');
            // 3.FlyItemMode.Route
            const routeItem = itemsList[2];
            expect(routeItem.uuid).toBe('2');
            expect(routeItem.name).toBe(FlyItemMode.Route);
            expect(routeItem.isInUse).toBe(false);
            expect(routeItem.routes).toStrictEqual([]);
        });
    }));
    it('ver. 9 May 2020', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            useMapWidgetIds: [],
            itemsList: [{
                    name: 'ROTATE',
                    isInUse: true,
                    direction: 'CCW'
                }, {
                    name: 'PATH',
                    isInUse: true,
                    direction: 'FORWARD',
                    style: 'CURVED'
                }, {
                    name: 'RECORD',
                    isInUse: false,
                    records: []
                }],
            layout: 'HORIZONTAL'
        });
        yield versionManager.upgrade(oldConfig, '1.2.0', TARGET_VER, WIDGET_ID).then((newConfig) => {
            const itemsList = newConfig.itemsList;
            // 1.FlyItemMode.Rotate
            expect(itemsList[0].uuid).toBe('0');
            // 2.FlyItemMode.Path
            expect(itemsList[1].uuid).toBe('1');
            // 3.FlyItemMode.Route
            const routeItem = itemsList[2];
            expect(routeItem.uuid).toBe('2');
            expect(routeItem.name).toBe(FlyItemMode.Route);
            expect(routeItem.isInUse).toBe(false);
            expect(routeItem.routes).toStrictEqual([]);
        });
    }));
    it('ver. 27 Sep 2020', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            useMapWidgetIds: [],
            itemsList: [{
                    name: 'ROTATE',
                    isInUse: true,
                    direction: 'CCW'
                }, {
                    name: 'PATH',
                    isInUse: true,
                    direction: 'FORWARD',
                    style: 'CURVED'
                }, {
                    name: 'RECORD',
                    isInUse: false,
                    routes: []
                }],
            layout: 'HORIZONTAL'
        });
        yield versionManager.upgrade(oldConfig, '1.2.0', TARGET_VER, WIDGET_ID).then((newConfig) => {
            const itemsList = newConfig.itemsList;
            // 1.FlyItemMode.Rotate
            expect(itemsList[0].uuid).toBe('0');
            // 2.FlyItemMode.Path
            expect(itemsList[1].uuid).toBe('1');
            // 3.FlyItemMode.Route
            const routeItem = itemsList[2];
            expect(routeItem.uuid).toBe('2');
            expect(routeItem.name).toBe(FlyItemMode.Route);
            expect(routeItem.isInUse).toBe(false);
            expect(routeItem.routes).toStrictEqual([]);
        });
    }));
    it('ver. 10 Oct 2020 ', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            useMapWidgetIds: [],
            itemsList: [{
                    name: 'ROTATE',
                    isInUse: true,
                    direction: 'CCW'
                }, {
                    name: 'PATH',
                    isInUse: true,
                    direction: 'FORWARD',
                    style: 'CURVED'
                }, {
                    name: 'RECORD',
                    isInUse: true,
                    routes: []
                }],
            layout: 'HORIZONTAL'
        });
        yield versionManager.upgrade(oldConfig, '1.2.0', TARGET_VER, WIDGET_ID).then((newConfig) => {
            const itemsList = newConfig.itemsList;
            // 1.FlyItemMode.Rotate
            expect(itemsList[0].uuid).toBe('0');
            // 2.FlyItemMode.Path
            expect(itemsList[1].uuid).toBe('1');
            // 3.FlyItemMode.Route
            const routeItem = itemsList[2];
            expect(routeItem.uuid).toBe('2');
            expect(routeItem.name).toBe(FlyItemMode.Route);
            expect(routeItem.isInUse).toBe(false);
            expect(routeItem.routes).toStrictEqual([]);
        });
    }));
    it('ver. 20 Oct 2020 ', () => __awaiter(void 0, void 0, void 0, function* () {
        const oldConfig = Immutable({
            useMapWidgetIds: [],
            itemsList: [{
                    name: 'ROTATE',
                    isInUse: true,
                    direction: 'CCW'
                }, {
                    name: 'PATH',
                    isInUse: true,
                    direction: 'FORWARD',
                    style: 'CURVED'
                }, {
                    name: 'ROUTE',
                    isInUse: true,
                    routes: []
                }],
            layout: 'HORIZONTAL'
        });
        yield versionManager.upgrade(oldConfig, '1.2.0', TARGET_VER, WIDGET_ID).then((newConfig) => {
            const itemsList = newConfig.itemsList;
            // 1.FlyItemMode.Rotate
            expect(itemsList[0].uuid).toBe('0');
            // 2.FlyItemMode.Path
            expect(itemsList[1].uuid).toBe('1');
            // 3.FlyItemMode.Route
            const routeItem = itemsList[2];
            expect(routeItem.uuid).toBe('2');
            expect(routeItem.name).toBe(FlyItemMode.Route);
            expect(routeItem.isInUse).toBe(false);
            expect(routeItem.routes).toStrictEqual([]);
        });
    }));
});
//# sourceMappingURL=version-manager.test.js.map