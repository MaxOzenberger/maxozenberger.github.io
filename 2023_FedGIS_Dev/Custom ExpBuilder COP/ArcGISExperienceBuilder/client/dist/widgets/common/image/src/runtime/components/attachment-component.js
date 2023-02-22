import { React } from 'jimu-core';
export class AttachmentComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.dataSources = null;
        this.__unmount = false;
        this.isLoading = false;
        this.resolveExpressions = (record) => {
            if (record) {
                const dataRecord = record;
                this.isLoading = true;
                dataRecord && dataRecord.queryAttachments && dataRecord.queryAttachments(this.props.attachmentTypes).then((attachmentInfos) => {
                    if (this.isLoading) {
                        this.isLoading = false;
                        this.setState({
                            attachmentInfos: attachmentInfos
                        });
                    }
                }, () => {
                    this.isLoading = false;
                });
            }
            else {
                this.isLoading = false;
                this.setState({
                    attachmentInfos: null
                });
            }
        };
        /**
         * Determine if an object is equivalent with another, not recursively.
         */
        this.shallowEquals = (obj1, obj2) => {
            if (!obj1 && !obj2) {
                return true;
            }
            else if (obj1 && obj2) {
                if (Object.keys(obj1).length !== Object.keys(obj2).length) {
                    return false;
                }
                else {
                    return !Object.keys(obj1).some(key => obj1[key] !== obj2[key]);
                }
            }
            else {
                return false;
            }
        };
        this.state = {
            attachmentInfos: null
        };
    }
    componentDidMount() {
        this.__unmount = false;
        this.resolveExpressions(this.props.record);
    }
    componentWillUnmount() {
        this.__unmount = true;
        this.props.unmountAttachmentInfosChange && this.props.unmountAttachmentInfosChange();
    }
    componentDidUpdate(prevProps, prevState) {
        if (!this.shallowEquals(this.props.record, prevProps.record)) {
            this.resolveExpressions(this.props.record);
        }
        if (prevState.attachmentInfos !== this.state.attachmentInfos) {
            this.props.onChange && this.props.onChange(this.state.attachmentInfos);
        }
    }
    render() {
        return null;
    }
}
//# sourceMappingURL=attachment-component.js.map