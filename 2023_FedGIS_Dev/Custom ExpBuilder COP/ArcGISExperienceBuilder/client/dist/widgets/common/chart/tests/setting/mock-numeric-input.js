var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { React } from 'jimu-core';
export const MockNumericInput = (props) => {
    const { onAcceptValue } = props, others = __rest(props, ["onAcceptValue"]);
    const [value, setValue] = React.useState();
    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const handleBlur = () => {
        onAcceptValue(value);
    };
    return (React.createElement("input", Object.assign({ type: 'number', onChange: handleChange, onBlur: handleBlur, className: 'jimu-input jimu-input-sm jimu-numeric-input jimu-numeric-input-input' }, others)));
};
//# sourceMappingURL=mock-numeric-input.js.map