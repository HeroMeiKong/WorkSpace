const REFRESH_ADMIN = 'REFRESH_ADMIN';

const defaultState = {
    // 'from': Config.FROM.NONE,
    // 'shanghe_openid': 'visitor' + Date.now() + Tool.RandomNum(1, 10000000000),
    // 'shanghe_nickname': '游客',
    // 'shanghe_avatar': 'http://cdn-live.foundao.com/pgcsystem/activity/template/img/visit_head.png',
    // 'shanghe_sex': 2,
    // 'shanghe_isVisitor': 1,
    // 'shanghe_authsign': 'NmQ3MHNmOWhLTVgxRmFRV3VxNkpzZXpWYzZMcWRSN1NGTVhveVJoZnVSamk3TmVuMTQ1TFNBVVdLWVdNK215eVRzRFhWV1NZQVMvaGhtaFhzS2d2YkF5a3haZllHaXAxQXNQWjMvQWw3TmhFN3lJTFZqZVJVWHlHazYraEJPM0JoYjZSdTB3V0JnVFh0L0JYK3BPY1FiTStqKzZwek8rWDJ1bWovQWR4b0RsVG1OQjUzaVRWTFg4dTBMZ0FBSURCbzhSNmhZUElZWXk2ZWlVZWdPNVdqRjVKT2tidlpsUWEvWjVYcCtQNmQ4UWVvUWtxNmY2ek1XMGd0L08yQ2ZF',
    onlyShow: false,
    picPreview_url: '',
    hideVideo: false,
    hideScroll: false,
};

export default function reduce(state = defaultState, action = {}) {
    switch (action.type) {
        case REFRESH_ADMIN:
            return {...state, ...action.data}
        default :
            return state
    }
}

export const refresh_admin = (data) => {
    return {
        type: REFRESH_ADMIN,
        data
    }
}