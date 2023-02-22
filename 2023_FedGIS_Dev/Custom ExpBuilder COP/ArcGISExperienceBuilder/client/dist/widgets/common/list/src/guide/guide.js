import { React, utils, i18n, getAppStore, appActions } from 'jimu-core';
import { Guide, EVENTS } from 'jimu-ui/basic/guide';
import defaultMessages from '../runtime/translations/default';
import { defaultMessages as jimuUIDefaultMessages } from 'jimu-ui';
const { useState, useEffect, useMemo } = React;
const MESSAGES = Object.assign({}, defaultMessages, jimuUIDefaultMessages);
const WidgetGuide = (props) => {
    var _a;
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState((_a = props.stepIndex) !== null && _a !== void 0 ? _a : 0);
    const stepsJson = useMemo(() => {
        var _a, _b;
        const stepsSrc = require('./steps.json');
        if (((_b = (_a = props.widgetJson) === null || _a === void 0 ? void 0 : _a.manifest) === null || _b === void 0 ? void 0 : _b.name) === 'list') {
            return utils.replaceI18nPlaceholdersInObject(stepsSrc, i18n.getIntl(props.widgetJson.id), MESSAGES);
        }
        return stepsSrc;
    }, [props.widgetJson]);
    const onStepClick = (e, step, index) => {
        if (index === 1) { // template step
            if (e === null || e === void 0 ? void 0 : e.target.classList.contains('btn-primary')) {
                setStepIndex(index + 1);
            }
        }
        else { // other steps
            setStepIndex(index + 1);
        }
    };
    const onStepChange = (data) => {
        const { nextIndex, step, event } = data;
        if (nextIndex === 1) {
            getAppStore().dispatch(appActions.widgetStatePropChange('right-sidebar', 'collapse', true));
        }
        else if ([5, 6, 7].includes(nextIndex) && event === EVENTS.STEP_BEFORE) {
            const settingContainerElm = document.querySelector('.jimu-widget-list-setting');
            const targetElm = document.querySelector(step === null || step === void 0 ? void 0 : step.target);
            if (settingContainerElm && targetElm) {
                const scrollTop = targetElm.getBoundingClientRect().top - settingContainerElm.getBoundingClientRect().top;
                settingContainerElm === null || settingContainerElm === void 0 ? void 0 : settingContainerElm.scrollTo({ top: scrollTop > 0 ? scrollTop : 0 });
            }
        }
        props === null || props === void 0 ? void 0 : props.onStepChange(data);
    };
    useEffect(() => {
        setRun(props.run);
    }, [props.run]);
    useEffect(() => {
        setStepIndex(props.stepIndex);
    }, [props.stepIndex]);
    return (React.createElement(Guide, Object.assign({}, props, { run: run, stepIndex: stepIndex, steps: stepsJson.steps, onStepChange: onStepChange, onActionClick: onStepClick })));
};
export default WidgetGuide;
//# sourceMappingURL=guide.js.map