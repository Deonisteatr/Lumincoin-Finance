import config from "../../config/config.js";

export class AuthUtils {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfoTokenKey = 'userInfo';

    // Записать токены и userInfo в localStorage
    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, userInfo);
        }
    }

    // Удалить токены и userInfo из localStorage
    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    // Получить токены и userInfo из localStorage
    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key)
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }

    //Функция для запроса на обновление токена
    static async updateRefreshToken() {
        let result = false; //флаг по умолчанию
        const refreshToken = this.getAuthInfo(this.refreshTokenKey);
        //Проверяем наличие рефрештокена
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken}),
            });
            if (response && response.status === 200) {
                const tokens = await response.json();
                if (tokens && !tokens.error) {
                    this.setAuthInfo(tokens.accessToken, tokens.refreshToken)
                    // || this.setAuthInfo(tokens.tokens?.accessToken, tokens.tokens?.refreshToken);
                    result = true;
                }
            }
            if (!result) {
                this.removeAuthInfo();
            }
        }
        return result;
    }
}