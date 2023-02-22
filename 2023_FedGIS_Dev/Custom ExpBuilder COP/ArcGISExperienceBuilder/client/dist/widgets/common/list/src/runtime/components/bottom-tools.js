import { React, polished } from 'jimu-core';
import { Pagination, Button } from 'jimu-ui';
import { PageStyle, ListLayoutType } from '../../config';
import { LeftOutlined } from 'jimu-icons/outlined/directional/left';
import { UpOutlined } from 'jimu-icons/outlined/directional/up';
import { RightOutlined } from 'jimu-icons/outlined/directional/right';
import { DownOutlined } from 'jimu-icons/outlined/directional/down';
export function ListBottomTools(props) {
    const { isRTL, totalPage, pageStyle, currentPage, scrollStatus, isScrollEnd, isEditing, showLoading, layoutType, handleScrollDown, handleScrollUp, handleSwitchPage, formatMessage } = props;
    return (React.createElement("div", { className: 'bottom-tools w-100 d-flex align-items-center justify-content-center pl-2 pr-2' },
        pageStyle === PageStyle.MultiPage
            ? (React.createElement(Pagination, { size: 'sm', totalPage: totalPage, current: currentPage, onChangePage: handleSwitchPage, disabled: showLoading }))
            : (React.createElement("div", { className: 'd-flex scroll-navigator' },
                React.createElement(Button, { title: formatMessage('previous'), disabled: scrollStatus === 'start', type: 'secondary', size: 'sm', icon: true, onClick: handleScrollUp }, layoutType === ListLayoutType.Column ? React.createElement(LeftOutlined, { size: 12 }) : React.createElement(UpOutlined, { size: 12 })),
                React.createElement(Button, { title: formatMessage('next'), disabled: scrollStatus === 'end' || isScrollEnd, type: 'secondary', size: 'sm', style: isRTL
                        ? { marginRight: polished.rem(10) }
                        : { marginLeft: polished.rem(10) }, icon: true, onClick: handleScrollDown }, layoutType === ListLayoutType.Column ? React.createElement(RightOutlined, null) : React.createElement(DownOutlined, null)))),
        window.jimuConfig.isInBuilder && isEditing && (React.createElement("div", { className: 'editing-mask-bottom-tool' }))));
}
//# sourceMappingURL=bottom-tools.js.map