/** @jsx jsx */
import { css, jsx, React } from 'jimu-core';
export default class ScrollContainer extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.moveY = 0;
        this.startY = 0;
        this.isRegisted = false;
        this.registerTouchEvent = (ref) => {
            if (ref && !this.isRegisted) {
                ref.addEventListener('touchstart', (event) => {
                    this.moveY = 0;
                    const touch = event.touches[0];
                    this.startY = touch.clientY;
                }, { passive: false });
                ref.addEventListener('touchmove', (event) => {
                    const touch = event.touches[0];
                    this.moveY = (touch.clientY - this.startY) * -1;
                    this.startY = touch.clientY;
                    ref.scrollTop = ref.scrollTop + this.moveY;
                }, { passive: false });
                ref.addEventListener('touchend', (event) => {
                    this.moveY = 0;
                    this.startY = 0;
                }, { passive: false });
                this.isRegisted = true;
            }
        };
    }
    getStyle() {
        return css `
      overflow: auto;
      pointer-events: auto;
      `;
    }
    render() {
        return (jsx("div", { css: this.getStyle(), className: this.props.className, style: this.props.style, ref: ref => {
                this.registerTouchEvent(ref);
            } }, this.props.children));
    }
}
//# sourceMappingURL=scroll-container.js.map