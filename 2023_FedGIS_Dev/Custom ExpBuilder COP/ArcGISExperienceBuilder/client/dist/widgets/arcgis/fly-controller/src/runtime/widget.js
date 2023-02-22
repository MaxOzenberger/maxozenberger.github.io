/** @jsx jsx */
import { React, jsx, appActions } from 'jimu-core';
import { WidgetPlaceholder, Tooltip } from 'jimu-ui';
import { JimuMapViewComponent } from 'jimu-arcgis';
import ErrorTipsManager, { ErrorTypes } from './components/error-tips-manager';
import InteractivePanel from './components/interactive-panel';
import { versionManager } from '../version-manager';
import { getWidgetPlaceholderStyle } from './style';
import widgetIcon from '../../icon.svg';
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.handleActiveViewChange = (jimuMapView) => {
            // Async errors
            if (jimuMapView === null || undefined === jimuMapView) {
                this.errorTipsManager.setErrorByType(ErrorTypes.Choose3DMap);
                this.setState({ jimuMapView: null });
                return; // skip null
            }
            if (jimuMapView.view.type === '2d') {
                this.errorTipsManager.setErrorByType(ErrorTypes.Choose3DMap);
                this.setState({ jimuMapView: null });
                return; // skip 2D
            }
            this.errorTipsManager.setError(''); // ok, so clean errortip
            // cache view id
            // if (this.state.jimuMapView?.id !== jimuMapView.id) {
            //   this.panelRef?.handleClearBtnClick() // change init map in liveview, need to remove feature drew
            // }
            this.setState({ jimuMapView: jimuMapView }); // 3d scene
        };
        this.handleViewGroupCreate = (viewGroup) => {
            this.setState({ viewGroup: viewGroup });
        };
        this.errorTipsManager = new ErrorTipsManager({ widget: this });
        this.state = {
            errorTip: this.errorTipsManager.getDefaultError(),
            jimuMapView: null,
            viewGroup: null
        };
        // observeStore(this.onFlyStop.bind(this), ['widgetsState', this.props.id, 'flyStop']);
        // observeStore(this.onRecordAdd.bind(this), ['widgetsState', this.props.id, 'recordAdd']);
    }
    componentDidMount() {
        const { layoutId, layoutItemId, id } = this.props;
        this.props.dispatch(appActions.widgetStatePropChange(id, 'layoutInfo', { layoutId, layoutItemId }));
    }
    // call exec manuly
    // editStatus = (name, value) => {
    //   const {dispatch, id} = this.props;
    //   dispatch(appActions.widgetStatePropChange(id, name, value));
    // }
    // componentWillUnmount() {
    //   // this.clearUIStateAndEvents();
    //   // this.controllerManager?.destructor();
    //   // this.graphicInteractionManager?.destructor();
    // }
    componentDidUpdate(prevProps, prevState) {
        if (this.errorTipsManager.isError()) {
            this.errorTipsManager.checkErrorInConfig();
        }
    }
    renderWidgetPlaceholder() {
        return jsx(Tooltip, { showArrow: true, placement: 'bottom', title: jsx("div", { className: "p-2", style: { background: 'var(--light-200)', border: '1px solid var(--light-800)' } }, this.state.errorTip), arrowStyle: {
                background: 'var(--light-200)',
                border: {
                    color: 'var(--light-800)',
                    width: '1px'
                }
            } },
            jsx("div", { className: 'h-100 w-100' },
                jsx(WidgetPlaceholder, { icon: widgetIcon, widgetId: this.props.id, css: getWidgetPlaceholderStyle() })));
    }
    render() {
        var _a;
        const mapContent = (jsx(JimuMapViewComponent, { useMapWidgetId: (_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onActiveViewChange: this.handleActiveViewChange, onViewGroupCreate: this.handleViewGroupCreate }));
        const { config, intl, theme } = this.props;
        let flyControllerContent = null;
        if (this.errorTipsManager.isError()) {
            flyControllerContent = this.renderWidgetPlaceholder();
        }
        else {
            flyControllerContent = (jsx(InteractivePanel, { config: config, 
                //
                widgetId: this.props.id, theme: theme, intl: intl, jimuMapView: this.state.jimuMapView, viewGroup: this.state.viewGroup, useMapWidgetIds: this.props.useMapWidgetIds, autoControlWidgetId: this.props.autoControlWidgetId, isPrintPreview: this.props.isPrintPreview }));
        }
        const isH100ForPlaceHolder = this.errorTipsManager.isError() ? ' h-100' : ''; // for holder center vertically, but the runtime remains as it is ,#10380
        return (jsx("div", { className: 'd-flex align-items-center justify-content-center' + isH100ForPlaceHolder },
            flyControllerContent,
            jsx("div", { className: 'fly-map' },
                jsx("div", null, mapContent))));
    }
}
Widget.versionManager = versionManager;
Widget.mapExtraStateProps = (state, props) => {
    var _a, _b, _c;
    const { useMapWidgetIds } = props;
    const mapWidgetId = useMapWidgetIds && useMapWidgetIds.length !== 0 ? useMapWidgetIds[0] : undefined;
    const mapWidgetsInfo = state && state.mapWidgetsInfo;
    const isPrintPreview = (_b = (_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.isPrintPreview) !== null && _b !== void 0 ? _b : false;
    return {
        autoControlWidgetId: mapWidgetId ? (_c = mapWidgetsInfo[mapWidgetId]) === null || _c === void 0 ? void 0 : _c.autoControlWidgetId : undefined,
        isPrintPreview: isPrintPreview
    };
};
//# sourceMappingURL=widget.js.map