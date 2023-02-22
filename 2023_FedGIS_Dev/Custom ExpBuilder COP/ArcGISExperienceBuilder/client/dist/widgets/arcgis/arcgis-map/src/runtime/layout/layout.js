/** @jsx jsx */
import { React, ReactDOM, css, jsx, AppMode } from 'jimu-core';
import Group from './base/group';
export default class Layout extends React.PureComponent {
    constructor(props) {
        super(props);
        // this item is used to solve the flash issue when swith mulitimap
        this.cloneLayoutRef = null;
        this.getMaxHeightForPcExpand = (widgetHeight) => {
            if (!widgetHeight) {
                return null;
            }
            else {
                if (widgetHeight < 65) {
                    return null;
                }
                else {
                    const resultHeight = widgetHeight - 65;
                    if (resultHeight < 300) {
                        return resultHeight;
                    }
                    else {
                        return 300;
                    }
                }
            }
        };
        this.handSetHiddenElementNames = (elementNames) => {
            this.setState({
                hiddenElementNames: elementNames
            });
        };
        this.getLayoutContent = (layoutJson) => {
            if (!layoutJson || !this.props.toolConfig) {
                return null;
            }
            else {
                return (jsx("div", { css: this.getStyle() }, Object.keys(layoutJson.layout).map((key, index) => {
                    if (!layoutJson.elements[key] || layoutJson.elements[key].type !== 'GROUP' || !layoutJson.layout[key].position) {
                        return null;
                    }
                    return (jsx(Group, { mapWidgetId: this.props.mapWidgetId, className: layoutJson.elements[key].className, style: layoutJson.elements[key].style, isResponsive: layoutJson.elements[key].isResponsive, isMobile: this.props.isMobile, isMainGroup: true, key: index, layoutConfig: layoutJson, toolConfig: this.props.toolConfig, activeToolInfo: this.props.activeToolInfo, jimuMapView: this.props.jimuMapView, groupName: key, onActiveToolInfoChange: this.props.onActiveToolInfoChange, hiddenElementNames: layoutJson.mobileResponsiveStrategy && this.state.hiddenElementNames, intl: this.props.intl, onSetHiddenElementNames: this.handSetHiddenElementNames, theme: this.props.theme }));
                })));
            }
        };
        this.state = {
            toolsContentInMobileExpandPanel: null,
            hiddenElementNames: []
        };
        this.contentRef = document.createElement('div');
        this.contentRef.className = 'exbmap-ui esri-ui-inner-container map-tool-layout';
    }
    getStyle() {
        return css `
      z-index: 0;

      .expand-panel-transition {
        transition: opacity 0.3s, right 0.3s;
      }

      .scale-attribution-xy-group {
        > div:first-of-type:nth-last-of-type(1) {
          width: 100%;
          max-width: 100% !important;
        }
      }

      .exbmap-ui-hidden-element {
        display: none !important;
      }
/*
      .exbmap-basetool-loader {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        width: 100%;
        animation: esri-fade-in 500ms ease-in-out;
      }

      .exbmap-basetool-loader:before {
        background-color: rgba(110,110,110,0.3);
        width: 100%;
        z-index: 0;
        content: "";
        opacity: 1;
        position: absolute;
        height: 2px;
        top: 0;
        transition: opacity 500ms ease-in-out;
      }

      .exbmap-basetool-loader:after {
        background-color: #6e6e6e;
        width: 20%;
        z-index: 0;
        animation: looping-progresss-bar-ani 1500ms linear infinite;
        content: "";
        opacity: 1;
        position: absolute;
        height: 2px;
        top: 0;
        transition: opacity 500ms ease-in-out;
      } */

      .exbmap-ui-pc-expand-maxheight {
        max-height: ${this.getMaxHeightForPcExpand(this.props.widgetHeight)}px;
        overflow: auto
      }
      `;
    }
    componentDidMount() {
        if ((this.props.jimuMapView && this.props.jimuMapView.view && this.props.jimuMapView.view.ui && this.props.jimuMapView.view.ui.container)) {
            this.props.jimuMapView.view.ui.container.appendChild(this.contentRef);
        }
    }
    componentDidUpdate(prevProps) {
        var _a, _b;
        if (prevProps.appMode !== this.props.appMode && this.props.appMode === AppMode.Design) {
            this.props.onActiveToolInfoChange(null);
        }
        if (prevProps.jimuMapView && prevProps.jimuMapView.view && prevProps.jimuMapView.view.ui) {
            const cloneDoms = prevProps.jimuMapView.view.ui.container.getElementsByClassName('tool-layout-clone');
            if (cloneDoms && cloneDoms.length > 0) {
                for (let i = 0; i < cloneDoms.length; i++) {
                    cloneDoms[i].remove();
                }
            }
        }
        if (((_a = prevProps.jimuMapView) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = this.props.jimuMapView) === null || _b === void 0 ? void 0 : _b.id)) {
            this.cloneLayoutRef = this.contentRef.cloneNode(true);
            this.cloneLayoutRef.classList.add('tool-layout-clone');
            setTimeout(() => {
                if (this.cloneLayoutRef && this.cloneLayoutRef.parentNode) {
                    this.cloneLayoutRef.parentNode.removeChild(this.cloneLayoutRef);
                }
                this.cloneLayoutRef = null;
            }, 500);
            if (prevProps.jimuMapView.view && prevProps.jimuMapView.view.ui && prevProps.jimuMapView.view.ui.container) {
                prevProps.jimuMapView.view.ui.container.appendChild(this.cloneLayoutRef);
                prevProps.jimuMapView.view.ui.container.removeChild(this.contentRef);
            }
            if (this.props.jimuMapView.view && this.props.jimuMapView.view.ui && this.props.jimuMapView.view.ui.container) {
                this.props.jimuMapView.view.ui.container.appendChild(this.contentRef);
            }
        }
    }
    render() {
        if (this.props.jimuMapView && this.props.jimuMapView.view && this.props.jimuMapView.view.ui && this.props.jimuMapView.view.ui.container) {
            return (jsx("div", null, ReactDOM.createPortal(this.getLayoutContent(this.props.layoutConfig), this.contentRef)));
        }
        else {
            return null;
        }
    }
}
//# sourceMappingURL=layout.js.map