/** @jsx jsx */
import { css, jsx, React } from 'jimu-core';
import { Button, defaultMessages, hooks } from 'jimu-ui';
import { ArrowLeftOutlined } from 'jimu-icons/outlined/directional/arrow-left';
import { useTheme } from 'jimu-theme';
const useStyle = () => {
    var _a;
    const theme = useTheme();
    const dark400 = (_a = theme === null || theme === void 0 ? void 0 : theme.colors) === null || _a === void 0 ? void 0 : _a.palette.dark[400];
    return React.useMemo(() => {
        return css `
      span {
        color: ${dark400};
      }
    `;
    }, [dark400]);
};
export const Back = (props) => {
    const translate = hooks.useTranslate(defaultMessages);
    const style = useStyle();
    const { className, onClick, text = translate('back') } = props;
    return (jsx(Button, { css: style, className: className, icon: true, size: 'sm', type: 'tertiary', onClick: onClick },
        jsx(ArrowLeftOutlined, null),
        jsx("span", { className: 'font-body1 ml-2' }, text)));
};
//# sourceMappingURL=back.js.map