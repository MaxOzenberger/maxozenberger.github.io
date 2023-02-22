/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem, Select } from 'jimu-ui';
import { PanelLayout, FlyItemMode } from '../../config';
import * as utils from '../../common/utils/utils';
import { getDropdownStyle } from '../style';
import nls from '../translations/default';
import { MenuOutlined } from 'jimu-icons/outlined/editor/menu';
export class RouteMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.togglePopup = () => {
            this.setState({ isPopupOpen: !this.state.isPopupOpen });
        };
        this.handleActivedRouteChangeBySelect = (evt) => {
            const idx = evt.target.value;
            this.handleActivedRouteChange(idx);
        };
        this.handleActivedRouteChange = (routeIdx) => {
            this.props.onActivedRouteChange(routeIdx);
        };
        this.getStyle = () => {
            return css `
      .routes-dropdown {
        width: 170px;

        .jimu-dropdown-button,
        .jimu-dropdown-button:hover{
          height: 100%;
          border: none;
        }
      }
      `;
        };
        // items
        this._getItemByActivedItemUuid = () => {
            let item = null;
            if (utils.isDefined(this.props.activedItemUuid) && utils.isDefined(this.props.itemsList)) {
                item = this.props.itemsList.find(itemConfig => (itemConfig.config.uuid === this.props.activedItemUuid && FlyItemMode.Route === itemConfig.config.name));
            }
            return item;
        };
        this.getActivedRouteName = (routesConfig) => {
            const route = utils.getRouteConfigByIdx(routesConfig === null || routesConfig === void 0 ? void 0 : routesConfig.routes, { routeUuid: this.props.activedRouteUuid });
            return route === null || route === void 0 ? void 0 : route.displayName;
        };
        this.state = {
            isPopupOpen: false
        };
    }
    componentDidUpdate(prevProps, prevState) {
        const graphicInteractionManagerUpdated = (!prevProps.graphicInteractionManagerRef && !!this.props.graphicInteractionManagerRef);
        const itemsListUpdated = (prevProps.itemsList !== this.props.itemsList);
        const updated = (itemsListUpdated || graphicInteractionManagerUpdated);
        if (!updated) {
            return;
        }
        //need reAuto select 1st route
        const firstUsedRoute = this._findFirstInUseRoute(this._getRoutesConfig());
        if (firstUsedRoute) {
            this.handleActivedRouteChange(firstUsedRoute.idx); //auto select 1st route to show, if possible
        }
    }
    getRouteItemStyle() {
        return css `
      .route-item {
        max-width: 120px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    `;
    }
    render() {
        const { isRouteMode, isEnable, layout } = this.props;
        const plannedRoutesTip = this.props.intl.formatMessage({ id: 'plannedRoutesTip', defaultMessage: nls.plannedRoutesTip });
        const routeItem = this._getItemByActivedItemUuid();
        const routeModeConfig = routeItem === null || routeItem === void 0 ? void 0 : routeItem.config;
        const routeName = this.getActivedRouteName(routeModeConfig);
        const routes = this._getRoutesConfig();
        return isRouteMode &&
            jsx("div", { className: 'h-100 item', css: this.getStyle() },
                (layout === PanelLayout.Palette) &&
                    jsx(Dropdown, { isOpen: this.state.isPopupOpen, disabled: !isEnable, toggle: this.togglePopup, className: 'btns routes-dropdown dropdowns', activeIcon: true },
                        jsx(DropdownButton, { icon: true, className: 'dropdown-btn', type: 'tertiary', arrow: false, title: routeName !== null && routeName !== void 0 ? routeName : plannedRoutesTip },
                            jsx(MenuOutlined, null)),
                        jsx(DropdownMenu, { showArrow: true, css: getDropdownStyle(this.props.theme) }, routes.map((route, idx) => {
                            return route.isInUse &&
                                jsx("div", { key: idx },
                                    jsx(DropdownItem, { title: route.displayName, onClick: () => this.handleActivedRouteChange(route.idx), active: this.props.activedRouteUuid === route.idx },
                                        jsx("div", { css: this.getRouteItemStyle() },
                                            jsx("div", { className: 'mx-2 route-item' }, route.displayName))));
                        }))),
                (layout === PanelLayout.Horizontal) &&
                    jsx(React.Fragment, null,
                        jsx("div", { className: 'separator-line' }),
                        jsx(Select, { onChange: this.handleActivedRouteChangeBySelect, placeholder: routeName !== null && routeName !== void 0 ? routeName : plannedRoutesTip, className: 'routes-dropdown', disabled: !isEnable }, routes.map((route, idx) => {
                            return route.isInUse &&
                                jsx("option", { key: idx, label: route.displayName, title: route.displayName, value: route.idx, selected: this.props.activedRouteUuid === route.idx },
                                    jsx("div", { css: this.getRouteItemStyle() },
                                        jsx("div", { className: 'route-item' }, route.displayName)));
                        }))));
    }
    _getRoutesConfig() {
        const routeItem = this._getItemByActivedItemUuid();
        const routeModeConfig = routeItem === null || routeItem === void 0 ? void 0 : routeItem.config;
        const routes = routeModeConfig === null || routeModeConfig === void 0 ? void 0 : routeModeConfig.routes;
        return routes;
    }
    _findFirstInUseRoute(routes) {
        return routes.find((route) => (!!route.isInUse));
    }
}
//# sourceMappingURL=route-menu.js.map