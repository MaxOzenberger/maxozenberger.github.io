/** @jsx jsx */
import { React, jsx, css, polished, defaultMessages as jimuCoreNls } from 'jimu-core';
import { Button, TextInput, Dropdown, DropdownButton, DropdownMenu, DropdownItem, Label, Badge, defaultMessages as jimuUiNls } from 'jimu-ui';
import { PageMode, NewFeatureMode } from '../../setting';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import nls from '../../translations/default';
import { RecordList } from './record/record-list';
import * as utils from '../../../common/utils/utils';
import { PinEsriOutlined } from 'jimu-icons/outlined/gis/pin-esri';
import { PolylineOutlined } from 'jimu-icons/outlined/gis/polyline';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
import { PlayOutlined } from 'jimu-icons/outlined/editor/play';
import { PauseOutlined } from 'jimu-icons/outlined/editor/pause';
export class RouteDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.backBtnRefFor508 = null; //508
        this.handleKeydown = (e, ref) => {
            if (e.key === 'Enter') {
                ref.current.blur();
            }
        };
        this._handleIsDisablePlayBtn = () => {
            const records = this.props.routeConfig.records;
            const isDisablePlayBtn = (records.length <= 0);
            return isDisablePlayBtn;
        };
        this._handleNewRecordNotify = () => {
            this.setState({ previewNeedToResetFlag: true });
        };
        this.handleRecordEdit = (ids) => {
            this.props.onRecordEdit(ids);
            this.setState({ previewNeedToResetFlag: true });
        };
        this.handleRecordDelete = (ids) => {
            this.props.onRecordDelete(ids);
            this.setState({ previewNeedToResetFlag: true });
        };
        this.handleRecordsOrderUpdate = (treeItems) => {
            this.props.onRecordsOrderUpdate(treeItems);
            this.setState({ previewNeedToResetFlag: true });
        };
        this.getStyle = ( /* theme: IMThemeVariables */) => {
            return css `
      .map-2d-warning{
        flex-direction: column;
        margin-top: 128px;
        color: ${this.props.theme.colors.palette.dark[200]};

        .tip {
          font-size: 14px;
        }
      }

      .description {
        height: ${polished.rem(40)};
      }

      .new-feature-dropdown {
        width: 190px;/*calc(100% - ${polished.rem(32)});*/
      }

      .del-btn-wapper {
        position: relative;

        .delete-con {
          & {
            position: absolute;
            bottom: ${polished.rem(16)};
            width: 100%;
            height: ${polished.rem(32)};
          }
          button {
            width: calc(100% - ${polished.rem(32)});
          }
        }
      }
      `;
        };
        this.handleBackBtnClick = () => {
            this.props.onShowMapPopperChange(false);
            this.props.onRouteEdit({ routeUuid: null });
            this.props.onSettingPageModeChange(PageMode.Common);
        };
        this.handleDeleteClick = () => {
            this.props.onRouteDelete({ routeUuid: this.props.routeConfig.idx });
            this.handleBackBtnClick();
        };
        this.handleRouteNameChange = (name) => {
            this.props.onRouteNameChange({ routeUuid: this.props.routeConfig.idx }, name);
        };
        /// /////////////////////////////////////////////////////////////////////////////
        // NewFeature
        this.toggleNewFeaturePopup = () => {
            this.setState({ isNewFeaturePopupOpen: !this.state.isNewFeaturePopupOpen });
        };
        this.handleNewFeatureModeClick = (mode) => {
            this.props.onNewFeatureModeChange(mode);
        };
        /// ///////////////////////////////////////////////////////////////
        // preview comp
        this.handlePreviewRoute = () => {
            if (this.props.isPreviewRouteBtnPlaying) {
                // Pause
                this.props.onPauseRoutePreview();
            }
            else {
                // Play
                const speed = 0.5; // mid speed
                this.props.onPreviewRoute(speed, { routeUuid: this.props.routeConfig.idx }, this.state.previewNeedToResetFlag);
                this.setState({ previewNeedToResetFlag: false }); // clean badge
            }
        };
        this.state = {
            isNewFeaturePopupOpen: false,
            previewNeedToResetFlag: false,
            is2DJimuMapView: false
        };
    }
    componentDidMount() {
        var _a;
        (_a = this.backBtnRefFor508) === null || _a === void 0 ? void 0 : _a.focus(); //508
    }
    componentDidUpdate(prevProps /*, prevState: States */) {
        if (this.props.newestRecordIdx !== prevProps.newestRecordIdx) {
            this._handleNewRecordNotify();
        }
        // Badge
        if (this.props.routeConfig !== prevProps.routeConfig) {
            if (this._handleIsDisablePlayBtn()) {
                this.setState({ previewNeedToResetFlag: false });
            }
        }
        // mapPopperJimuMapView changed
        if (this.props.mapPopperJimuMapView !== prevProps.mapPopperJimuMapView) {
            if (this.props.mapPopperJimuMapView.view.type === '2d') {
                this.setState({ is2DJimuMapView: true });
                this.setState({ previewNeedToResetFlag: false });
            }
            else {
                this.setState({ is2DJimuMapView: false });
            }
        }
    }
    render() {
        var _a;
        const { routeConfig } = this.props;
        const backLabel = this.props.intl.formatMessage({ id: 'back', defaultMessage: jimuUiNls.back });
        const deleteLabel = this.props.intl.formatMessage({ id: 'delete', defaultMessage: jimuCoreNls.delete });
        const nameLabel = this.props.intl.formatMessage({ id: 'label', defaultMessage: jimuUiNls.label });
        const choose3DMapTip = this.props.intl.formatMessage({ id: 'chooseMapTip', defaultMessage: nls.chooseMapTip });
        // const descriptionLabel = this.props.intl.formatMessage({ id: 'description', defaultMessage: jimuUiNls.description });
        // const desPlaceHolder = this.props.intl.formatMessage({ id: 'desPlaceHolder', defaultMessage: nls.desPlaceHolder });
        const titleTextInput = React.createRef();
        const records = routeConfig.records;
        return (utils.isDefined(routeConfig) &&
            jsx("div", { className: 'w-100 h-100', css: this.getStyle( /* theme */) },
                jsx("div", { className: 'w-100 h-100' },
                    jsx(SettingSection, null,
                        jsx(Button, { className: 'page-back-btn p-0 mt-1 mb-2', type: 'tertiary', onClick: this.handleBackBtnClick, ref: (ref) => { this.backBtnRefFor508 = ref; } },
                            jsx(ArrowLeftOutlined, { size: 16, autoFlip: true }),
                            jsx(Label, { className: 'm-0' }, backLabel)),
                        jsx(SettingRow, { label: nameLabel }),
                        jsx(SettingRow, null,
                            jsx(TextInput, { className: 'w-100', ref: titleTextInput, size: 'sm', required: true, title: routeConfig.displayName, defaultValue: (_a = routeConfig.displayName) !== null && _a !== void 0 ? _a : '', onAcceptValue: this.handleRouteNameChange, onKeyDown: (e) => this.handleKeydown(e, titleTextInput) }))),
                    jsx(SettingSection, null,
                        (this.state.is2DJimuMapView) &&
                            jsx("div", { className: 'd-flex align-items-center justify-content-center map-2d-warning' },
                                jsx(InfoOutlined, { size: 42 }),
                                jsx("div", { className: 'tip text-center mt-3' }, choose3DMapTip)),
                        (!this.state.is2DJimuMapView) &&
                            jsx(React.Fragment, null,
                                jsx("div", { className: 'd-flex justify-content-between mb-4' },
                                    this.renderNewFeatureContent(),
                                    this.renderPreviewContent()),
                                (utils.isDefined(records) &&
                                    jsx(RecordList, { records: records, mapPopperJimuMapView: this.props.mapPopperJimuMapView, isTerrainLoaded: this.props.isTerrainLoaded, theme: this.props.theme, intl: this.props.intl, 
                                        //
                                        playingInfo: this.props.playingInfo, 
                                        //
                                        onRecordEdit: this.handleRecordEdit, onRecordPreview: this.props.onRecordPreview, onPauseRecordPreview: this.props.onPauseRecordPreview, onRecordDelete: this.handleRecordDelete, onRecordsOrderUpdate: this.handleRecordsOrderUpdate, 
                                        // onSettingPageModeChange={this.props.onSettingPageModeChange}
                                        isRecordCanPlay: this.props.isRecordCanPlay }))))),
                jsx(SettingRow, { className: 'del-btn-wapper' },
                    jsx("div", { className: 'd-flex w-100 justify-content-center delete-con' },
                        jsx(Button, { type: 'secondary', onClick: this.handleDeleteClick }, deleteLabel)))));
    }
    renderNewFeatureContent() {
        const newFeatureTip = this.props.intl.formatMessage({ id: 'newFeature', defaultMessage: nls.newFeature });
        const addPointTip = this.props.intl.formatMessage({ id: 'addPoint', defaultMessage: nls.addPoint });
        const addPathTip = this.props.intl.formatMessage({ id: 'addPath', defaultMessage: nls.addPath });
        const isDisable = !this.props.isDrawHelperLoaded || this.state.is2DJimuMapView || !this.props.isTerrainLoaded;
        return (jsx(Dropdown, { isOpen: this.state.isNewFeaturePopupOpen, toggle: this.toggleNewFeaturePopup, className: 'dropdowns', activeIcon: true, disabled: isDisable },
            jsx(DropdownButton, { icon: true, className: 'new-feature-dropdown oper-btns', arrow: false }, newFeatureTip),
            jsx(DropdownMenu, { showArrow: false },
                jsx(DropdownItem, { onClick: () => this.handleNewFeatureModeClick(NewFeatureMode.Point), className: 'dropdown-items' },
                    jsx(PinEsriOutlined, null),
                    jsx("span", { className: 'mx-2' }, addPointTip)),
                jsx(DropdownItem, { onClick: () => this.handleNewFeatureModeClick(NewFeatureMode.Path), className: 'dropdown-items' },
                    jsx(PolylineOutlined, null),
                    jsx("span", { className: 'mx-2' }, addPathTip)))));
    }
    renderPreviewContent() {
        let content;
        const previewLabel = this.props.intl.formatMessage({ id: 'previewRoute', defaultMessage: nls.previewRoute });
        const previewWithBadgeLabel = this.props.intl.formatMessage({ id: 'previewRouteBadge', defaultMessage: nls.previewRouteBadge });
        const pauseLabel = this.props.intl.formatMessage({ id: 'pause', defaultMessage: jimuUiNls.pause });
        const isDisable = this._handleIsDisablePlayBtn() || !this.props.isDrawHelperLoaded || this.state.is2DJimuMapView || !this.props.isTerrainLoaded;
        if (this.props.isPreviewRouteBtnPlaying) {
            content = (jsx(Button, { icon: true, onClick: this.handlePreviewRoute, title: pauseLabel, disabled: isDisable },
                jsx(PauseOutlined, null)));
        }
        else {
            const title = (this.state.previewNeedToResetFlag) ? previewWithBadgeLabel : previewLabel;
            content = (jsx(Button, { icon: true, onClick: this.handlePreviewRoute, title: title, disabled: isDisable },
                jsx(PlayOutlined, null)));
        }
        return (jsx(Badge, { dot: true, hideBadge: !this.state.previewNeedToResetFlag, color: 'danger' }, content));
    }
}
//# sourceMappingURL=route-detail.js.map