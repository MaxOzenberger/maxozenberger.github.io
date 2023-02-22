export var OrientedImageryActions;
(function (OrientedImageryActions) {
    OrientedImageryActions["BtnClickAction"] = "Click_Btn_Active";
    OrientedImageryActions["OICSelectAction"] = "OIC_Loaded";
    OrientedImageryActions["APILoadAction"] = "API_Loaded";
})(OrientedImageryActions || (OrientedImageryActions = {}));
export default class OIReduxStore {
    constructor() {
        this.id = 'oi-redux-store';
    }
    getActions() {
        return Object.keys(OrientedImageryActions).map(k => OrientedImageryActions[k]);
    }
    getInitLocalState() {
        return {
            pointBool: true,
            oic: null,
            oiApiLoaded: false
        };
    }
    getReducer() {
        return (localState, action, appState) => {
            switch (action.type) {
                case OrientedImageryActions.BtnClickAction:
                    return localState.set('pointBool', action.val);
                case OrientedImageryActions.OICSelectAction:
                    return localState.set('oic', action.val);
                case OrientedImageryActions.APILoadAction:
                    return localState.set('oiApiLoaded', action.val);
                default:
                    return localState;
            }
        };
    }
    getStoreKey() {
        return 'widget_orientedimagery';
    }
}
//# sourceMappingURL=oi-store.js.map