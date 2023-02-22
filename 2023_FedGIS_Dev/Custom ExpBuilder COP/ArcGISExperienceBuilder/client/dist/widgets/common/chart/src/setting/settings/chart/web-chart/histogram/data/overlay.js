import { React } from 'jimu-core';
import { LineSymbolSetting } from '../../components';
export const HistogramOverlaySetting = (props) => {
    const { defaultColor, value: propValue, onChange } = props;
    const handleSymbolChange = (symbol) => {
        const value = propValue.set('symbol', symbol);
        onChange(value);
    };
    return (React.createElement(LineSymbolSetting, { value: propValue.symbol, onChange: handleSymbolChange, defaultColor: defaultColor }));
};
//# sourceMappingURL=overlay.js.map