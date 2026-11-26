export class Sidebar {
    constructor() {

        this.initCategoriesToggle();
        this.initMobilSidebar();
        this.setActiveSidebarLink()
    }

    // Переключатель категорий
    initCategoriesToggle() {
        const categoriesLink = document.querySelector('.categories-link');
        if (!categoriesLink) return;

        const parentItem = categoriesLink.closest('.nav-item');
        if (!parentItem) return;

        categoriesLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            parentItem.classList.toggle('menu-open');
        });
    }
    // Функция переключения класса "active" по ссылкам
    setActiveSidebarLink () {
        const currentHash = window.location.hash || '#/';

        // Снимаем active и menu-open со всего
        document.querySelectorAll('.app-sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelectorAll('.app-sidebar .nav-item.menu-open').forEach(item => {
            item.classList.remove('menu-open');
        });

        let activeLink = null;

        document.querySelectorAll('.app-sidebar .nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href === 'javascript:void(0)') return;

            if (href === currentHash ||
                (href !== '#/' && currentHash.startsWith(href + '/'))) {
                activeLink = link;
            }
        });

        // Главная
        if (!activeLink && (currentHash === '#/' || currentHash === '#/dashboard')) {
            activeLink = document.querySelector('.app-sidebar a[href="#/"]') ||
            document.querySelector('.app-sidebar a[href="#/dashboard"]');
        }

        if (activeLink) {
            activeLink.classList.add('active');

            // Если пункт внутри «Категории» — открываем родителя
            const treeview = activeLink.closest('.nav-treeview');
            if (treeview) {
                const parentItem = treeview.closest('.nav-item');
                parentItem?.classList.add('menu-open');
                const categoriesLink = parentItem?.querySelector('.categories-link');
                categoriesLink?.classList.add('active');
                // treeview.closest('.nav-item')?.classList.add('menu-open');
            }
        }
    }

    initMobilSidebar() {
        const toggle = document.querySelector('.sidebar-toggle');
        const backdrop = document.querySelector('.sidebar-backdrop');
        const sidebar = document.querySelector('.app-sidebar');

        if (!toggle || !sidebar) return;

        const open = () => {
            sidebar.classList.add('is-open');
            backdrop?.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        };

        const close = () => {
            sidebar.classList.remove('is-open');
            backdrop?.classList.remove('is-visible');
            document.body.style.overflow = '';
        };

        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        newToggle.addEventListener('click', () => {
            sidebar.classList.contains('is-open') ? close() : open();
        });
        backdrop?.addEventListener('click', close);

        window.addEventListener('resize', () => {
            if (window.innerWidth > 710) close();
        });
    }
}