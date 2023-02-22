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
/** @jsx jsx */
import { React, css, jsx, classNames, polished } from 'jimu-core';
import { NavButtonGroup, hooks, utils } from 'jimu-ui';
import { useObserveDebouncedLength as _useObserveDebouncedLength } from './utils';
const useStyle = (vertical, space, minLength) => {
    return css `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .root {
      flex-direction: ${vertical ? 'column' : 'row'};
      width: 100%;
      height: 100%;
      min-width: ${polished.rem(minLength)};
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      align-items: center;
      .scroll-list-item {
        &:not(:first-of-type) {
          margin-top: ${vertical ? polished.rem(space) : 'unset'};
          margin-left: ${!vertical ? polished.rem(space) : 'unset'};
        }
      }
    }
`;
};
const useObserveDebouncedLength = (rootRef, vertical, offset = 0, minLength = offset) => {
    let length = _useObserveDebouncedLength(rootRef, 500, vertical);
    length += offset;
    length = Math.max(length, minLength);
    return length;
};
const getStartEnd = (previousStart, previousEnd, number) => {
    let start = previousStart;
    let end = previousEnd;
    if (end - start > number) {
        end = previousStart + number;
    }
    else if (end - start < number) {
        start = 0;
        end = start + number;
    }
    return [start, end];
};
const DefaultList = [];
export const ScrollList = React.forwardRef((props, ref) => {
    var _a;
    const { scrollRef, className, lists = DefaultList, createItem, vertical, itemLength, space, onChange, autoHideArrow, minLength = itemLength, autoScrollEnd, onScrollStatusChange } = props, others = __rest(props, ["scrollRef", "className", "lists", "createItem", "vertical", "itemLength", "space", "onChange", "autoHideArrow", "minLength", "autoScrollEnd", "onScrollStatusChange"]);
    const translate = hooks.useTranslate();
    const counts = (_a = lists === null || lists === void 0 ? void 0 : lists.length) !== null && _a !== void 0 ? _a : 0;
    const style = useStyle(vertical, space, minLength);
    const [rootRef, handleRef] = hooks.useForwardRef(ref);
    //The length of the viewport that can be used to display items
    const length = useObserveDebouncedLength(rootRef, vertical, space, minLength);
    //Number of items that can be displayed in the viewport.
    //When length or itemLength changed, recalculate the number that can be displayed in the viewport
    const number = React.useMemo(() => Math.floor(length / itemLength), [itemLength, length]);
    //Used to intercept several items from the lists and display them in the viewport([].slice(start, end))
    const [start, setStart] = React.useState(getStartEnd(0, 0, number)[0]);
    const [end, setEnd] = React.useState(getStartEnd(0, 0, number)[1]);
    const endRef = hooks.useRefValue(end);
    const startRef = hooks.useRefValue(start);
    const [disablePrevious, setDisablePrevious] = React.useState(true);
    const [disableNext, setDisableNext] = React.useState(false);
    const [hideArrow, setHideArrow] = React.useState(true);
    const buttonStyle = React.useMemo(() => ({ visibility: !hideArrow ? 'visible' : 'hidden' }), [hideArrow]);
    React.useEffect(() => {
        onScrollStatusChange === null || onScrollStatusChange === void 0 ? void 0 : onScrollStatusChange(hideArrow, disablePrevious, disableNext);
    }, [disableNext, disablePrevious, hideArrow, onScrollStatusChange]);
    //When the number that can be displayed in the viewport changed, automatically update end
    React.useEffect(() => {
        if (length === 0)
            return;
        const [start, end] = getStartEnd(startRef.current, endRef.current, number);
        setStart(start);
        setEnd(end);
    }, [number, startRef, endRef, length]);
    //When the counts of lists changed, automatically scroll to end
    const listsRef = React.useRef([]);
    const scrollToEnd = hooks.useEventCallback(() => {
        const validList = lists.length > 0 && listsRef.current.length > 0 &&
            lists[lists.length - 1] !== listsRef.current[listsRef.current.length - 1];
        const scrollEnd = autoScrollEnd && validList && listsRef.current.length > counts;
        if (scrollEnd) {
            let start = 0;
            let end = 0;
            end = counts;
            start = end - number;
            start = Math.max(0, start);
            setStart(start);
            setEnd(end);
        }
    });
    React.useEffect(() => {
        scrollToEnd();
        listsRef.current = lists;
    }, [lists, scrollToEnd]);
    //Fire scroll function to change start and end
    const scroll = hooks.useEventCallback((previous, moveOne = true) => {
        const moveNumber = moveOne ? 1 : number;
        let s = 0;
        let e = 0;
        if (previous) {
            s = start - moveNumber;
            if (s < 0) {
                s = 0;
                e = s + number;
            }
            else {
                e = end - moveNumber;
            }
        }
        else {
            e = end + moveNumber;
            if (e > counts) {
                e = counts;
                s = e - number;
            }
            else {
                s = start + moveNumber;
            }
        }
        setStart(s);
        setEnd(e);
    });
    React.useEffect(() => {
        utils.setRef(scrollRef, scroll);
    }, [scroll, scrollRef]);
    const handleChange = (previous) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(previous);
        scroll(previous, true);
    };
    React.useEffect(() => {
        if (length === 0)
            return;
        const hideArrow = (end - start) >= counts;
        const disablePrevious = start === 0;
        const disableNext = end === counts;
        setDisablePrevious(disablePrevious);
        setDisableNext(disableNext);
        setHideArrow(hideArrow);
    }, [start, end, counts, length]);
    return jsx(NavButtonGroup, Object.assign({}, others, { css: style, type: "tertiary", vertical: vertical, onChange: handleChange, disablePrevious: disablePrevious, disableNext: disableNext, previousAriaLabel: translate('previous'), nextAriaLabel: translate('next'), previousStyle: buttonStyle, nextStyle: buttonStyle, className: classNames('scroll-list', className) }),
        jsx("div", { className: "root scroll-list-root", ref: handleRef }, lists.slice(start, end).map((item) => {
            return createItem(item, 'scroll-list-item');
        })));
});
//# sourceMappingURL=scroll-list.js.map