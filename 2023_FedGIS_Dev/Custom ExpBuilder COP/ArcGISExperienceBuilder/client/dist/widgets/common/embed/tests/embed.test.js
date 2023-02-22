import { React, Immutable, getAppStore, appActions, lodash, AppMode } from 'jimu-core';
import EmbedWidget from '../src/runtime/widget';
import { wrapWidget, mockTheme, widgetRender, getInitState } from 'jimu-for-test';
import { EmbedType } from '../src/config';
import { ViewVisibilityContext } from 'jimu-layouts/layout-runtime';
jest.mock('jimu-ui', () => {
    return Object.assign(Object.assign({}, jest.requireActual('jimu-ui')), { DynamicUrlResolver: jest.fn().mockImplementation(props => {
            const { value, onHtmlResolved } = props;
            React.useEffect(() => {
                const resolvedUrl = value.replace(/<[^>]+>/g, '').replace(/\s/g, '');
                onHtmlResolved(resolvedUrl, resolvedUrl === null || resolvedUrl === void 0 ? void 0 : resolvedUrl.includes('{'));
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [value]);
            return null;
        }) });
});
const initState = getInitState().merge({
    appConfig: { widgets: [] }
});
getAppStore().dispatch(appActions.updateStoreState(initState));
describe('embed unit test', function () {
    let render = null;
    beforeAll(() => {
        render = widgetRender(getAppStore(), mockTheme);
    });
    afterAll(() => {
        render = null;
    });
    const config = Immutable({
        embedType: EmbedType.Url,
        embedCode: '',
        expression: '<p>https://nodejs.org/en/</p>'
    });
    let props = {
        config,
        appMode: AppMode.Design
    };
    it.only('safe url should use iframe without sandbox', () => {
        const ref = { current: null };
        const Widget = wrapWidget(EmbedWidget, { theme: mockTheme, ref });
        const { rerender } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest1' }, props))));
        expect(ref.current.ifr.getAttribute('sandbox')).toBeDefined();
        const newConfig = lodash.assign({}, config, {
            expression: '<p>https://doc.arcgis.com/en/experience-builder/configure-widgets/image-widget.htm</p>'
        });
        const newProps = lodash.assign({}, props, { config: newConfig });
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest1' }, newProps))));
        expect(ref.current.ifr.getAttribute('sandbox')).toBeNull();
    });
    it.only('embed should not render when current view is not active', () => {
        const ref = { current: null };
        const Widget = wrapWidget(EmbedWidget, { theme: mockTheme, ref });
        const { queryByTestId, rerender } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: true, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest2' }, props))));
        expect(queryByTestId('embedSandbox')).not.toBeInTheDocument();
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: true, isInCurrentView: true } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest2' }, props))));
        expect(queryByTestId('embedSandbox')).toBeInTheDocument();
    });
    it.only('switch useDs mode to code mode', () => {
        const ref = { current: null };
        const Widget = wrapWidget(EmbedWidget, { theme: mockTheme, ref });
        // url
        const newConfigDs = lodash.assign({}, config, {
            embedType: EmbedType.Url,
            expression: '<p>https://nodejs.org/en/</p>'
        });
        const newPropsDs = lodash.assign({}, props, {
            config: newConfigDs,
            useDataSourcesEnabled: true
        });
        const { getByTestId, queryByTestId, rerender } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest3' }, newPropsDs))));
        // code
        const newConfigCode = lodash.assign({}, config, {
            embedType: EmbedType.Code,
            embedCode: '<div>Test text</div>'
        });
        const newPropsCode = lodash.assign({}, props, { config: newConfigCode });
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest3' }, newPropsCode))));
        expect(getByTestId('embedSandbox').srcdoc).toContain('<div>Test text</div>');
        expect(queryByTestId('test-expressionMask')).not.toBeInTheDocument();
    });
    it.only('runtime mode, embed should load content', () => {
        const ref = { current: null };
        const Widget = wrapWidget(EmbedWidget, { theme: mockTheme, ref });
        const { queryByTestId, rerender } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest4' }, props))));
        props = lodash.assign({}, props, { appMode: AppMode.Run });
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest4' }, props))));
        expect(queryByTestId('embedSandbox')).toBeInTheDocument();
    });
    it.only('autoRefresh config change', () => {
        const ref = { current: null };
        const Widget = wrapWidget(EmbedWidget, { theme: mockTheme, ref });
        const initConfig = lodash.assign({}, config, {
            embedType: EmbedType.Code,
            embedCode: '<h1>111</h1>'
        });
        const initProps = lodash.assign({}, props, { config: initConfig });
        const { getByTestId, rerender } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest5' }, initProps))));
        const current = ref.current;
        expect(getByTestId('embedSandbox').srcdoc).toContain('<h1>111</h1>');
        const newConfig = lodash.assign({}, config, {
            embedType: EmbedType.Code,
            embedCode: '<h1>222</h1>'
        });
        const newProps = lodash.assign({}, props, { config: newConfig });
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest5' }, newProps))));
        expect(getByTestId('embedSandbox').srcdoc).toContain('<h1>222</h1>');
        const newConfigSec = lodash.assign({}, config, {
            embedType: EmbedType.Code,
            embedCode: '<h1>222</h1>',
            autoRefresh: true,
            autoInterval: 0.5
        });
        const newPropsSec = lodash.assign({}, props, { config: newConfigSec });
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest5' }, newPropsSec))));
        expect(current.refreshTimer).toBeDefined();
        expect(current.state.content).toBe('<h1>222</h1>');
    });
    it.only('use label in content placeholder when enableLabel is true', () => {
        const ref = { current: null };
        const Widget = wrapWidget(EmbedWidget, { theme: mockTheme, ref });
        const newConfigDs = lodash.assign({}, config, {
            enableLabel: true,
            label: 'an exp label'
        });
        const newPropsDs = lodash.assign({}, props, {
            config: newConfigDs,
            useDataSourcesEnabled: true
        });
        const { getByText, rerender } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest3' }, newPropsDs))));
        const current = ref.current;
        current.state.resolveErr = true;
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest5' }, newPropsDs))));
        expect(getByText('an exp label')).toBeInTheDocument();
    });
    it.only('domains under *.arcgis.com or *.esri.com, should be considered as the same origin', () => {
        const ref = { current: null };
        const Widget = wrapWidget(EmbedWidget, { theme: mockTheme, ref });
        const newConfig = lodash.assign({}, config, {
            expression: 'https://storymaps.arcgis.com/stories/11e15c74cd224fe88f7b7fc17b7deb7f'
        });
        const newProps = lodash.assign({}, props, { config: newConfig });
        render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest6' }, newProps))));
        const current = ref.current;
        window.location.host = 'use.arcgis.com';
        expect(current.state.loadErr).toBe(false);
    });
    it.only('unresolved url should show content, when enableLabel is true should show use label', () => {
        const ref = { current: null };
        const Widget = wrapWidget(EmbedWidget, { theme: mockTheme, ref });
        const newConfigDs = lodash.assign({}, config, {
            embedType: EmbedType.Url,
            expression: '<p>https://www.baidu.com/?a={name_alias}</p>',
            enableLabel: false,
            label: ''
        });
        const newPropsDs = lodash.assign({}, props, {
            config: newConfigDs,
            useDataSourcesEnabled: true
        });
        const { getByText, rerender } = render(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest7' }, newPropsDs))));
        const current = ref.current;
        expect(current.state.loadErr).toBe(false);
        expect(current.state.resolveErr).toBe(true);
        expect(getByText('https://www.baidu.com/?a={name_alias}')).toBeInTheDocument();
        const newLabelConfigDs = lodash.assign({}, config, {
            embedType: EmbedType.Url,
            expression: '<p>https://www.baidu.com/?a={name_alias}</p>',
            enableLabel: true,
            label: 'embed-label'
        });
        const newLabelPropsDs = lodash.assign({}, props, {
            config: newLabelConfigDs,
            useDataSourcesEnabled: true
        });
        rerender(React.createElement(ViewVisibilityContext.Provider, { value: { isInView: false, isInCurrentView: false } },
            React.createElement(Widget, Object.assign({ widgetId: 'embedTest7' }, newLabelPropsDs))));
        expect(getByText('embed-label')).toBeInTheDocument();
    });
});
//# sourceMappingURL=embed.test.js.map