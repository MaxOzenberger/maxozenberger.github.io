/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Button, defaultMessages, hooks, Tooltip } from 'jimu-ui';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTimer } from './hooks/useTimer';
import { getStyles } from './styles';
import { CopyOutlined } from 'jimu-icons/outlined/editor/copy';
import { CheckOutlined } from 'jimu-icons/outlined/application/check';
export const CopyBtn = React.memo((props) => {
    const { text, disabled, className } = props;
    const [isShowSuccessfullyCopied, setIsShowSuccessfullyCopied] = React.useState(null);
    const [initTimer, clearTimer] = useTimer(3000, setIsShowSuccessfullyCopied);
    React.useEffect(() => {
        clearTimer();
    }, [text, clearTimer]);
    const onCopy = React.useCallback((text, result) => {
        if (props === null || props === void 0 ? void 0 : props.onCopy)
            props.onCopy(text, result);
        initTimer();
    }, [props, initTimer]);
    const translate = hooks.useTranslate(defaultMessages);
    const copyNls = translate('copy');
    const copiedToClipboardNls = translate('copiedToClipboard');
    const title = (isShowSuccessfullyCopied ? copiedToClipboardNls : copyNls);
    const copyButton = (jsx(Button, { className: 'copy-btn jimu-outline-inside d-flex', icon: true, size: 'sm', type: 'tertiary', disabled: disabled },
        !isShowSuccessfullyCopied &&
            jsx(CopyOutlined, { size: 'm', autoFlip: true }),
        isShowSuccessfullyCopied &&
            jsx(CheckOutlined, { size: 'm' })));
    return jsx("div", { css: getStyles(), className: className },
        jsx(CopyToClipboard, { onCopy: onCopy, text: text, options: { format: 'text/plain' }, "data-testid": 'copy-btn' }, disabled
            ? copyButton
            : jsx(Tooltip, { title: title, placement: 'auto-end' }, copyButton)));
});
//# sourceMappingURL=index.js.map