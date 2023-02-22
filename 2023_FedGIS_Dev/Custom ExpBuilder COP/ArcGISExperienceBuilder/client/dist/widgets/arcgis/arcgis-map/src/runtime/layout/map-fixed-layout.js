/** @jsx jsx */
import { React, ReactDOM, jsx, Immutable, classNames } from 'jimu-core';
import { LayoutEntry } from 'jimu-layouts/layout-runtime';
import { checkIsLive } from '../utils';
export default class Layout extends React.PureComponent {
    constructor(props) {
        super(props);
        // this item is used to solve the flash issue when swith mulitimap
        this.cloneLayoutRef = null;
        this.insertFixedDom = (container, insertedDom) => {
            if (!container || !insertedDom) {
                return;
            }
            const toolLayoutDoms = container.getElementsByClassName('map-tool-layout');
            if (toolLayoutDoms && toolLayoutDoms[0]) {
                container.insertBefore(insertedDom, toolLayoutDoms[0]);
            }
            else {
                container.appendChild(insertedDom);
            }
        };
        this.getMapFixedLayout = () => {
            if (window.jimuConfig.isInBuilder) {
                const LayoutEntry = this.props.LayoutEntry;
                const layout = this.props.layouts && this.props.layouts.MapFixedLayout;
                return (jsx(LayoutEntry, { layouts: layout || null, isInWidget: true, className: classNames('w-100 h-100 map-fix-layout', { 'widget-map-usemask': !checkIsLive(this.props.appMode), 'map-is-live-mode': checkIsLive(this.props.appMode) }) }));
            }
            else {
                const layout = this.props.layouts && this.props.layouts.MapFixedLayout;
                return jsx(LayoutEntry, { layouts: layout ? Immutable(layout) : null, className: 'w-100 h-100 map-is-live-mode map-fix-layout' });
            }
        };
        this.state = {};
        this.fixedLayoutRef = document.createElement('div');
        this.fixedLayoutRef.className = 'w-100 h-100 map-fix-layout';
        this.fixedLayoutRef.style.position = 'absolute';
        this.fixedLayoutRef.style.zIndex = '0';
    }
    componentDidMount() {
        if ((this.props.jimuMapView && this.props.jimuMapView.view && this.props.jimuMapView.view.ui && this.props.jimuMapView.view.ui.container)) {
            this.insertFixedDom(this.props.jimuMapView.view.ui.container, this.fixedLayoutRef);
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.jimuMapView || !this.props.jimuMapView) {
            return;
        }
        if (prevProps.jimuMapView && prevProps.jimuMapView.view && prevProps.jimuMapView.view.ui) {
            const cloneDoms = prevProps.jimuMapView.view.ui.container.getElementsByClassName('layout-clone');
            if (cloneDoms && cloneDoms.length > 0) {
                for (let i = 0; i < cloneDoms.length; i++) {
                    cloneDoms[i].remove();
                }
            }
        }
        if (prevProps.jimuMapView.id !== this.props.jimuMapView.id) {
            if (prevProps.jimuMapView && prevProps.jimuMapView.view && prevProps.jimuMapView.view.ui) {
                this.cloneLayoutRef = this.fixedLayoutRef.cloneNode(true);
                this.cloneLayoutRef.classList.add('layout-clone');
                this.insertFixedDom(prevProps.jimuMapView.view.ui.container, this.cloneLayoutRef);
                setTimeout(() => {
                    if (this.cloneLayoutRef && this.cloneLayoutRef.parentNode) {
                        this.cloneLayoutRef.parentNode.removeChild(this.cloneLayoutRef);
                    }
                    this.cloneLayoutRef = null;
                }, 500);
                if (prevProps.jimuMapView.view.ui.container.contains(this.fixedLayoutRef)) {
                    prevProps.jimuMapView.view.ui.container.removeChild(this.fixedLayoutRef);
                }
            }
            this.props.jimuMapView && this.props.jimuMapView.view && this.insertFixedDom(this.props.jimuMapView.view.ui.container, this.fixedLayoutRef);
        }
    }
    render() {
        if (this.props.jimuMapView && this.props.jimuMapView.view && this.props.jimuMapView.view.ui && this.props.jimuMapView.view.ui.container) {
            return (jsx("div", null, ReactDOM.createPortal(this.getMapFixedLayout(), this.fixedLayoutRef)));
        }
        else {
            // seems we can't run to here?
            return this.getMapFixedLayout();
        }
    }
}
//# sourceMappingURL=map-fixed-layout.js.map