import { polished, React } from 'jimu-core';
import { AvatarCard } from './avatar-card';
import WidgetPlaceHolderOutlined from 'jimu-icons/svg/outlined/brand/widget-place-holder.svg';
import { styled } from 'jimu-theme';
const createArray = (length) => {
    const arr = [];
    while (length > 0) {
        arr.push(length);
        length--;
    }
    return arr;
};
const PlaceholderRoot = styled('div') `
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  .avatar-placeholder {
    &:not(:first-of-type) {
      margin-top: ${props => props.vertical ? polished.rem(props.space) : 'unset'};
      margin-left: ${props => !props.vertical ? polished.rem(props.space) : 'unset'};
    }
  }
`;
const dummyData = createArray(3);
const defaultAvatar = { type: 'secondary', size: 'lg', shape: 'circle' };
export const ListPlaceholder = (props) => {
    const { vertical, space, size = 'lg' } = props;
    const avatar = React.useMemo(() => (Object.assign(Object.assign({}, defaultAvatar), { size })), [size]);
    return (React.createElement(PlaceholderRoot, { className: 'list-placeholder', vertical: vertical, space: space }, dummyData.map((_, idx) => (React.createElement(AvatarCard, { key: idx, disabled: true, className: 'avatar-placeholder', icon: WidgetPlaceHolderOutlined, label: '', showTooltip: false, avatar: avatar })))));
};
//# sourceMappingURL=list-placeholder.js.map