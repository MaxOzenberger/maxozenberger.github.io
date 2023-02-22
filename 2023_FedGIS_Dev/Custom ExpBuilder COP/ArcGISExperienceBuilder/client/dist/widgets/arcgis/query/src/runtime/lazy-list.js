var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */
import { React, jsx, css, CONSTANTS, classNames } from 'jimu-core';
import { hooks, Loading, LoadingType } from 'jimu-ui';
import { ListDirection } from '../config';
import { EntityStatusType } from '../common/common-components';
import { QueryResultItem } from './query-result-item';
import { executeQuery, getPopupTemplate } from './query-utils';
import { useAutoHeight } from './useAutoHeight';
const { useRef, useState } = React;
const getStyle = (isAutoHeight) => {
    return css `
    display: flex;
    flex: 1 1 ${isAutoHeight ? 'auto' : 0};
    overflow: auto;
    max-height: ${isAutoHeight ? 'calc(61.8vh - 100px)' : 'none'};

    .query-result-item + .query-result-item {
      margin-left: 0.5rem;
      margin-top: 0;
    }

    &.vertical {
      flex-direction: column;
      .list-items {
        position: relative;
        flex-direction: column;
      }

      .feature-info-component {
        width: 100%;
      }

      .query-result-item + .query-result-item {
        margin-left: 0;
        margin-top: 0.5rem;
      }
    }
    .list-items {
      display: flex;
    }
    .lazyload-detector {
      height: 2px;
      width: 2px;
      opacity: 0;
    }
  `;
};
export function LazyList(props) {
    var _a;
    const { widgetId, outputDS, queryParams, resultCount, records, queryItem, direction, onRenderDone } = props;
    const [dataItems, setDataItems] = useState(records);
    const [popupTempalte, setPopupTemplate] = useState();
    const [loadStatus, setLoadStatus] = useState(EntityStatusType.Init);
    const dataItemsRef = hooks.useRefValue(dataItems);
    const resultCountRef = hooks.useRefValue(resultCount);
    const loadStatusRef = hooks.useRefValue(loadStatus);
    const allDataItemsLoadedRef = hooks.useRefValue((records === null || records === void 0 ? void 0 : records.length) === resultCount);
    const pageRef = useRef(0);
    const resultContainerRef = useRef();
    const queryResultPageSize = (_a = outputDS === null || outputDS === void 0 ? void 0 : outputDS.getQueryPageSize()) !== null && _a !== void 0 ? _a : CONSTANTS.DEFAULT_QUERY_PAGE_SIZE;
    const el = useRef(null);
    const isAutoHeight = useAutoHeight();
    React.useEffect(() => {
        pageRef.current = 1;
        resultContainerRef.current.scrollTop = 0;
        setDataItems(records);
    }, [records]);
    const loadByPages = () => __awaiter(this, void 0, void 0, function* () {
        if (allDataItemsLoadedRef.current || loadStatusRef.current === EntityStatusType.Loading) {
            return;
        }
        pageRef.current = pageRef.current + 1;
        setLoadStatus(EntityStatusType.Loading);
        const { records } = yield executeQuery(widgetId, queryItem, outputDS, Object.assign(Object.assign({}, queryParams), { page: pageRef.current, pageSize: queryResultPageSize }));
        if (resultCountRef.current > 0 && dataItemsRef.current.length + records.length >= resultCountRef.current) {
            allDataItemsLoadedRef.current = true;
        }
        const updatedItems = dataItemsRef.current.concat(records);
        setDataItems(updatedItems);
        onRenderDone === null || onRenderDone === void 0 ? void 0 : onRenderDone({
            dataItems: updatedItems
        });
        setLoadStatus(EntityStatusType.Loaded);
    });
    React.useEffect(() => {
        getPopupTemplate(outputDS, queryItem).then((template) => {
            setPopupTemplate(template);
        });
    }, [outputDS, queryItem]);
    hooks.useEffectOnce(() => {
        const elLoadDetector = el === null || el === void 0 ? void 0 : el.current;
        if (elLoadDetector) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadByPages();
                }
            });
            observer === null || observer === void 0 ? void 0 : observer.observe(elLoadDetector);
            return () => {
                observer === null || observer === void 0 ? void 0 : observer.disconnect();
            };
        }
    });
    return (jsx("div", { className: classNames({ vertical: direction === ListDirection.Vertical }), css: getStyle(isAutoHeight), ref: resultContainerRef },
        jsx("div", { className: 'list-items px-3' }, dataItems === null || dataItems === void 0 ? void 0 : dataItems.map((dataItem, x) => (jsx(QueryResultItem, { key: dataItem.getId(), data: dataItem, dataSource: outputDS, widgetId: widgetId, popupTemplate: popupTempalte, expandByDefault: queryItem.resultExpandByDefault })))),
        jsx("div", { ref: el, className: 'lazyload-detector' }, "\u00A0"),
        loadStatus === EntityStatusType.Loading && jsx(Loading, { type: LoadingType.Donut })));
}
//# sourceMappingURL=lazy-list.js.map