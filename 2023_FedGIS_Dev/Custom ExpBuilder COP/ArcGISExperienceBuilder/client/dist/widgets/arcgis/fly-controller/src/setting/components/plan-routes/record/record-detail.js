/** @jsx jsx */
import { React, jsx, css } from 'jimu-core';
import { Button, TextInput, NumericInput, Slider, Radio, Label, defaultMessages } from 'jimu-ui';
import { RotateDirection } from '../../../../config';
import { ControllerMode } from '../../../../common/fly-facade/controllers/base-fly-controller';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import nls from '../../../translations/default';
import { isDefined, angleNumFix, altNumFix, timeNumFix } from '../../../../common/utils/utils';
import { Constraints } from '../../../../common/constraints';
// resources
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
export class RecordDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.backBtnRefFor508 = null; //508
        this.handleKeydown = (e, ref) => {
            if (e.key === 'Enter') {
                ref.current.blur();
            }
        };
        this.getStyle = () => {
            return css `
      .tilt-setting{
        .tilt-slider{
          width:80px
        }

        .tilt-number{
          .jimu-numeric-input {
            width: 64px;
          }
        }
      }

      .altitude-setting{
        margin-top: 1rem;
        margin-bottom: 1rem;

        .altitude-number{
          width: 70px;
        }
        .small-tips{
          font-size: 12px;
          color: #A8A8A8;
        }
      }
      `;
        };
        this.handleBackBtnClick = () => {
            this.props.onRecordChange(this.tmpRecordConfig); // save
            this.props.onRecordEdit({ routeUuid: null, recordUuid: null }); // exit to 3rd level menu
        };
        // change
        this.handleRecordChange = (recordConfig) => {
            this.props.onRecordChange(recordConfig);
        };
        // common
        this.handleDisplayNameChange = (name) => {
            this.tmpRecordConfig.displayName = name;
        };
        this.handleDurationChange = (duration) => {
            this.tmpRecordConfig.duration = timeNumFix(duration);
            this.setState({ duration: this.tmpRecordConfig.duration });
        };
        this.handleDelayChange = (endDelay) => {
            this.tmpRecordConfig.endDelay = timeNumFix(endDelay);
            this.setState({ endDelay: this.tmpRecordConfig.endDelay });
        };
        // 1 point
        this.handlePointDirectionChange = (dir) => {
            this.tmpRecordConfig.direction = dir;
            this.setState({ rotateDirection: dir });
        };
        this.handlePointTiltChange = (tilt) => {
            let _tilt = this.tmpRecordConfig.controllerConfig.liveviewSettingState.fixTilt;
            _tilt = angleNumFix(tilt);
            this.props.onLiveviewSettingChange({ tilt: _tilt });
            this.setState({ tilt: _tilt });
        };
        this.handlePointAngleChange = (angle) => {
            this.tmpRecordConfig.angle = angleNumFix(angle);
            this.setState({ angle: this.tmpRecordConfig.angle });
        };
        this.renderPointDirection = () => {
            const isCW = (this.state.rotateDirection === RotateDirection.CW);
            const label = this.props.intl.formatMessage({ id: 'styleLabelRotate', defaultMessage: nls.styleLabelRotate });
            const cw = this.props.intl.formatMessage({ id: 'CW', defaultMessage: nls.CW });
            const ccw = this.props.intl.formatMessage({ id: 'CCW', defaultMessage: nls.CCW });
            return (jsx(React.Fragment, null,
                jsx(SettingRow, { label: label }),
                jsx(SettingRow, { className: 'mt-2 radio-wapper' },
                    jsx(Radio, { checked: isCW, id: 'CW', style: { cursor: 'pointer' }, onChange: e => this.handlePointDirectionChange(RotateDirection.CW) }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'CW', className: 'ml-1 text-break' }, cw)),
                jsx(SettingRow, { className: 'mt-2 radio-wapper' },
                    jsx(Radio, { checked: !isCW, id: 'CCW', style: { cursor: 'pointer' }, onChange: e => this.handlePointDirectionChange(RotateDirection.CCW) }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'CCW', className: 'ml-1 text-break' }, ccw))));
        };
        this.renderTilt = () => {
            const { tilt } = this.state;
            const label = this.props.intl.formatMessage({ id: 'tilt', defaultMessage: defaultMessages.tilt });
            const degree = this.props.intl.formatMessage({ id: 'degree', defaultMessage: defaultMessages.degree });
            return (jsx(React.Fragment, null,
                jsx(SettingRow, { label: label }),
                jsx(SettingRow, { className: 'tilt-setting mt-0' },
                    jsx(Slider, { className: 'd-flex dropdown-item tilt-slider', size: 'sm', value: tilt, min: Constraints.TILT.MIN, max: Constraints.TILT.MAX, step: Constraints.TILT.STEP, onChange: (evt) => this.handlePointTiltChange(parseFloat(evt.target.value)) }),
                    jsx("div", { className: 'd-flex tilt-number' },
                        jsx(NumericInput, { className: 'm-2', defaultValue: '0', size: 'sm', value: tilt, min: Constraints.TILT.MIN, max: Constraints.TILT.MAX, onChange: (val) => this.handlePointTiltChange(val) }),
                        jsx(Label, { className: '' }, degree)))));
        };
        this.renderPointsAdvancedSettings = () => {
            const { duration, angle, endDelay } = this.state;
            const advancedSettingsLabel = this.props.intl.formatMessage({ id: 'advancedSettings', defaultMessage: nls.advancedSettings });
            const durationLabel = this.props.intl.formatMessage({ id: 'duration', defaultMessage: nls.duration });
            const rotationAngleLabel = this.props.intl.formatMessage({ id: 'rotationAngle', defaultMessage: nls.rotationAngle });
            const delayLabel = this.props.intl.formatMessage({ id: 'endDelay', defaultMessage: nls.endDelay });
            return (jsx(React.Fragment, null,
                jsx(SettingRow, { label: advancedSettingsLabel }),
                jsx(SettingRow, null,
                    jsx(Label, { className: '' }, durationLabel)),
                jsx(SettingRow, null,
                    jsx(NumericInput, { className: 'w-100', size: 'sm', showHandlers: false, value: duration, min: Constraints.TIME.MIN, onChange: (value) => { this.handleDurationChange(value); } })),
                jsx(SettingRow, null,
                    jsx(Label, { className: '' }, rotationAngleLabel)),
                jsx(SettingRow, null,
                    jsx(NumericInput, { className: 'w-100', size: 'sm', showHandlers: false, value: angle, min: 0, onChange: (value) => { this.handlePointAngleChange(value); } })),
                jsx(SettingRow, null,
                    jsx(Label, { className: '' }, delayLabel)),
                jsx(SettingRow, null,
                    jsx(NumericInput, { className: 'w-100', size: 'sm', showHandlers: false, value: endDelay, min: Constraints.TIME.MIN, onChange: (value) => { this.handleDelayChange(value); } }))));
        };
        // 2 path
        this.handlePathStyleChange = (type) => {
            this.tmpRecordConfig.type = type;
            this.setState({ pathStyle: type });
        };
        this.handlePathAltitudeChange = (altitude) => {
            let _altitude = this.tmpRecordConfig.controllerConfig.liveviewSettingState.fixAltitude;
            _altitude = altNumFix(altitude);
            this.props.onLiveviewSettingChange({ altitude: _altitude });
            this.setState({ altitude: _altitude });
        };
        this.renderPathStyle = () => {
            const isCurve = (this.state.pathStyle === ControllerMode.Smoothed);
            const label = this.props.intl.formatMessage({ id: 'styleLabelPath', defaultMessage: nls.styleLabelPath });
            const smoothedCurve = this.props.intl.formatMessage({ id: 'pathTypeSmoothedCurve', defaultMessage: nls.pathTypeSmoothedCurve });
            const realPath = this.props.intl.formatMessage({ id: 'pathTypeRealPath', defaultMessage: nls.pathTypeRealPath });
            return (jsx(React.Fragment, null,
                jsx(SettingRow, null,
                    jsx(Label, { className: ' text-truncate' }, label)),
                jsx(SettingRow, { className: 'mt-2 radio-wapper' },
                    jsx(Radio, { checked: isCurve, id: 'CURVED', style: { cursor: 'pointer' }, onChange: e => this.handlePathStyleChange(ControllerMode.Smoothed) }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'CURVED', className: 'ml-1 text-break' }, smoothedCurve)),
                jsx(SettingRow, { className: 'mt-2 radio-wapper' },
                    jsx(Radio, { checked: !isCurve, id: 'LINE', style: { cursor: 'pointer' }, onChange: e => this.handlePathStyleChange(ControllerMode.RealPath) }),
                    jsx(Label, { style: { cursor: 'pointer' }, for: 'LINE', className: 'ml-1 text-break' }, realPath))));
        };
        this.renderAltitude = () => {
            const { altitude } = this.state;
            const altitudeLabel = this.props.intl.formatMessage({ id: 'altitude', defaultMessage: defaultMessages.altitude });
            const meterAbbr = this.props.intl.formatMessage({ id: 'meterAbbr', defaultMessage: defaultMessages.meterAbbr });
            const ground = this.props.intl.formatMessage({ id: 'ground', defaultMessage: defaultMessages.ground });
            const space = this.props.intl.formatMessage({ id: 'outerSpace', defaultMessage: defaultMessages.outerSpace });
            const relative2Ground = this.props.intl.formatMessage({ id: 'relative2Ground', defaultMessage: defaultMessages.relative2Ground });
            return (jsx("div", { className: 'altitude-setting' },
                jsx(SettingRow, null,
                    jsx(Label, { className: '' }, altitudeLabel)),
                jsx(SettingRow, { className: 'd-flex justify-content-between' },
                    jsx("div", { className: 'd-flex altitude-number' },
                        jsx(NumericInput, { defaultValue: '0', size: 'sm', value: altitude, min: Constraints.ALT.MIN, max: Constraints.ALT.MAX, onChange: (value) => this.handlePathAltitudeChange(value) }),
                        jsx(Label, { className: 'small-tips' }, meterAbbr)),
                    jsx(Label, { className: 'small-tips' }, relative2Ground)),
                jsx(SettingRow, null,
                    jsx(Slider, { className: 'd-flex dropdown-item', size: 'sm', value: altitude, min: Constraints.ALT.MIN, max: Constraints.ALT.MAX, step: Constraints.ALT.STEP, onChange: (evt) => this.handlePathAltitudeChange(parseFloat(evt.target.value)), title: '' })),
                jsx(SettingRow, { className: 'd-flex mt-0 justify-content-between ' },
                    jsx(Label, { className: 'small-tips' }, ground),
                    jsx(Label, { className: 'small-tips' }, space))));
        };
        this.renderPathAdvancedSettings = () => {
            const { duration, endDelay } = this.state;
            const advancedSettingsLabel = this.props.intl.formatMessage({ id: 'advancedSettings', defaultMessage: nls.advancedSettings });
            const durationLabel = this.props.intl.formatMessage({ id: 'duration', defaultMessage: nls.duration });
            const delayLabel = this.props.intl.formatMessage({ id: 'endDelay', defaultMessage: nls.endDelay });
            return (jsx(React.Fragment, null,
                jsx(SettingRow, { label: advancedSettingsLabel }),
                jsx(SettingRow, null,
                    jsx(Label, { className: '' }, durationLabel)),
                jsx(SettingRow, null,
                    jsx(NumericInput, { className: 'w-100', size: 'sm', showHandlers: false, value: duration, min: Constraints.TIME.MIN, onChange: (value) => { this.handleDurationChange(value); } })),
                jsx(SettingRow, null,
                    jsx(Label, { className: '' }, delayLabel)),
                jsx(SettingRow, null,
                    jsx(NumericInput, { className: 'w-100', size: 'sm', showHandlers: false, value: endDelay, min: Constraints.TIME.MIN, onChange: (value) => { this.handleDelayChange(value); } }))));
        };
        const { type } = this.props.record.getConfig();
        let rotateDirection, tilt, pathStyle, altitude;
        if (type === ControllerMode.Rotate) {
            rotateDirection = this.props.record.getConfig().direction;
            tilt = this.props.getCurrentLiveviewSetting().tilt;
        }
        else if (type === ControllerMode.RealPath || type === ControllerMode.Smoothed) {
            pathStyle = this.props.record.getConfig().type;
            altitude = this.props.getCurrentLiveviewSetting().altitude;
        }
        const initDuration = this.props.getDefaultDuration() / 1000;
        const duration = isDefined(this.props.record.getConfig().duration) ? this.props.record.getConfig().duration : initDuration;
        const initAngle = this.props.record.getConfig().angle;
        const initEndDelay = this.props.record.getConfig().endDelay;
        this.state = {
            // point
            rotateDirection: rotateDirection,
            tilt: angleNumFix(tilt),
            angle: angleNumFix(initAngle),
            // path
            pathStyle: pathStyle,
            altitude: altNumFix(altitude),
            // AdvancedSettings
            duration: timeNumFix(duration),
            endDelay: timeNumFix(initEndDelay)
        };
        this.tmpRecordConfig = this.props.record.getConfig(); // for cache change
    }
    componentDidMount() {
        var _a;
        (_a = this.backBtnRefFor508) === null || _a === void 0 ? void 0 : _a.focus(); //508
    }
    render() {
        var _a;
        const recordConfig = this.props.record.getConfig();
        const titleTextInput = React.createRef();
        // const durationInput = React.createRef<HTMLInputElement>();
        // const degreeInput = React.createRef<HTMLInputElement>();
        // const waitingInput = React.createRef<HTMLInputElement>();
        // const second = this.props.intl.formatMessage({ id: 'second', defaultMessage: defaultMessages.second });
        const nameLabel = this.props.intl.formatMessage({ id: 'label', defaultMessage: defaultMessages.label });
        const backLabel = this.props.intl.formatMessage({ id: 'back', defaultMessage: defaultMessages.back });
        const recordType = recordConfig === null || recordConfig === void 0 ? void 0 : recordConfig.type;
        return (isDefined(recordConfig) &&
            jsx("div", { className: 'w-100', css: this.getStyle() },
                jsx(SettingSection, null,
                    jsx(Button, { className: 'page-back-btn p-0 mt-1 mb-2', type: 'tertiary', onClick: this.handleBackBtnClick, ref: (ref) => { this.backBtnRefFor508 = ref; } },
                        jsx(ArrowLeftOutlined, { size: 'm', autoFlip: true }),
                        jsx(Label, { className: 'm-0' }, backLabel)),
                    jsx(SettingRow, { label: nameLabel }),
                    jsx(SettingRow, null,
                        jsx(TextInput, { className: 'w-100', ref: titleTextInput, size: 'sm', required: true, title: recordConfig.displayName, defaultValue: (_a = recordConfig.displayName) !== null && _a !== void 0 ? _a : '', onAcceptValue: this.handleDisplayNameChange, onKeyDown: (e) => this.handleKeydown(e, titleTextInput) })),
                    (recordType === ControllerMode.Rotate) &&
                        jsx(React.Fragment, null,
                            this.renderPointDirection(),
                            this.renderTilt(),
                            this.renderPointsAdvancedSettings()),
                    (recordType === ControllerMode.RealPath || recordType === ControllerMode.Smoothed) &&
                        jsx(React.Fragment, null,
                            this.renderPathStyle(),
                            this.renderAltitude(),
                            this.renderPathAdvancedSettings()))));
    }
}
//# sourceMappingURL=record-detail.js.map