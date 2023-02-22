import { React } from 'jimu-core';
export default class PanelShell extends React.PureComponent {
    componentWillUnmount() {
        if (this.props.onDestroyed) {
            this.props.onDestroyed();
        }
    }
    render() {
        return (React.createElement(React.Fragment, null, this.props.children));
    }
}
//# sourceMappingURL=panel-shell.js.map