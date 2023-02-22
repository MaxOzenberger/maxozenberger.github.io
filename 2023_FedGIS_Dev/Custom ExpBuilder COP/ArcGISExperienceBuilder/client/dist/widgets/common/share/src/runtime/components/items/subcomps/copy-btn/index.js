/** @jsx jsx */
import { React, jsx, useIntl } from 'jimu-core';
import { Button, defaultMessages, Tooltip } from 'jimu-ui';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTimer } from './hooks/useTimer';
import nls from '../../../../translations/default';
import { getStyles } from './styles';
import { CopyOutlined } from 'jimu-icons/outlined/editor/copy';
import { CheckOutlined } from 'jimu-icons/outlined/application/check';
export const CopyBtn = React.memo((props) => {
    const [isShowSuccessfullyCopied, setIsShowSuccessfullyCopied] = React.useState(null);
    const [initTimer, clearTimer] = useTimer(3000, setIsShowSuccessfullyCopied);
    React.useEffect(() => {
        clearTimer();
    }, [props.text, clearTimer]);
    const onCopy = React.useCallback((text, result) => {
        props.onCopy(text, result); // stopPropagation(evt)
        initTimer();
    }, [props, initTimer]);
    const copyNls = useIntl().formatMessage({ id: 'copy', defaultMessage: nls.copyString });
    const copiedToClipboardNls = useIntl().formatMessage({ id: 'copiedToClipboard', defaultMessage: defaultMessages.copiedToClipboard });
    const title = (isShowSuccessfullyCopied ? copiedToClipboardNls : copyNls);
    return jsx("div", { css: getStyles() },
        jsx(CopyToClipboard, { onCopy: onCopy, text: props.text, options: { format: 'text/plain' }, "data-testid": 'copy-btn' },
            jsx(Tooltip, { title: title, placement: 'auto-end' },
                jsx(Button, { className: 'copy-btn jimu-outline-inside d-flex', icon: true, type: 'tertiary' },
                    !isShowSuccessfullyCopied &&
                        jsx(CopyOutlined, { size: 'm', autoFlip: true }),
                    isShowSuccessfullyCopied &&
                        jsx(CheckOutlined, { size: 'm' })))));
});
//# sourceMappingURL=index.js.map