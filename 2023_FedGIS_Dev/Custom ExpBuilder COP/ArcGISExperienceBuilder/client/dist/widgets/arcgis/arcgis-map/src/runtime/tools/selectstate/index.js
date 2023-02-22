/** @jsx jsx */
import { css, jsx, React } from 'jimu-core';
import { Button, Icon, defaultMessages } from 'jimu-ui';
import { BaseTool } from '../../layout/base/base-tool';
import { SelectedNumber } from './selected-number';
const SelectZoomtoIcon = require('../../assets/icons/select-tool/select-zoomto.svg');
const SelectClearIcon = require('../../assets/icons/select-tool/select-clear.svg');
export default class SelectState extends BaseTool {
    constructor(props) {
        super(props);
        this.toolName = 'SelectState';
        this.handleSelectedGraphicsChanged = (selectedGraphics) => {
            this.setState({
                selectedGraphics: selectedGraphics
            });
        };
        this.zoomToSelectedFeatures = () => {
            if (this.props.jimuMapView.view) {
                this.props.jimuMapView.view.goTo(this.state.selectedGraphics);
            }
        };
        this.clearSelectedFeatures = () => {
            this.props.jimuMapView.clearSelectedFeatures();
        };
        this.state = {
            selectedGraphics: []
        };
    }
    getStyle() {
        return css `
      background-color: ${this.props.theme.arcgis.components.button.variants.default.default.bg};

      .divide-line {
        border-right: 1px solid ${this.props.theme.colors.palette.dark[400]};
        height: 100%;
      }
    `;
    }
    getTitle() {
        return '';
    }
    getIcon() {
        return null;
    }
    getExpandPanel() {
        if (this.props.isMobile) {
            return (jsx("div", { css: this.getStyle(), className: 'w-100 d-flex justify-content-between align-items-center', style: { height: '40px' } },
                jsx("div", { className: 'ml-2' }, `${this.props.intl.formatMessage({ id: 'SelectionSelectedFeatures', defaultMessage: defaultMessages.SelectionSelectedFeatures })}:${this.state.selectedGraphics.length}`),
                jsx("div", { className: 'd-flex' },
                    jsx("div", { className: 'h-100 border border-top-0 border-bottom-0 d-flex justify-content-center align-items-center', style: { width: '40px', cursor: 'pointer' }, onClick: this.zoomToSelectedFeatures },
                        jsx(Icon, { width: 18, height: 18, icon: SelectZoomtoIcon })),
                    jsx("div", { className: 'h-100 d-flex justify-content-center align-items-center', style: { width: '40px', cursor: 'pointer' }, onClick: this.clearSelectedFeatures },
                        jsx(Icon, { width: 18, height: 18, icon: SelectClearIcon }))),
                jsx(SelectedNumber, { jimuMapView: this.props.jimuMapView, onSelectedGraphicsChanged: this.handleSelectedGraphicsChanged })));
        }
        else {
            return (jsx(React.Fragment, null,
                jsx(Button, { onClick: this.zoomToSelectedFeatures },
                    jsx(Icon, { width: 16, height: 16, icon: SelectZoomtoIcon, className: 'mr-2' }),
                    `${this.props.intl.formatMessage({ id: 'SelectionSelectedFeatures', defaultMessage: defaultMessages.SelectionSelectedFeatures })}:${this.state.selectedGraphics.length}`),
                jsx(SelectedNumber, { jimuMapView: this.props.jimuMapView, onSelectedGraphicsChanged: this.handleSelectedGraphicsChanged })));
        }
    }
}
//# sourceMappingURL=index.js.map