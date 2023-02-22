var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, Immutable, getAppStore, appActions, BrowserSizeMode, AppMode } from 'jimu-core';
import { wrapWidget, widgetRender, getInitState, mockTheme } from 'jimu-for-test';
import { fireEvent, waitFor } from '@testing-library/react';
import ShareWidget from '../src/runtime/widget';
const initState = getInitState().merge({
    appContext: { isRTL: false },
    appConfig: { widgets: [] }
});
getAppStore().dispatch(appActions.updateStoreState(initState));
describe('share popup test', function () {
    let render;
    beforeAll(() => {
        render = widgetRender(getAppStore(), mockTheme);
    });
    it('show popup after click popupBtn', () => __awaiter(this, void 0, void 0, function* () {
        const config = Immutable({
            uiMode: 'POPUP',
            popup: {
                icon: '',
                items: ['embed', 'qrcode', 'email', 'facebook', 'twitter', 'pinterest', 'linkedin'],
                tooltip: ''
            },
            inline: {
                items: ['facebook', 'twitter', 'pinterest', 'linkedin', 'embed', 'qrcode', 'email', 'sharelink'],
                design: {
                    direction: 'HORIZONTAL',
                    hideLabel: false,
                    btnRad: 0,
                    btnColor: '',
                    iconColor: '',
                    size: 'default'
                }
            }
        });
        const props = {
            dispatch: jest.fn(),
            config,
            appInfo: { name: 'test share name' },
            appConfig: initState.appConfig,
            browserSizeMode: BrowserSizeMode.Small,
            isLiveViewMode: AppMode.Run
        };
        const widgetRef = { current: null };
        const Widget = wrapWidget(ShareWidget, { theme: mockTheme, ref: widgetRef });
        const { queryByTestId } = render(React.createElement(Widget, Object.assign({ widgetId: 'shareTest1' }, props)));
        // click popupBtn
        const btn = queryByTestId('popupBtn');
        fireEvent.click(btn);
        // assert
        yield waitFor(() => {
            const popperState = widgetRef.current.state.isPopupOpen;
            // const popper = queryByTestId('mainPopuper');
            expect(popperState).toBe(true);
        }, { timeout: 500 });
    }));
});
//# sourceMappingURL=popup.test.js.map