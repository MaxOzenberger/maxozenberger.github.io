import { Status, PageStyle, DS_TOOL_H, BOTTOM_TOOL_H, SelectionModeType, ListLayoutType, LIST_CARD_MIN_SIZE, SCROLL_BAR_WIDTH } from '../../config';
import { DataSourceManager, getAppStore } from 'jimu-core';
import { DistanceUnits, utils as jimuUtils } from 'jimu-ui';
export function isScrollStart(listDiv, lastScrollOffset) {
    if (!listDiv)
        return true;
    const scrollTOrL = lastScrollOffset;
    const isStart = scrollTOrL < 2;
    return isStart;
}
export function isEqualCardSizeByListLayout(cardSize1, cardSize2, layoutType) {
    if (layoutType === ListLayoutType.Column) {
        return isEqualNumber(cardSize1.width, cardSize2.width);
    }
    else if (layoutType === ListLayoutType.Row) {
        return isEqualNumber(cardSize1.height, cardSize2.height);
    }
    else {
        return isEqualNumber(cardSize1.width, cardSize2.width) && isEqualNumber(cardSize1.height, cardSize2.height);
    }
}
export function isEqualNumber(num1, num2) {
    if (Math.abs(num1 - num2) < 0.0001) {
        return true;
    }
    else {
        return false;
    }
}
export function createOutputDs(records, outputDsId, useDs) {
    if (!outputDsId || !useDs)
        return;
    const dsManager = DataSourceManager.getInstance();
    if (dsManager.getDataSource(outputDsId)) {
        if (dsManager.getDataSource(outputDsId).getDataSourceJson()
            .originDataSources[0].dataSourceId !== useDs.dataSourceId) {
            dsManager.destroyDataSource(outputDsId);
            dsManager.createDataSource(outputDsId).then(ods => {
                ods.setRecords(records);
            });
        }
        else {
            const ods = dsManager.getDataSource(outputDsId);
            ods.setRecords(records);
        }
    }
    else {
        dsManager.createDataSource(outputDsId).then(ods => {
            ods.setRecords(records);
        });
    }
}
export function getCardSizeNumberInConfig(props, widgetRect) {
    const { config } = props;
    const cardSizeInConfig = getCardSizeConfig(props);
    const widthLinearUnit = jimuUtils.toLinearUnit(cardSizeInConfig.width);
    let width = initCardSize(jimuUtils.toLinearUnit(cardSizeInConfig.width), widgetRect.width + config.horizontalSpace - SCROLL_BAR_WIDTH);
    //The width in percentage includes space, the width in px does not include
    if (widthLinearUnit.unit === DistanceUnits.PERCENTAGE) {
        width = (width - config.horizontalSpace) > 0 ? width - config.horizontalSpace : LIST_CARD_MIN_SIZE;
    }
    let height = initCardSize(jimuUtils.toLinearUnit(cardSizeInConfig.height), widgetRect.height);
    if (config.keepAspectRatio && (config === null || config === void 0 ? void 0 : config.layoutType) === ListLayoutType.GRID) {
        height = width * (config === null || config === void 0 ? void 0 : config.gridItemSizeRatio);
    }
    const cardSize = {
        width: width,
        height: height
    };
    return cardSize;
}
export function getCardSizeConfig(props) {
    var _a;
    const { config, builderStatus, browserSizeMode } = props;
    let cardConfigs = config === null || config === void 0 ? void 0 : config.asMutable({ deep: true }).cardConfigs[builderStatus];
    if (!cardConfigs || !cardConfigs.cardSize) {
        cardConfigs = config === null || config === void 0 ? void 0 : config.asMutable({ deep: true }).cardConfigs[Status.Regular];
    }
    let cardSizeInConfig = (_a = cardConfigs === null || cardConfigs === void 0 ? void 0 : cardConfigs.cardSize) === null || _a === void 0 ? void 0 : _a[browserSizeMode];
    if (!cardSizeInConfig) {
        cardSizeInConfig = cardConfigs.cardSize[Object.keys(cardConfigs.cardSize)[0]];
    }
    return cardSizeInConfig;
}
export function getDefaultMinListSize(props) {
    const cardSizeInConfig = getCardSizeConfig(props);
    const listMinSize = {
        width: LIST_CARD_MIN_SIZE,
        height: LIST_CARD_MIN_SIZE
    };
    const cardSizeUnit = {
        width: jimuUtils.toLinearUnit(cardSizeInConfig.width),
        height: jimuUtils.toLinearUnit(cardSizeInConfig.height)
    };
    if (cardSizeUnit.width.unit === DistanceUnits.PERCENTAGE) {
        listMinSize.width = (LIST_CARD_MIN_SIZE + 30) / cardSizeUnit.width.distance * 100;
    }
    if (cardSizeUnit.height.unit === DistanceUnits.PERCENTAGE) {
        listMinSize.height = (LIST_CARD_MIN_SIZE + 30) / cardSizeUnit.height.distance * 100;
    }
    return listMinSize;
}
export function getCardSizeWidthUnitInConfig(props) {
    const { config } = props;
    const cardSizeInConfig = getCardSizeConfig(props);
    const width = jimuUtils.toLinearUnit(cardSizeInConfig.width);
    if (width.unit === DistanceUnits.PERCENTAGE) {
        width.distance = (width.distance - config.horizontalSpace) > 0 ? width.distance - config.horizontalSpace : LIST_CARD_MIN_SIZE;
    }
    const cardSizeWidthUnit = {
        width: width,
        height: jimuUtils.toLinearUnit(cardSizeInConfig.height)
    };
    return cardSizeWidthUnit;
}
export function initCardSize(sizeUnit, widgetSize) {
    if (sizeUnit.unit === DistanceUnits.PERCENTAGE) {
        return (sizeUnit.distance / 100) * widgetSize;
    }
    else {
        return sizeUnit.distance;
    }
}
export function getPageSize(widgetRect, listHeight, props, columnCount) {
    const cardSize = getCardSizeNumberInConfig(props, widgetRect);
    const { config, isHeightAuto, isWidthAuto } = props;
    let pageSize;
    if (config.pageStyle === PageStyle.Scroll) {
        if (!widgetRect) {
            return 0;
        }
        switch (config === null || config === void 0 ? void 0 : config.layoutType) {
            case ListLayoutType.Row:
                if (widgetRect.height === 0)
                    return 0;
                if (isHeightAuto) {
                    listHeight = document.body.scrollHeight;
                }
                pageSize = Math.ceil((listHeight + config.space) / (cardSize.height + config.space)) + 1;
                break;
            case ListLayoutType.Column:
                if (widgetRect.width === 0)
                    return 0;
                let listWidth = widgetRect.width;
                if (isWidthAuto) {
                    listWidth = document.body.scrollWidth;
                }
                pageSize = Math.ceil((listWidth + config.space) / (cardSize.width + config.space)) + 1;
                break;
            case ListLayoutType.GRID:
                if (widgetRect.height === 0)
                    return 0;
                if (isHeightAuto) {
                    listHeight = document.body.scrollHeight;
                }
                pageSize = Math.ceil((listHeight + (config === null || config === void 0 ? void 0 : config.verticalSpace)) / (cardSize.height + config.space)) * columnCount;
                break;
        }
        if (config.navigatorOpen) {
            pageSize = Math.max(pageSize, config.scrollStep);
        }
    }
    else {
        pageSize = config.itemsPerPage;
    }
    return pageSize;
}
export function getBottomToolH(paginatorDiv, showBottomTools) {
    let bottomToolH = BOTTOM_TOOL_H;
    if (paginatorDiv) {
        bottomToolH = paginatorDiv.clientHeight;
    }
    bottomToolH = showBottomTools ? bottomToolH : 0;
    return bottomToolH;
}
export function getListHeight(widgetRect, bottomToolH, showTopTool) {
    const dsToolH = showTopTool ? DS_TOOL_H : 0;
    if (!widgetRect)
        return 0;
    const height = widgetRect.height - dsToolH - bottomToolH;
    return height < 0 ? 0 : height;
}
export function showBottomTools(props, state) {
    const { config } = props;
    const { datasource } = state;
    return (!!datasource &&
        !(config.pageStyle === PageStyle.Scroll && !config.navigatorOpen));
}
export function showTopTools(props) {
    return (checkIsShowListToolsOnly(props) || checkIsShowDataAction(props));
}
export function checkIsShowListToolsOnly(props) {
    return (showSort(props) ||
        showDisplaySelectedOnly(props) ||
        showClearSelected(props) ||
        showFilter(props) ||
        showSearch(props));
}
export function isDsConfigured(props) {
    const { useDataSources } = props;
    return !!useDataSources && !!useDataSources[0];
}
export function checkIsShowDataAction(props) {
    var _a, _b, _c;
    const { id } = props;
    const appConfig = (_b = (_a = getAppStore()) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.appConfig;
    const widgetJson = (_c = appConfig === null || appConfig === void 0 ? void 0 : appConfig.widgets) === null || _c === void 0 ? void 0 : _c[id];
    const enableDataAction = (widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.enableDataAction) === undefined ? true : widgetJson === null || widgetJson === void 0 ? void 0 : widgetJson.enableDataAction;
    return enableDataAction && isDsConfigured(props);
}
export function showSort(props) {
    const { config } = props;
    if (!config.sortOpen || !config.sorts || config.sorts.length < 1)
        return false;
    const sorts = config.sorts;
    let isValid = false;
    sorts.some((sort) => {
        sort.rule &&
            sort.rule.some(sortData => {
                if (sortData && !!sortData.jimuFieldName) {
                    isValid = true;
                }
                return isValid;
            });
        return isValid;
    });
    return isValid;
}
export function showSearch(props) {
    const { config } = props;
    return config.searchOpen && config.searchFields && config.searchFields !== '';
}
export function showFilter(props) {
    const { config } = props;
    return config.filterOpen && !!config.filter;
}
export function showDisplaySelectedOnly(props) {
    const { config } = props;
    return (config.showSelectedOnlyOpen &&
        config.cardConfigs[Status.Selected].selectionMode !== SelectionModeType.None);
}
export function showClearSelected(props) {
    const { config } = props;
    return (config.showClearSelected &&
        config.cardConfigs[Status.Selected].selectionMode !== SelectionModeType.None);
}
export function intersectionObserver(ref, rootElement, onChange, options) {
    const option = options || { root: rootElement };
    const callback = function (entries, observer) {
        const isIn = entries[0].intersectionRatio > 0;
        onChange && onChange(isIn);
    };
    const observer = new IntersectionObserver(callback, option);
    observer.observe(ref);
    return observer;
}
//# sourceMappingURL=utils.js.map