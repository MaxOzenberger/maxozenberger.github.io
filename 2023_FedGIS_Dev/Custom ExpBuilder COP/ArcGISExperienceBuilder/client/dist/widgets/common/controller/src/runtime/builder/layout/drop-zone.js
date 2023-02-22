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
import { DropArea, CanvasPane } from 'jimu-layouts/layout-builder';
import { utils } from 'jimu-layouts/layout-runtime';
import { hooks } from 'jimu-ui';
import { calInsertPositionForRow, calInsertPositionForColumn, useInsertSyncWidgetToLayout } from '../utils';
import { BASE_LAYOUT_NAME } from '../../../common/consts';
const style = css `
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    background: transparent;
    > .drop-area {
      width: 100%;
      height: 100%;
    }
    > .overlay {
      position: absolute;
      left: 0;
      bottom: 0;
      top: 0;
      right: 0;
      background: transparent;
      z-index: -1;
      &.hide {
        display: none;
      }
    }
  `;
// Drag and insert a widget to the specified `layout`
export const DrapZone = React.forwardRef((props, ref) => {
    const { widgetId, layout, layouts, vertical, childClass, placeholder, className } = props, others = __rest(props, ["widgetId", "layout", "layouts", "vertical", "childClass", "placeholder", "className"]);
    const { color, size: [long, short] } = placeholder;
    const nodeRef = React.useRef(null);
    const overlayRef = React.useRef(null);
    const referenceIdRef = React.useRef(null);
    const childRectsRef = React.useRef(null);
    const overlayNodeRef = React.useRef(null);
    const [dragover, setDragover] = React.useState(false);
    const handleRef = hooks.useForkRef(nodeRef, ref);
    React.useEffect(() => {
        overlayRef.current = new CanvasPane(overlayNodeRef.current);
    }, []);
    const collectBounds = () => {
        childRectsRef.current = [];
        const domRect = nodeRef.current.getBoundingClientRect();
        const children = nodeRef.current.parentNode.querySelectorAll(`.${childClass}`);
        if (children && children.length) {
            children.forEach((node) => {
                const itemId = node.getAttribute('data-layoutitemid');
                if (layout.order && layout.order.includes(itemId)) {
                    const rect = utils.relativeClientRect(node.getBoundingClientRect(), domRect);
                    rect.id = itemId;
                    childRectsRef.current.push(rect);
                }
            });
        }
        if (!vertical) {
            childRectsRef.current.sort((a, b) => a.left - b.left);
        }
        else {
            childRectsRef.current.sort((a, b) => a.top - b.top);
        }
    };
    const toggleDragoverEffect = (value) => {
        if (value) {
            referenceIdRef.current = null;
            collectBounds();
            overlayRef.current.setSize(nodeRef.current.clientWidth, nodeRef.current.clientHeight);
        }
        setDragover(value);
    };
    const onDragOver = (_, __, containerRect, itemRect) => {
        let rect = itemRect;
        const childRects = childRectsRef.current;
        const height = nodeRef.current.offsetHeight;
        const width = nodeRef.current.offsetWidth;
        if (childRects && childRects.length) {
            if (!vertical) {
                const { insertX, refId } = calInsertPositionForRow(containerRect, rect, childRects);
                referenceIdRef.current = refId;
                rect = {
                    left: insertX - short / 2 + nodeRef.current.scrollLeft,
                    width: short,
                    top: (height - long) / 2 + nodeRef.current.scrollTop,
                    height: long
                };
            }
            else {
                const { insertY, refId } = calInsertPositionForColumn(containerRect, rect, childRects);
                referenceIdRef.current = refId;
                rect = {
                    top: insertY - long / 2 + nodeRef.current.scrollTop,
                    width: long,
                    left: (width - long) / 2 + nodeRef.current.scrollLeft,
                    height: short
                };
            }
        }
        else {
            if (!vertical) {
                rect = {
                    left: containerRect.width / 2 - short / 2,
                    width: short,
                    top: (height - long) / 2 + nodeRef.current.scrollTop,
                    height: long
                };
            }
            else {
                rect = {
                    top: containerRect.height / 2 - short / 2,
                    width: long,
                    left: short / 2,
                    height: short
                };
            }
        }
        overlayRef.current.clear();
        overlayRef.current.setColor(polished.rgba(color, 1));
        overlayRef.current.drawRect(rect);
    };
    const insertSyncWidgetToLayout = useInsertSyncWidgetToLayout(widgetId, BASE_LAYOUT_NAME);
    const onDrop = (draggingItem, containerRect, itemRect) => {
        overlayRef.current.clear();
        let insertIndex = 0;
        if (referenceIdRef.current) {
            insertIndex = (layout.order && layout.order.indexOf(referenceIdRef.current)) || 0;
        }
        else if (layout.order) {
            insertIndex = layout.order.length;
        }
        insertSyncWidgetToLayout(layout, draggingItem, containerRect, itemRect, insertIndex);
        referenceIdRef.current = null;
        childRectsRef.current = [];
    };
    return (jsx("div", Object.assign({ className: classNames('drop-zone', className), ref: handleRef }, others, { css: style }),
        jsx(DropArea, { style: style, className: 'drop-area', layouts: layouts, highlightDragover: true, onDragOver: onDragOver, onDrop: onDrop, onToggleDragoverEffect: toggleDragoverEffect }),
        jsx("canvas", { className: classNames('overlay', { hide: !dragover }), ref: overlayNodeRef })));
});
//# sourceMappingURL=drop-zone.js.map