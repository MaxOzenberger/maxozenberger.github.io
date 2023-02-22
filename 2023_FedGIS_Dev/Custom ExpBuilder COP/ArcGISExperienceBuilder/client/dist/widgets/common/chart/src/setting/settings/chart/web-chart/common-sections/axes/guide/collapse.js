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
import { Button, hooks } from 'jimu-ui';
import EditInput from './edit-input';
import defaultMessages from '../../../../../../translations/default';
import { SettingCollapse } from '../../../../../components';
import { TrashOutlined } from 'jimu-icons/outlined/editor/trash';
import { styled } from 'jimu-theme';
const EditableLabelRoot = styled.div `
  margin-bottom: 2px;
`;
function EditableLabel({ value, onChange, onDelete }) {
    const translate = hooks.useTranslate(defaultMessages);
    return (React.createElement(EditableLabelRoot, { className: 'mw-100 d-flex align-items-center justify-content-between' },
        React.createElement(EditInput, { value: value, onChange: onChange, className: 'mr-2' }),
        React.createElement(Button, { icon: true, type: 'tertiary', size: 'sm', onClick: onDelete, title: translate('removeGuide') },
            React.createElement(TrashOutlined, null))));
}
const GuideCollapse = (props) => {
    const { name, onChange, onDelete } = props, others = __rest(props, ["name", "onChange", "onDelete"]);
    const label = React.createElement(EditableLabel, { value: name, onChange: onChange, onDelete: onDelete });
    return React.createElement(SettingCollapse, Object.assign({ type: 'primary', level: 1, label: label }, others));
};
export default GuideCollapse;
//# sourceMappingURL=collapse.js.map