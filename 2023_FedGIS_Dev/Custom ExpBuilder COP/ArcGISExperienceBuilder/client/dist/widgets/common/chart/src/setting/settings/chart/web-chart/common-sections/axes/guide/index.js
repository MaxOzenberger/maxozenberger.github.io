import { React, Immutable } from 'jimu-core';
import { hooks, defaultMessages as jimuiDefaultMessage, Button } from 'jimu-ui';
import defaultMessages from '../../../../../../translations/default';
import Guide from './guide';
import { getDefaultGuide } from '../../../../../../../utils/default';
import { getGuideName, getValidGuides } from './utils';
import { ElementPanel } from '../../appearance/element-panel';
import { Placeholder } from '../../../../../components';
import { PlusOutlined } from 'jimu-icons/outlined/editor/plus';
import { styled } from 'jimu-theme';
const Root = styled.div `
  height: 100%;
  .guilds-panel {
    overflow-y: auto;
    height: calc(100% - 50px);
  }
`;
const Guides = (props) => {
    const translate = hooks.useTranslate(defaultMessages, jimuiDefaultMessage);
    const { value: propValue, onChange, isHorizontal } = props;
    const [defaultOpenIndex, setDefaultOpenIndex] = React.useState(-1);
    const [guides, setGuides] = React.useState(propValue !== null && propValue !== void 0 ? propValue : Immutable([]));
    const handleCreate = () => {
        const name = getGuideName(guides);
        const guide = getDefaultGuide(name, '', isHorizontal);
        setGuides(guides.concat(guide));
        setDefaultOpenIndex(guides.length);
    };
    const handleChange = (guide, index) => {
        setGuides(Immutable.set(guides, index, guide));
    };
    const handleDelete = (index) => {
        setGuides(guides.filter((_, i) => i !== index));
    };
    hooks.useUpdateEffect(() => {
        const gs = getValidGuides(guides);
        onChange(gs);
    }, [guides]);
    return (React.createElement(ElementPanel, { label: translate('auxiliaryGuide'), title: translate('auxiliaryGuide'), level: 2 },
        React.createElement(Root, { className: 'px-3' },
            React.createElement(Button, { size: 'sm', type: 'primary', onClick: handleCreate, className: 'w-100', "aria-describedby": 'no-guides-msg' },
                React.createElement(PlusOutlined, null),
                React.createElement("span", null, translate('add'))),
            !!guides.length && (React.createElement("div", { className: 'guilds-panel mt-1' }, guides.map((guide, index) => {
                var _a;
                return (React.createElement(Guide, { className: 'mt-2', key: (_a = guide.name) !== null && _a !== void 0 ? _a : index, isHorizontal: isHorizontal, value: guide, defaultIsOpen: index === defaultOpenIndex, onChange: (guide) => handleChange(guide, index), onDelete: () => handleDelete(index) }));
            }))),
            !guides.length && (React.createElement(Placeholder, { messageId: 'no-guides-msg', placeholder: translate('noGuideTip') })))));
};
export default Guides;
//# sourceMappingURL=index.js.map