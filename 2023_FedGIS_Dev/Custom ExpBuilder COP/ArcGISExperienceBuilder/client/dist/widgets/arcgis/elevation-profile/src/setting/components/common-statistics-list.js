/** @jsx jsx */ // <-- make sure to include the jsx pragma
import { React, jsx } from 'jimu-core';
import { Checkbox, Tooltip, Label, Icon, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { List, TreeItemActionType } from 'jimu-ui/basic/list-tree';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { getStatisticsListStyle } from '../lib/style';
import defaultMessages from '../translations/default';
import { getConfigIcon } from '../constants';
const { epConfigIcon } = getConfigIcon();
export default class StatisticsList extends React.PureComponent {
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
            const statisticsConfig = [];
            //Update initial config saved statistics
            this.props.availableStatistics.forEach((stat) => {
                const configProperty = {
                    name: stat.name,
                    label: stat.label,
                    enabled: stat.enabled
                };
                statisticsConfig.push(configProperty);
            });
            if (statisticsConfig.length > 0 && this._statistics.length !== statisticsConfig.length) {
                this._statistics = statisticsConfig;
            }
            this.props.onStatsListUpdated(this._statistics);
        };
        this.componentDidUpdate = (prevProps) => {
            if (this.isStatsPropsChange(prevProps)) {
                this._statistics = this.props.availableStatistics;
            }
        };
        this.isStatsPropsChange = (prevProps) => {
            let isChangeDone = false;
            if (prevProps.availableStatistics.length > 0) {
                prevProps.availableStatistics.some((stats) => (this.props.availableStatistics.some((currentStats) => {
                    if (stats.name === currentStats.name) {
                        if (stats.enabled !== currentStats.enabled) {
                            isChangeDone = true;
                            return true;
                        }
                    }
                    return false;
                })));
            }
            return isChangeDone;
        };
        /**
        * Create checkbox and label element in the individual statistics list items
        */
        this.createOptionElement = (stat, index) => {
            const _options = (jsx("div", { style: { width: 180 } },
                jsx(SettingRow, null,
                    jsx(Checkbox, { role: 'çheckbox', className: 'cursor-pointer mr-2 font-13', "aria-label": stat.label, checked: stat.enabled, onChange: e => { this.onCheckBoxChange(e, index); } }),
                    jsx("div", { className: 'text-truncate', title: stat.label }, this.nls(stat.name)))));
            return _options;
        };
        this.onCheckBoxChange = (evt, statIndex) => {
            const statistics = this._statistics;
            let updatedSettings;
            statistics.some((statsSetting, index) => {
                if (statIndex === index) {
                    updatedSettings = {
                        name: statsSetting.name,
                        label: statsSetting.label,
                        enabled: evt.currentTarget.checked
                    };
                    return true;
                }
                return false;
            });
            evt.stopPropagation();
            this.updateItem(statIndex, updatedSettings);
        };
        this.updateItem = (index, itemAttributes) => {
            if (index > -1) {
                this._statistics = [
                    ...this._statistics.slice(0, index),
                    Object.assign({}, this._statistics[index], itemAttributes),
                    ...this._statistics.slice(index + 1)
                ];
                this.props.onStatsListUpdated(this._statistics);
            }
        };
        this._statistics = [];
    }
    render() {
        return jsx("div", { css: getStatisticsListStyle(this.props.theme), className: 'pt-3 pb-2' },
            jsx(SettingRow, null,
                jsx(Label, { tabIndex: 0, "aria-label": this.nls('statisticsListLabel'), className: 'w-100 d-flex' },
                    jsx("div", { className: 'flex-grow-1 text-break color-label' }, this.nls('statisticsListLabel'))),
                jsx(Tooltip, { role: 'tooltip', tabIndex: 0, "aria-label": this.nls('statisticsListTooltip'), title: this.nls('statisticsListTooltip'), showArrow: true, placement: 'top' },
                    jsx("div", { className: 'ml-2 d-inline ep-tooltip color-label' },
                        jsx(Icon, { size: 14, icon: epConfigIcon.infoIcon })))),
            jsx("div", { className: 'pt-2' },
                jsx(List, { size: 'sm', className: this.props.availableStatistics && this.props.availableStatistics.length === 0 ? 'hidden' : 'ep-statistics-list-items', itemsJson: Array.from(this.props.availableStatistics).map((stats, index) => ({
                        itemStateDetailContent: stats,
                        itemKey: `${index}`
                    })), dndEnabled: true, isItemFocused: () => false, onUpdateItem: (actionData, refComponent) => {
                        const { itemJsons } = refComponent.props;
                        const [, parentItemJson] = itemJsons;
                        const newSortedStatistics = parentItemJson.map(item => {
                            return item.itemStateDetailContent;
                        });
                        this._statistics = newSortedStatistics;
                        this.props.onStatsListUpdated(newSortedStatistics);
                    }, overrideItemBlockInfo: () => {
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
//# sourceMappingURL=common-statistics-list.js.map