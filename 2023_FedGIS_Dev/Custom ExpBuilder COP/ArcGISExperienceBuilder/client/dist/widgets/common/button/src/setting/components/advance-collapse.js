import { React } from 'jimu-core';
import { Collapse, Switch, Label } from 'jimu-ui';
export default class AdvanceCollapse extends React.PureComponent {
    render() {
        return (React.createElement("div", { className: 'w-100' },
            React.createElement("div", { onClick: this.props.toggle, className: 'd-flex justify-content-between mb-2' },
                React.createElement("div", null,
                    React.createElement(Label, { for: 'open-collapse', className: 'collapse-label setting-text-level-3' }, this.props.title)),
                React.createElement("div", null,
                    React.createElement(Switch, { id: 'open-collapse', name: 'open-collapse', onChange: this.props.toggle, checked: this.props.isOpen }))),
            React.createElement(Collapse, { isOpen: this.props.isOpen }, this.props.children)));
    }
}
//# sourceMappingURL=advance-collapse.js.map