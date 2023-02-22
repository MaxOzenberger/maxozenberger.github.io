/** @jsx jsx */
// This file is duplicated from '../../../../feature-info/src/runtime/components/feature-info'
import { React, css, jsx, injectIntl, classNames } from 'jimu-core';
import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import { Button } from 'jimu-ui';
import { RightFilled } from 'jimu-icons/filled/directional/right';
import { DownFilled } from 'jimu-icons/filled/directional/down';
export var LoadStatus;
(function (LoadStatus) {
    LoadStatus["Pending"] = "Pending";
    LoadStatus["Fulfilled"] = "Fulfilled";
    LoadStatus["Rejected"] = "Rejected";
})(LoadStatus || (LoadStatus = {}));
const style = css `
  border: 1px solid var(--light-200);
  .esri-widget__heading {
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    color: var(--black);
  }

  .esri-feature__content-element {
    padding: 0;
  }

  .jimu-btn.expanded {
    align-self: flex-start;
  }
`;
class FeatureInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.toggleExpanded = (e) => {
            e.stopPropagation();
            this.setState({ showContent: !this.state.showContent });
        };
        const { togglable = false, expandByDefault } = this.props;
        this.state = {
            showContent: !togglable || expandByDefault,
            loadStatus: LoadStatus.Pending
        };
    }
    componentDidMount() {
        this.createFeature();
    }
    componentDidUpdate() {
        if (this.feature) {
            this.feature.graphic.popupTemplate = this.props.popupTemplate;
            this.feature.visibleElements = this.getVisibleElements();
        }
    }
    destoryFeature() {
        this.feature && !this.feature.destroyed && this.feature.destroy();
    }
    getVisibleElements() {
        const { togglable = false } = this.props;
        const { showContent } = this.state;
        const expanded = togglable ? showContent : true;
        return {
            title: true,
            content: {
                fields: expanded,
                text: expanded,
                media: expanded,
                attachments: expanded
            },
            lastEditedInfo: false
        };
    }
    createFeature() {
        let featureModulePromise;
        if (this.Feature) {
            featureModulePromise = Promise.resolve();
        }
        else {
            featureModulePromise = loadArcGISJSAPIModules([
                'esri/widgets/Feature'
            ]).then(modules => {
                [
                    this.Feature
                ] = modules;
            });
        }
        return featureModulePromise.then(() => {
            var _a, _b, _c;
            const container = document && document.createElement('div');
            container.className = 'jimu-widget';
            this.refs.featureContainer.appendChild(container);
            const originDS = this.props.dataSource.getOriginDataSources();
            const rootDataSource = (_a = originDS === null || originDS === void 0 ? void 0 : originDS[0]) === null || _a === void 0 ? void 0 : _a.getRootDataSource();
            this.destoryFeature();
            this.props.graphic.popupTemplate = this.props.popupTemplate;
            this.feature = new this.Feature({
                container: container,
                defaultPopupTemplateEnabled: true,
                // @ts-expect-error
                spatialReference: ((_c = (_b = this.props.dataSource) === null || _b === void 0 ? void 0 : _b.layer) === null || _c === void 0 ? void 0 : _c.spatialReference) || null,
                // @ts-expect-error
                map: (rootDataSource === null || rootDataSource === void 0 ? void 0 : rootDataSource.map) || null,
                graphic: this.props.graphic,
                visibleElements: this.getVisibleElements()
            });
        }).then(() => {
            this.setState({ loadStatus: LoadStatus.Fulfilled });
        });
    }
    render() {
        const { togglable = false, intl } = this.props;
        const { showContent } = this.state;
        return (jsx("div", { className: 'feature-info-component d-flex align-items-center p-2', css: style },
            togglable && (jsx(Button, { "aria-label": intl.formatMessage({ id: showContent ? 'hide' : 'show' }), className: classNames('p-0', { expanded: showContent }), type: 'tertiary', icon: true, size: 'sm', onClick: this.toggleExpanded }, showContent ? jsx(DownFilled, { size: 's' }) : jsx(RightFilled, { size: 's', autoFlip: true }))),
            jsx("div", { className: 'flex-grow-1', ref: 'featureContainer' })));
    }
}
export default injectIntl(FeatureInfo);
//# sourceMappingURL=feature-info.js.map