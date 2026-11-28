import {AuthUtils} from "../utils/auth-utils.js";
import {HttpUtils} from "../utils/http-utils.js";

export class Logout {
    constructor() {
        if (!localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
            return location.hash = '#/sign-up';
        }

        this.logout().then();
    }

    async logout() {
         await HttpUtils.request('/logout', 'POST', {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
        });

        AuthUtils.removeAuthInfo();
        location.hash = '#/login';
    }
}