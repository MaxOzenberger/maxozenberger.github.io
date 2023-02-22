import * as utils from '../../common/utils/utils';
import { defaultMessages as jimuUiNls } from 'jimu-ui';
import nls from '../translations/default';
export var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes[ErrorTypes["Choose3DMap"] = 0] = "Choose3DMap";
    ErrorTypes[ErrorTypes["ConfigError"] = 1] = "ConfigError";
})(ErrorTypes || (ErrorTypes = {}));
export default class ErrorTipsManager {
    constructor(options) {
        this.getDefaultError = () => {
            return this.chooseMapTip;
        };
        this.isError = () => {
            return (this.isNoMapId() || this.isNoScene() || this.isNoModeInSetting());
        };
        this.setError = (tip) => {
            if (tip !== this.widget.state.errorTip) {
                this.widget.setState({ errorTip: tip });
            }
        };
        this.setErrorByType = (type) => {
            if (type === ErrorTypes.Choose3DMap) {
                this.setError(this.chooseMapTip);
            }
        };
        this.isNoScene = () => {
            return !utils.isDefined(this.widget.state.jimuMapView);
        };
        this.isNoModeInSetting = () => {
            return utils.getEnabledItemNum(this.widget.props.config.itemsList) < 1;
        };
        this.isNoMapId = () => {
            return !utils.isDefined(this.widget.props.useMapWidgetIds) || !utils.isDefined(this.widget.props.useMapWidgetIds[0]);
        };
        this.checkErrorInConfig = () => {
            const choseSceneInSetting = this.isNoScene() || this.isNoMapId(); // for change map
            if (choseSceneInSetting) {
                this.setError(this.chooseMapTip); // no 3d map
                return;
            }
            if (this.isNoModeInSetting()) {
                this.setError(this.configErrorTip); // no item in config
                return;
            }
            if (utils.isDefined(this.widget.jimuMapView)) {
                this.setError(''); // ok
            }
        };
        this.widget = options.widget;
        this.chooseMapTip = this.widget.props.intl.formatMessage({ id: 'select3DMapHint', defaultMessage: jimuUiNls.select3DMapHint });
        this.configErrorTip = this.widget.props.intl.formatMessage({ id: 'configErrorTip', defaultMessage: nls.configErrorTip });
    }
}
//# sourceMappingURL=error-tips-manager.js.map