/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx } from 'jimu-core';
import { Checkbox, Button, Icon, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { getTableStyle } from '../lib/style';
import defaultMessages from '../translations/default';
const iconEdit = require('jimu-ui/lib/icons/edit.svg');
export default class CoordinateTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.nls = (id) => {
            const messages = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
            //for unit testing no need to mock intl we can directly use default en msg
            if (this.props.intl && this.props.intl.formatMessage) {
                return this.props.intl.formatMessage({ id: id, defaultMessage: messages[id] });
            }
            else {
                return messages[id];
            }
        };
        this.componentDidMount = () => {
            let isAllChecked = true;
            const coordinateConfig = [];
            this.props.allSupportedFormats.forEach((coordinateFormat) => {
                const configProperty = {
                    name: coordinateFormat.name,
                    label: coordinateFormat.label,
                    defaultPattern: coordinateFormat.defaultPattern,
                    currentPattern: coordinateFormat.currentPattern,
                    enabled: coordinateFormat.enabled,
                    isCustom: coordinateFormat.isCustom
                };
                coordinateConfig.push(configProperty);
                if (!coordinateFormat.enabled) {
                    isAllChecked = false;
                }
            });
            if (coordinateConfig.length > 0 && this._outputSettings.length !== coordinateConfig.length) {
                this._outputSettings = coordinateConfig;
            }
            this.props.onSettingsUpdate(this._outputSettings);
            this._isAllChecked = isAllChecked;
        };
        this.componentDidUpdate = (prevProps) => {
            if (this.isChange(prevProps.allSupportedFormats, this.props.allSupportedFormats)) {
                this._outputSettings = this.props.allSupportedFormats;
            }
        };
        this.isChange = (prevSettings, newSettings) => {
            if (prevSettings.length > 0) {
                let isChangeDone = false;
                //eslint-disable-next-line
                newSettings === null || newSettings === void 0 ? void 0 : newSettings.some((newCoordsSetting, index) => {
                    var _a, _b, _c;
                    if ((newCoordsSetting === null || newCoordsSetting === void 0 ? void 0 : newCoordsSetting.name) !== ((_a = prevSettings[index]) === null || _a === void 0 ? void 0 : _a.name) ||
                        (newCoordsSetting === null || newCoordsSetting === void 0 ? void 0 : newCoordsSetting.currentPattern) !== ((_b = prevSettings[index]) === null || _b === void 0 ? void 0 : _b.currentPattern) ||
                        (newCoordsSetting === null || newCoordsSetting === void 0 ? void 0 : newCoordsSetting.enabled) !== ((_c = prevSettings[index]) === null || _c === void 0 ? void 0 : _c.enabled)) {
                        isChangeDone = true;
                        return true;
                    }
                });
                return isChangeDone;
            }
        };
        this.updateHeaderCheckBoxState = (updatedSettings) => {
            let isAllChecked = true;
            updatedSettings.some((formatSettings) => {
                if (!formatSettings.enabled) {
                    isAllChecked = false;
                    return true;
                }
                return false;
            });
            this._isAllChecked = isAllChecked;
        };
        this.onHeaderCheckBoxChange = (checked) => {
            const outputSettings = this._outputSettings;
            const updatedSettings = outputSettings.map((coordinateSetting) => {
                const temp = Object.assign({}, coordinateSetting);
                temp.enabled = checked;
                return temp;
            });
            this.props.onSettingsUpdate(updatedSettings);
            this._outputSettings = updatedSettings;
            this.updateHeaderCheckBoxState(this._outputSettings);
        };
        this.onCheckBoxChange = (evt, formatIndex) => {
            const outputSettings = this._outputSettings;
            let updatedSettings;
            outputSettings.some((coordinateSetting, index) => {
                if (formatIndex === index) {
                    updatedSettings = {
                        name: coordinateSetting.name,
                        label: coordinateSetting.label,
                        defaultPattern: coordinateSetting.defaultPattern,
                        currentPattern: coordinateSetting.currentPattern,
                        enabled: evt.target.checked,
                        isCustom: coordinateSetting.isCustom
                    };
                    return true;
                }
                return false;
            });
            evt.stopPropagation();
            this.updateItem(formatIndex, updatedSettings);
        };
        this.onEditButtonClick = () => {
            this.props.onEditClick();
        };
        /**
        * Create checkbox, label, format elements in the individual list items
        */
        this.createOptionElement = (coordinateFormat, index) => {
            const coordsConfig = [];
            const inputOption = {
                name: coordinateFormat.name,
                label: coordinateFormat.label,
                defaultPattern: coordinateFormat.defaultPattern,
                currentPattern: coordinateFormat.currentPattern,
                enabled: coordinateFormat.enabled,
                isCustom: coordinateFormat.isCustom
            };
            coordsConfig.push(inputOption);
            const _options = (jsx("div", { className: 'rowDimensions' },
                jsx(SettingRow, null,
                    jsx(Checkbox, { className: 'cursor-pointer mr-2 font-13', checked: coordinateFormat.enabled, onChange: e => { this.onCheckBoxChange(e, index); } }),
                    jsx("div", { className: 'coordinatesNotation text-truncate', title: coordinateFormat.label }, coordinateFormat.label),
                    jsx("div", { className: 'coordinateFormat pl-1 text-truncate', title: coordinateFormat.currentPattern }, coordinateFormat.currentPattern))));
            return _options;
        };
        /**
        * Create header for the coordinates list
        */
        this.createHeaderElement = () => {
            const _header = (jsx("div", { className: 'tableHeading' },
                jsx(SettingRow, null,
                    jsx(Checkbox, { className: 'cursor-pointer alignBox mr-2 font-13', checked: this._isAllChecked, onChange: evt => { this.onHeaderCheckBoxChange(evt.target.checked); } }),
                    jsx("div", { className: 'coordinateHeaderLabel text-truncate', title: this.nls('coordinateLabel') }, this.nls('coordinateLabel')),
                    jsx("div", { className: 'coordinateHeaderFormat pl-1 text-truncate', title: this.nls('coordinateFormat') }, this.nls('coordinateFormat')),
                    jsx("span", null,
                        jsx(Button, { "aria-label": this.nls('edit'), className: 'ml-2', title: this.nls('edit'), size: 'sm', icon: true, type: 'tertiary', onClick: this.onEditButtonClick.bind(this) },
                            jsx(Icon, { icon: iconEdit, size: 12 }))))));
            return _header;
        };
        this._isAllChecked = false;
        this._outputSettings = [];
    }
    updateItem(index, itemAttributes) {
        if (index > -1) {
            this._outputSettings = [
                ...this._outputSettings.slice(0, index),
                Object.assign({}, this._outputSettings[index], itemAttributes),
                ...this._outputSettings.slice(index + 1)
            ];
            this.props.onSettingsUpdate(this._outputSettings);
            this.updateHeaderCheckBoxState(this._outputSettings);
        }
    }
    render() {
        const header = this.createHeaderElement();
        return jsx("div", { css: getTableStyle(this.props.theme), style: { height: '100%', width: '100%' } },
            jsx("div", { className: this.props.allSupportedFormats && this.props.allSupportedFormats.length === 0 ? 'hidden' : '' },
                header,
                jsx(List, { className: 'coordinate-converion-list-items', itemsJson: Array.from(this.props.allSupportedFormats).map((coordinateFormat, index) => ({
                        itemStateDetailContent: coordinateFormat,
                        itemKey: `${index}`
                    })), dndEnabled: true, isItemFocused: () => false, onUpdateItem: (actionData, refComponent) => {
                        const { itemJsons } = refComponent.props;
                        const [, parentItemJson] = itemJsons;
                        const newSortedConversions = parentItemJson.map(item => {
                            return item.itemStateDetailContent;
                        });
                        this._outputSettings = newSortedConversions;
                        this.props.onSettingsUpdate(newSortedConversions);
                    }, overrideItemBlockInfo: ({ itemBlockInfo }) => {
                        return {
                            name: TreeItemActionType.RenderOverrideItem,
                            children: [{
                                    name: TreeItemActionType.RenderOverrideItemDroppableContainer,
                                    withListGroupItemWrapper: false,
                                    children: [{
                                            name: TreeItemActionType.RenderOverrideItemDraggableContainer,
                                            children: [{
                                                    name: TreeItemActionType.RenderOverrideItemBody,
                                                    children: [{
                                                            name: TreeItemActionType.RenderOverrideItemDragHandle
                                                        }, {
                                                            name: TreeItemActionType.RenderOverrideItemMainLine
                                                        }]
                                                }]
                                        }]
                                }]
                        };
                    }, renderOverrideItemMainLine: (actionData, refComponent) => {
                        const { itemJsons } = refComponent.props;
                        const currentItemJson = itemJsons[0];
                        const listItemJsons = itemJsons[1];
                        return this.createOptionElement(currentItemJson.itemStateDetailContent, listItemJsons.indexOf(currentItemJson));
                    } })));
    }
}
//# sourceMappingURL=coordinate-table.js.map