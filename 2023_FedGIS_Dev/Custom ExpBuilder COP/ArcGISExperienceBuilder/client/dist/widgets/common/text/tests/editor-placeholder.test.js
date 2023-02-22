import { React } from 'jimu-core';
import * as MutationObserver from 'mutation-observer';
import { EditorPlaceholder } from '../src/runtime/builder/placeholder';
import { mockGetSelection, withThemeRender } from 'jimu-for-test';
import '@testing-library/jest-dom/extend-expect';
const render = withThemeRender();
describe('<EditorPlaceholder />', () => {
    beforeAll(() => {
        global.MutationObserver = MutationObserver;
        mockGetSelection(global);
    });
    describe('prop: placeholder, value', () => {
        it('value is defined, display value', () => {
            const placeholder = 'placeholder';
            const value = 'value';
            const { queryByText } = render(React.createElement(EditorPlaceholder, { enabled: false, placeholder: placeholder, value: value }));
            expect(queryByText(value)).toBeInTheDOM();
            expect(queryByText(placeholder)).not.toBeInTheDOM();
        });
        it('value is not defined, displace placeholder', () => {
            const placeholder = 'placeholder';
            const { getByText } = render(React.createElement(EditorPlaceholder, { enabled: false, placeholder: placeholder }));
            expect(getByText(placeholder)).toBeInTheDOM();
        });
    });
    it('props: editorRef', () => {
        const editorRef = { current: null };
        render(React.createElement(EditorPlaceholder, { enabled: false, editorRef: editorRef, value: '<span>bar</span>' }));
        expect(editorRef.current.root).toBeInTheDOM();
    });
    describe('prop: enabled', () => {
        it('the default value of enabled is false', () => {
            const placeholder = '<strong>placeholder</strong>';
            const { getByTestId, rerender } = render(React.createElement(EditorPlaceholder, { value: '', placeholder: placeholder, enabled: false }));
            expect(getByTestId('rich-editor-core').firstChild.firstChild.firstChild.firstChild.nodeName).toBe('STRONG');
            expect(getByTestId('rich-editor-core').firstChild.firstChild.firstChild.firstChild.textContent).toBe('placeholder');
            rerender(React.createElement(EditorPlaceholder, { value: '', placeholder: placeholder, enabled: true }));
            expect(getByTestId('rich-editor-core').firstChild.firstChild.firstChild.firstChild.nodeName).toBe('STRONG');
            expect(getByTestId('rich-editor-core').firstChild.firstChild.firstChild.firstChild.textContent).toBe('\uFEFF');
        });
        it('the default value of enabled is true', () => {
            const placeholder = '<strong>placeholder</strong>';
            const { getByTestId, rerender } = render(React.createElement(EditorPlaceholder, { value: '', placeholder: placeholder, enabled: true }));
            expect(getByTestId('rich-editor-core').firstChild.firstChild.firstChild.firstChild.nodeName).toBe('STRONG');
            expect(getByTestId('rich-editor-core').firstChild.firstChild.firstChild.firstChild.textContent).toBe('\uFEFF');
            rerender(React.createElement(EditorPlaceholder, { value: '', placeholder: placeholder, enabled: false }));
            expect(getByTestId('rich-editor-core').firstChild.firstChild.firstChild.firstChild.nodeName).toBe('STRONG');
            expect(getByTestId('rich-editor-core').firstChild.firstChild.firstChild.firstChild.textContent).toBe('placeholder');
        });
    });
    it('props: onComplete', () => {
        const onComplete = jest.fn();
        const { rerender, unmount } = render(React.createElement(EditorPlaceholder, { enabled: true, onComplete: onComplete, value: 'foo', placeholder: 'bar' }));
        rerender(React.createElement(EditorPlaceholder, { enabled: false, onComplete: onComplete, value: 'foo', placeholder: 'bar' }));
        expect(onComplete).toHaveBeenNthCalledWith(1, 'foo', 'bar');
        onComplete.mockRestore();
        unmount();
        expect(onComplete).toHaveBeenNthCalledWith(1, 'foo', 'bar');
    });
});
//# sourceMappingURL=editor-placeholder.test.js.map