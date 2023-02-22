/** @jsx jsx */
import { React, jsx, polished, css } from 'jimu-core';
import { Popper } from 'jimu-ui';
import { InfoOutlined } from 'jimu-icons/outlined/suggested/info';
export class TipsPopper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.tipPopperToggle = evt => {
            evt.stopPropagation();
            const { isTipOpen } = this.state;
            this.setState({
                isTipOpen: !isTipOpen
            });
        };
        this.getStyle = () => {
            return css `
      .info-btn {
        padding-left: ${polished.rem(6)};
        cursor: pointer;
      }
    `;
        };
        this.state = {
            isTipOpen: false
        };
        this.tipRef = React.createRef();
    }
    render() {
        return (jsx("div", { className: 'd-inline-block', onClick: e => {
                e.stopPropagation();
            }, css: this.getStyle() },
            jsx("div", { className: 'd-inline-block info-btn', ref: this.tipRef, onMouseEnter: this.tipPopperToggle, onMouseLeave: this.tipPopperToggle },
                jsx(InfoOutlined, { size: 12 })),
            jsx(Popper, { placement: 'left-start', reference: this.tipRef.current, showArrow: true, offset: [0, 5], zIndex: 3, toggle: this.tipPopperToggle, open: this.state.isTipOpen },
                jsx("div", { className: 'p-2', style: { width: polished.rem(230) } }, this.props.tipsMessage))));
    }
}
//# sourceMappingURL=tips-popper.js.map