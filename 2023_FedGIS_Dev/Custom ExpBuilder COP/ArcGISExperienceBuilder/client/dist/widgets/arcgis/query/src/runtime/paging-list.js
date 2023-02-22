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
import { React, jsx, css, classNames, CONSTANTS } from 'jimu-core';
import { Pagination, Loading, LoadingType } from 'jimu-ui';
import { ListDirection } from '../config';
import { EntityStatusType } from '../common/common-components';
import { QueryResultItem } from './query-result-item';
import { executeQuery, getPopupTemplate } from './query-utils';
import { useAutoHeight } from './useAutoHeight';
const { useRef, useState } = React;
const getStyle = (isAutoHeight) => {
    return css `
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;

    .list_items {
      flex: 1 1 ${isAutoHeight ? 'auto' : 0};
      max-height: ${isAutoHeight ? 'calc(61.8vh - 100px)' : 'none'};
      overflow: auto;
      display: flex;
      flex-direction: row;
    }

    .query-result-item + .query-result-item {
      margin-left: 0.5rem;
      margin-top: 0;
    }

    &.vertical {
      .list_items {
        flex-direction: column;
      }
      .feature-info-component {
        width: 100%;
      }
      .query-result-item + .query-result-item {
        margin-top: 0.5rem;
        margin-left: 0;
      }
    }
    .page-size-selector {
      width: auto;
    }

    .query-editable-select {
      .jimu-numeric-input {
        width: 60px;
      }
    }
  `;
};
export function PagingList(props) {
    var _a;
    const { widgetId, outputDS, queryItem, queryParams, resultCount, records, onRenderDone, direction } = props;
    const [dataItems, setDataItems] = useState(records);
    const [popupTempalte, setPopupTemplate] = useState();
    const [loadStatus, setLoadStatus] = useState(EntityStatusType.Init);
    const pageRef = useRef(1);
    const defaultPageSize = (_a = outputDS === null || outputDS === void 0 ? void 0 : outputDS.getQueryPageSize()) !== null && _a !== void 0 ? _a : CONSTANTS.DEFAULT_QUERY_PAGE_SIZE;
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const isAutoHeight = useAutoHeight();
    const pageSizeOptions = React.useMemo(() => {
        const result = [defaultPageSize];
        if (Math.round(defaultPageSize / 2) !== result[0]) {
            result.push(Math.round(defaultPageSize / 2));
        }
        if (Math.round(defaultPageSize / 5) !== result[1]) {
            result.push(Math.round(defaultPageSize / 5));
        }
        return result.reverse();
    }, [defaultPageSize]);
    React.useEffect(() => {
        pageRef.current = 1;
        setDataItems(records);
        setPageSize(defaultPageSize);
        // eslint-disable-next-line
    }, [records]);
    React.useEffect(() => {
        getPopupTemplate(outputDS, queryItem).then(template => {
            setPopupTemplate(template);
        });
    }, [outputDS, queryItem]);
    const loadByPages = (currentPage, size) => __awaiter(this, void 0, void 0, function* () {
        pageRef.current = currentPage;
        setLoadStatus(EntityStatusType.Loading);
        const result = yield executeQuery(widgetId, queryItem, outputDS, Object.assign(Object.assign({}, queryParams), { page: currentPage, pageSize: size }));
        setDataItems(result.records);
        onRenderDone === null || onRenderDone === void 0 ? void 0 : onRenderDone({
            dataItems: result.records,
            pageSize: size,
            page: pageRef.current
        });
        setLoadStatus(EntityStatusType.Loaded);
    });
    const handlePageSizeChange = (size) => {
        if (size > 0) {
            setPageSize(size);
            loadByPages(1, size);
        }
    };
    return (jsx("div", { className: classNames({ vertical: direction === ListDirection.Vertical }), css: getStyle(isAutoHeight) },
        jsx("div", { className: 'list_items mb-2 px-3' }, dataItems === null || dataItems === void 0 ? void 0 : dataItems.map((dataItem, x) => (jsx(QueryResultItem, { key: dataItem.getId(), data: dataItem, dataSource: outputDS, widgetId: widgetId, popupTemplate: popupTempalte, expandByDefault: queryItem.resultExpandByDefault })))),
        loadStatus === EntityStatusType.Loading && jsx(Loading, { type: LoadingType.Donut }),
        resultCount > 0 && (jsx("div", { className: 'd-flex justify-content-between align-items-center px-3' },
            jsx(Pagination, { className: 'd-flex justify-content-end', disabled: loadStatus === EntityStatusType.Loading, current: pageRef.current, totalPage: Math.ceil(resultCount / pageSize), onChangePage: (pageNum) => loadByPages(pageNum, pageSize), pageSize: pageSize, pageSizeOptions: pageSizeOptions, onPageSizeChange: handlePageSizeChange, showSizeChanger: true })))));
}
//# sourceMappingURL=paging-list.js.map