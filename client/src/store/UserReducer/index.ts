const initialState = {
    // 用户手机号
    phone: '12345678901',
    // 用户token
    token: '',
    // 用户姓名
    username: '燃脂每一天'
};
export default function(state = initialState, action: { type: string; payload: any }) {
    switch(action.type) {
        case 'userInfo/setUserInfo':
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};