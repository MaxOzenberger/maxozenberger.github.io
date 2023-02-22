/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Nav } from 'jimu-ui';
import { getStyle, getPlayPanelWapperClass, getSettingBtnsClass } from './style';
export default class BarLayout extends React.PureComponent {
    renderSeparator() {
        return jsx("div", { className: 'separator-line' });
    }
    render() {
        return (jsx("div", { css: getStyle(this.props.theme), className: 'fly-wapper d-flex' },
            jsx(Nav, { navbar: true, className: 'bar' },
                jsx("div", { className: 'items d-flex flex-row justify-content-around' },
                    jsx("div", { className: 'd-flex' },
                        jsx("div", { className: 'setting-btns-wapper items ' + getSettingBtnsClass(this.props.isPlaying) },
                            jsx("div", { className: 'item' }, this.props.flyStyleContent),
                            !this.props.isRouteMode &&
                                jsx(React.Fragment, null,
                                    jsx("div", { className: 'item' },
                                        jsx("div", { className: 'd-flex' },
                                            this.renderSeparator(),
                                            this.props.graphicInteractionManager)),
                                    jsx("div", { className: 'item' }, this.props.liveviewSettingContent)),
                            this.props.isRouteMode &&
                                jsx(React.Fragment, null,
                                    this.props.graphicInteractionManager,
                                    this.props.routeListContent)),
                        jsx("div", { className: getPlayPanelWapperClass(this.props.isPlaying) },
                            jsx("div", { className: 'speed-wapper h-100' }, this.props.speedController))),
                    jsx("div", { className: 'd-flex' },
                        jsx("div", { className: 'item' },
                            this.renderSeparator(),
                            this.props.playStateContent)),
                    jsx("div", { className: 'progress-bar-wapper ' + getPlayPanelWapperClass(this.props.isPlaying) }, this.props.progressBar)))));
    }
}
//# sourceMappingURL=layout.js.map