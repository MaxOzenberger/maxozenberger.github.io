/** @jsx jsx */
import { React, jsx, css, Immutable, JimuFieldType } from 'jimu-core';
import { FieldSelector as JimuFieldSelector } from 'jimu-ui/advanced/data-source-selector';
const getFieldSelectorType = (type) => {
    switch (type) {
        case 'numeric':
            return Immutable([JimuFieldType.Number]);
        case 'data':
            return Immutable([JimuFieldType.Date]);
        case 'category':
            return Immutable([JimuFieldType.String, JimuFieldType.Number]);
        default:
    }
};
const serializedStyle = css `
  .component-field-selector {
    .jimu-advanced-select {
      > .dropdown{
        > .dropdown-button {
          justify-content: flex-end;
        }
      }
    }
  }
`;
export const FieldSelector = (props) => {
    const { className, style, type, useDataSources, showEmptyItem, disabled, isMultiple, fields: porpFields, onChange } = props;
    const suportedType = React.useMemo(() => getFieldSelectorType(type), [type]);
    const noSelectionItem = React.useMemo(() => showEmptyItem ? { name: '' } : undefined, [showEmptyItem]);
    const dropdownProps = React.useMemo(() => ({ disabled, size: 'sm' }), [disabled]);
    const handleChange = (fieldSchemas) => {
        const fields = fieldSchemas.map(e => e.jimuName);
        onChange === null || onChange === void 0 ? void 0 : onChange(Immutable(fields), fieldSchemas);
    };
    return (jsx(JimuFieldSelector, { css: serializedStyle, className: className, style: style, types: suportedType, noSelectionItem: noSelectionItem, dropdownProps: dropdownProps, isMultiple: isMultiple, isDataSourceDropDownHidden: true, isSearchInputHidden: true, useDropdown: true, useDataSources: useDataSources, selectedFields: porpFields, onChange: handleChange }));
};
//# sourceMappingURL=field-selector.js.map