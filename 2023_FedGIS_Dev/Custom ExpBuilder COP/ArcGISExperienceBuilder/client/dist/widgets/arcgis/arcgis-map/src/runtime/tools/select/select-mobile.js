/** @jsx jsx */
import { css, jsx, classNames, React, polished } from 'jimu-core';
import { Icon, MobilePanel, defaultMessages, Radio } from 'jimu-ui';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { MultiSourceMapContext } from '../../components/multisourcemap-context';
const defaultPointSymbol = {
    style: 'esriSMSCircle',
    color: [0, 0, 128, 128],
    name: 'Circle',
    outline: {
        color: [0, 0, 128, 255],
        width: 1
    },
    type: 'esriSMS',
    size: 18
};
const defaultPolylineSymbol = {
    tags: ['solid'],
    title: 'Blue Thin',
    style: 'esriSLSSolid',
    color: [79, 129, 189, 255],
    width: 3,
    name: 'Blue 1',
    type: 'esriSLS'
};
const defaultPolygonSymbol = {
    style: 'esriSFSSolid',
    color: [79, 129, 189, 77],
    type: 'esriSFS',
    outline: {
        style: 'esriSLSSolid',
        color: [54, 93, 141, 255],
        width: 1.5,
        type: 'esriSLS'
    }
};
const SelectRectangleIcon = require('../../assets/icons/select-tool/select-rectangle.svg');
const SelectLassoIcon = require('../../assets/icons/select-tool/select-lasso.svg');
const SelectCircleIcon = require('../../assets/icons/select-tool/select-circle.svg');
const SelectLineIcon = require('../../assets/icons/select-tool/select-line.svg');
const SelectPointIcon = require('../../assets/icons/select-tool/select-point.svg');
const SelectMoreIcon = require('jimu-ui/lib/icons/more-16.svg');
export class SelectMobileTool extends React.PureComponent {
    constructor(props) {
        super(props);
        this.jsonUtils = null;
        this.currentActiveTool = 'rectangle';
        this.setCurrentSelectType = (currentSelectType) => {
            this.initialSketchTool();
            if (currentSelectType === this.state.currentSelectType) {
                return;
            }
            if (currentSelectType === 'Point') {
                if (this.props.isActive) {
                    this.sketchViewModel.create('point');
                }
                this.currentActiveTool = 'point';
            }
            if (currentSelectType === 'Rectangle') {
                if (this.props.isActive) {
                    this.sketchViewModel.create('rectangle');
                }
                this.currentActiveTool = 'rectangle';
            }
            if (currentSelectType === 'Lasso') {
                if (this.props.isActive) {
                    this.sketchViewModel.create('polygon');
                }
                this.currentActiveTool = 'polygon';
            }
            if (currentSelectType === 'Circle') {
                if (this.props.isActive) {
                    this.sketchViewModel.create('circle');
                }
                this.currentActiveTool = 'circle';
            }
            if (currentSelectType === 'Line') {
                if (this.props.isActive) {
                    this.sketchViewModel.create('polyline');
                }
                this.currentActiveTool = 'polyline';
            }
            this.setState({
                currentSelectType: currentSelectType
            }, () => {
                if (!this.props.activeToolInfo || (this.props.activeToolInfo && this.props.activeToolInfo.activeToolName !== this.props.toolName)) {
                    this.props._onIconClick(null);
                }
            });
        };
        this.toggleIsSelectActive = () => {
            this.props._onIconClick(null);
        };
        this.handleIsShowSelectSetting = () => {
            this.setState({
                isShowSelectSetting: !this.state.isShowSelectSetting
            });
        };
        this.getSelectToolIcon = () => {
            if (this.state.currentSelectType === 'Point') {
                return SelectPointIcon;
            }
            else if (this.state.currentSelectType === 'Rectangle') {
                return SelectRectangleIcon;
            }
            else if (this.state.currentSelectType === 'Lasso') {
                return SelectLassoIcon;
            }
            else if (this.state.currentSelectType === 'Circle') {
                return SelectCircleIcon;
            }
            else if (this.state.currentSelectType === 'Line') {
                return SelectLineIcon;
            }
            else {
                return SelectRectangleIcon;
            }
        };
        this.getMobilePanelForSelectSetting = () => {
            return (jsx(MultiSourceMapContext.Consumer, null, ({ mapWidgetId }) => (jsx(MobilePanel, { mapWidgetId: `${mapWidgetId}-with-select-container`, title: '', open: this.state.isShowSelectSetting, toggle: () => { this.handleIsShowSelectSetting(); } },
                jsx("div", { className: 'w-100' }, this.getMobilePanelSettingContent())))));
        };
        this.getMobilePanelSettingContent = () => {
            return (jsx("div", { css: this.getCSSStyle() },
                jsx("div", { className: 'content-title mt-1 mb-2' }, this.props.intl.formatMessage({ id: 'SelectionTool', defaultMessage: defaultMessages.SelectionTool })),
                jsx("div", { className: 'w-100 select-tool-type-mobile-container-shell' },
                    jsx("div", { className: 'select-tool-type-mobile-container' },
                        jsx("div", { className: classNames('select-tool-type mr-3 d-flex flex-column align-items-center justify-content-center select-tool-btn-hover', {
                                'select-tool-type-choosed': this.state.currentSelectType === 'Rectangle'
                            }), onClick: () => { this.setCurrentSelectType('Rectangle'); }, style: { float: 'left' } },
                            jsx(Icon, { width: 16, height: 16, icon: SelectRectangleIcon }),
                            jsx("div", { className: 'select-tool-type-text mt-1 w-100 text-truncate pl-1 pr-1 d-flex justify-content-center', title: this.props.intl.formatMessage({ id: 'SelectionToolRectangle', defaultMessage: defaultMessages.SelectionToolRectangle }) }, this.props.intl.formatMessage({ id: 'SelectionToolRectangle', defaultMessage: defaultMessages.SelectionToolRectangle }))),
                        jsx("div", { className: classNames('select-tool-type mr-3 d-flex flex-column align-items-center justify-content-center select-tool-btn-hover', {
                                'select-tool-type-choosed': this.state.currentSelectType === 'Lasso'
                            }), onClick: () => { this.setCurrentSelectType('Lasso'); }, style: { float: 'left' } },
                            jsx(Icon, { width: 16, height: 16, icon: SelectLassoIcon }),
                            jsx("div", { className: 'select-tool-type-text mt-1 w-100 text-truncate pl-1 pr-1 d-flex justify-content-center', title: this.props.intl.formatMessage({ id: 'SelectionToolLasso', defaultMessage: defaultMessages.SelectionToolLasso }) }, this.props.intl.formatMessage({ id: 'SelectionToolLasso', defaultMessage: defaultMessages.SelectionToolLasso }))),
                        jsx("div", { className: classNames('select-tool-type mr-3 d-flex flex-column align-items-center justify-content-center select-tool-btn-hover', {
                                'select-tool-type-choosed': this.state.currentSelectType === 'Circle'
                            }), onClick: () => { this.setCurrentSelectType('Circle'); }, style: { float: 'left' } },
                            jsx(Icon, { width: 16, height: 16, icon: SelectCircleIcon }),
                            jsx("div", { className: 'select-tool-type-text mt-1 w-100 text-truncate pl-1 pr-1 d-flex justify-content-center', title: this.props.intl.formatMessage({ id: 'SelectionToolCircle', defaultMessage: defaultMessages.SelectionToolCircle }) }, this.props.intl.formatMessage({ id: 'SelectionToolCircle', defaultMessage: defaultMessages.SelectionToolCircle }))),
                        jsx("div", { className: classNames('select-tool-type mr-3 d-flex flex-column align-items-center justify-content-center select-tool-btn-hover', {
                                'select-tool-type-choosed': this.state.currentSelectType === 'Line'
                            }), onClick: () => { this.setCurrentSelectType('Line'); }, style: { float: 'left' } },
                            jsx(Icon, { width: 16, height: 16, icon: SelectLineIcon }),
                            jsx("div", { className: 'select-tool-type-text mt-1 w-100 text-truncate pl-1 pr-1 d-flex justify-content-center', title: this.props.intl.formatMessage({ id: 'SelectionToolLine', defaultMessage: defaultMessages.SelectionToolLine }) }, this.props.intl.formatMessage({ id: 'SelectionToolLine', defaultMessage: defaultMessages.SelectionToolLine }))),
                        jsx("div", { className: classNames('select-tool-type mr-3 d-flex flex-column align-items-center justify-content-center select-tool-btn-hover', {
                                'select-tool-type-choosed': this.state.currentSelectType === 'Point'
                            }), onClick: () => { this.setCurrentSelectType('Point'); }, style: { float: 'left' } },
                            jsx(Icon, { width: 16, height: 16, icon: SelectPointIcon }),
                            jsx("div", { className: 'select-tool-type-text mt-1 w-100 text-truncate pl-1 pr-1 d-flex justify-content-center', title: this.props.intl.formatMessage({ id: 'SelectionToolPoint', defaultMessage: defaultMessages.SelectionToolPoint }) }, this.props.intl.formatMessage({ id: 'SelectionToolPoint', defaultMessage: defaultMessages.SelectionToolPoint }))))),
                jsx("div", { className: 'content-title mt-1 mb-2' }, this.props.intl.formatMessage({ id: 'SelectionMode', defaultMessage: defaultMessages.SelectionMode })),
                jsx("div", null,
                    jsx("div", { className: 'd-flex align-items-center mt-2' },
                        jsx(Radio, { style: { cursor: 'pointer' }, checked: this.state.spatialRelationship === 'intersects', onChange: () => { this.setState({ spatialRelationship: 'intersects' }); } }),
                        jsx("label", { className: 'm-0 ml-2 content-title', style: { cursor: 'pointer' }, onClick: () => { this.setState({ spatialRelationship: 'intersects' }); } }, this.props.intl.formatMessage({ id: 'SelectionWithin', defaultMessage: defaultMessages.SelectionWithin }))),
                    jsx("div", { className: 'd-flex align-items-center mt-2' },
                        jsx(Radio, { style: { cursor: 'pointer' }, checked: this.state.spatialRelationship === 'contains', onChange: () => { this.setState({ spatialRelationship: 'contains' }); } }),
                        jsx("label", { className: 'm-0 ml-2 content-title', style: { cursor: 'pointer' }, onClick: () => { this.setState({ spatialRelationship: 'contains' }); } }, this.props.intl.formatMessage({ id: 'SelectionContain', defaultMessage: defaultMessages.SelectionContain }))))));
        };
        this.state = {
            currentSelectType: 'Rectangle',
            sketchInitialed: false,
            spatialRelationship: 'intersects',
            isQuerying: false,
            isShowSelectSetting: false
        };
    }
    getCSSStyle() {
        const theme = this.props.theme;
        return css `
      background-color: 'initial';

      .select-tool-btn-hover: hover {
        background-color: ${polished.rgba(theme.colors.palette.primary[500], 0.1)};;
      }

      .content-title {
        font-size: ${polished.rem(13)};
        font-weight: bold;
      }

      .select-tool-type-mobile-container-shell {
        overflow-x: auto;
      }

      .select-tool-type-mobile-container-shell::-webkit-scrollbar {
        height: 0 !important;
        display: none;
      }

      .select-tool-type-mobile-container {
        width: 400px;
      }

      .select-tool-type {
        width: 64px;
        height: 64px;
        border: 1px solid ${theme.colors.palette.light[400]};
        cursor: pointer;
      }

      .select-tool-type-choosed {
        border: 1px solid ${theme.colors.primary};
        position: relative;
      }

      .select-tool-type-choosed:after {
        width: 0;
        height: 0;
        border-top: 8px solid ${theme.colors.primary};
        border-left: 8px solid transparent;
        position: absolute;
        top: 0;
        right: 0;
        content: "";
      }

      .select-tool-type-text {
        font-size: ${polished.rem(12)};
      }

      .select-tool-loader {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        width: 100%;
        animation: esri-fade-in 500ms ease-in-out;
      }

      .select-tool-loader:before {
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

      .select-tool-loader:after {
        background-color: ${theme.colors.primary};
        width: 40%;
        z-index: 0;
        animation: looping-progresss-bar-ani 1500ms linear infinite;
        content: "";
        opacity: 1;
        position: absolute;
        height: 2px;
        top: 0;
        transition: opacity 500ms ease-in-out;
      }

    `;
    }
    componentDidMount() {
        if (!this.state.sketchInitialed) {
            loadArcGISJSAPIModules([
                'esri/widgets/Sketch/SketchViewModel',
                'esri/layers/GraphicsLayer',
                'esri/rest/support/Query',
                'esri/symbols/support/jsonUtils',
                'esri/geometry/geometryEngine'
            ]).then(modules => {
                [this.SketchViewModel, this.GraphicsLayer, this.Query, this.jsonUtils, this.geometryEngine] = modules;
                this.props.jimuMapView.view.when(() => {
                    this.initialSketchTool();
                    this.setState({
                        sketchInitialed: true
                    });
                });
            });
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const prevActiveToolName = prevProps.activeToolInfo && prevProps.activeToolInfo.activeToolName;
        const currentActiveToolName = this.props.activeToolInfo && this.props.activeToolInfo.activeToolName;
        if (prevActiveToolName !== currentActiveToolName && currentActiveToolName !== this.props.toolName && currentActiveToolName) {
            this.setState({
                isShowSelectSetting: false
            });
        }
        if (prevState.sketchInitialed !== this.state.sketchInitialed && this.state.sketchInitialed) {
            this.initialSketchTool();
            if (this.props.isActive && this.currentActiveTool) {
                this.sketchViewModel.create(this.currentActiveTool);
            }
            return;
        }
        if (prevProps.jimuMapView && this.props.jimuMapView && (prevProps.jimuMapView.id !== this.props.jimuMapView.id) && this.state.sketchInitialed) {
            this.initialSketchTool();
            this.sketchViewModel.view = this.props.jimuMapView.view;
            if (this.props.isActive && this.currentActiveTool) {
                this.sketchViewModel.create(this.currentActiveTool);
            }
            return;
        }
        if (prevProps.isActive !== this.props.isActive) {
            this.initialSketchTool();
            if (this.props.isActive) {
                this.sketchViewModel.create(this.currentActiveTool);
            }
            else {
                this.sketchViewModel.destroy();
                this.sketchViewModel = null;
            }
        }
    }
    componentWillUnmount() {
        if (this.sketchViewModel) {
            this.sketchViewModel.destroy();
        }
    }
    initialSketchTool() {
        if (!this.SketchViewModel) {
            return;
        }
        if (!this.sketchViewModel) {
            this.sketchViewModel = new this.SketchViewModel({
                view: this.props.jimuMapView.view,
                layer: new this.GraphicsLayer(),
                pointSymbol: this.jsonUtils.fromJSON(defaultPointSymbol),
                polylineSymbol: this.jsonUtils.fromJSON(defaultPolylineSymbol),
                polygonSymbol: this.jsonUtils.fromJSON(defaultPolygonSymbol)
            });
            this.sketchViewModel.on('create', (event) => {
                if (event.state === 'complete') {
                    this.sketchViewModel.create(this.currentActiveTool);
                    this.setState({
                        isQuerying: true
                    });
                    const jimuMapView = this.props.jimuMapView;
                    jimuMapView.selectFeaturesByGraphic(event.graphic, this.state.spatialRelationship).then(() => {
                        this.setState({
                            isQuerying: false
                        });
                    });
                }
            });
        }
    }
    render() {
        return (jsx("div", { css: this.getCSSStyle() },
            this.state.sketchInitialed && jsx("div", { onClick: this.toggleIsSelectActive, style: {}, className: classNames('exbmap-ui-tool border-0 esri-widget--button', {
                    'exbmap-ui-tool-icon-selected': this.props.isActive
                }) },
                jsx(Icon, { width: 16, height: 16, className: 'exbmap-ui-tool-icon', icon: this.getSelectToolIcon() })),
            !this.state.sketchInitialed && jsx("div", { style: {}, className: classNames('exbmap-ui-tool border-0 esri-widget--button') },
                jsx(Icon, { width: 16, height: 16, className: 'exbmap-ui-tool-icon', icon: this.getSelectToolIcon() })),
            jsx("div", { className: 'border border-top-0 w-100', style: { height: '1px' } }),
            this.state.sketchInitialed && jsx("div", { onClick: this.handleIsShowSelectSetting, style: {}, className: classNames('exbmap-ui-tool border-0 esri-widget--button') },
                jsx(Icon, { width: 16, height: 16, className: 'exbmap-ui-tool-icon', icon: SelectMoreIcon })),
            !this.state.sketchInitialed && jsx("div", { style: {}, className: classNames('exbmap-ui-tool border-0 esri-widget--button') },
                jsx(Icon, { width: 16, height: 16, className: 'exbmap-ui-tool-icon', icon: SelectMoreIcon })),
            this.state.isShowSelectSetting && this.getMobilePanelForSelectSetting(),
            (this.state.isQuerying || !this.state.sketchInitialed) && jsx("div", { className: 'select-tool-loader' })));
    }
}
//# sourceMappingURL=select-mobile.js.map