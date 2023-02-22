/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { getStyle, getPlayPanelWapperClass, getFunctionalBtnsClass, getRouteModeClass } from './style';
export default class PaletteLayout extends React.PureComponent {
    render() {
        return (jsx("div", { css: getStyle(this.props.theme), className: 'fly-wapper d-flex' },
            jsx("div", { className: 'palette-wapper' + getRouteModeClass(this.props.isRouteMode) },
                jsx("div", { className: 'progress-bar-wapper' + getPlayPanelWapperClass(this.props.isPlaying) }, this.props.progressBar),
                jsx("div", { className: getFunctionalBtnsClass(this.props.isPlaying) },
                    this.props.flyStyleContent,
                    !this.props.isRouteMode &&
                        jsx(React.Fragment, null,
                            this.props.graphicInteractionManager,
                            this.props.liveviewSettingContent),
                    this.props.isRouteMode &&
                        jsx(React.Fragment, null,
                            this.props.graphicInteractionManager,
                            this.props.routeListContent)),
                this.props.playStateContent,
                jsx("div", { className: getPlayPanelWapperClass(this.props.isPlaying) }, this.props.speedController))));
    }
}
//# sourceMappingURL=layout.js.map