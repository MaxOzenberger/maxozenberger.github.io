/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { Button } from 'jimu-ui';
import { UiMode } from '../../config';
import { stopPropagation } from './items/utils';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
const { useCallback } = React;
export const BackBtn = React.memo((props) => {
    const onBackBtnClick = useCallback((evt) => {
        props.onBackBtnClick();
        stopPropagation(evt);
    }, [props]);
    const style = css `
      .back-btn {
        border: none;
      }

      .separator {
        width: 0.5rem;
      }
    `;
    let content = null;
    if (props.uiMode === UiMode.Inline) {
        content = null;
    }
    else {
        content = jsx("div", { className: 'd-flex align-items-center', css: style },
            jsx(Button, { className: 'back-btn', size: 'sm', icon: true, onClick: evt => onBackBtnClick(evt) },
                jsx(ArrowLeftOutlined, { size: 'm', autoFlip: true })),
            jsx("div", { className: 'separator' }));
    }
    return content;
});
//# sourceMappingURL=back-btn.js.map