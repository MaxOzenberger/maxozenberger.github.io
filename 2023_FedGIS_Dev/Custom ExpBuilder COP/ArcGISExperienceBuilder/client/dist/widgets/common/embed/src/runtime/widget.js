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
import { React, getAppStore, AppMode, urlUtils, queryString, SessionManager, jsx, classNames, appActions, portalUrlUtils } from 'jimu-core';
import { Fragment } from 'react';
import { WidgetPlaceholder, DynamicUrlResolver, AlertButton, Alert } from 'jimu-ui';
import { EmbedType } from '../config';
import { getStyle } from './style';
import defaultMessages from './translations/default';
import embedIcon from '../../icon.svg';
import { versionManager } from '../version-manager';
import { ViewVisibilityContext, searchUtils, utils } from 'jimu-layouts/layout-runtime';
export default class Widget extends React.PureComponent {
    constructor(props) {
        super(props);
        this.checkAndLoadByType = () => {
            const { config } = this.props;
            const { embedType } = config;
            const { content } = this.state;
            if (embedType === EmbedType.Url) {
                const processedUrl = this.processUrl(content);
                this.checkUrl(processedUrl).then(passed => {
                    if (passed)
                        this.loadContent();
                });
            }
            else {
                this.loadContent();
            }
        };
        this.reloadContentInView = (preSectionNavInfos) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const { sectionNavInfos, layoutId } = this.props;
            if (this.needLoadContentInView &&
                sectionNavInfos &&
                preSectionNavInfos !== sectionNavInfos) {
                const changedSection = [];
                for (const sectionIndex in sectionNavInfos) {
                    const curSectionInfo = sectionNavInfos[sectionIndex];
                    const preSectionInfo = preSectionNavInfos === null || preSectionNavInfos === void 0 ? void 0 : preSectionNavInfos[sectionIndex];
                    if (curSectionInfo !== preSectionInfo) {
                        changedSection.push(sectionIndex);
                    }
                }
                const appState = getAppStore().getState();
                const appConfig = appState === null || appState === void 0 ? void 0 : appState.appConfig;
                const pageId = (_a = appState === null || appState === void 0 ? void 0 : appState.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.currentPageId;
                const sizeMode = utils.getCurrentSizeMode();
                const mainSizeMode = appConfig.mainSizeMode;
                const rootLayoutId = (_e = (_d = (_c = (_b = appConfig === null || appConfig === void 0 ? void 0 : appConfig.pages) === null || _b === void 0 ? void 0 : _b[pageId]) === null || _c === void 0 ? void 0 : _c.layout) === null || _d === void 0 ? void 0 : _d[sizeMode]) !== null && _e !== void 0 ? _e : (_h = (_g = (_f = appConfig === null || appConfig === void 0 ? void 0 : appConfig.pages) === null || _f === void 0 ? void 0 : _f[pageId]) === null || _g === void 0 ? void 0 : _g.layout) === null || _h === void 0 ? void 0 : _h[mainSizeMode];
                const structure = searchUtils.buildLayoutStructure(appConfig, rootLayoutId, pageId, "PAGE" /* ParentType.Page */, sizeMode);
                const { sectionId } = searchUtils.findParentViewId(layoutId, structure);
                if (changedSection.includes(sectionId)) {
                    // Reload the content in section view
                    this.checkAndLoadByType();
                }
            }
        };
        this.autoRefreshHandler = (autoConfChange) => {
            const { config } = this.props;
            const { embedType, autoRefresh, autoInterval = 1 } = config;
            // Turn auto refresh on or off
            if (!this.refreshTimer && autoRefresh) {
                const autoRefreshTimer = setInterval(() => {
                    if (embedType === EmbedType.Url) {
                        if (this.ifr) {
                            const src = this.ifr.src;
                            this.ifr.src = '';
                            setTimeout(() => {
                                if (this.ifr)
                                    this.ifr.src = src;
                            }, 100);
                        }
                    }
                    else {
                        const srcDoc = this.ifr.srcdoc;
                        this.ifr.srcdoc = srcDoc;
                    }
                }, autoInterval * 60 * 1000);
                this.refreshTimer = autoRefreshTimer;
            }
            else if (this.refreshTimer && !autoRefresh) {
                clearInterval(this.refreshTimer);
                this.refreshTimer = null;
            }
            // Auto refresh setting changed
            if (autoConfChange && autoRefresh) {
                if (this.refreshTimer)
                    clearInterval(this.refreshTimer);
                const changeTimer = setInterval(() => {
                    if (embedType === EmbedType.Url) {
                        if (this.ifr) {
                            const src = this.ifr.src;
                            this.ifr.src = '';
                            setTimeout(() => {
                                if (this.ifr)
                                    this.ifr.src = src;
                            }, 100);
                        }
                    }
                    else {
                        const srcDoc = this.ifr.srcdoc;
                        this.ifr.srcdoc = srcDoc;
                    }
                }, autoInterval * 60 * 1000);
                this.refreshTimer = changeTimer;
            }
        };
        this.iframeOnLoad = () => {
            this.setState({ isLoading: false });
        };
        this.checkSafeDomain = (url) => {
            var _a;
            let safeFlag = false;
            if (!url)
                return safeFlag;
            const appState = getAppStore().getState();
            const selfPortal = appState === null || appState === void 0 ? void 0 : appState.portalSelf;
            const selfPortalDomain = ((_a = selfPortal === null || selfPortal === void 0 ? void 0 : selfPortal.portalLocalHostname) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || (selfPortal === null || selfPortal === void 0 ? void 0 : selfPortal.portalHostname);
            const safeDomain = ['.arcgis.com', '.esri.com'];
            // portal self domain is safe
            if (selfPortalDomain)
                safeDomain.push(selfPortalDomain);
            let tobeCheckedDomain = '';
            if (url.includes('https://')) {
                tobeCheckedDomain = url.substring(8).split('/')[0];
            }
            // Check safedomain
            for (const safeItem of safeDomain) {
                if (tobeCheckedDomain.includes(safeItem)) {
                    safeFlag = true;
                    break;
                }
            }
            return safeFlag;
        };
        this.processUrl = (url) => {
            var _a, _b, _c;
            if (!url)
                return url;
            // Support Google Map, Youtube, Facebook and Vimeo now.
            const lowerUrl = url.toLowerCase();
            // Google Map
            // if(lowerUrl.indexOf('https://www.google.com/maps') > -1 || lowerUrl.indexOf('https://goo.gl/maps') > -1){//google map
            //   return url;
            // }
            // Vimeo
            if (/https:\/\/vimeo\.com\/.*/.test(lowerUrl)) {
                url = urlUtils.removeSearchFromUrl(url);
                const splits = url.split('/');
                const id = splits[splits.length - 1];
                return `https://player.vimeo.com/video/${id}`;
            }
            // Youtube
            if (/https:\/\/www\.youtube\.com\/watch\?.*v=.*/.test(lowerUrl)) {
                const queryObj = (_a = queryString.parseUrl(url)) === null || _a === void 0 ? void 0 : _a.query;
                const id = queryObj === null || queryObj === void 0 ? void 0 : queryObj.v;
                return `https://www.youtube.com/embed/${id}`;
            }
            else if (/https:\/\/youtu\.be\/.*/.test(lowerUrl)) {
                url = urlUtils.removeSearchFromUrl(url);
                const splits = url.split('/');
                const id = splits[splits.length - 1];
                return `https://www.youtube.com/embed/${id}`;
            }
            // Facebook video
            if (/https:\/\/www\.facebook\.com\/.*\/videos\/.*/.test(lowerUrl)) {
                return `https://www.facebook.com/plugins/video.php?href=${lowerUrl}&show_text=0`;
            }
            if (!this.checkURLFormat(url)) {
                url = 'about:blank';
            }
            // Check and replace the url to current user's org to avoid duplicate sign-in
            // This is the matching rule, and the target Domain contains these three types, which need to be replaced
            const matchedUrl = [
                '.maps.arcgis.com',
                '.mapsdevext.arcgis.com',
                '.mapsqa.arcgis.com'
            ];
            let tobeCheckedDomain = '';
            if (url.includes('https://')) {
                tobeCheckedDomain = url.substring(8).split('/')[0];
            }
            let matchFlag = false;
            let matchEnv = '';
            // Check domain
            for (const item of matchedUrl) {
                if (tobeCheckedDomain.includes(item)) {
                    matchFlag = true;
                    switch (item) {
                        case '.maps.arcgis.com':
                            matchEnv = 'prod';
                            break;
                        case '.mapsdevext.arcgis.com':
                            matchEnv = 'dev';
                            break;
                        case '.mapsqa.arcgis.com':
                            matchEnv = 'qa';
                            break;
                    }
                    break;
                }
            }
            const hostEnv = window.jimuConfig.hostEnv;
            if (matchFlag && matchEnv === hostEnv) {
                const appState = getAppStore().getState();
                if (appState && appState.user) {
                    const urlKey = (_b = appState === null || appState === void 0 ? void 0 : appState.portalSelf) === null || _b === void 0 ? void 0 : _b.urlKey;
                    const customBaseUrl = (_c = appState === null || appState === void 0 ? void 0 : appState.portalSelf) === null || _c === void 0 ? void 0 : _c.customBaseUrl;
                    if (tobeCheckedDomain && urlKey && customBaseUrl) {
                        url = url.replace(tobeCheckedDomain, `${urlKey}.${customBaseUrl}`);
                    }
                }
            }
            return url;
        };
        this.checkURLFormat = (str) => {
            if (!str || str === '') {
                this.setState({ errMessage: this.errMessages.unSupportUrl });
                return false;
            }
            if (str === 'about:blank') {
                return false;
            }
            const httpsRex = '^(([h][t]{2}[p][s])?://)';
            const re = new RegExp(httpsRex);
            if (!re.test(str)) {
                this.setState({ errMessage: this.errMessages.httpsCheck });
                return false;
            }
            // url of localhost works without '.'
            // eslint-disable-next-line
            const httpsLocalRex = new RegExp('^(([h][t]{2}[p][s])?://localhost)');
            if (httpsLocalRex.test(str)) {
                return true;
            }
            const index = str.indexOf('.');
            if (index < 0 || index === str.length - 1) {
                this.setState({ errMessage: this.errMessages.unSupportUrl });
                return false;
            }
            return true;
        };
        this.formatMessage = (id) => {
            return this.props.intl.formatMessage({
                id: id,
                defaultMessage: defaultMessages[id]
            });
        };
        this.fetchUrl = (fetchUrl, url) => __awaiter(this, void 0, void 0, function* () {
            const session = SessionManager.getInstance().getMainSession();
            const headers = {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            };
            const result = yield fetch(fetchUrl, {
                method: 'post',
                headers: headers,
                body: JSON.stringify({ token: session === null || session === void 0 ? void 0 : session.token, url })
            }).catch(err => {
                console.error(err);
            });
            if (!result)
                return Promise.resolve(null);
            const json = yield result.json().catch(err => {
                console.error(err);
            });
            return Promise.resolve(json);
        });
        this.reload = () => {
            const { config } = this.props;
            if (this.ifr) {
                if (config.embedType === EmbedType.Code) {
                    const srcDoc = this.ifr.srcdoc;
                    this.ifr.srcdoc = srcDoc;
                }
                else {
                    const src = this.ifr.src;
                    this.ifr.src = src;
                }
            }
        };
        this.loadContent = () => {
            const { config } = this.props;
            const { content } = this.state;
            const { embedType } = config;
            if (this.ifr) {
                if (embedType === EmbedType.Code) {
                    this.ifr.removeAttribute('src');
                    const docSafeString = `<script>
            if(window !== window.parent || window !== window.top){
              window.parent = undefined
              window.top = undefined
              document.cookie = undefined
              localStorage = undefined
              sessionStorage = undefined
            }
          </script>`;
                    this.ifr.srcdoc = `${docSafeString}${content}`;
                }
                else {
                    this.ifr.removeAttribute('srcdoc');
                    this.ifr.removeAttribute('src');
                    setTimeout(() => {
                        if (this.ifr)
                            this.ifr.src = this.processUrl(content);
                    }, 100);
                }
            }
        };
        this.onHtmlResolved = (url, hasExpression) => {
            this.setState({
                content: url,
                resolveErr: hasExpression
            });
        };
        const { config } = props;
        const { embedType, embedCode, expression } = config;
        this.errMessages = {
            httpsCheck: this.formatMessage('httpsUrlMessage'),
            unSupportUrl: this.formatMessage('unSupportUrl'),
            unSupportIframeUrl: this.formatMessage('unSupportIframeUrl')
        };
        this.checkUrl = this.checkUrl.bind(this);
        const state = {
            content: embedType === EmbedType.Url
                ? expression
                : embedCode,
            isLoading: false,
            loadErr: false,
            resolveErr: false,
            errMessage: '',
            codeLimitExceeded: false
        };
        this.state = state;
        this.shouldRenderIframeInView = false;
    }
    componentDidMount() {
        const { config } = this.props;
        const { content } = this.state;
        if (content && content.trim().length > 0) {
            this.setState({ isLoading: true }, () => {
                // In the first load, resolving the URL is incomplete, after resolved, it is loaded via didUpdate
                // In code type, we can loadContent directly
                if (config.embedType === EmbedType.Code) {
                    this.loadContent();
                }
            });
        }
    }
    componentDidUpdate(preProps, preStates) {
        var _a, _b;
        const { content } = this.state;
        const { content: oldContent } = preStates;
        const { appMode, config, id } = this.props;
        const { embedCode, embedType, autoRefresh, autoInterval, expression } = config;
        const { config: preConfig, appMode: preAppMode, sectionNavInfos: preSectionNavInfos } = preProps;
        const { autoRefresh: preAutoRefresh, autoInterval: preAutoInterval, embedType: preEmbedType } = preConfig;
        const autoConfChange = autoRefresh !== preAutoRefresh || autoInterval !== preAutoInterval;
        const codeLimitExceeded = ((_b = (_a = this.props) === null || _a === void 0 ? void 0 : _a.stateProps) === null || _b === void 0 ? void 0 : _b.codeLimitExceeded) || false;
        this.setState({ codeLimitExceeded });
        if ((appMode !== preAppMode && appMode === AppMode.Design) || autoConfChange) {
            this.reload();
        }
        // embedType change
        if (embedType !== preEmbedType) {
            const reuseContent = embedType === EmbedType.Url
                ? expression
                : embedCode;
            this.setState({
                loadErr: false,
                resolveErr: false,
                codeLimitExceeded: false,
                content: reuseContent
            });
            this.props.dispatch(appActions.widgetStatePropChange(id, 'codeLimitExceeded', false));
        }
        else {
            if (embedType === EmbedType.Code) {
                if (preConfig.embedCode !== embedCode) {
                    this.setState({
                        content: embedCode
                    });
                }
            }
        }
        if (content !== oldContent) {
            this.setState({
                isLoading: !!content,
                loadErr: false
            }, () => {
                this.checkAndLoadByType();
            });
        }
        // Current section change reload embed
        this.reloadContentInView(preSectionNavInfos);
        // Auto refresh setting
        this.autoRefreshHandler(autoConfChange);
    }
    checkUrl(url) {
        var _a, _b, _c;
        if (!this.checkURLFormat(url)) {
            this.setState({ loadErr: true });
            return Promise.resolve(false);
        }
        else {
            this.setState({ loadErr: false });
        }
        const appMode = (_c = (_b = (_a = getAppStore()) === null || _a === void 0 ? void 0 : _a.getState()) === null || _b === void 0 ? void 0 : _b.appRuntimeInfo) === null || _c === void 0 ? void 0 : _c.appMode;
        if (!window.jimuConfig.isInBuilder ||
            appMode === AppMode.Run ||
            window.jimuConfig.isInPortal) {
            return Promise.resolve(true);
        }
        // Specially supported urls that do not require fetchUrl
        const supportUrls = [
            'https://www.facebook.com/plugins/video.php?show_text=0&href=',
            'https://www.youtube.com/embed/',
            'https://www.youtube-nocookie.com/embed/',
            'https://player.vimeo.com/video/'
        ];
        if (supportUrls.some(supportUrl => url.includes(supportUrl))) {
            this.setState({ loadErr: false });
            return Promise.resolve(true);
        }
        // dev edition, still use the existing Node server API
        if (window.jimuConfig.isDevEdition) {
            return this.fetchUrl(`${window.location.origin}/rest/check_url`, url).then(res => {
                var _a, _b, _c;
                let canLoadUrl = true;
                if (res && res.success) {
                    const data = res.data;
                    const status = data === null || data === void 0 ? void 0 : data.status;
                    const cspForbid = ['default-src "self"', 'frame-ancestors "none"'];
                    const checkCsp = (csp) => {
                        let embedForbidden = false;
                        cspForbid.forEach(rule => {
                            if (csp.indexOf(rule) > 0) {
                                embedForbidden = true;
                            }
                        });
                        return embedForbidden;
                    };
                    if (status && status < 400) {
                        const contentSecurityPolicy = (_a = data === null || data === void 0 ? void 0 : data.headers) === null || _a === void 0 ? void 0 : _a['content-security-policy'];
                        const cspClose = contentSecurityPolicy && checkCsp(contentSecurityPolicy);
                        if (cspClose) {
                            canLoadUrl = false;
                        }
                        const xFrameOptions = (_c = (_b = data === null || data === void 0 ? void 0 : data.headers) === null || _b === void 0 ? void 0 : _b['x-frame-options']) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                        if (xFrameOptions) {
                            if (xFrameOptions === 'deny') {
                                canLoadUrl = false;
                            }
                            else if (xFrameOptions === 'sameorigin') {
                                if (!this.isOriginSameAsLocation(url)) {
                                    canLoadUrl = false;
                                }
                            }
                        }
                    }
                    else {
                        canLoadUrl = false;
                    }
                }
                else {
                    canLoadUrl = false;
                }
                const alterState = {
                    loadErr: !canLoadUrl
                };
                let fetchSuccess = true;
                if (!canLoadUrl) {
                    alterState.isLoading = false;
                    alterState.errMessage = this.errMessages.unSupportIframeUrl;
                    fetchSuccess = false;
                }
                this.setState(alterState);
                return Promise.resolve(fetchSuccess);
            });
        }
        else {
            const portalUrl = getAppStore().getState().portalUrl;
            const platformUrl = portalUrlUtils.getPlatformUrlByOrgUrl(portalUrl);
            const checker = `${platformUrl}/sharing/checkUrl.jsp?url=`;
            return fetch(`${checker}${url}`).then(result => result.json()).then(res => {
                var _a;
                let canLoadUrl = true;
                const { success, httpStatusCode, httpHeaders } = res;
                if (success !== false) {
                    const cspForbid = ['default-src "self"', 'frame-ancestors "none"'];
                    const checkCsp = (csp) => {
                        let embedForbidden = false;
                        cspForbid.forEach(rule => {
                            if (csp.indexOf(rule) > 0) {
                                embedForbidden = true;
                            }
                        });
                        return embedForbidden;
                    };
                    if (httpStatusCode && httpStatusCode < 400) {
                        const contentSecurityPolicy = httpHeaders === null || httpHeaders === void 0 ? void 0 : httpHeaders.contentSecurityPolicy;
                        const cspClose = contentSecurityPolicy && checkCsp(contentSecurityPolicy);
                        if (cspClose) {
                            canLoadUrl = false;
                        }
                        const xFrameOptions = (_a = httpHeaders === null || httpHeaders === void 0 ? void 0 : httpHeaders.xFrameOptions) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                        if (xFrameOptions) {
                            if (xFrameOptions === 'deny') {
                                canLoadUrl = false;
                            }
                            else if (xFrameOptions === 'sameorigin') {
                                if (!this.isOriginSameAsLocation(url)) {
                                    canLoadUrl = false;
                                }
                            }
                        }
                    }
                    else {
                        canLoadUrl = false;
                    }
                }
                else {
                    canLoadUrl = false;
                }
                const alterState = {
                    loadErr: !canLoadUrl
                };
                let fetchSuccess = true;
                if (!canLoadUrl) {
                    alterState.isLoading = false;
                    alterState.errMessage = this.errMessages.unSupportIframeUrl;
                    fetchSuccess = false;
                }
                this.setState(alterState);
                return Promise.resolve(fetchSuccess);
            });
        }
    }
    isOriginSameAsLocation(url) {
        // Domains under *.arcgis.com or *.esri.com, should be considered as the same origin.
        const safeDomainArray = ['.arcgis.com', '.esri.com'];
        const pageLocation = window.location;
        const URL_HOST_PATTERN = /(\w+:)?(?:\/\/)([\w.-]+)?(?::(\d+))?\/?/;
        const urlMatch = URL_HOST_PATTERN.exec(url) || [];
        const urlparts = {
            protocol: urlMatch[1] || '',
            host: urlMatch[2] || '',
            port: urlMatch[3] || ''
        };
        // Check safedomain
        let safeDomain = '';
        for (const safeItem of safeDomainArray) {
            if (pageLocation.host.includes(safeItem)) {
                safeDomain = safeItem;
                break;
            }
        }
        if (urlMatch[2].includes(safeDomain)) {
            return true;
        }
        const defaultPort = protocol => {
            return { 'http:': 80, 'https:': 443 }[protocol];
        };
        const portOf = location => {
            return (location.port || defaultPort(location.protocol || pageLocation.protocol));
        };
        return !!(urlparts.protocol &&
            urlparts.protocol === pageLocation.protocol &&
            urlparts.host &&
            urlparts.host === pageLocation.host &&
            urlparts.host &&
            portOf(urlparts) === portOf(pageLocation));
    }
    render() {
        const { isLoading, loadErr, errMessage, resolveErr, content, codeLimitExceeded } = this.state;
        const { theme, id, config } = this.props;
        const { embedCode, embedType, expression, enableLabel, label } = config;
        // the expression value will be '<p><br></p>' after the input is cleared
        const showPlaceholder = embedType === EmbedType.Code
            ? !embedCode
            : (!expression || expression === '<p><br></p>' || expression === '<p></p>');
        if (showPlaceholder) {
            return (jsx(Fragment, null,
                jsx(WidgetPlaceholder, { widgetId: this.props.id, icon: embedIcon, message: this.formatMessage('embedHint') }),
                codeLimitExceeded &&
                    jsx("div", { className: 'p-2 w-100', style: { position: 'absolute', bottom: 0 } },
                        jsx(Alert, { withIcon: true, size: 'small', type: 'warning', text: this.formatMessage('maxLimitTips'), className: 'w-100' }))));
        }
        let withSandbox = true;
        if (embedType === EmbedType.Url) {
            withSandbox = !this.checkSafeDomain(this.processUrl(content));
        }
        return (jsx(ViewVisibilityContext.Consumer, null, ({ isInView, isInCurrentView }) => {
            let embedLoad = true;
            if (!this.shouldRenderIframeInView) {
                embedLoad = isInView ? isInCurrentView : true;
                if (embedLoad)
                    this.shouldRenderIframeInView = true;
            }
            this.needLoadContentInView = isInView && isInCurrentView;
            return jsx(Fragment, null, embedLoad &&
                jsx("div", { className: "jimu-widget widget-embed", css: getStyle(theme) },
                    withSandbox
                        ? jsx("iframe", { id: "ifrSandbox", className: `iframe-${id} w-100 h-100`, sandbox: "allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-popups-to-escape-sandbox", allowFullScreen: true, onLoad: this.iframeOnLoad, frameBorder: "0", ref: (f) => { this.ifr = f; }, allow: "geolocation", "data-testid": "embedSandbox" })
                        : jsx("iframe", { id: "ifrSafe", className: `iframe-${id} w-100 h-100`, allowFullScreen: true, onLoad: this.iframeOnLoad, frameBorder: "0", ref: (f) => { this.ifr = f; }, allow: "geolocation", "data-testid": "embedSafe" }),
                    isLoading && jsx("div", { className: 'jimu-secondary-loading' }),
                    loadErr &&
                        jsx("div", { className: 'mask text-center load-err-mask' },
                            jsx("div", { className: 'mask-content' },
                                jsx(AlertButton, { buttonType: 'tertiary', size: 'small', type: 'warning' }),
                                errMessage)),
                    resolveErr &&
                        jsx("div", { "data-testid": 'test-expressionMask', className: "mask text-center load-err-mask" },
                            jsx("div", { className: classNames('mask-content', { 'truncate-two': !(enableLabel && label) }), style: { width: '70%' }, title: (enableLabel && label) || content }, (enableLabel && label) || content)),
                    embedType === EmbedType.Url &&
                        jsx(DynamicUrlResolver, { widgetId: id, useDataSources: this.props.useDataSources, value: config.expression, onHtmlResolved: this.onHtmlResolved }),
                    codeLimitExceeded &&
                        jsx("div", { className: 'bottom-alert p-2 w-100' },
                            jsx(Alert, { withIcon: true, size: 'small', type: 'warning', text: this.formatMessage('maxLimitTips'), className: 'w-100' }))));
        }));
    }
}
Widget.versionManager = versionManager;
Widget.mapExtraStateProps = (state, props) => {
    var _a, _b;
    return {
        appMode: (_a = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _a === void 0 ? void 0 : _a.appMode,
        sectionNavInfos: (_b = state === null || state === void 0 ? void 0 : state.appRuntimeInfo) === null || _b === void 0 ? void 0 : _b.sectionNavInfos
    };
};
//# sourceMappingURL=widget.js.map