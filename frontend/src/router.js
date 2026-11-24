import {Dashboard} from "./components/dashboard.js";
import {Login} from "./components/auth/login.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Sidebar} from "./components/auth/sidebar.js";
import {Incomes} from "./components/incomes/incomes.js";
import {IncomesCreate} from "./components/incomes/incomes-create.js";
import {IncomesEdit} from "./components/incomes/incomes-edit.js";
import {Expenses} from "./components/expenses/expenses.js";
import {ExpensesCreate} from "./components/expenses/expenses-create.js";
import {ExpensesEdit} from "./components/expenses/expenses-edit.js";
import {Balances} from "./components/balances/balances.js";
import {BalancesCreate} from "./components/balances/balances-create.js";
import {BalancesEdit} from "./components/balances/balances-edit.js";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');

        this.initEvents();

        this.routes = [
            {
                route: '#/',
                title: 'Дашборд',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Dashboard();
                },
            },
            {
                route: '#/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,

            },
            {
                route: '#/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login();
                },
            },
            {
                route: '#/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp();
                },
            },
            {
                route: '#/sidebar',
                filePathTemplate: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                },
            },
            {
                route: '#/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/incomes/incomes.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Incomes();
                },
            },
            {
                route: '#/incomes/create',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/pages/incomes/create.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new IncomesCreate();
                },
            },
            {
                route: '#/incomes/edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/pages/incomes/edit.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new IncomesEdit();
                },
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/expenses.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Expenses();
                },
            },
            {
                route: '#/expenses/create',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new ExpensesCreate();
                },
            },
            {
                route: '#/expenses/edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new ExpensesEdit();
                },
            },
            {
                route: '#/balances',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/balances/balances.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Balances();
                },
            },
            {
                route: '#/balances/create',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/pages/balances/create.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new BalancesCreate();
                },
            },
            {
                route: '#/balances/edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/pages/balances/edit.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new BalancesEdit();
                },
            },
            {
                route: '#/dashboard',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/sidebar.html',
                load: () => {
                    new Sidebar();
                    new Dashboard();
                },
            },
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('hashchange', this.activateRoute.bind(this));
    }

    async activateRoute() {
        const urlRoute = window.location.hash || '#/';
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }
            if (newRoute.filePathTemplate) {
                const contentElement = document.getElementById('content');

                if (newRoute.useLayout) {
                    // Загружаем layout (сайдбар) в #content
                    contentElement.innerHTML =
                        await fetch(newRoute.useLayout)
                            .then(response => response.text());
                    //  Внутрь layout кладём страницу
                    const layoutContent = document.getElementById('content-layout');
                    if (layoutContent) {
                        layoutContent.innerHTML = await
                            fetch(newRoute.filePathTemplate)
                                .then(response => response.text());
                    }
                } else {
                    // Без layout — просто вставляем страницу в #content
                    contentElement.innerHTML = await fetch(newRoute.filePathTemplate)
                        .then(response => response.text());
                }

            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            window.location.hash = '#/404';
            console.log('No route found');
        }
    }
}