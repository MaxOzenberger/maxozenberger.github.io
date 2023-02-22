/**@jsx jsx */
import { React, jsx, css, Immutable } from 'jimu-core';
import { ColorsSelector } from './colors-selector';
import { applyPieSlicesColors, getPieSlice } from '../utils';
import { ColorAdder } from './color-adder';
import { ColorItem } from './color-item';
import { hooks, Loading, LoadingType } from 'jimu-ui';
import defaultMessages from '../../../../../../../translations/default';
import { ColorLoader } from './color-loader';
const defaultValue = Immutable([]);
const style = css `
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  color: var(--dark-800);
  > .body {
    width: 100%;
    height: calc(100% - 43px);
    > .color-list {
      width: 100%;
      max-height: 85%;
      overflow-y: auto;
      .color-other-item {
        width: 88%;
      }
   }
  }
  > .footer {
    height: 43px;
    width: 100%;
    border-top: 1px solid #6a6a6a;
    > div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .colors-selector {
        width: 80%;
      }
    }
  }
`;
export const ByGroupColorList = (props) => {
    const { categoryFieldType, loading, value: propValue = defaultValue, other, colors, onChange, loadSlices, onOtherChange, onColorsChange } = props;
    const translate = hooks.useTranslate(defaultMessages);
    const listCount = Object.keys(propValue).length;
    const ref = React.useRef(null);
    const unmountRef = React.useRef(false);
    hooks.useUnmount(() => { unmountRef.current = true; });
    const undefinedSlice = React.useMemo(() => {
        return Immutable({
            sliceId: 'undefined',
            label: translate('undefined'),
            fillSymbol: other
        });
    }, [other, translate]);
    const handleChange = (index, slice) => {
        const slices = Immutable.set(propValue, index, slice);
        onChange === null || onChange === void 0 ? void 0 : onChange(slices);
    };
    const handleColorsChange = (colors) => {
        onColorsChange === null || onColorsChange === void 0 ? void 0 : onColorsChange(colors);
        const slices = applyPieSlicesColors(propValue, colors);
        onChange === null || onChange === void 0 ? void 0 : onChange(slices);
    };
    const validity = React.useCallback((value) => {
        value = value.trim();
        if (!value) {
            return {
                valid: false,
                msg: translate('categoryEmpty')
            };
        }
        const existed = !!(propValue === null || propValue === void 0 ? void 0 : propValue.find(slice => slice.sliceId === value));
        if (existed) {
            return {
                valid: false,
                msg: translate('categoryExist')
            };
        }
        return { valid: true };
    }, [propValue, translate]);
    const handleColorAdded = (key) => {
        if (!key)
            return;
        const index = Object.keys(propValue).length;
        const slice = getPieSlice(index, colors, key);
        const slices = propValue.concat(slice);
        onChange === null || onChange === void 0 ? void 0 : onChange(slices);
    };
    const handleDelete = (sliceId) => {
        const slices = propValue === null || propValue === void 0 ? void 0 : propValue.filter(slice => slice.sliceId !== sliceId);
        onChange === null || onChange === void 0 ? void 0 : onChange(slices);
    };
    const handleOtherChange = (value) => {
        const color = value.fillSymbol.color;
        const symbol = other === null || other === void 0 ? void 0 : other.set('color', color);
        onOtherChange === null || onOtherChange === void 0 ? void 0 : onOtherChange(symbol);
    };
    React.useEffect(() => {
        const nodes = ref.current.querySelectorAll('.color-item');
        const node = nodes[listCount - 2];
        node === null || node === void 0 ? void 0 : node.scrollIntoView();
    }, [listCount]);
    return (jsx("div", { className: 'color-match', css: style },
        jsx("div", { className: 'body' },
            jsx("div", { className: 'color-list px-3', ref: ref },
                propValue.map((slice, index) => {
                    return (jsx(ColorItem, { key: index, deletable: true, className: 'mb-2', value: slice, onChange: (val) => handleChange(index, val), onDelete: (sliceId) => handleDelete(sliceId) }));
                }),
                jsx(ColorItem, { className: 'mb-2 color-other-item', value: undefinedSlice, deletable: false, onChange: handleOtherChange })),
            jsx(ColorAdder, { className: 'px-3', categoryFieldType: categoryFieldType, validity: validity, onChange: handleColorAdded })),
        jsx("div", { className: 'footer' },
            jsx("div", { className: 'px-3' },
                jsx(ColorLoader, { className: 'my-2', loadSlices: loadSlices, onChange: onChange }),
                jsx(ColorsSelector, { className: 'my-2', onChange: handleColorsChange }))),
        loading && jsx(Loading, { type: LoadingType.Secondary })));
};
//# sourceMappingURL=by-group.js.map