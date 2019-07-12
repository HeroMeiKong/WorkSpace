import React, {Component} from 'react';
// import Tool from './../../utils/tool';

class Return extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        // var parmas = Tool.getRequest();
        // console.log(parmas);
        window.open('','_self','');
        window.close();
    }

    render() {
        return (
            <div className=""></div>
        );
    }
}

export default Return;