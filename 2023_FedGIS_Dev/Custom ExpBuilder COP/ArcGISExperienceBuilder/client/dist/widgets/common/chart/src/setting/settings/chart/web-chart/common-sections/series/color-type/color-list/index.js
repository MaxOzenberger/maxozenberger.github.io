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
import { CategoryType } from '../../../../../../../../config';
import { ByFieldColorList } from './by-field';
import { ByGroupColorList } from './by-group';
import defaultMessages from '../../../../../../../translations/default';
import { hooks } from 'jimu-ui';
import { SidePopperTooltip } from '../../../../../../components';
const totalNumberLimit = 50;
const numberPerLoads = 20;
export const ColorList = (props) => {
    const { open, onRequestClose, categoryType, categoryFieldType, value, onChange, onColorsChange } = props, others = __rest(props, ["open", "onRequestClose", "categoryType", "categoryFieldType", "value", "onChange", "onColorsChange"]);
    const translate = hooks.useTranslate(defaultMessages);
    const tooltip = categoryType === CategoryType.ByGroup ? translate('sliceColorTip', { numberPerLoads, totalNumberLimit }) : '';
    return React.createElement(SidePopperTooltip, { trigger: null, position: 'right', isOpen: open, title: translate('sliceColor'), tooltip: tooltip, toggle: onRequestClose },
        categoryType === CategoryType.ByGroup && (React.createElement(ByGroupColorList, Object.assign({ value: value, categoryFieldType: categoryFieldType, onColorsChange: onColorsChange, onChange: onChange }, others))),
        categoryType === CategoryType.ByField && (React.createElement(ByFieldColorList, { onColorsChange: onColorsChange, value: value, onChange: onChange })));
};
//# sourceMappingURL=index.js.map