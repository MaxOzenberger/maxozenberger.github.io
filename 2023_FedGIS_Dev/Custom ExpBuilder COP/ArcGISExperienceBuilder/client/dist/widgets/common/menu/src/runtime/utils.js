import { React, ReactRedux, css, getAppStore, PageType, LinkType, Immutable, BrowserSizeMode, polished } from 'jimu-core';
import { componentStyleUtils, styleUtils, utils } from 'jimu-ui';
const { useState, useEffect, useMemo } = React;
const { useSelector } = ReactRedux;
const isRTL = getAppStore().getState().appContext.isRTL;
const normalIcon = require('jimu-ui/lib/icons/toc-page.svg');
const linkIcon = require('jimu-ui/lib/icons/toc-link.svg');
const folderIcon = require('jimu-ui/lib/icons/toc-folder.svg');
const icons = {
    [PageType.Normal]: normalIcon,
    [PageType.Link]: linkIcon,
    [PageType.Folder]: folderIcon
};
/**
 * Filter out hidden pages
 * @param pageStructure
 * @param pages
 */
export const filterPageStructure = (pageStructure, pages) => {
    pageStructure = pageStructure.filter(item => {
        const id = Object.keys(item)[0];
        const info = pages === null || pages === void 0 ? void 0 : pages[id];
        return info.isVisible;
    });
    return pageStructure.map(item => {
        const entries = Object.entries(item)[0];
        const id = entries[0];
        let subs = entries[1];
        subs = subs.filter(id => {
            const info = pages === null || pages === void 0 ? void 0 : pages[id];
            return info.isVisible;
        });
        return item.set(id, subs);
    });
};
/**
 * Generate the data of menu navigation
 * @param pageStructure
 * @param pages
 */
export const getMenuNavigationData = (pageStructure, pages) => {
    pageStructure = filterPageStructure(pageStructure, pages);
    return pageStructure.map(item => {
        const entries = Object.entries(item)[0];
        const id = entries[0];
        const subs = entries[1];
        const info = pages[id];
        const navItem = getMenuNavigationItem(info);
        const subNavItems = subs.map(subPageId => {
            const info = pages[subPageId];
            return getMenuNavigationItem(info);
        });
        return navItem.set('subs', subNavItems);
    });
};
const getMenuNavigationItem = (page) => {
    const linkType = getLinkType(page);
    const value = getLinkValue(page);
    const icon = page.icon || icons[page.type];
    return Immutable({
        linkType,
        value,
        icon: Object.prototype.toString.call(icon) === '[object Object]'
            ? icon
            : utils.toIconResult(icon, page.type, 16),
        target: page.openTarget,
        name: page.label
    });
};
const getLinkType = (page) => {
    if (page.type === PageType.Link) {
        return LinkType.WebAddress;
    }
    else if (page.type === PageType.Normal) {
        return LinkType.Page;
    }
    else if (page.type === PageType.Folder) {
        return LinkType.None;
    }
};
const getLinkValue = (page) => {
    if (page.type === PageType.Link) {
        return page.linkUrl;
    }
    else if (page.type === PageType.Normal) {
        return page.id;
    }
    else if (page.type === PageType.Folder) {
        return '#';
    }
};
/**
 * Get page id from `NavigationItem`
 * @param item
 */
export const getPageId = (item) => {
    if (!(item === null || item === void 0 ? void 0 : item.value))
        return '';
    const splits = item.value.split(',');
    return (splits === null || splits === void 0 ? void 0 : splits.length) ? splits[0] : '';
};
/**
 * Return a function to check navigation item is actived or not
 */
export const useAvtivePage = () => {
    const currentPageId = useSelector((state) => { var _a; return (_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.currentPageId; });
    return React.useCallback((item) => {
        return getPageId(item) === currentPageId;
    }, [currentPageId]);
};
/**
 * Listen page info and update menu navigation data
 */
export const useNavigationData = () => {
    const [data, setData] = useState([]);
    const pages = useSelector((state) => { var _a; return (_a = state === null || state === void 0 ? void 0 : state.appConfig) === null || _a === void 0 ? void 0 : _a.pages; });
    const pageStructure = useSelector((state) => { var _a; return (_a = state === null || state === void 0 ? void 0 : state.appConfig) === null || _a === void 0 ? void 0 : _a.pageStructure; });
    useEffect(() => {
        const data = getMenuNavigationData(pageStructure, pages);
        setData(data);
    }, [pages, pageStructure]);
    return data;
};
/**
 * When run in small device, set anchor as 'full'
 * @param anchor
 */
export const useAnchor = (anchor) => {
    return useSelector((state) => (state === null || state === void 0 ? void 0 : state.browserSizeMode) === BrowserSizeMode.Small ? 'full' : anchor);
};
/**
 * Generate style to override the default style of navigation component
 * @param menuStyle
 * @param variant
 * @param vertical
 */
export const useNavAdvanceStyle = (advanced, menuStyle, variant, vertical) => {
    return useMemo(() => {
        if (!advanced)
            return css ``;
        return css `
      .jimu-nav,
      &.jimu-nav {
        ${componentStyleUtils.nav.getRootStyles(variant === null || variant === void 0 ? void 0 : variant.root)};
        ${componentStyleUtils.nav.getVariantStyles(menuStyle, variant, vertical, !isRTL)};
        ${styleUtils.getButtonStyleByState(variant === null || variant === void 0 ? void 0 : variant.item, true)}
      }
    `;
    }, [advanced, menuStyle, variant, vertical]);
};
/**
 * Generate style to override the default style of drawer component
 * @param advanced
 * @param variant
 * @param paper
 */
export const useDrawerAdvanceStyle = (advanced, variant, paper) => {
    var _a, _b;
    const bg = paper === null || paper === void 0 ? void 0 : paper.bg;
    const color = (_b = (_a = variant === null || variant === void 0 ? void 0 : variant.item) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.color;
    return useMemo(() => {
        if (!advanced) {
            return css `
      .paper {
        .header {
          padding: ${polished.rem(8)};
        }
      }
    `;
        }
        return css `
      .paper {
        background: ${bg};
        .header {
          color: ${color};
          padding: ${polished.rem(8)};
        }
      }
    `;
    }, [advanced, bg, color]);
};
/**
 * Set the style of nav under different devices
 * @param isInSmallDevice
 */
export const useNavigationStyle = (isInSmallDevice) => {
    return useMemo(() => {
        if (!isInSmallDevice) {
            return css `
      &{
        min-width: ${polished.rem(240)};
        max-width: ${polished.rem(320)};
      }
      & .jimu-nav-link-wrapper {
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        white-space: nowrap;
      }
    `;
        }
        return css `
      & .jimu-nav-link-wrapper {
        text-overflow: ellipsis !important;
        white-space: nowrap;
        overflow: hidden !important;
      }
    `;
    }, [isInSmallDevice]);
};
//# sourceMappingURL=utils.js.map