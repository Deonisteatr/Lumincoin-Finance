export class Sidebar {
    constructor() {
        console.log('SIDEBAR');

        this.initTreeview();
        this.initMobilSidebar();
    }

    initTreeview() {
        // Проверяем, что jQuery и AdminLTE доступны
        if (typeof $ === 'undefined' || !$.fn.Treeview) {
            console.warn('jQuery или AdminLTE Treeview не загружены');
            return;
        }

        setTimeout(() => {
            if (window.$ && $.fn.Treeview) {
                $('[data-widget="treeview"]').Treeview('init');
            }
        }, 0);
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

        toggle.addEventListener('click', () => {
            sidebar.classList.contains('is-open') ? close() : open();
        });
        backdrop?.addEventListener('click', close);

        window.addEventListener('resize', () => {
            if (window.innerWidth > 710) close();
        });
    }
}