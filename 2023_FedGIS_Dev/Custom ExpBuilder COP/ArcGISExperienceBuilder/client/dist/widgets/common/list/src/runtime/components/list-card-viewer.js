/** @jsx jsx */
import { RepeatedDataSourceProvider, jsx, AppMode, React, ExpressionResolverComponent, LinkType, utils, classNames } from 'jimu-core';
import { ListGroupItem, styleUtils, _Link as Link } from 'jimu-ui';
import { LayoutEntry } from 'jimu-layouts/layout-runtime';
import { Status, ListLayout } from '../../config';
import ListCard from './list-card-base';
import { Fragment } from 'react';
export default class ListCardViewer extends ListCard {
    constructor(props) {
        super(props);
        this.updateExpressionRecords = () => {
            var _a, _b;
            this.expressionRecords = {};
            if (((_a = this.providerData) === null || _a === void 0 ? void 0 : _a.dataSourceId) && ((_b = this.providerData) === null || _b === void 0 ? void 0 : _b.record)) {
                this.expressionRecords[this.providerData.dataSourceId] = this.providerData.record;
            }
        };
        this.onUrlExpResolveChange = result => {
            if (result.isSuccessful) {
                this.setState({ url: result.value });
            }
            else {
                const res = '';
                // const errorCode = result.value
                // if (errorCode === ExpressionResolverErrorCode.Failed) {
                // }
                this.setState({ url: res });
            }
        };
        // componentDidUpdate(preProps, preState){
        //   Object.keys(this.props).forEach(key => {
        //     if(this.props[key] !== preProps[key])
        //       console.log(`props has changed: ${key}`)
        //   })
        // }
        this.handleItemClick = evt => {
            const { onChange, active } = this.props;
            const { providerData, linkRef } = this;
            const tagName = (evt.target && evt.target.tagName) || '';
            if (!(tagName.toLowerCase() === 'a' ||
                tagName.toLowerCase() === 'button' ||
                evt.exbEventType === 'linkClick') &&
                !active) {
                if (linkRef.current) {
                    // Must stopPropagation from link click, or this method will be called twice.
                    linkRef.current.click();
                }
            }
            // if click sub widget event, don't un select
            if (active) {
                const tagName = (evt.target && evt.target.tagName) || '';
                if (!(tagName.toLowerCase() === 'a' ||
                    tagName.toLowerCase() === 'button' ||
                    evt.exbEventType === 'linkClick')) {
                    onChange(providerData && providerData.record);
                }
            }
            else {
                onChange(providerData && providerData.record);
            }
            if (evt.exbEventType === 'linkClick') {
                delete evt.exbEventType;
            }
        };
        this.handleLinkClick = evt => {
            evt.stopPropagation();
        };
        this.state = {
            url: ''
        };
        this.providerData = this.getNewProviderData();
        this.updateExpressionRecords();
        this.layoutRef = React.createRef();
        this.linkRef = React.createRef();
    }
    shouldComponentUpdate(nextProps, nextStats) {
        let shouldUpdate = this.shouldComponentUpdateExcept(nextProps, nextStats, [
            'listStyle'
        ]);
        shouldUpdate =
            shouldUpdate ||
                !utils.isDeepEqual(this.props.listStyle, nextProps.listStyle);
        return shouldUpdate;
    }
    render() {
        var _a;
        const { selectable, active, cardConfigs, widgetId, listStyle, layouts, hoverLayoutOpen, appMode, isHover, linkParam, useDataSources, itemIdex, handleListMouseLeave, handleListMouseMove } = this.props;
        let { queryObject } = this.props;
        const { url } = this.state;
        let currentStatus = Status.Regular;
        const isInBuilder = window.jimuConfig.isInBuilder;
        let layout;
        let bgStyle;
        let target;
        let linkTo;
        if (isInBuilder && appMode !== AppMode.Run) {
            bgStyle = cardConfigs[Status.Regular].backgroundStyle;
            layout = layouts[Status.Regular];
        }
        else {
            layout = layouts[Status.Regular];
            bgStyle = cardConfigs[Status.Regular].backgroundStyle;
            if (linkParam && linkParam.linkType) {
                target = linkParam.openType;
                linkTo = {
                    linkType: linkParam.linkType
                };
                if (linkParam.linkType === LinkType.WebAddress) {
                    linkTo.value = url;
                    queryObject = undefined;
                }
                else {
                    linkTo.value = linkParam.value;
                }
            }
            if (hoverLayoutOpen && isHover && layouts[Status.Hover]) {
                currentStatus = Status.Hover;
                layout = layouts === null || layouts === void 0 ? void 0 : layouts[Status.Hover];
                bgStyle = cardConfigs[Status.Hover].backgroundStyle;
            }
            if (selectable && active && layouts[Status.Selected]) {
                currentStatus = Status.Selected;
                layout = layouts === null || layouts === void 0 ? void 0 : layouts[Status.Selected];
                bgStyle = cardConfigs[Status.Selected].backgroundStyle;
                queryObject = undefined;
                linkTo = undefined;
                target = undefined;
            }
        }
        const currentLayoutType = ((_a = cardConfigs[currentStatus]) === null || _a === void 0 ? void 0 : _a.listLayout) || ListLayout.CUSTOM;
        const regularLayout = layouts[Status.Regular];
        const showLayout = currentLayoutType === ListLayout.AUTO ? regularLayout : layout;
        const mergedStyle = Object.assign({}, styleUtils.toCSSStyle(bgStyle || {}));
        const cardContentStyle = Object.assign({}, styleUtils.toCSSStyle({
            borderRadius: (bgStyle === null || bgStyle === void 0 ? void 0 : bgStyle.borderRadius) || 0
        } || {}));
        const newProviderData = this.getNewProviderData();
        if (!this.isProviderEqual(newProviderData, this.providerData)) {
            this.providerData = newProviderData;
            this.updateExpressionRecords();
        }
        return (jsx(RepeatedDataSourceProvider, { data: this.providerData },
            jsx(ListGroupItem, { active: selectable && active, css: this.getStyle(currentStatus), style: Object.assign(Object.assign({}, listStyle), cardContentStyle), className: classNames('surface-1', `list-card-${widgetId}`), role: 'listCardViewer', onClick: this.handleItemClick },
                jsx("div", { className: 'list-card-content d-flex', onMouseLeave: handleListMouseLeave, onMouseMove: () => { handleListMouseMove(itemIdex); }, style: mergedStyle },
                    jsx("div", { className: 'position-relative h-100 w-100' },
                        jsx(Fragment, null,
                            jsx(Link, { className: 'p-0 w-100 h-100 border-0 list-clear-background list-link', ref: this.linkRef, to: linkTo, target: target, queryObject: queryObject, onClick: this.handleLinkClick }),
                            jsx("div", { className: 'd-flex w-100 h-100 list-item-con', ref: this.layoutRef },
                                jsx(LayoutEntry, { layouts: showLayout }))))),
                jsx(ExpressionResolverComponent, { useDataSources: useDataSources, expression: linkParam === null || linkParam === void 0 ? void 0 : linkParam.expression, 
                    /* records={this.expressionRecords}  */ onChange: this.onUrlExpResolveChange, widgetId: this.props.widgetId }))));
    }
}
//# sourceMappingURL=list-card-viewer.js.map