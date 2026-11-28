import {AuthUtils} from "../../utils/auth-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class SignUp {
    constructor() {

        // Если клиент уже залогинился переводим его на главную страницу
        // (чтобы зарегистрироваться нужно выйти из системы)
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return location.hash = '#/';
        }

        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.nameErrorElement = document.getElementById('name-error');
        this.lastNameErrorElement = document.getElementById('last-name-error');
        this.emailErrorElement = document.getElementById('email-error');
        this.passwordErrorElement = document.getElementById('password-error');
        this.passwordRepeatErrorElement = document.getElementById('password-repeat-error');
        this.commonErrorElement = document.getElementById('common-error');
        this.rememberMeElement = document.getElementById('remember-me');

        document.getElementById('process-button')
            .addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid = true;

        // name
        if (this.nameElement.value &&
            this.nameElement.value.match(/^[А-Я][а-я]+\s*$/)) {
            this.nameElement.classList.remove('is-invalid');
            this.nameErrorElement.classList.remove('d-block');
        } else {
            this.nameElement.classList.add('is-invalid');
            this.nameErrorElement.classList.add('d-block');
            isValid = false;
        }
        // last-name
        if (this.lastNameElement.value &&
            this.lastNameElement.value.match(/^[А-Я][а-я]+\s*$/)) {
            this.lastNameElement.classList.remove('is-invalid');
            this.lastNameErrorElement.classList.remove('d-block');
        } else {
            this.lastNameElement.classList.add('is-invalid');
            this.lastNameErrorElement.classList.add('d-block');
            isValid = false;
        }
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
        if (this.passwordElement.value &&
            this.passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z_@$-.,\d]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
            this.passwordErrorElement.classList.remove('d-block');
        } else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordErrorElement.classList.add('d-block');
            isValid = false;
        }
        // password-repeat
        if (this.passwordRepeatElement.value &&
            this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.passwordRepeatErrorElement.classList.remove('d-block');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            this.passwordRepeatErrorElement.classList.add('d-block');
            isValid = false;
        }
        return isValid;
    }

    async signUp() {
        this.commonErrorElement.classList.remove('d-block');
        if (!this.validateForm()) {
            return;
        }

        // 1. Регистрация
        const signUpResult = await HttpUtils.request('/signup', 'POST', {
            name: this.nameElement.value.trim(),
            lastName: this.lastNameElement.value.trim(),
            email: this.emailElement.value.trim(),
            password: this.passwordElement.value,
            passwordRepeat: this.passwordRepeatElement.value,
        });

        if (signUpResult.error || !signUpResult.response?.user?.id ||
            !signUpResult.response?.user?.email || !signUpResult.response?.user?.name
            || !signUpResult.response?.user?.lastName) {
            this.commonErrorElement.classList.add('d-block');
            return;
        }

        // 2. Сразу логинимся и получаем токены
        const loginResult = await HttpUtils.request('/login', 'POST', {
            email: this.emailElement.value.trim(),
            password: this.passwordElement.value,
            rememberMe: false,
        });

        if (loginResult.error ||
            !loginResult.response.tokens?.accessToken ||
            !loginResult.response.tokens?.refreshToken) {
            // регистрация прошла, но войти не удалось - перекидываем на страницу логина
            location.hash = '#/login';
            return;
        }

        // 3. Сохраняем токены и данные user
        AuthUtils.setAuthInfo(
            loginResult.response.tokens.accessToken,
            loginResult.response.tokens.refreshToken,
            JSON.stringify({
                id: loginResult.response.user.id,
                name: loginResult.response.user.name,
                lastName: loginResult.response.user.lastName
            })
        );

        location.hash = '#/';
    }
}