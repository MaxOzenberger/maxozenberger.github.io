/** @jsx jsx */
import { React, jsx, css, classNames, polished, getAppStore, appActions, AppMode } from 'jimu-core';
import { utils, PageContext } from 'jimu-layouts/layout-runtime';
import { styleUtils, Loading } from 'jimu-ui';
import { SidebarType, CollapseSides, SidebarControllerPositions } from '../config';
import { SidebarController } from './toggle-button';
const animation = css `
  transition: all 200ms;
`;
export class BaseSidebarLayout extends React.PureComponent {
    constructor(props) {
        super(props);
        this.removeSplitHandler = () => {
            if (this.interactable != null) {
                this.interactable.unset();
                this.interactable = null;
            }
        };
        this.handleToggleSidebar = (e) => {
            e.stopPropagation();
            getAppStore().dispatch(appActions.widgetStatePropChange(this.props.widgetId, 'collapse', !this.props.sidebarVisible));
        };
        this.state = {
            isResizing: false,
            deltaSize: 0
        };
    }
    componentDidMount() {
        const { firstLayouts, secondLayouts, config } = this.props;
        if (firstLayouts != null && secondLayouts != null) {
            this.bindSplitHandler();
        }
        getAppStore().dispatch(appActions.widgetStatePropChange(this.props.widgetId, 'collapse', config.defaultState !== 0));
    }
    componentDidUpdate() {
        const { firstLayouts, secondLayouts } = this.props;
        if (firstLayouts != null && secondLayouts != null && this.interactable == null) {
            this.bindSplitHandler();
        }
        if (this.interactable != null) {
            this.interactable.draggable({
                startAxis: this.props.direction === SidebarType.Horizontal ? 'x' : 'y',
                lockAxis: this.props.direction === SidebarType.Horizontal ? 'x' : 'y'
            });
        }
    }
    componentWillUnmount() {
        this.removeSplitHandler();
    }
    calSidebarSize() {
        const { config } = this.props;
        let size;
        if (this.state.deltaSize !== 0) {
            if (utils.isPercentage(config.size)) {
                size = `${(parseFloat(config.size) * this.domSize) / 100 + this.state.deltaSize}px`;
            }
            else {
                size = `${parseFloat(config.size) + this.state.deltaSize}px`;
            }
        }
        else {
            size = config.size;
        }
        return size;
    }
    createCollapsibleSide(layouts, side) {
        const { config, direction } = this.props;
        const size = this.calSidebarSize();
        const shouldFlip = this.shouldFlipLeftAndRight();
        let sizeCSS;
        if (direction === SidebarType.Horizontal) {
            sizeCSS = css `
        width: ${size};
        transform: ${config.overlay && !this.props.sidebarVisible
                ? (config.collapseSide === CollapseSides.First ? `translateX(-${size})` : `translateX(${size})`)
                : 'none'};
        top: ${config.overlay ? 0 : 'auto'};
        bottom: ${config.overlay ? 0 : 'auto'};
        left: ${config.overlay && side === CollapseSides.First ? 0 : 'auto'};
        right: ${config.overlay && side === CollapseSides.Second ? 0 : 'auto'};
      `;
        }
        else {
            sizeCSS = css `
        height: ${size};
        transform: ${config.overlay && !this.props.sidebarVisible
                ? (config.collapseSide === CollapseSides.First ? `translateY(-${size})` : `translateY(${size})`)
                : 'none'};
        left: ${config.overlay ? 0 : 'auto'};
        right: ${config.overlay ? 0 : 'auto'};
        top: ${config.overlay && side === CollapseSides.First ? 0 : 'auto'};
        bottom: ${config.overlay && side === CollapseSides.Second ? 0 : 'auto'};
      `;
        }
        const LayoutItem = this.layoutItemComponent;
        return (jsx("div", { css: css `
        ${this.state.isResizing ? '' : animation}
        ${sizeCSS}
        position: ${config.overlay ? 'absolute' : 'relative'};
        overflow: visible;
        z-index: 2;
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;
      `, className: classNames('d-flex', {
                'flex-column': direction === SidebarType.Vertical
            }) },
            jsx(LayoutItem
            // layoutId={this.props.layoutId}
            // layoutItemId={side === CollapseSides.First ? '0' : '1'}
            , { 
                // layoutId={this.props.layoutId}
                // layoutItemId={side === CollapseSides.First ? '0' : '1'}
                innerLayouts: layouts, itemStyle: side === CollapseSides.First ? config.firstPanelStyle : config.secondPanelStyle, collapsed: !this.props.sidebarVisible, className: classNames({
                    'h-100': direction === SidebarType.Vertical,
                    'w-100': direction === SidebarType.Horizontal
                }) }),
            this.createController(shouldFlip)));
    }
    splitStyle() {
        const { direction, config, appMode } = this.props;
        const size = this.calSidebarSize();
        const collapsed = !this.props.sidebarVisible;
        const lineStyle = config.divider == null || !config.divider.visible || config.divider.lineStyle == null
            ? 'none'
            : styleUtils.toCSSBorder(config.divider.lineStyle);
        if (direction === SidebarType.Horizontal) {
            return css `
        width: 1px;
        border-left: ${lineStyle};
        position: ${config.overlay ? 'absolute' : 'relative'};
        left: ${config.overlay && !collapsed && config.collapseSide === CollapseSides.First ? size : 'auto'};
        right: ${config.overlay && !collapsed && config.collapseSide === CollapseSides.Second ? size : 'auto'};
        display: ${collapsed ? 'none' : 'block'};
        height: ${config.overlay ? '100%' : 'auto'};
        &:after {
          display: ${config.resizable || appMode === AppMode.Design ? 'block' : 'none'};
          position: absolute;
          content: '';
          width: 5px;
          top: 0;
          bottom: 0;
          left: -2px;
          cursor: col-resize;
        }
        z-index: 3;
      `;
        }
        return css `
      height: 1px;
      border-top: ${lineStyle};
      position: ${config.overlay ? 'absolute' : 'relative'};
      top: ${config.overlay && !collapsed && config.collapseSide === CollapseSides.First ? size : 'auto'};
      bottom: ${config.overlay && !collapsed && config.collapseSide === CollapseSides.Second ? size : 'auto'};
      display: ${collapsed ? 'none' : 'block'};
      width: ${config.overlay ? '100%' : 'auto'};
      &:after {
        display: ${config.resizable || appMode === AppMode.Design ? 'block' : 'none'};
        position: absolute;
        content: '';
        height: 5px;
        top: -2px;
        right: 0;
        left: 0;
        cursor: row-resize;
      }
      z-index: 3;
    `;
    }
    createController(shouldFlip) {
        const { config, theme, direction } = this.props;
        if (config.toggleBtn != null && !config.toggleBtn.visible) {
            return null;
        }
        const controllStyle = !this.props.sidebarVisible ? config.toggleBtn.expandStyle : config.toggleBtn.collapseStyle;
        let top;
        let left;
        let offsetX = 0;
        let offsetY = 0;
        let posCSS;
        if (direction === SidebarType.Horizontal) {
            if (config.toggleBtn.position === SidebarControllerPositions.Start) {
                top = 0;
            }
            else if (config.toggleBtn.position === SidebarControllerPositions.Center) {
                top = '50%';
                offsetY = -config.toggleBtn.height / 2;
            }
            const isLeftFixed = config.collapseSide === CollapseSides.Second;
            posCSS = css `
        top: ${config.toggleBtn.position !== SidebarControllerPositions.End ? top : 'auto'};
        bottom: ${config.toggleBtn.position === SidebarControllerPositions.End ? 0 : 'auto'};
        right: ${isLeftFixed ? 'auto' : 0};
        left: ${isLeftFixed ? 0 : 'auto'};
      `;
        }
        else {
            if (config.toggleBtn.position === SidebarControllerPositions.Start) {
                left = 0;
            }
            else if (config.toggleBtn.position === SidebarControllerPositions.Center) {
                left = '50%';
                offsetX = -config.toggleBtn.width / 2;
            }
            posCSS = css `
        left: ${config.toggleBtn.position !== SidebarControllerPositions.End ? left : 'auto'};
        right: ${config.toggleBtn.position === SidebarControllerPositions.End ? 0 : 'auto'};
        bottom: ${config.collapseSide === CollapseSides.First ? 0 : 'auto'};
        top: ${config.collapseSide === CollapseSides.Second ? 0 : 'auto'};
      `;
        }
        const { style } = controllStyle;
        const { iconSize, width, height, color, icon, border, iconSource } = config.toggleBtn;
        return (jsx("div", { css: css `
          ${posCSS}
          position: absolute;
          transform: translate(${config.toggleBtn.offsetX + offsetX}px, ${config.toggleBtn.offsetY + offsetY}px);
        ` },
            jsx(SidebarController, { theme: theme, icon: icon, iconSize: iconSize, expanded: this.props.sidebarVisible, width: width, height: height, color: color, style: style, shouldFlip: shouldFlip, border: border, iconSource: iconSource, onClick: this.handleToggleSidebar })));
    }
    createNormalSide(layouts, side) {
        const LayoutItem = this.layoutItemComponent;
        const { config } = this.props;
        return (jsx("div", { css: this.state.isResizing ? '' : animation, className: 'flex-shrink-0 flex-grow-1 d-flex', style: { zIndex: 0, flexBasis: !this.props.sidebarVisible ? '100%' : '0', overflow: 'auto' } },
            jsx(LayoutItem
            // layoutId={this.props.layoutId}
            // layoutItemId={side === CollapseSides.First ? '0' : '1'}
            , { 
                // layoutId={this.props.layoutId}
                // layoutItemId={side === CollapseSides.First ? '0' : '1'}
                itemStyle: side === CollapseSides.First ? config.firstPanelStyle : config.secondPanelStyle, innerLayouts: layouts, className: 'w-100' })));
    }
    shouldFlipLeftAndRight() {
        const { direction } = this.props;
        if (direction === SidebarType.Horizontal) {
            const isRTL = getAppStore().getState().appContext.isRTL;
            return isRTL; // TODO need to update the logic
        }
        return false;
    }
    createContent() {
        const { config, firstLayouts, secondLayouts } = this.props;
        if (config.overlay) {
            // overlay should make sure the normal side' dom is before the collapsed side
            if (config.collapseSide === CollapseSides.First) {
                return (jsx(React.Fragment, null,
                    this.createNormalSide(secondLayouts, CollapseSides.Second),
                    jsx("div", { css: this.splitStyle(), ref: el => (this.splitRef = el) }),
                    this.createCollapsibleSide(firstLayouts, CollapseSides.First)));
            }
            return (jsx(React.Fragment, null,
                this.createNormalSide(firstLayouts, CollapseSides.First),
                jsx("div", { css: this.splitStyle(), ref: el => (this.splitRef = el) }),
                this.createCollapsibleSide(secondLayouts, CollapseSides.Second)));
        }
        if (config.collapseSide === CollapseSides.First) {
            return (jsx(React.Fragment, null,
                this.createCollapsibleSide(firstLayouts, CollapseSides.First),
                jsx("div", { css: this.splitStyle(), ref: el => (this.splitRef = el) }),
                this.createNormalSide(secondLayouts, CollapseSides.Second)));
        }
        return (jsx(React.Fragment, null,
            this.createNormalSide(firstLayouts, CollapseSides.First),
            jsx("div", { css: this.splitStyle(), ref: el => (this.splitRef = el) }),
            this.createCollapsibleSide(secondLayouts, CollapseSides.Second)));
    }
    render() {
        const { config, firstLayouts, secondLayouts, direction } = this.props;
        if (firstLayouts == null || secondLayouts == null) {
            return (jsx(Loading, null));
        }
        return (jsx(PageContext.Consumer, null, (pageContext) => {
            const builderTheme = pageContext.builderTheme;
            return (jsx("div", { className: classNames('d-flex w-100', {
                    'flex-column': direction === SidebarType.Vertical
                }), ref: el => (this.ref = el), css: css `
            border: 1px dashed ${builderTheme != null ? polished.rgba(builderTheme.colors.palette.dark[300], 0.3) : ''};
            position: relative;
            overflow: hidden;
            justify-content: ${config.collapseSide === CollapseSides.First ? 'flex-end' : 'flex-start'};
            body:not(.design-mode) & {
              border: none;
            }
          ` }, this.createContent()));
        }));
    }
}
//# sourceMappingURL=layout-base.js.map