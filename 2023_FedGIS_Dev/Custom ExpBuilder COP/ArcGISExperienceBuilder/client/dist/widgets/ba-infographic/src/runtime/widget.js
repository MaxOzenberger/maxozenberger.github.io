/* eslint-disable @typescript-eslint/dot-notation */
/** @jsx jsx */
import { React, jsx, SessionManager } from 'jimu-core';
import { ArcgisInfographic } from '../business-analyst-components/components.js';
import { getStyle } from './lib/style';
import D from './dbg-log';
import BAMapActions from './ba-map-actions';
import { JimuMapViewComponent } from 'jimu-arcgis';
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getConfigVals();
        this.syncId = 'baSync' + Date.now();
        this.stencilPropChangeConnected = false;
        // debug logging set to true
        D.showDebugConsoleLogs = true;
    }
    componentWillMount() {
        const session = SessionManager.getInstance().getMainSession();
        if (!session) {
            this.promptSignIn();
        }
    }
    componentDidMount() {
        D.log('componentDidMount()...');
        if (!this.stencilPropChangeConnected) {
            const id = '#' + this.props.id;
            const elem = document.querySelector(id);
            D.log('componentDidMount', 'assigning onPropChange to element', id);
            if (elem) {
                // @ts-expect-error
                elem.onPropChange(this.onSettingChanged, this);
                this.stencilPropChangeConnected = true;
            }
        }
        // listen to fullscreen button
        window.addEventListener('message', (event) => {
            const id = '#' + this.props.id;
            const elem = document.querySelector(id);
            const iframe = elem.shadowRoot.querySelector('.arcgisInfographicFrame');
            if (elem && event.data.action === 'fullscreen-enter' && event.data.componentId === this.props.id) {
                // Do fullscreen
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                    // @ts-expect-error
                }
                else if (iframe.webkitRequestFullscreen) {
                    // @ts-expect-error
                    iframe.webkitRequestFullscreen();
                }
                else if (
                // @ts-expect-error
                iframe.mozRequestFullScreen) {
                    // @ts-expect-error
                    iframe.mozRequestFullScreen();
                }
                else if (
                // @ts-expect-error
                iframe.msRequestFullscreen) {
                    // @ts-expect-error
                    iframe.msRequestFullscreen();
                }
            }
            else if (elem && event.data.action === 'fullscreen-exit' && event.data.componentId === this.props.id) {
                if (document['exitFullscreen']) {
                    document['exitFullscreen']();
                }
                else if (document['webkitExitFullscreen']) {
                    document['webkitExitFullscreen']();
                }
                else if (document['mozCancelFullScreen']) {
                    document['mozCancelFullScreen']();
                }
                else if (document['msExitFullscreen']) {
                    document['msExitFullscreen']();
                }
            }
        });
    }
    promptSignIn() {
        SessionManager.getInstance().signIn();
    }
    onSettingChanged(context, reportLocation) {
        D.log('ba-infographic', 'onSettingChanged');
        if (!context.mapActions || !context.mapActions.ignorePropChanges) {
            const arr = reportLocation.split(',');
            // update widget location
            context.infographicLatitude = parseFloat(arr[1]);
            context.infographicLongitude = parseFloat(arr[0]);
            if (context.mapActions) {
                // update associated map
                context.mapActions.updateMap();
            }
        }
    }
    /** onMapChanges
     *      Handles updates from map actions including
     *      feature click, map click, and search results
     * @param data = { type, latitude, longitude, rings, displayName }
     */
    onMapChanges(data, context) {
        const id = '#' + context.props.id;
        const elem = document.querySelector(id);
        switch (data.type) {
            case ('point'): {
                const lat = data.latitude;
                const lon = data.longitude;
                // render buffers on map
                context.mapActions.render(lat, lon, false);
                const s = lon + ', ' + lat;
                context.infographicLatitude = context.settingsLatitude = lat;
                context.infographicLongitude = context.settingsLongitude = lon;
                // update stencil component and infographic
                if (elem) {
                    // set stencil component location
                    elem.setAttribute('report-geometry', '');
                    elem.setAttribute('report-location', s);
                }
                break;
            }
            case ('polygon'): {
                const lat = data.latitude;
                const lon = data.longitude;
                context.infographicLatitude = context.settingsLatitude = lat;
                context.infographicLongitude = context.settingsLongitude = lon;
                // not rendering any buffers on the map- the polygon is the buffer
                if (elem) {
                    const gStr = JSON.stringify(data);
                    elem.setAttribute('report-location', data.longitude.toString() + ', ' + data.latitude.toString());
                    elem.setAttribute('report-geometry', gStr);
                }
                break;
            }
        }
    }
    activeViewChangeHandler(jmv, context) {
        D.log('widget', 'activeViewChangeHandler()...');
        const self = context;
        this.jimuMapView = jmv;
        if (jmv && jmv.view) {
            jmv.view.when(function (event) {
                self.getConfigVals();
                // Map interaction setup
                self.mapActions = new BAMapActions(context.props.id, jmv.mapWidgetId, self.showSearch, self.onMapChanges, context);
                const sSizes = self.bufferSizes.split(',');
                const nSizes = [];
                for (let ii = 0; ii < sSizes.length; ii++) {
                    nSizes[ii] = parseFloat(sSizes[ii]);
                }
                self.mapActions.setReportOnClick(self.runReportOnClick);
                self.mapActions.initialize(jmv.view);
                if (!self.stencilPropChangeConnected) {
                    const id = '#' + self.props.id;
                    const elem = document.querySelector(id);
                    D.log('componentWillMount', 'assigning onPropChange to element', id);
                    if (elem) {
                        // @ts-expect-error
                        elem.onPropChange(self.onSettingChanged, self);
                        self.stencilPropChangeConnected = true;
                    }
                }
            });
        }
    }
    buildBufferSizes() {
        let bufferArray = [];
        if (!this.isEmpty(this.props.config.bufferSize1)) {
            bufferArray.push(this.props.config.bufferSize1);
        }
        if (!this.isEmpty(this.props.config.bufferSize2)) {
            bufferArray.push(this.props.config.bufferSize2);
        }
        if (!this.isEmpty(this.props.config.bufferSize3)) {
            bufferArray.push(this.props.config.bufferSize3);
        }
        if (bufferArray.length === 0 || (this.isEmpty(this.props.config.bufferSize1) && this.isEmpty(this.props.config.bufferSize2) && this.isEmpty(this.props.config.bufferSize3))) {
            bufferArray = [1, 3, 5];
        }
        return bufferArray.toString();
    }
    isEmpty(obj) {
        if (obj == null)
            return true;
        if (obj.length > 0)
            return false;
        if (obj.length === 0)
            return true;
        if (typeof obj !== 'object')
            return true;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key))
                return false;
        }
        return true;
    }
    getConfigVals() {
        this.selectedReport = !this.isEmpty(this.props.config.selectedReport) ? this.props.config.selectedReport : 'b737042ee11d4d19ba938a3ca333e673';
        this.infographicLatitude = !this.isEmpty(this.props.config.infographicLatitude) ? this.props.config.infographicLatitude : '34.057170';
        this.infographicLongitude = !this.isEmpty(this.props.config.infographicLongitude) ? this.props.config.infographicLongitude : '-117.194150';
        this.langCode = !this.isEmpty(this.props.config.langCode) ? this.props.config.langCode : 'US';
        this.viewMode = this.props.browserSizeMode === 'SMALL' ? 'stack' : !this.isEmpty(this.props.config.viewMode) ? this.props.config.viewMode : 'full';
        this.bufferType = !this.isEmpty(this.props.config.bufferType) ? this.props.config.bufferType : 'ring';
        this.bufferSizes = this.buildBufferSizes();
        this.bufferUnits = !this.isEmpty(this.props.config.bufferUnits) ? this.props.config.bufferUnits : 'miles';
        this.displayHeader = Object.prototype.hasOwnProperty.call(this.props.config, 'displayHeader') ? this.props.config.displayHeader : true;
        this.print = Object.prototype.hasOwnProperty.call(this.props.config, 'print') ? this.props.config.print : true;
        this.imageExport = Object.prototype.hasOwnProperty.call(this.props.config, 'imageExport') ? this.props.config.imageExport : true;
        this.excel = Object.prototype.hasOwnProperty.call(this.props.config, 'excel') ? this.props.config.excel : true;
        this.fullscreen = Object.prototype.hasOwnProperty.call(this.props.config, 'fullscreen') ? this.props.config.fullscreen : true;
        this.zoomLevel = Object.prototype.hasOwnProperty.call(this.props.config, 'zoomLevel') ? this.props.config.zoomLevel : true;
        this.dynamicHtml = Object.prototype.hasOwnProperty.call(this.props.config, 'dynamicHtml') ? this.props.config.dynamicHtml : true;
        this.pdf = false;
        // this.pdf = Object.prototype.hasOwnProperty.call(this.props.config, 'pdf') ? this.props.config.pdf : true
        this.backgroundColor = !this.isEmpty(this.props.config.backgroundColor) ? this.props.config.backgroundColor : '#525659';
        this.headerColor = !this.isEmpty(this.props.config.headerColor) ? this.props.config.headerColor : '#0079C1';
        this.headerTextColor = !this.isEmpty(this.props.config.headerTextColor) ? this.props.config.headerTextColor : '#FFFFFF';
        this.showSearch = true;
        //this.showSearch = !this.isEmpty(this.props.config.showSearch) ? this.props.config.showSearch : true
        //this.runReportOnClick = true
        this.runReportOnClick = Object.prototype.hasOwnProperty.call(this.props.config, 'runReportOnClick') ? this.props.config.runReportOnClick : true;
    }
    render() {
        var _a, _b;
        this.getConfigVals();
        return (jsx("div", { css: getStyle(this.props.theme), className: 'widget-infographic-player jimu-widget App' }, ((_a = this.props.user) === null || _a === void 0 ? void 0 : _a.username)
            ? jsx(React.Fragment, null,
                jsx(ArcgisInfographic, { id: this.props.id, instanceId: this.props.id, env: window.jimuConfig.hostEnv, reportId: this.selectedReport, reportLocation: this.infographicLongitude + ', ' + this.infographicLatitude, username: this.props.user.username, token: this.props.token, langCode: this.langCode, reportShowHeader: this.displayHeader, reportHeaderButtonPrint: this.print, reportHeaderButtonExcel: this.excel, reportHeaderButtonFullscreen: this.fullscreen, reportHeaderButtonZoomLevel: this.zoomLevel, reportHeaderButtonImage: this.imageExport, reportHeaderButtonDynHtml: this.dynamicHtml, reportHeaderButtonPdf: this.pdf, bufferType: this.bufferType, bufferUnits: this.bufferUnits, bufferSizes: this.bufferSizes, reportColorBackground: this.backgroundColor, reportColorHeader: this.headerColor, reportColorHeaderText: this.headerTextColor, viewMode: this.viewMode }),
                Object.prototype.hasOwnProperty.call(this.props, 'useMapWidgetIds') && this.props.useMapWidgetIds && this.props.useMapWidgetIds.length === 1 && (jsx(JimuMapViewComponent, { useMapWidgetId: (_b = this.props.useMapWidgetIds) === null || _b === void 0 ? void 0 : _b[0], onActiveViewChange: e => { this.activeViewChangeHandler(e, this); } })))
            : jsx("div", { className: 'esri-directions__sign-in-content' },
                jsx("div", { className: 'esri-widget__heading', role: 'heading', style: { marginTop: '0', padding: '0', alignSelf: 'flex-start' } }, "Business Analyst Infographic (beta)"),
                jsx("div", { className: 'esri-widget__body' },
                    "Your account cannot run the Business Analyst infographic widget.  In order to run the Business Analyst infographic widget, the administrator of your organization needs to grant you GeoEnrichment and Network Analysis ",
                    jsx("a", { href: 'http://doc.arcgis.com/en/arcgis-online/reference/roles.htm', target: '_blank' }, "privileges"),
                    ", and also allocate ",
                    jsx("a", { href: 'https://doc.arcgis.com/en/arcgis-online/administer/configure-credits.htm?', target: '_blank' }, "credits"),
                    "."),
                jsx("div", { className: 'esri-widget__heading', role: 'heading' }, "Sign-in required"),
                jsx("button", { className: 'esri-button esri-button--secondary', type: 'button', style: { width: 'auto' }, onClick: () => this.promptSignIn() }, "Sign in"))));
    }
}
Widget.mapExtraStateProps = (state) => {
    return {
        browserSizeMode: state.browserSizeMode
    };
};
//# sourceMappingURL=widget.js.map