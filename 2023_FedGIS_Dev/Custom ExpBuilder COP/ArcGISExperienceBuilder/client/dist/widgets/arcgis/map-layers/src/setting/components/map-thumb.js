import { React, SessionManager, esri, getAppStore } from 'jimu-core';
import { ImageWithParam } from 'jimu-ui';
export default class MapThumb extends React.PureComponent {
    constructor(props) {
        super(props);
        this.unmount = false;
        this.setMapThumbUrl = (mapId) => {
            if (!mapId) {
                this.setState({ mapThumbUrl: null });
            }
            if (!this.props.portUrl || this.props.portUrl === getAppStore().getState().portalUrl) {
                // if no portalUrl or same to config portalurl, use app config's portalUrl
                const portalUrl = getAppStore().getState().portalUrl;
                const session = SessionManager.getInstance().getSessionByUrl(portalUrl);
                esri.restPortal.searchItems({
                    q: `id:${mapId}`,
                    authentication: SessionManager.getInstance().getSessionByUrl(portalUrl),
                    portal: portalUrl + '/sharing/rest'
                }).then(items => {
                    if (!this.unmount) {
                        if (items.results[0]) {
                            const tempThumbUrl = `${portalUrl}/sharing/rest/content/items/${items.results[0].id}/` +
                                `info/${items.results[0].thumbnail}?token=${session === null || session === void 0 ? void 0 : session.token}`;
                            this.setState({ mapThumbUrl: tempThumbUrl });
                        }
                        else {
                            this.setState({ mapThumbUrl: null });
                        }
                    }
                });
            }
            else {
                // use other portalUrl
                esri.restPortal.searchItems({
                    q: `id:${mapId}`,
                    portal: this.props.portUrl + '/sharing/rest'
                }).then(items => {
                    if (!this.unmount) {
                        if (items.results[0]) {
                            const tempThumbUrl = `${this.props.portUrl}/sharing/rest/content/items/${items.results[0].id}/` +
                                `info/${items.results[0].thumbnail}`;
                            this.setState({ mapThumbUrl: tempThumbUrl });
                        }
                        else {
                            this.setState({ mapThumbUrl: null });
                        }
                    }
                });
            }
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
            return React.createElement(ImageWithParam, { imageParam: {} });
        }
    }
}
//# sourceMappingURL=map-thumb.js.map