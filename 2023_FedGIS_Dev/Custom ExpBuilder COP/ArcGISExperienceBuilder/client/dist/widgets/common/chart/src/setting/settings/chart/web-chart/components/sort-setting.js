/** @jsx jsx */
import { css, Immutable, jsx } from 'jimu-core';
import { Button, Select } from 'jimu-ui';
import { parseOrderByField } from '../../../../../utils/common/serial';
import { SortAscendingOutlined } from 'jimu-icons/outlined/directional/sort-ascending';
import { SortDescendingOutlined } from 'jimu-icons/outlined/directional/sort-descending';
const style = css `
  .sort-select {
    width: 85%;
  }
  .order-arrow {
    width: 26px;
    height: 26px;
  }
`;
export const SorteSetting = (props) => {
    const { value = ' ASC', fields = Immutable([]), onChange } = props;
    const [field, order] = parseOrderByField(value);
    const handleOrderChange = (order) => {
        onChange(`${field} ${order}`);
    };
    const handleFieldChange = (evt) => {
        const field = evt.currentTarget.value;
        onChange(`${field} ${order}`);
    };
    return (jsx("div", { className: 'sorted w-100', css: style },
        jsx("div", { className: 'field-row d-flex align-items-center justify-content-between' },
            jsx(Select, { size: 'sm', className: 'sort-select', value: field, onChange: handleFieldChange }, fields.map((item, index) => (jsx("option", { key: index, value: item.value }, item.name)))),
            jsx(OrderArrow, { value: order, onChange: handleOrderChange }))));
};
export const OrderArrow = ({ value = 'ASC', onChange }) => {
    const handleClick = () => {
        onChange(value === 'DESC' ? 'ASC' : 'DESC');
    };
    return (jsx(Button, { type: 'tertiary', className: 'order-arrow', size: 'sm', icon: true, onClick: handleClick },
        value === 'ASC' && jsx(SortAscendingOutlined, null),
        value !== 'ASC' && jsx(SortDescendingOutlined, null)));
};
//# sourceMappingURL=sort-setting.js.map