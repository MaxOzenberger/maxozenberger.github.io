/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Label, Button, Icon, Collapse, defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
import { SettingRow } from 'jimu-ui/advanced/setting-components';
import { convertSingle } from '../../common/unit-conversion';
import defaultMessages from '../translations/default';
import { getRuntimeIcon, unitOptions } from '../constants';
const { epIcon } = getRuntimeIcon();
export default class ProfileStatistics extends React.PureComponent {
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
            //generate the statistics list for displaying in the legend section
            this.generateStats();
        };
        this.generateStats = () => {
            this.selectedStats = [];
            this.props.activeDsConfig.profileChartSettings.selectedStatistics.forEach((stats) => {
                if (stats.enabled) {
                    this.selectedStats.push({
                        label: stats.label,
                        name: stats.name
                    });
                }
            });
            this.selectedStatisticsDisplay();
        };
        this.componentDidUpdate = (prevProps) => {
            var _a, _b;
            if (((_a = prevProps.chartProfileResult) === null || _a === void 0 ? void 0 : _a.statistics) !== ((_b = this.props.chartProfileResult) === null || _b === void 0 ? void 0 : _b.statistics) ||
                prevProps.selectedElevationUnit !== this.props.selectedElevationUnit ||
                prevProps.selectedLinearUnit !== this.props.selectedLinearUnit ||
                prevProps.selectedStatsDisplay !== this.props.selectedStatsDisplay ||
                prevProps.isFlip !== this.props.isFlip) {
                this.generateStats();
            }
            if (prevProps.renderSeries !== this.props.renderSeries) {
                this.selectedStatisticsDisplay();
            }
        };
        this.selectedStatisticsDisplay = () => {
            const items = [];
            let statsValueWithUnit = '';
            let statsValue = null;
            let statisticsName = '';
            this.selectedStats.forEach((stat) => {
                var _a;
                if (!this.props.renderSeries && this.props.legendName === this.props.toggledSeriesName) { //on series hide, make the statistics values blank
                    statsValueWithUnit = '-';
                }
                else {
                    statisticsName = stat.name;
                    if (!this.props.chartProfileResult) {
                        statsValueWithUnit = '-';
                    }
                    else {
                        if (this.props.isFlip) {
                            if (stat.name !== "avgElevation" /* ElevationProfileStatisticsName.AvgElevation */ &&
                                stat.name !== "maxDistance" /* ElevationProfileStatisticsName.MaxDistance */ &&
                                stat.name !== "maxElevation" /* ElevationProfileStatisticsName.MaxElevation */ &&
                                stat.name !== "minElevation" /* ElevationProfileStatisticsName.MinElevation */) {
                                statisticsName = this.getReverseStatsOnFlip(stat.name);
                            }
                        }
                        statsValue = (_a = this.props.chartProfileResult) === null || _a === void 0 ? void 0 : _a.statistics[statisticsName];
                        statsValueWithUnit = this.getStatsValueWithUnit(statsValue, statisticsName);
                    }
                }
                items.push(jsx(React.Fragment, null,
                    jsx("div", { tabIndex: 0, className: 'statistic-info' },
                        jsx(Label, { id: this.props.parentWidgetId + this.props.index, "aria-label": this.nls(stat.name), className: 'statistic-label text-break mb-1 pt-3' }, this.nls(stat.name)),
                        jsx("div", { tabIndex: 0, "aria-label": statsValueWithUnit }, statsValueWithUnit))));
            });
            this.setState({
                statsResultList: items
            });
        };
        this.getReverseStatsOnFlip = (statsName) => {
            switch (statsName) {
                case "maxPositiveSlope" /* ElevationProfileStatisticsName.MaxPositiveSlope */:
                    return "maxNegativeSlope" /* ElevationProfileStatisticsName.MaxNegativeSlope */;
                case "maxNegativeSlope" /* ElevationProfileStatisticsName.MaxNegativeSlope */:
                    return "maxPositiveSlope" /* ElevationProfileStatisticsName.MaxPositiveSlope */;
                case "avgPositiveSlope" /* ElevationProfileStatisticsName.AvgPositiveSlope */:
                    return "avgNegativeSlope" /* ElevationProfileStatisticsName.AvgNegativeSlope */;
                case "avgNegativeSlope" /* ElevationProfileStatisticsName.AvgNegativeSlope */:
                    return "avgPositiveSlope" /* ElevationProfileStatisticsName.AvgPositiveSlope */;
                case "elevationLoss" /* ElevationProfileStatisticsName.ElevationLoss */:
                    return "elevationGain" /* ElevationProfileStatisticsName.ElevationGain */;
                case "elevationGain" /* ElevationProfileStatisticsName.ElevationGain */:
                    return "elevationLoss" /* ElevationProfileStatisticsName.ElevationLoss */;
            }
        };
        this.getStatsValueWithUnit = (statVal, name) => {
            let roundOffStat = '';
            let convertedStats = null;
            unitOptions.forEach((unit) => {
                var _a, _b;
                if (name === "maxDistance" /* ElevationProfileStatisticsName.MaxDistance */) {
                    if (unit.value === this.props.selectedLinearUnit) {
                        convertedStats = convertSingle(statVal, (_a = this.props.chartProfileResult) === null || _a === void 0 ? void 0 : _a.effectiveUnits.distance, this.props.selectedLinearUnit);
                        roundOffStat = this.props.intl.formatNumber(convertedStats, { maximumFractionDigits: 2 }) + ' ' + this.nls(unit.abbreviation);
                    }
                }
                else if (name === "maxPositiveSlope" /* ElevationProfileStatisticsName.MaxPositiveSlope */ || name === "maxNegativeSlope" /* ElevationProfileStatisticsName.MaxNegativeSlope */ ||
                    name === "avgPositiveSlope" /* ElevationProfileStatisticsName.AvgPositiveSlope */ || name === "avgNegativeSlope" /* ElevationProfileStatisticsName.AvgNegativeSlope */) { //Slope values in degree unit
                    if (statVal === null) {
                        roundOffStat = '-';
                    }
                    else {
                        roundOffStat = this.props.intl.formatNumber(statVal, { maximumFractionDigits: 2 }) + ' ' + '\u00b0';
                    }
                }
                else {
                    if (unit.value === this.props.selectedElevationUnit) {
                        convertedStats = convertSingle(statVal, (_b = this.props.chartProfileResult) === null || _b === void 0 ? void 0 : _b.effectiveUnits.elevation, this.props.selectedElevationUnit);
                        roundOffStat = this.props.intl.formatNumber(convertedStats, { maximumFractionDigits: 2 }) + ' ' + this.nls(unit.abbreviation);
                    }
                }
            });
            return roundOffStat;
        };
        this.onExpandClick = () => {
            this.setState({
                legendExpanded: !this.state.legendExpanded
            });
        };
        this.state = {
            legendExpanded: false,
            statsResultList: []
        };
    }
    render() {
        return (jsx("div", { tabIndex: -1 },
            jsx("div", { tabIndex: -1, className: 'ep-legend-section ep-shadow py-1' },
                jsx(SettingRow, { flow: 'wrap' },
                    jsx("div", { tabIndex: 0, className: 'd-flex justify-content-between w-100 align-items-center' },
                        jsx(Label, { id: this.props.parentWidgetId + this.props.index, "aria-label": this.props.legendName, className: 'w-100 legendLabel text-break' }, this.props.legendName),
                        !this.props.singleSeriesExpandStat &&
                            jsx("div", { tabIndex: 0, className: this.state.legendExpanded ? 'arrow-up' : 'arrow-down' },
                                jsx(Button, { id: this.props.parentWidgetId + this.props.index, role: 'button', "aria-expanded": this.state.legendExpanded, title: this.nls('expandLegend'), className: 'expand-collapse-button', type: 'tertiary', icon: true, size: 'sm', onClick: this.onExpandClick.bind(this) },
                                    jsx(Icon, { icon: epIcon.iconExpandCollapse, size: '10' }))))),
                jsx(Collapse, { isOpen: this.state.legendExpanded || this.props.singleSeriesExpandStat },
                    jsx("div", { tabIndex: -1, className: 'stat-content' },
                        jsx("div", { tabIndex: 0, className: 'profile-statistics' }, this.state.statsResultList.map((statsResult, index) => (jsx(React.Fragment, { key: index }, statsResult)))))))));
    }
}
//# sourceMappingURL=chart-statistics.js.map