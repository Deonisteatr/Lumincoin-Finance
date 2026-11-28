import {HttpUtils} from "../../utils/http-utils.js";
import {AuthUtils} from "../../utils/auth-utils.js";
import config from "../../../config/config.js";

export class Login {
    constructor() {

        // Если клиент уже залогинился переводим его на главную страницу
        // (чтобы зарегистрироваться нужно выйти из системы)
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return location.hash = '#/';
        }


        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.emailErrorElement = document.getElementById('email-error');
        this.passwordErrorElement = document.getElementById('password-error');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');

        document.getElementById('process-button')
            .addEventListener('click', this.login.bind(this));
    }

    validateForm() {
        let isValid = true;

        // email
        if (this.emailElement.value &&
            this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
            this.emailErrorElement.classList.remove('d-block');
        } else {
            this.emailElement.classList.add('is-invalid');
            this.emailErrorElement.classList.add('d-block');
            isValid = false;
        }
        // password
        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordErrorElement.classList.remove('d-block');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordErrorElement.classList.add('d-block');
            isValid = false;
        }
        return isValid;
    }

    async login() {
        this.commonErrorElement.classList.remove('d-block');
        if (!this.validateForm()) {
            return;
        }

        const result = await HttpUtils.request('/login', 'POST', {
            email: this.emailElement.value,
            password: this.passwordElement.value,
            rememberMe: this.rememberMeElement.checked,
        });

        if (!result || !result.response || (result.response && (!result.response.tokens.accessToken ||
            !result.response.tokens.refreshToken || !result.response.user ||
            !result.response.user.id || !result.response.user.name || !result.response.user.lastName)) ) {
            this.commonErrorElement.classList.add('d-block');
            return;
        }

        // сохранить токены и userInfo
        AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, JSON.stringify({
            id: result.response.user.id,
            name: result.response.user.name,
            lastName: result.response.user.lastName,
        }))
        location.hash = '#/dashboard';
    }
}