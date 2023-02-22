/** @jsx jsx */
import { React, jsx, classNames, polished } from 'jimu-core';
import { MapWidgetSelector, SettingSection, SettingRow, SettingCollapse } from 'jimu-ui/advanced/setting-components';
import { Button, Icon, Switch, Label, Radio, defaultMessages } from 'jimu-ui';
import { Arrangement } from '../config';
import { DrawingElevationMode3D } from 'jimu-ui/advanced/map';
// sub-comps
import { DrawToolsSelector } from './components/draw-tools-selector';
import { MeasurementsUnitsSelector } from './components/measurements-units-selector';
//import { DrawModesSelector } from './components/wip-draw-modes-selector'
import { getStyle } from './style';
// nls
import nls from './translations/default';
import { ClickOutlined } from 'jimu-icons/outlined/application/click';
export default class Setting extends React.PureComponent {
    constructor(props) {
        var _a;
        super(props);
        //Maps
        this.handleMapWidgetChange = (useMapWidgetIds) => {
            const _isSelectMap = !!(useMapWidgetIds === null || useMapWidgetIds === void 0 ? void 0 : useMapWidgetIds[0]);
            this.setState({ isSelectedMap: _isSelectMap });
            this.props.onSettingChange({
                id: this.props.id,
                useMapWidgetIds: useMapWidgetIds
            });
        };
        this.handleIsDisplayCanvasLayerChange = () => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('isDisplayCanvasLayer', !this.props.config.isDisplayCanvasLayer)
            });
        };
        // Arrangement
        this.handleArrangementChange = (arrangement) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('arrangement', arrangement)
            });
        };
        this.handleShowAdvancedSettingClick = () => {
            this.setState({
                isShowAdvancedSetting: !this.state.isShowAdvancedSetting
            });
        };
        //DrawTools
        this.handleDrawToolsChange = (drawingTools) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('drawingTools', drawingTools)
            });
        };
        //Measurements
        this.handleIsEnableMeasurementChange = () => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.setIn(['measurementsInfo', 'enableMeasurements'], !this.props.config.measurementsInfo.enableMeasurements)
            });
        };
        this.handleMeasurementUnitsInfoChange = (measurementsUnitsInfos) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('measurementsUnitsInfos', measurementsUnitsInfos)
            });
        };
        // handleIsEnableAdvancedSettingChange = (/*isEnableAdvancedSetting: boolean*/): void => {
        //   this.props.onSettingChange({
        //     id: this.props.id,
        //     config: this.props.config.set('isEnableAdvancedSetting', !this.props.config.isEnableAdvancedSetting)
        //   })
        // }
        //DrawingElevationMode3D
        this.handleDrawingElevationMode3DChange = (drawingElevationMode3D) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set('drawingElevationMode3D', drawingElevationMode3D)
            });
        };
        this.state = {
            isSelectedMap: !!((_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0]),
            isShowAdvancedSetting: false
        };
    }
    render() {
        var _a;
        const a11yDescriptionId = this.props.id + '-uimode-description';
        const a11yUIMode0Id = this.props.id + '-uimode-0';
        const a11yUIMode1Id = this.props.id + '-uimode-1';
        //Maps
        const selectMapWidgetTips = this.props.intl.formatMessage({ id: 'selectMapWidget', defaultMessage: nls.selectMapWidget });
        const selectMapHint = this.props.intl.formatMessage({ id: 'selectMapHint', defaultMessage: defaultMessages.selectMapHint });
        //const isDisplayCanvasLayerTips = this.props.intl.formatMessage({ id: 'isDisplayCanvasLayerTips', defaultMessage: nls.isDisplayCanvasLayerTips })
        //Arrangement
        const arrangementTips = this.props.intl.formatMessage({ id: 'arrangementTips', defaultMessage: nls.arrangementTips });
        const panelTips = this.props.intl.formatMessage({ id: 'panelTips', defaultMessage: nls.panelTips });
        const toolbarTips = this.props.intl.formatMessage({ id: 'toolbarTips', defaultMessage: nls.toolbarTips });
        //Advanced setting
        const advancedTips = this.props.intl.formatMessage({ id: 'advance', defaultMessage: defaultMessages.advance });
        //Drawing tools
        const drawingToolsTips = this.props.intl.formatMessage({ id: 'drawingToolsTips', defaultMessage: nls.drawingToolsTips });
        //Other options
        const isEnableMeasurementsTips = this.props.intl.formatMessage({ id: 'isEnableMeasurementsTips', defaultMessage: nls.isEnableMeasurementsTips });
        //const isEnableAdvancedSettingTips = 'Enable advanced setting'
        //DrawingElevationMode3D
        const drawingElevationMode3DTips = this.props.intl.formatMessage({ id: 'drawingElevationMode3DTips', defaultMessage: nls.drawingElevationMode3DTips });
        const relativeToGroundTips = this.props.intl.formatMessage({ id: 'relativeToGroundTips', defaultMessage: nls.relativeToGroundTips });
        const onTheGroundTips = this.props.intl.formatMessage({ id: 'onTheGroundTips', defaultMessage: nls.onTheGroundTips });
        return (jsx("div", { css: getStyle(this.props.theme, polished), className: 'widget-setting-menu jimu-widget-setting' },
            jsx(SettingSection, { title: selectMapWidgetTips, className: classNames('map-selector-section', { 'border-0': !this.state.isSelectedMap }) },
                jsx(SettingRow, null,
                    jsx(MapWidgetSelector, { onSelect: this.handleMapWidgetChange, useMapWidgetIds: this.props.useMapWidgetIds }))),
            !this.state.isSelectedMap && jsx("div", { className: 'd-flex placeholder-container justify-content-center align-items-center' },
                jsx("div", { className: 'd-flex text-center placeholder justify-content-center align-items-center ' },
                    jsx(ClickOutlined, { size: 48, className: 'd-flex icon mb-2' }),
                    jsx("p", { className: 'hint' }, selectMapHint))),
            this.state.isSelectedMap && jsx(React.Fragment, null,
                jsx(SettingSection, { title: arrangementTips },
                    jsx(SettingRow, null,
                        jsx("div", { className: 'ui-mode-card-chooser' },
                            jsx(Label, { className: 'd-flex flex-column ui-mode-card-wapper' },
                                jsx(Button, { icon: true, className: classNames('ui-mode-card', { active: (this.props.config.arrangement === Arrangement.Panel) }), onClick: () => this.handleArrangementChange(Arrangement.Panel), "aria-labelledby": a11yUIMode0Id, "aria-describedby": a11yDescriptionId },
                                    jsx(Icon, { width: 100, height: 72, icon: require('./assets/arrangements/style0.svg'), autoFlip: true })),
                                jsx("div", { id: a11yUIMode0Id, className: 'mx-1 text-break ui-mode-label' }, panelTips)),
                            jsx("div", { className: 'ui-mode-card-separator' }),
                            jsx(Label, { className: 'd-flex flex-column ui-mode-card-wapper' },
                                jsx(Button, { icon: true, className: classNames('ui-mode-card', { active: (this.props.config.arrangement === Arrangement.Toolbar) }), onClick: () => this.handleArrangementChange(Arrangement.Toolbar), "aria-labelledby": a11yUIMode1Id, "aria-describedby": a11yDescriptionId },
                                    jsx(Icon, { width: 100, height: 72, icon: require('./assets/arrangements/style1.svg'), autoFlip: true })),
                                jsx("div", { id: a11yUIMode1Id, className: 'mx-1 text-break ui-mode-label' }, toolbarTips))))),
                jsx(SettingSection, null,
                    jsx(SettingCollapse, { label: advancedTips, isOpen: this.state.isShowAdvancedSetting, onRequestOpen: this.handleShowAdvancedSettingClick, onRequestClose: this.handleShowAdvancedSettingClick },
                        jsx(React.Fragment, null,
                            jsx(SettingSection, { title: drawingToolsTips, className: 'px-0' },
                                jsx(DrawToolsSelector, { items: this.props.config.drawingTools.asMutable(), theme: this.props.theme, intl: this.props.intl, title: 'Drawing tools', onDrawingToolsChange: this.handleDrawToolsChange })),
                            jsx(SettingSection, { className: 'px-0' },
                                jsx(SettingRow, { label: isEnableMeasurementsTips },
                                    jsx(Switch, { checked: this.props.config.measurementsInfo.enableMeasurements, onChange: this.handleIsEnableMeasurementChange, "aria-label": isEnableMeasurementsTips })),
                                this.props.config.measurementsInfo.enableMeasurements && jsx(SettingRow, null,
                                    jsx(MeasurementsUnitsSelector, { theme: this.props.theme, intl: this.props.intl, measurementsUnitsInfos: (_a = this.props.config.measurementsUnitsInfos) === null || _a === void 0 ? void 0 : _a.asMutable(), onUnitsSettingChange: this.handleMeasurementUnitsInfoChange }))),
                            jsx(SettingSection, { title: drawingElevationMode3DTips, className: 'px-0' },
                                jsx(SettingRow, null,
                                    jsx(Label, { style: { cursor: 'pointer' }, title: relativeToGroundTips },
                                        jsx(Radio, { style: { cursor: 'pointer' }, className: 'm-0 mr-2', title: relativeToGroundTips, onChange: () => this.handleDrawingElevationMode3DChange(DrawingElevationMode3D.RelativeToGround), checked: this.props.config.drawingElevationMode3D === DrawingElevationMode3D.RelativeToGround }),
                                        relativeToGroundTips)),
                                jsx(SettingRow, null,
                                    jsx(Label, { style: { cursor: 'pointer' }, title: onTheGroundTips },
                                        jsx(Radio, { style: { cursor: 'pointer' }, className: 'm-0 mr-2', title: onTheGroundTips, onChange: () => this.handleDrawingElevationMode3DChange(DrawingElevationMode3D.OnTheGround), checked: this.props.config.drawingElevationMode3D === DrawingElevationMode3D.OnTheGround }),
                                        onTheGroundTips)))))))));
    }
}
//# sourceMappingURL=setting.js.map