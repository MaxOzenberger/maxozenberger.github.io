import { React, Immutable, getAppStore, appActions, DataSourceTypes } from 'jimu-core';
import DynamicUrlSetting from '../src/setting/components/dynamicurl-setting';
import { mockTheme, wrapWidget, widgetRender, getInitState } from 'jimu-for-test';
import { DynamicUrlType } from '../src/config';
jest.mock('jimu-core', () => {
    const ds = {
        supportAttachment: () => false,
        supportSymbol: () => true
    };
    return Object.assign(Object.assign({}, jest.requireActual('jimu-core')), { DataSourceComponent: jest.fn((props) => React.createElement("div", { "data-testid": 'dataSourceTest' }, props.children(ds))) });
});
const useDataSource = {
    dataSourceId: 'ds3',
    mainDataSourceId: 'ds3'
};
const props = {
    dynamicUrlType: DynamicUrlType.Attachment,
    srcExpression: null,
    useDataSources: Immutable([useDataSource]),
    isSrcPopupOpen: false,
    widgetId: 'dynamicUrlSettingTest1',
    isSelectedFromRepeatedDataSourceContext: false,
    useDataSourceForMainDataAndViewSelector: Immutable({}),
    onDynamicUrlTypeChanged: jest.fn(),
    onSrcExpChange: jest.fn(),
    openSrcPopup: jest.fn(),
    closeSrcPopup: jest.fn(),
    onSelectedUseDsChangeForSymbol: jest.fn(),
    onSelectedUseDsChangeForAttachment: jest.fn(),
    onTypeNoSupportChange: jest.fn(() => (props.dynamicUrlType = null))
};
const initState = getInitState().merge({
    appConfig: {
        widgets: [],
        dialogs: [],
        dataSources: {
            ds3: {
                id: 'ds3',
                type: DataSourceTypes.FeatureLayer
            }
        }
    }
});
getAppStore().dispatch(appActions.updateStoreState(initState));
describe('image setting test', function () {
    let render = null;
    beforeAll(() => {
        render = widgetRender(getAppStore(), mockTheme);
    });
    afterAll(() => {
        render = null;
    });
    it('attachment tag should not be render when not support attachment', () => {
        const Widget = wrapWidget(DynamicUrlSetting, { theme: mockTheme });
        const { queryByTestId, getByTestId, rerender } = render(React.createElement(Widget, Object.assign({}, props)));
        rerender(React.createElement(Widget, Object.assign({}, Object.assign({}, props))));
        expect(getByTestId('dynamicurl-expression')).toBeChecked();
        expect(queryByTestId('dynamicurl-attachment')).toBeFalsy();
    });
});
//# sourceMappingURL=dynamicurl-setting.test.js.map