import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

export class Dashboard {
    constructor() {
        this.initCharts();
    }

    createLegend(containerId, labels, colors) {
        const el = document.getElementById(containerId);
        if (!el) return;

        el.innerHTML = labels.map((label, i) => `
            <span class="chart-legend-item">
                <span class="chart-legend-color" style="background:${colors[i]}"></span>
                ${label}
            </span>
        `).join('');
    }

    initCharts() {
        const incomesCanvas = document.getElementById('incomesChart');
        const expensesCanvas = document.getElementById('expensesChart');

        if (!incomesCanvas || !expensesCanvas) return;

        // временные данные — потом подставлю с бэка
        const labels = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];
        const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#0d6efd'];

        this.createLegend('incomesLegend', labels, colors);
        this.createLegend('expensesLegend', labels, colors);

        const incomesData = {
            labels,
            datasets: [{
                data: [28, 32, 18, 12, 10],
                backgroundColor: colors,
                borderWidth: 0,
            }],
        };

        const expensesData = {
            labels,
            datasets: [{
                data: [5, 15, 30, 28, 22],
                backgroundColor: colors,
                borderWidth: 0,
            }],
        };

        const commonOptions = {
            responsive: false,
            animation: false,
            plugins: {
                legend: { display: false }, // легенда своя, HTML
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
                    },
                },
            },
        };

        new Chart(incomesCanvas, {
            type: 'pie',
            data: incomesData,
            options: commonOptions,
        });

        new Chart(expensesCanvas, {
            type: 'pie',
            data: expensesData,
            options: commonOptions,
        });
    }
}