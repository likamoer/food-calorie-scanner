const initialState = {
    // 用户手机号
    phoneNumber: '',
    // 用户token
    token: '',
    // 用户姓名
    username: ''
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