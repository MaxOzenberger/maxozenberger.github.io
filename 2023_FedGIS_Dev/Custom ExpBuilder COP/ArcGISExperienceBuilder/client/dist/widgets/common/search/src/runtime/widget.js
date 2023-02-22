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
import { React, css, jsx, Immutable, polished, UtilityManager } from 'jimu-core';
import { ViewVisibilityContext, PageVisibilityContext } from 'jimu-layouts/layout-runtime';
import { ArrangementStyle } from '../config';
import SearchSetting from './component/search-setting';
import SearchInput from './component/search';
import CreateDatasource from './component/create-datasource';
import { versionManager } from '../version-manager';
const { useEffect, useState, useRef } = React;
const Widget = (props) => {
    const { config, id } = props;
    const searchConRef = useRef(null);
    const [datasourceConfig, setDatasourceConfig] = useState(Immutable([]));
    const [isShowSearchInput, setIsShowSearchInput] = useState(false);
    useEffect(() => {
        initDatasourceConfig();
        // eslint-disable-next-line
    }, [config]);
    const STYLE = css `
    & {
      height: ${polished.rem(32)};
      margin-top: 1px;
      margin-left: 1px;
    }
  `;
    const onDatasourceConfigChange = (newDatasourceConfig) => {
        newDatasourceConfig && setDatasourceConfig(newDatasourceConfig);
    };
    const initDatasourceConfig = () => __awaiter(void 0, void 0, void 0, function* () {
        const dsConfig = (config === null || config === void 0 ? void 0 : config.datasourceConfig) || Immutable([]);
        const newDsPromise = dsConfig.map((configItem) => __awaiter(void 0, void 0, void 0, function* () {
            let newConfigItem = configItem === null || configItem === void 0 ? void 0 : configItem.setIn(['enable'], true);
            if (configItem === null || configItem === void 0 ? void 0 : configItem.useUtility) {
                yield getUrlOfUseUtility(configItem === null || configItem === void 0 ? void 0 : configItem.useUtility).then(geocodeUrl => {
                    newConfigItem = newConfigItem.setIn(['geocodeURL'], geocodeUrl);
                });
            }
            return Promise.resolve(newConfigItem === null || newConfigItem === void 0 ? void 0 : newConfigItem.asMutable({ deep: true }));
        }));
        yield Promise.all(newDsPromise).then(newDsConfig => {
            setDatasourceConfig(Immutable(newDsConfig));
        });
    });
    const getUrlOfUseUtility = (useUtility) => __awaiter(void 0, void 0, void 0, function* () {
        return UtilityManager.getInstance().getUrlOfUseUtility(useUtility)
            .then((url) => {
            return Promise.resolve(url);
        });
    });
    const checkIsShowSearchInput = () => {
        if ((config === null || config === void 0 ? void 0 : config.arrangementStyle) === ArrangementStyle.Style1) {
            return true;
        }
        else {
            return isShowSearchInput;
        }
    };
    const onShowSearchInputChange = (isShow) => {
        setIsShowSearchInput(isShow);
    };
    return (jsx(ViewVisibilityContext.Consumer, null, ({ isInView, isInCurrentView }) => {
        const isSearchInCurrentView = isInView ? isInCurrentView : true;
        return (jsx(PageVisibilityContext.Consumer, null, (isWidgetInCurrentPage) => {
            var _a;
            return (jsx("div", { className: 'widget-search jimu-widget' },
                jsx("div", { className: 'd-flex w-100 align-items-center', css: STYLE, ref: searchConRef },
                    jsx("div", null, (((_a = config === null || config === void 0 ? void 0 : config.datasourceConfig) === null || _a === void 0 ? void 0 : _a.length) > 1 && checkIsShowSearchInput()) && jsx(SearchSetting, { className: 'h-100', config: config, datasourceConfig: datasourceConfig, onDatasourceConfigChange: onDatasourceConfigChange })),
                    jsx(SearchInput, { id: id, className: 'flex-grow-1 h-100', reference: searchConRef, datasourceConfig: datasourceConfig, config: config, isShowSearchInput: checkIsShowSearchInput(), onShowSearchInputChange: onShowSearchInputChange, isInCurrentView: isSearchInCurrentView, isWidgetInCurrentPage: isWidgetInCurrentPage }),
                    jsx(CreateDatasource, { id: id, datasourceConfig: datasourceConfig }))));
        }));
    }));
};
Widget.versionManager = versionManager;
export default Widget;
//# sourceMappingURL=widget.js.map