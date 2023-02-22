import { React } from 'jimu-core';
const Widget = (props) => {
    return (React.createElement("div", { className: "widget-demo jimu-widget m-2" },
        React.createElement("p", null, "Simple Widget"),
        React.createElement("p", null,
            "exampleConfigProperty: ",
            props.config.exampleConfigProperty)));
};
export default Widget;
//# sourceMappingURL=widget.js.map