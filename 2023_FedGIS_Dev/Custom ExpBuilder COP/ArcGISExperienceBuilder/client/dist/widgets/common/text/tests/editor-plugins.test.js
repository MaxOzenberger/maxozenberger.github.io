import { React } from 'jimu-core';
import { render } from '@testing-library/react';
import * as MutationObserver from 'mutation-observer';
import { Editor } from '../src/runtime/builder/editor';
import { mockGetSelection } from 'jimu-for-test';
import '@testing-library/jest-dom/extend-expect';
jest.mock('../src/runtime/builder/plugins', () => {
    return {
        TextPlugins: ({ widgetId }) => React.createElement("div", null, widgetId)
    };
});
const WIDGETID = 'widget_1';
let useDataSources = null;
describe('<EditorPlugins />', () => {
    beforeAll(() => {
        global.MutationObserver = MutationObserver;
        mockGetSelection(global);
        useDataSources = [{ dataSourceId: 'ds_1' }];
    });
    it('props: onCreate, onDestory', () => {
        const onCreate = jest.fn();
        const onDestory = jest.fn();
        let formats = ['bold'];
        const { queryByText, rerender, unmount } = render(React.createElement(Editor, { formats: formats, enabled: false, value: 'foo', widgetId: WIDGETID, useDataSources: useDataSources, onCreate: onCreate, onDestory: onDestory }));
        expect(queryByText(WIDGETID)).toBeInTheDOM();
        expect(onDestory).toBeCalledTimes(0);
        expect(onCreate).toBeCalledTimes(1);
        rerender(React.createElement(Editor, { formats: formats, enabled: false, value: 'foo', widgetId: WIDGETID, useDataSources: useDataSources, onCreate: onCreate, onDestory: onDestory }));
        expect(onDestory).toBeCalledTimes(0);
        expect(onCreate).toBeCalledTimes(1);
        formats = ['strike'];
        rerender(React.createElement(Editor, { formats: formats, enabled: false, value: 'foo', widgetId: WIDGETID, useDataSources: useDataSources, onCreate: onCreate, onDestory: onDestory }));
        expect(onDestory).toBeCalledTimes(1);
        expect(onCreate).toBeCalledTimes(2);
        unmount();
        expect(onDestory).toBeCalledTimes(2);
        expect(onCreate).toBeCalledTimes(2);
    });
});
//# sourceMappingURL=editor-plugins.test.js.map