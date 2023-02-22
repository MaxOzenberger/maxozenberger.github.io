var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, Immutable, getAppStore } from 'jimu-core';
import { createIntl } from 'react-intl';
import { defaultMessages } from 'jimu-ui';
import { fireEvent, waitFor } from '@testing-library/react';
import { withStoreThemeIntlRender, mockTheme } from 'jimu-for-test';
import { ShownMode } from '../src/runtime/components/items/base-item';
import { ShareLink } from '../src/runtime/components/items/sharelink';
describe('<ShareLink />', () => {
    const TAR_URL = 'test-url';
    let config;
    let render = null;
    let intl = null;
    beforeAll(() => {
        intl = createIntl({
            locale: 'en',
            defaultLocale: 'en',
            messages: defaultMessages
        });
        render = withStoreThemeIntlRender(getAppStore(), mockTheme);
    });
    afterAll(() => {
        render = null;
    });
    beforeEach(() => {
        config = Immutable({
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
    });
    it('click copy btn', () => __awaiter(void 0, void 0, void 0, function* () {
        const _onCopyFn = jest.fn().mockImplementation((text, result) => {
            expect(text).toBe(TAR_URL);
        });
        const props = {
            uiMode: config.uiMode,
            url: TAR_URL,
            isShowInModal: false,
            shownMode: ShownMode.Content,
            getAppTitle: jest.fn(),
            onItemClick: jest.fn(),
            onBackBtnClick: jest.fn(),
            theme: mockTheme,
            intl: intl,
            config: config,
            longUrl: 'test-long-url',
            onShortUrlChange: jest.fn(),
            onLongUrlChange: jest.fn(),
            updateUrl: jest.fn(),
            onCopy: _onCopyFn
        };
        const widgetRef = { current: null };
        const { queryByTestId } = render(React.createElement(ShareLink, Object.assign({}, props, { ref: widgetRef })));
        // widgetRef.current.onCopy = _onCopyFn;
        // let _onCopyFnSpy = jest.spyOn(widgetRef.current, 'onCopy');
        const btn = queryByTestId('copy-btn');
        fireEvent.click(btn);
        yield waitFor(() => {
            expect(_onCopyFn).toHaveBeenCalledTimes(1);
        }, { timeout: 200 });
    }));
});
//# sourceMappingURL=copy-link.test.js.map