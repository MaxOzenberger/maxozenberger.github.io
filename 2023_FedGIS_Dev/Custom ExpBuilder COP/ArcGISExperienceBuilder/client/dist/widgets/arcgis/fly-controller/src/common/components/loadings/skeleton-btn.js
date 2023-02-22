/** @jsx jsx */
import { React, jsx } from 'jimu-core';
import { Button, Icon } from 'jimu-ui';
export default class SkeletonBtn extends React.PureComponent {
    constructor() {
        super(...arguments);
        // for ,#5981 white-border when img's src=''
        this.TRANSPARENT_GIF = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';
    }
    render() {
        const iconStyle = { borderRadius: '50%', border: 'none', backgroundColor: this.props.theme.colors.palette.light[600] };
        return (jsx(React.Fragment, null,
            jsx(Button, { icon: true, type: 'tertiary', className: 'btns ' + this.props.className, disabled: true },
                jsx(Icon, { icon: this.TRANSPARENT_GIF, style: iconStyle }))));
    }
}
//# sourceMappingURL=skeleton-btn.js.map