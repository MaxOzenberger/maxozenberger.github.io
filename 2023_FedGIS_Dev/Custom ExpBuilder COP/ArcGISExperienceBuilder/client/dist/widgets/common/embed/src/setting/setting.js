/** @jsx jsx */
import { React, jsx, Immutable, expressionUtils, AllDataSourceTypes } from 'jimu-core';
import { builderAppSync } from 'jimu-for-builder';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { TextInput, TextArea, Switch, NumericInput, defaultMessages as jimuUiMessages, AdvancedButtonGroup, Button, richTextUtils } from 'jimu-ui';
import defaultMessages from './translations/default';
import { EmbedType } from '../config';
import { getStyle } from './style';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { DynamicUrlEditor } from 'jimu-ui/advanced/dynamic-url-editor';
import { WarningOutlined } from 'jimu-icons/outlined/suggested/warning';
import { getExpressionParts } from './utils';
const MAX_CODE_LEN = 8192;
export default class Setting extends React.PureComponent {
    constructor(props) {
        super(props);
        this.supportedDsTypes = Immutable([
            AllDataSourceTypes.FeatureLayer,
            AllDataSourceTypes.SceneLayer
        ]);
        this.embedTypeChange = (type) => {
            const { config } = this.props;
            if (type === EmbedType.Url) {
                this.setState({ showCodeError: false });
            }
            if (config.embedType !== type) {
                this.props.onSettingChange({
                    id: this.props.id,
                    config: config.set('embedType', type)
                });
            }
        };
        this.checkURL = (str) => {
            if (!str || str === '') {
                this.setState({ urlError: '' });
                return true;
            }
            const httpsRex = '^(([h][t]{2}[p][s])?://)';
            const re = new RegExp(httpsRex);
            if (!re.test(str)) {
                this.setState({
                    urlError: this.formatMessage('httpsUrlMessage')
                });
                return false;
            }
            // url of localhost works without '.'
            // eslint-disable-next-line
            const httpsLocalRex = new RegExp('^(([h][t]{2}[p][s])?://localhost)');
            if (httpsLocalRex.test(str)) {
                this.setState({ urlError: '' });
                return true;
            }
            const index = str.indexOf('.');
            if (index < 0 || index === str.length - 1) {
                this.setState({
                    urlError: this.formatMessage('invalidUrlMessage')
                });
                return false;
            }
            this.setState({ urlError: '' });
            return true;
        };
        this.embedCodeChangeRightAway = value => {
            const { config, id } = this.props;
            const contentLength = value === null || value === void 0 ? void 0 : value.length;
            if (contentLength > MAX_CODE_LEN) {
                this.setState({ showCodeError: true });
                builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: id, propKey: 'codeLimitExceeded', value: true });
                return;
            }
            this.setState({ showCodeError: false });
            builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: id, propKey: 'codeLimitExceeded', value: false });
            this.props.onSettingChange({
                config: config.set('embedCode', value),
                id: id
            });
        };
        this.formatMessage = (id) => {
            return this.props.intl.formatMessage({
                id: id,
                defaultMessage: Object.assign(Object.assign({}, jimuUiMessages), defaultMessages)[id]
            });
        };
        this.onDataSourceChange = (useDataSources) => {
            if (!useDataSources) {
                return;
            }
            this.props.onSettingChange({
                id: this.props.id,
                useDataSources: useDataSources
            });
        };
        this.onToggleUseDataEnabled = (useDataSourcesEnabled) => {
            this.props.onSettingChange({
                id: this.props.id,
                useDataSourcesEnabled
            });
        };
        this.onSwitchChanged = (checked, name) => {
            this.props.onSettingChange({
                id: this.props.id,
                config: this.props.config.set(name, checked)
            });
        };
        this.handleAutoInterval = (valueInt) => {
            const { config, id } = this.props;
            this.props.onSettingChange({
                id,
                config: config.set('autoInterval', valueInt)
            });
        };
        this.labelChange = event => {
            var _a;
            const { config, id } = this.props;
            const value = (_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.value;
            this.props.onSettingChange({
                id,
                config: config.set('label', value)
            });
        };
        this.webAddressExpressionChange = (expression) => {
            const { config, onSettingChange, id, useDataSourcesEnabled, useDataSources } = this.props;
            const { embedType } = config;
            const UINF_TAG_REGEXP = /\<urlsearch((?!\<urlsearch).)+\<\/urlsearch\>/gmi;
            const EXP_TAG_REGEXP = /\<exp((?!\<exp).)+\<\/exp\>/gmi;
            const haveUrlsearch = expression === null || expression === void 0 ? void 0 : expression.match(UINF_TAG_REGEXP);
            const haveExp = expression === null || expression === void 0 ? void 0 : expression.match(EXP_TAG_REGEXP);
            const expressionStr = expression && expression.replace(/<[^>]+>/g, '').replace(/(^\s*|\s*$)/g, '');
            if ((haveUrlsearch || haveExp) && expressionStr.indexOf('{') === 0) {
                // show expression in runtime
                this.setState({ showUrlError: false });
            }
            else {
                if (this.checkURL(expressionStr)) {
                    this.setState({ showUrlError: false });
                }
                else {
                    this.setState({ showUrlError: true });
                }
            }
            // When expression changed, put the fields in `useDataSources`
            const embedExpressions = richTextUtils.getAllExpressions(expression);
            const parts = getExpressionParts(embedExpressions);
            let udsWithFields;
            udsWithFields = expressionUtils.getUseDataSourceFromExpParts(parts, useDataSources);
            const udsWithoutFields = expressionUtils.getUseDataSourcesWithoutFields(useDataSources);
            udsWithFields = expressionUtils.mergeUseDataSources(udsWithoutFields, udsWithFields);
            const hasExpressionTag = expression === null || expression === void 0 ? void 0 : expression.match(EXP_TAG_REGEXP);
            const useLabel = embedType === EmbedType.Url && useDataSourcesEnabled && (useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) > 0 && hasExpressionTag;
            if (!useLabel) {
                onSettingChange({
                    id,
                    config: config.set('expression', expression).set('enableLabel', false),
                    useDataSources: udsWithFields
                });
            }
            else {
                onSettingChange({
                    id,
                    config: config.set('expression', expression),
                    useDataSources: udsWithFields
                });
            }
        };
        this.isUsedDataSource = () => {
            const { useDataSources, useDataSourcesEnabled } = this.props;
            return useDataSourcesEnabled && useDataSources && useDataSources.length > 0;
        };
        this.hasExpressionTag = (expression) => {
            const EXP_TAG_REGEXP = /\<exp((?!\<exp).)+\<\/exp\>/gmi;
            return expression === null || expression === void 0 ? void 0 : expression.match(EXP_TAG_REGEXP);
        };
        this.state = {
            showUrlError: false,
            urlError: '',
            isExpPopupOpen: false,
            showCodeError: false
        };
    }
    componentWillUnmount() {
        builderAppSync.publishChangeWidgetStatePropToApp({ widgetId: this.props.id, propKey: 'codeLimitExceeded', value: false });
    }
    render() {
        const { showUrlError, urlError, showCodeError } = this.state;
        const { theme, useDataSources, config, useDataSourcesEnabled, id, selectWidgets } = this.props;
        const { embedType, enableLabel, label } = config;
        const useLabel = embedType === EmbedType.Url && useDataSourcesEnabled && (useDataSources === null || useDataSources === void 0 ? void 0 : useDataSources.length) > 0 && this.hasExpressionTag(config.expression);
        return (jsx("div", { css: getStyle(this.props.theme) },
            jsx("div", { className: 'widget-iframe jimu-widget' },
                jsx("div", null,
                    jsx(SettingSection, null,
                        jsx(SettingRow, { label: this.formatMessage('embedBy') }),
                        jsx(SettingRow, null,
                            jsx(AdvancedButtonGroup, { className: 'w-100' },
                                jsx(Button, { className: 'w-50', "aria-label": `${this.formatMessage('embedBy')} ${this.formatMessage('url')}`, active: embedType === EmbedType.Url, onClick: () => this.embedTypeChange(EmbedType.Url) }, this.formatMessage('url')),
                                jsx(Button, { className: 'w-50', "aria-label": `${this.formatMessage('embedBy')} ${this.formatMessage('code')}`, active: embedType === EmbedType.Code, onClick: () => this.embedTypeChange(EmbedType.Code) }, this.formatMessage('code')))),
                        embedType === EmbedType.Url && (jsx(SettingRow, null,
                            jsx("div", { className: 'choose-ds w-100' },
                                jsx(DataSourceSelector, { types: this.supportedDsTypes, useDataSources: this.props.useDataSources, useDataSourcesEnabled: useDataSourcesEnabled, onToggleUseDataEnabled: this.onToggleUseDataEnabled, onChange: this.onDataSourceChange, widgetId: this.props.id })))),
                        jsx(SettingRow, null, embedType === EmbedType.Url
                            ? (jsx("div", { className: 'd-flex flex-column w-100 embed-dynamic-con' },
                                jsx(DynamicUrlEditor, { widgetId: id, useDataSourcesEnabled: useDataSourcesEnabled, useDataSources: useDataSources, selectWidgets: selectWidgets, onChange: this.webAddressExpressionChange, value: config.expression }),
                                showUrlError && (jsx("div", { className: 'd-flex w-100 align-items-center justify-content-between', style: { marginTop: '5px' } },
                                    jsx(WarningOutlined, { color: theme.colors.danger }),
                                    jsx("div", { style: {
                                            width: 'calc(100% - 20px)',
                                            margin: '0 4px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            color: theme.colors.danger
                                        } }, urlError)))))
                            : (jsx("div", { className: 'd-flex flex-column w-100' },
                                jsx(TextArea, { height: 300, className: 'w-100', spellCheck: false, placeholder: this.formatMessage('codePlaceholder'), defaultValue: config.embedCode || '', onAcceptValue: this.embedCodeChangeRightAway }),
                                showCodeError &&
                                    jsx("div", { className: 'd-flex w-100 align-items-center justify-content-between', style: { marginTop: '5px' } },
                                        jsx(WarningOutlined, { color: theme.colors.danger }),
                                        jsx("div", { style: {
                                                width: 'calc(100% - 20px)',
                                                margin: '0 4px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: theme.colors.danger
                                            } }, this.formatMessage('maxLimit')))))),
                        useLabel &&
                            jsx(React.Fragment, null,
                                jsx(SettingRow, null,
                                    jsx("div", { className: 'd-flex justify-content-between w-100' },
                                        jsx("label", { className: 'w-75 text-truncate d-inline-block font-dark-600' }, this.formatMessage('label')),
                                        jsx(Switch, { className: 'can-x-switch', checked: enableLabel || false, "data-key": 'enableLabel', onChange: evt => {
                                                this.onSwitchChanged(evt.target.checked, 'enableLabel');
                                            }, "aria-label": this.formatMessage('label') }))),
                                enableLabel &&
                                    jsx(SettingRow, null,
                                        jsx(TextInput, { type: 'text', className: 'w-100', value: label || '', onChange: this.labelChange }))),
                        jsx(SettingRow, null,
                            jsx("div", { className: 'd-flex justify-content-between w-100' },
                                jsx("label", { className: 'w-75 text-truncate d-inline-block font-dark-600' }, this.formatMessage('autoRefresh')),
                                jsx(Switch, { className: 'can-x-switch', checked: (this.props.config && this.props.config.autoRefresh) ||
                                        false, "data-key": 'autoRefresh', onChange: evt => {
                                        this.onSwitchChanged(evt.target.checked, 'autoRefresh');
                                    }, "aria-label": this.formatMessage('autoRefresh') }))),
                        config.autoRefresh && (jsx(SettingRow, { flow: 'wrap', label: `${this.formatMessage('autoInterval')} (${this.formatMessage('autoUnit')})` },
                            jsx(NumericInput, { size: 'sm', style: { width: '100%' }, value: config.autoInterval || 1, precision: 2, min: 0.2, max: 1440, onChange: this.handleAutoInterval, "aria-label": `${this.formatMessage('autoInterval')} (${this.formatMessage('autoUnit')})` }))))))));
    }
}
Setting.mapExtraStateProps = (state, props) => {
    var _a, _b;
    const widgets = state && ((_b = (_a = state.appStateInBuilder) === null || _a === void 0 ? void 0 : _a.appConfig) === null || _b === void 0 ? void 0 : _b.widgets);
    const selectWidgets = [];
    if (widgets) {
        for (const name in widgets) {
            const item = widgets[name];
            if (item.uri === 'widgets/common/embed/' && item.id !== props.id) {
                selectWidgets.push(item);
            }
        }
    }
    return {
        appConfig: state && state.appStateInBuilder && state.appStateInBuilder.appConfig,
        selectWidgets
    };
};
//# sourceMappingURL=setting.js.map