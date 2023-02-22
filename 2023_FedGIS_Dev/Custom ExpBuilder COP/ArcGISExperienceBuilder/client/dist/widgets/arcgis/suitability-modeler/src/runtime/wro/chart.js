/** @jsx jsx */
/**
  Licensing

  Copyright 2021 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.

  A copy of the license is available in the repository's
  LICENSE file.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { React, jsx } from 'jimu-core';
import chartUtils from 'esri/widgets/support/chartUtils';
export class WroChart extends React.PureComponent {
    constructor(props) {
        super(props);
        this.initChart = (data) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                let am4chartsModule = this.am4chartsModule;
                if (!am4chartsModule) {
                    am4chartsModule = this.am4chartsModule = yield chartUtils.loadChartsModule();
                }
                if (this.pieChart) {
                    try {
                        this.pieChart.dispose();
                        this.pieChart = null;
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }
                const { am4core, am4charts } = am4chartsModule;
                const theme = this.props.wroContext.getTheme();
                if (theme === null || theme === void 0 ? void 0 : theme.darkTheme) {
                    am4core.useTheme(am4chartsModule.am4themes_dark);
                }
                else {
                    am4core.unuseTheme(am4chartsModule.am4themes_dark);
                }
                const isRTL = !!(((_a = document === null || document === void 0 ? void 0 : document.documentElement) === null || _a === void 0 ? void 0 : _a.dir) === 'rtl');
                const locale = (_b = document === null || document === void 0 ? void 0 : document.documentElement) === null || _b === void 0 ? void 0 : _b.lang;
                let toolTipText = '{category} {value.percent.formatNumber(\'#.00\')}%';
                const labelText = '{category}';
                let valueText = '{value.percent.formatNumber(\'#.00\')}%';
                if (locale === 'ar') {
                    valueText = '%{value.percent.formatNumber(\'#.00\')}';
                }
                if (locale === 'tr') {
                    toolTipText = '{category} %{value.percent.formatNumber(\'#.00\')}';
                    valueText = '%{value.percent.formatNumber(\'#.00\')}';
                }
                const pieChart = am4core.create(this.chartRef.current, am4charts.PieChart);
                pieChart.rtl = isRTL;
                pieChart.radius = am4core.percent(90);
                const pieSeries = pieChart.series.push(new am4charts.PieSeries());
                pieSeries.dataFields.value = 'value';
                pieSeries.dataFields.category = 'label';
                pieSeries.slices.template.propertyFields.fill = 'fillColor';
                pieSeries.labels.template.disabled = true;
                pieSeries.ticks.template.disabled = true;
                pieSeries.slices.template.tooltipText = toolTipText;
                pieSeries.legendSettings.labelText = labelText;
                pieSeries.legendSettings.valueText = valueText;
                const legend = pieChart.legend = new am4charts.Legend();
                legend.position = 'bottom';
                legend.maxHeight = 130;
                legend.maxWidth = 340;
                legend.scrollable = true;
                legend.layout = 'vertical'; // vertical horizontal grid
                legend.valueLabels.template.align = 'right';
                legend.valueLabels.template.textAlign = 'end';
                // legend.fontSize = 10
                // pieChart.seriesContainer.align = 'left'
                // legend.align = "middle"
                // legend.contentAlign = 'left'
                if (isRTL) {
                    legend.reverseOrder = true;
                    legend.itemContainers.template.reverseOrder = true;
                }
                const markerTemplate = legend.markers.template;
                markerTemplate.width = 15;
                markerTemplate.height = 15;
                // remove default click behaviors
                const slice = pieSeries.slices.template;
                //slice.states.getKey('hover').properties.scale = 1 // keep the hover behavior
                slice.states.getKey('active').properties.shiftRadius = 0;
                legend.itemContainers.template.clickable = false;
                legend.itemContainers.template.focusable = false;
                legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.default;
                if (data)
                    pieChart.data = data;
                this.pieChart = pieChart;
            }
            catch (ex) {
                console.error('Error creating chart', ex);
            }
        });
        this.chartRef = React.createRef();
        this.state = {
            needsRefresh: false
        };
    }
    componentDidMount() {
        this.initChart();
    }
    componentDidUpdate(prevProps) {
        var _a;
        const wroModel = this.props.wroModel;
        const prevWroModel = prevProps.wroModel;
        const isChartPanel = wroModel && (wroModel.activePanel === 'chart-panel');
        const wasChartPanel = prevWroModel && (prevWroModel.activePanel === 'chart-panel');
        let data;
        if (prevProps.histogramData !== this.props.histogramData) {
            data = [];
            const histogramData = this.props.histogramData;
            if ((histogramData === null || histogramData === void 0 ? void 0 : histogramData.colorCounts) &&
                histogramData.colorCounts.length > 0) {
                histogramData.colorCounts.forEach(cc => {
                    const fillColor = 'rgb(' + cc.rgb[0].toString() + ',' + cc.rgb[1].toString() + ',' + cc.rgb[2].toString() + ')';
                    const item = {
                        label: cc.label,
                        value: cc.count,
                        fillColor: fillColor
                    };
                    data.push(item);
                });
            }
            if (this.pieChart) {
                this.pieChart.data = data;
            }
        }
        if (prevProps.wroStatus.themeId !== this.props.wroStatus.themeId) {
            if (!data)
                data = (_a = this.pieChart) === null || _a === void 0 ? void 0 : _a.data;
            this.initChart(data);
        }
        if (isChartPanel && !wasChartPanel && this.state.needsRefresh) {
            if (this.pieChart) {
                this.pieChart.invalidateRawData();
                this.pieChart.legend.deepInvalidate();
            }
            this.setState({ needsRefresh: false });
        }
        if (!isChartPanel && wasChartPanel && !this.state.needsRefresh) {
            this.setState({ needsRefresh: true });
        }
    }
    componentWillUnmount() {
        if (this.pieChart) {
            this.pieChart.dispose();
            this.pieChart = null;
        }
    }
    render() {
        return (jsx("div", { ref: this.chartRef, className: 'widget-wro-chart-component' }));
    }
}
//# sourceMappingURL=chart.js.map