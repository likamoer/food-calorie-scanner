let baseUrl = window.location.origin

export const registryUserInfo = async function (params: {
    username: string,
    password: string,
    phone: string,
}) {
    const { username, password, phone } = params
    const res = await fetch(`${baseUrl}/api/users/create`, {
        method: 'POST',
        body: JSON.stringify({
            username,
            password,
            phoneNumber: phone,
        })
    })
    console.log('注册的结果:', res);
}