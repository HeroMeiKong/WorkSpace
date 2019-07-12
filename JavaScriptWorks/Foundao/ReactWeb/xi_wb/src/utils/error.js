import {Message} from 'element-react';


var Error = {
    receive(code) {
        switch (parseInt(code)) {
            case -1001:
                //超时
                if(localStorage.x_token){
                    localStorage.removeItem('x_token');
                }else {
                    localStorage.removeItem('x_sid');
                }

                window.location.href = '/user/login';
                return false
            case -3001:
                //超时
                Message('您已被冻结');
                localStorage.removeItem('x_token');
                window.location.href = '/user/login';
                return false
            default :
                return true
        }
    }
}

export default Error;