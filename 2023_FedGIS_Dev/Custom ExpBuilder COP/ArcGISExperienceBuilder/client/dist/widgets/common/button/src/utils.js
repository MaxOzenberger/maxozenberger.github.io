import { Immutable } from 'jimu-core';
import { styleUtils } from 'jimu-ui';
export function getIconPropsFromTheme(isRegular, type, theme) {
    const status = isRegular ? 'default' : 'hover';
    const t = Immutable(theme);
    const color = t.getIn(['components', 'button', 'variants', type, status, 'color']);
    const size = t.getIn(['components', 'button', 'sizes', 'default', 'fontSize']);
    const iconProps = {
        color,
        size: parseFloat(styleUtils.remToPixel(size))
    };
    return iconProps;
}
//# sourceMappingURL=utils.js.map