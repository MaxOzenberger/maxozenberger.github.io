import { Immutable, React } from 'jimu-core';
export const StringFields = ['Year', 'Arrest', 'Primary_Ty'];
export const NumericFields = ['Beat', 'District', 'Ward'];
export const MockFieldSelector = ({ className, type, isMultiple, fields: selectedFields = [], onChange }) => {
    const AllFields = type === 'category' ? StringFields : NumericFields;
    const [open, setOpen] = React.useState(false);
    const handleClick = (e) => {
        let fields = [];
        const field = e.target.value;
        if (isMultiple === false) {
            fields = [field];
        }
        else {
            if (selectedFields.includes(field)) {
                fields = selectedFields.filter(e => e !== field);
            }
            else {
                fields = selectedFields.concat([field]);
            }
        }
        setOpen(false);
        onChange === null || onChange === void 0 ? void 0 : onChange(Immutable(fields));
    };
    return (React.createElement("div", { className: `mock-field-selector ${className}` },
        React.createElement("div", { className: 'selected-fields', onClick: () => setOpen(!open) }, isMultiple
            ? (selectedFields === null || selectedFields === void 0 ? void 0 : selectedFields.map((field, idx) => (React.createElement("div", { key: idx, className: 'selected-field-item' }, field))))
            : (React.createElement("div", { className: 'selected-field-item' }, selectedFields === null || selectedFields === void 0 ? void 0 : selectedFields[0]))),
        open && (React.createElement("div", null, AllFields.map((field, idx) => (React.createElement("option", { key: idx, className: 'field-selector-item', value: field, onClick: handleClick }, field)))))));
};
//# sourceMappingURL=mock-field-selector.js.map