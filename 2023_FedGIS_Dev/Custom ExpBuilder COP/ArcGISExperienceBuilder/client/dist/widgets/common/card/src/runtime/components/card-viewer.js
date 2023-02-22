/** @jsx jsx */
import { jsx, AppMode, React, classNames, AnimationContext, LinkType, TransitionContainer, getNextAnimationId } from 'jimu-core';
import { styleUtils, _Link as Link } from 'jimu-ui';
import { LayoutEntry } from 'jimu-layouts/layout-runtime';
import { Status } from '../../config';
import Card from './card-base';
export default class CardViewer extends Card {
    constructor(props) {
        super(props);
        this.handleItemClick = evt => {
            const { linkRef } = this;
            const tagName = (evt.target && evt.target.tagName) || '';
            if (!(tagName.toLowerCase() === 'a' ||
                tagName.toLowerCase() === 'button' ||
                evt.exbEventType === 'linkClick')) {
                if (linkRef.current) {
                    // Must stopPropagation from link click, or this method will be called twice.
                    linkRef.current.click();
                }
            }
            if (evt.exbEventType === 'linkClick') {
                delete evt.exbEventType;
            }
        };
        this.onMouse = (evt, isHover = false) => {
            var _a;
            const { cardConfigs } = this.props;
            const isHoverEnable = (_a = cardConfigs === null || cardConfigs === void 0 ? void 0 : cardConfigs.HOVER) === null || _a === void 0 ? void 0 : _a.enable;
            let { previousIndex, currentIndex, hoverPlayId, regularPlayId } = this.state;
            if (isHoverEnable) {
                previousIndex = isHover ? 0 : 1;
                currentIndex = isHover ? 1 : 0;
                hoverPlayId = isHover ? getNextAnimationId() : null;
                regularPlayId = isHover ? null : getNextAnimationId();
            }
            this.setState({
                isHover: isHover,
                previousIndex: previousIndex,
                currentIndex: currentIndex,
                hoverPlayId: hoverPlayId,
                regularPlayId: regularPlayId
            });
        };
        this.getCardContent = () => {
            var _a;
            const { cardConfigs, layouts, appMode, linkParam, browserSizeMode } = this.props;
            let { queryObject } = this.props;
            const { hoverPlayId, regularPlayId } = this.state;
            const transitionInfo = cardConfigs === null || cardConfigs === void 0 ? void 0 : cardConfigs.transitionInfo;
            const isHoverEnable = (_a = cardConfigs === null || cardConfigs === void 0 ? void 0 : cardConfigs.HOVER) === null || _a === void 0 ? void 0 : _a.enable;
            const isInBuilder = window.jimuConfig.isInBuilder;
            const cardContent = [];
            let regularLayout, regularBgStyle, hoverLayout, hoverBgStyle;
            let target;
            let linkTo;
            if (isInBuilder && appMode !== AppMode.Run) {
                regularBgStyle = this.getBackgroundStyle(Status.Regular);
                regularLayout = layouts[Status.Regular];
                if (isHoverEnable) {
                    hoverBgStyle = this.getBackgroundStyle(Status.Hover);
                    hoverLayout = layouts[Status.Hover];
                }
            }
            else {
                regularLayout = layouts[Status.Regular];
                regularBgStyle = this.getBackgroundStyle(Status.Regular);
                if (linkParam && linkParam.linkType) {
                    target = linkParam.openType;
                    linkTo = {
                        linkType: linkParam.linkType
                    };
                    if (linkParam.linkType === LinkType.WebAddress) {
                        linkTo.value = (linkParam === null || linkParam === void 0 ? void 0 : linkParam.value) || '';
                        queryObject = undefined;
                    }
                    else {
                        linkTo.value = linkParam.value;
                    }
                }
                if (isHoverEnable) {
                    hoverLayout = layouts[Status.Hover];
                    hoverBgStyle = this.getBackgroundStyle(Status.Hover);
                }
            }
            const mergedStyle = Object.assign({}, styleUtils.toCSSStyle(regularBgStyle || {}));
            const isShowLink = (linkParam === null || linkParam === void 0 ? void 0 : linkParam.linkType) && (linkParam === null || linkParam === void 0 ? void 0 : linkParam.linkType) !== LinkType.None;
            const regularElement = (jsx("div", { className: classNames('card-content d-flex surface-1', isShowLink ? 'card-link' : ''), key: Status.Regular },
                jsx("div", { className: 'w-100 animation-list', style: mergedStyle },
                    jsx(Link, { className: 'p-0 w-100 h-100 border-0 clear-background card-link', ref: this.linkRef, to: linkTo, target: target, queryObject: queryObject }),
                    jsx("div", { className: 'd-flex w-100 h-100', ref: this.regularLayoutRef },
                        jsx(AnimationContext.Provider, { value: {
                                setting: (transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.oneByOneEffect) || null,
                                playId: regularPlayId,
                                oid: regularLayout === null || regularLayout === void 0 ? void 0 : regularLayout[browserSizeMode]
                            } },
                            jsx(LayoutEntry, { layouts: regularLayout }))))));
            cardContent.push(regularElement);
            if (isHoverEnable) {
                const hoverMergedStyle = Object.assign({}, styleUtils.toCSSStyle(hoverBgStyle || {}));
                const hoverElement = (jsx("div", { className: classNames('card-content d-flex surface-1', isShowLink ? 'card-link' : ''), key: Status.Hover },
                    jsx("div", { className: 'w-100 animation-list', style: hoverMergedStyle },
                        jsx(Link, { className: 'p-0 w-100 h-100 border-0 clear-background card-link', ref: this.linkRef, to: linkTo, target: target, queryObject: queryObject }),
                        jsx("div", { className: 'd-flex w-100 h-100', ref: this.hoverLayoutRef },
                            jsx(AnimationContext.Provider, { value: {
                                    setting: (transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.oneByOneEffect) || null,
                                    playId: hoverPlayId,
                                    oid: hoverLayout[browserSizeMode]
                                } },
                                jsx(LayoutEntry, { layouts: hoverLayout }))))));
                cardContent.push(hoverElement);
            }
            return cardContent;
        };
        this.getBackgroundStyle = (status) => {
            const { cardConfigs } = this.props;
            const backgroundStyle = cardConfigs[status].backgroundStyle;
            if (backgroundStyle === null || backgroundStyle === void 0 ? void 0 : backgroundStyle.boxShadow) {
                return backgroundStyle.setIn(['boxShadow', 'color'], 'transparent');
            }
            else {
                return backgroundStyle;
            }
        };
        this.getCardShadowStyle = () => {
            var _a, _b;
            const { cardConfigs } = this.props;
            const { isHover } = this.state;
            const isShowHoverBoxShadow = isHover && cardConfigs[Status.Hover].enable;
            const status = isShowHoverBoxShadow ? Status.Hover : Status.Regular;
            const style = {
                boxShadow: (_a = cardConfigs[status].backgroundStyle) === null || _a === void 0 ? void 0 : _a.boxShadow,
                borderRadius: (_b = cardConfigs[status].backgroundStyle) === null || _b === void 0 ? void 0 : _b.borderRadius
            };
            const cardShadowStyle = Object.assign({}, styleUtils.toCSSStyle(style));
            return cardShadowStyle;
        };
        this.state = {
            url: '',
            isHover: false,
            previousIndex: 1,
            currentIndex: 0,
            regularPlayId: null,
            hoverPlayId: null
        };
        this.regularLayoutRef = React.createRef();
        this.hoverLayoutRef = React.createRef();
        this.linkRef = React.createRef();
        this.didMount = false;
    }
    componentDidMount() {
        this.didMount = true;
    }
    componentDidUpdate(prveProps) {
        var _a, _b;
        const oldCardConfig = this.props.cardConfigs;
        const { cardConfigs } = prveProps;
        const isPreviewIdChange = ((_a = oldCardConfig === null || oldCardConfig === void 0 ? void 0 : oldCardConfig.transitionInfo) === null || _a === void 0 ? void 0 : _a.previewId) ===
            ((_b = cardConfigs === null || cardConfigs === void 0 ? void 0 : cardConfigs.transitionInfo) === null || _b === void 0 ? void 0 : _b.previewId);
        if (!isPreviewIdChange) {
            this.setState({
                hoverPlayId: getNextAnimationId(),
                regularPlayId: getNextAnimationId()
            });
        }
    }
    render() {
        var _a, _b;
        const { widgetId, cardConfigs } = this.props;
        const { previousIndex, currentIndex } = this.state;
        const transitionInfo = cardConfigs.transitionInfo;
        const cardViewerClass = `card-${widgetId}`;
        const previewId = (transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.previewId) || null;
        const status = currentIndex === 0 ? Status.Regular : Status.Hover;
        return (jsx("div", { css: this.getStyle(status), style: this.getCardShadowStyle(), className: cardViewerClass, onMouseLeave: e => {
                this.onMouse(e, false);
            }, onMouseEnter: e => {
                this.onMouse(e, true);
            }, onClick: this.handleItemClick },
            jsx(TransitionContainer, { previousIndex: previousIndex, currentIndex: currentIndex, transitionType: (_a = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _a === void 0 ? void 0 : _a.type, direction: (_b = transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.transition) === null || _b === void 0 ? void 0 : _b.direction, playId: this.didMount ? previewId : null, withOneByOne: !!(transitionInfo === null || transitionInfo === void 0 ? void 0 : transitionInfo.oneByOneEffect) }, this.getCardContent())));
    }
}
//# sourceMappingURL=card-viewer.js.map