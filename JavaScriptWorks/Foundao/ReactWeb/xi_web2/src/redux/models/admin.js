import CONST from './../../config/const';
import tool from './../../utils/tool';
import Tool from '@/utils/tool';
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const REFRESH_ADMIN = 'REFRESH_ADMIN';
const IS_MULI_VIP = 'IS_MULI_VIP';
const NOT_MULI_VIP = 'NOT_MULI_VIP';
const IS_REMOVE_VIP = 'IS_REMOVE_VIP';
const NOT_REMOVE_VIP = 'NOT_REMOVE_VIP';
const SHOW_LAODING = 'SHOW_LOADING';
const HIDE_LOADING = 'HIDE_LOADING';

//国外  enjoycut.com
//国内  enjoycut.cn
var foreign = false;
var language = CONST.LANGUAGE.ZH;
if (tool.isForeign()) {
    foreign = true;
    language = CONST.LANGUAGE.EN
}


const defaultState = {
    isForeign: foreign,
    isLogin: false,
    language: language,
    sid: '',
    isMuliVip: false,//是否是多段拼接会员
    isRemoveVip:false,//是否是去水印会员
    loading: 0,//>0时显示加载loading
};


export default function reduce(state = defaultState, action = {}) {
    switch (action.type) {
        case LOGIN :
            if (action.data.vip_expire_in < Date.parse(new Date()) / 1000) {
                action.data.vip_type = 0;
            }
            // console.log({...action.data},'12333')
          Tool.setUserData_storage(JSON.stringify({...action.data}))
          // state.isForeign ? localStorage.setItem('XI_U_F', JSON.stringify({...action.data})) : localStorage.setItem('XI_U', JSON.stringify({...action.data}))
            return {...state, ...action.data, isLogin: true};
        case LOGOUT :
            state.isForeign ? localStorage.removeItem('XI_U_F') : localStorage.removeItem('XI_U')
            Tool.delCookie(state.isForeign?'XI_U_F':'XI_U');
            return {...state, ...action.data, isLogin: false};
        case REFRESH_ADMIN :
            return {...state, ...action.data};
        case IS_MULI_VIP :
            return {...state, ...action.data, isMuliVip: true};
        case NOT_MULI_VIP :
            return {...state, ...action.data, isMuliVip: false};
        case IS_REMOVE_VIP :
          return {...state, ...action.data, isRemoveVip: true};
        case NOT_REMOVE_VIP :
          return {...state, ...action.data, isRemoveVip: false};
        case SHOW_LAODING :
            return {...state, loading: state.loading + 1};
        case HIDE_LOADING :
            return {...state, loading: state.loading - 1};
        default :
            return state
    }
}

export const login = (userInfo) => {
    window.is_expired = false; // 重置登录过期状态为 未过期
    return {
        type: LOGIN,
        data: userInfo,
    }
};

export const logout = (userInfo) => {
    return {
        type: LOGOUT,
        // data: userInfo,
        data: {},
    }
};

export const refresh_admin = (userInfo) => {
    return {
        type: REFRESH_ADMIN,
        data: userInfo,
    }
};
export const is_muli_vip = (userInfo) => {
    return {
        type: IS_MULI_VIP,
        // data: userInfo,
    }
};
export const not_muli_vip = (userInfo) => {
    return {
        type: NOT_MULI_VIP,
        // data: userInfo,
    }
};
export const is_remove_vip = (userInfo) => {
  return {
    type: IS_REMOVE_VIP,
    // data: userInfo,
  }
};
export const not_remove_vip = (userInfo) => {
  return {
    type: NOT_REMOVE_VIP,
    // data: userInfo,
  }
};
export const show_loading = () => {
    return {
        type: SHOW_LAODING,
        data: {},
    }
};
export const hide_loading = () => {
    return {
        type: HIDE_LOADING,
        data: {},
    }
};