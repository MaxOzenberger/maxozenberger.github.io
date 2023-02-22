import { React, SessionManager, esri, getAppStore } from 'jimu-core';
import { ImageWithParam } from 'jimu-ui';
import { PlaceholderMapFilled } from 'jimu-icons/filled/data/placeholder-map';
export default class MapThumb extends React.PureComponent {
    constructor(props) {
        super(props);
        this.unmount = false;
        this.setMapThumbUrl = (mapId) => {
            var _a;
            if (!mapId) {
                this.setState({ mapThumbUrl: null });
            }
            // if no portalUrl or same to config portalurl, use app config's portalUrl
            const portalUrl = ((_a = this.props) === null || _a === void 0 ? void 0 : _a.portUrl) || getAppStore().getState().portalUrl;
            const session = SessionManager.getInstance().getSessionByUrl(portalUrl) || null;
            esri.restPortal.searchItems({
                q: `id:${mapId}`,
                authentication: session,
                portal: portalUrl + '/sharing/rest'
            }).then(items => {
                var _a;
                if (!this.unmount) {
                    if ((_a = items.results[0]) === null || _a === void 0 ? void 0 : _a.thumbnail) {
                        const session = SessionManager.getInstance().getSessionByUrl(portalUrl);
                        let tempThumbUrl = null;
                        if (session && session.token) {
                            tempThumbUrl = `${portalUrl}/sharing/rest/content/items/${items.results[0].id}/` +
                                `info/${items.results[0].thumbnail}?token=${session.token}`;
                        }
                        else {
                            tempThumbUrl = `${portalUrl}/sharing/rest/content/items/${items.results[0].id}/` +
                                `info/${items.results[0].thumbnail}`;
                        }
                        this.setState({ mapThumbUrl: tempThumbUrl });
                    }
                    else {
                        this.setState({ mapThumbUrl: null });
                    }
                }
            });
        };
        this.state = {
            mapThumbUrl: null
        };
    }
    componentDidMount() {
        this.unmount = false;
        this.setMapThumbUrl(this.props.mapItemId);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.mapItemId !== this.props.mapItemId) {
            this.setMapThumbUrl(this.props.mapItemId);
        }
    }
    componentWillUnmount() {
        this.unmount = true;
    }
    render() {
        if (this.state.mapThumbUrl) {
            return React.createElement(ImageWithParam, { imageParam: { url: this.state.mapThumbUrl } });
        }
        else {
            const palette = this.props.theme.colors.palette;
            return (React.createElement("div", { style: { backgroundColor: palette.light[200], height: '100%' } },
                React.createElement(PlaceholderMapFilled, { color: palette.light[600], size: '100%' })));
        }
    }
}
//# sourceMappingURL=map-thumb.js.map