document.addEventListener('DOMContentLoaded', () => {

    let radarChart = null;
    let cognitiveChart = null;
    let barCharts = {};

    const getT = () => window.currentTranslations ?? {};
    const getVoc = () => getT()?.skills?.vocational ?? {};
    const getChartData = () => getT()?.chartsData ?? {};

    const RIASEC_COLORS = {
        realistic: { border: '#c2185b', fill: 'rgba(194,24,91,0.18)', point: '#c2185b' },
        investigative: { border: '#e91e63', fill: 'rgba(233,30,99,0.18)', point: '#e91e63' },
        artistic: { border: '#ffb74d', fill: 'rgba(255,183,77,0.18)', point: '#ffb74d' },
        social: { border: '#ff9800', fill: 'rgba(255,152,0,0.18)', point: '#ff9800' },
        enterprising: { border: '#ff7043', fill: 'rgba(255,112,67,0.22)', point: '#ff7043' },
        conventional: { border: '#ec407a', fill: 'rgba(236,64,122,0.15)', point: '#ec407a' }
    };

    const COGNITIVE_COLORS = {
        mine: { border: '#4fc3f7', fill: 'rgba(79,195,247,0.22)', point: '#4fc3f7' },
        avg: { border: '#f06292', fill: 'rgba(240,98,146,0.15)', point: '#f06292' }
    };

    const BAR_TOP = { bg: 'rgba(79,195,247,0.75)', border: 'rgba(79,195,247,1)' };
    const BAR_LOW = { bg: 'rgba(236,64,122,0.70)', border: 'rgba(236,64,122,1)' };

    const buildRadarData = () => {
        const voc = getVoc();
        const nums = getChartData()?.riasec ?? {};

        const makeDs = (key, col) => ({
            label: voc.datasets?.[key] ?? key,
            data: nums[key] ?? [],
            backgroundColor: col.fill,
            borderColor: col.border,
            borderWidth: 1.5,
            pointBackgroundColor: col.point,
            pointBorderColor: '#fff',
            pointRadius: 3,
            pointHoverRadius: 5
        });

        return {
            labels: voc.radarLabels ?? [],
            datasets: [
                makeDs('realistic', RIASEC_COLORS.realistic),
                makeDs('investigative', RIASEC_COLORS.investigative),
                makeDs('artistic', RIASEC_COLORS.artistic),
                makeDs('social', RIASEC_COLORS.social),
                makeDs('enterprising', RIASEC_COLORS.enterprising),
                makeDs('conventional', RIASEC_COLORS.conventional)
            ]
        };
    };

    const buildCognitiveData = () => {
        const voc = getVoc();
        const nums = getChartData()?.cognitive ?? {};

        const makeDs = (key, label, col, extra = {}) => ({
            label,
            data: nums[key] ?? [],
            backgroundColor: col.fill,
            borderColor: col.border,
            borderWidth: 2,
            pointBackgroundColor: col.point,
            pointBorderColor: '#ffffff',
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBorderWidth: 2,
            ...extra
        });

        return {
            labels: voc.cognitiveLabels ?? [],
            datasets: [
                makeDs('mine', voc.cognitiveMe ?? 'My Score', COGNITIVE_COLORS.mine),
                makeDs('avg', voc.cognitiveAvg ?? 'General Average', COGNITIVE_COLORS.avg, { borderDash: [6, 3], pointRadius: 4, pointHoverRadius: 6 })
            ]
        };
    };

    const makeBarDataset = (data, color) => [{
        label: 'Porcentaje',
        data,
        backgroundColor: color.bg,
        borderColor: color.border,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false
    }];

    const buildBarData = () => {
        const voc = getVoc();
        const labels = voc.barLabels ?? {};
        const nums = getChartData()?.bars ?? {};

        const make = (key, color) => ({
            labels: labels[key] ?? [],
            datasets: makeBarDataset(nums[key] ?? [], color)
        });

        return {
            topSkills: make('topSkills', BAR_TOP),
            topInterests: make('topInterests', BAR_TOP),
            topCareers: make('topCareers', BAR_TOP),
            lowSkills: make('lowSkills', BAR_LOW),
            lowInterests: make('lowInterests', BAR_LOW),
            lowCareers: make('lowCareers', BAR_LOW),
            valoresOcupacionales: make('valoresOcupacionales', BAR_TOP)
        };
    };

    const radarOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,3,47,0.92)', titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1, padding: 10, cornerRadius: 8,
                callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.r}%` }
            }
        },
        scales: {
            r: {
                beginAtZero: true, max: 100,
                ticks: { stepSize: 20, color: 'rgba(0,0,0,0)', backdropColor: 'transparent', font: { size: 9 } },
                grid: { color: 'rgba(255,255,255,0.15)', circular: true },
                pointLabels: { color: 'rgb(160,161,163)', font: { size: 12, weight: '600' }, padding: 12 },
                angleLines: { color: 'rgba(255,255,255,0.12)' }
            }
        },
        animation: { duration: 800, easing: 'easeInOutQuart' }
    };

    const cognitiveOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,3,47,0.92)', titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1, padding: 12, cornerRadius: 8,
                callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.r} pts` }
            }
        },
        scales: {
            r: {
                beginAtZero: true, min: 0, max: 60,
                ticks: { stepSize: 15, color: 'rgba(255,255,255,0.35)', backdropColor: 'transparent', font: { size: 9 } },
                grid: { color: 'rgba(255,255,255,0.12)' },
                pointLabels: { color: 'rgba(255,255,255,0.9)', font: { size: 13, weight: '700' }, padding: 14 },
                angleLines: { color: 'rgba(255,255,255,0.1)' }
            }
        },
        animation: { duration: 900, easing: 'easeInOutQuart' }
    };

    const barOptions = {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,3,47,0.92)', padding: 12, titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1, cornerRadius: 8,
                callbacks: { label: ctx => '  ' + ctx.parsed.x.toFixed(1) + '%' }
            }
        },
        scales: {
            x: {
                beginAtZero: true, max: 100,
                grid: { color: 'rgba(255,255,255,0.06)', drawBorder: false },
                border: { display: false },
                ticks: { color: 'rgba(255,255,255,0.45)', font: { size: 10 }, callback: v => v + '%', maxTicksLimit: 5 }
            },
            y: {
                grid: { display: false }, border: { display: false },
                ticks: { color: 'rgba(255,255,255,0.9)', font: { size: 11, weight: '600' }, padding: 6 }
            }
        },
        layout: { padding: { right: 8 } },
        animation: { duration: 700, easing: 'easeInOutQuart' }
    };

    const SECTION_BAR_CHARTS = {
        profile: ['topSkillsChart', 'topInterestsChart', 'topCareersChart',
            'lowSkillsChart', 'lowInterestsChart', 'lowCareersChart'],
        aptitudes: ['valoresOcupacionalesChart'],
        proyecto: []
    };

    const getActiveSectionKey = () => {
        const el = document.querySelector('.vocational-section-content.active');
        return el?.getAttribute('data-section-content') ?? 'profile';
    };

    const createRadar = () => {
        if (radarChart) return;
        const ctx = document.getElementById('vocationalRadarChart');
        if (!ctx) return;
        radarChart = new Chart(ctx, { type: 'radar', data: buildRadarData(), options: radarOptions });
    };

    const destroyRadar = () => { radarChart?.destroy(); radarChart = null; };

    const updateRadarLabels = () => {
        if (!radarChart) return;
        radarChart.data = buildRadarData();
        radarChart.update();
    };

    const createCognitiveChart = () => {
        if (cognitiveChart) return;
        const ctx = document.getElementById('cognitiveRadarChart');
        if (!ctx) return;
        cognitiveChart = new Chart(ctx, { type: 'radar', data: buildCognitiveData(), options: cognitiveOptions });
    };

    const destroyCognitiveChart = () => { cognitiveChart?.destroy(); cognitiveChart = null; };

    const updateCognitiveLabels = () => {
        if (!cognitiveChart) return;
        cognitiveChart.data = buildCognitiveData();
        cognitiveChart.update();
    };

    const syncCognitiveChart = () => {
        if (getActiveSectionKey() === 'aptitudes') {
            setTimeout(createCognitiveChart, 100);
        } else {
            destroyCognitiveChart();
        }
    };

    const destroyBarCharts = () => {
        Object.values(barCharts).forEach(chart => chart?.destroy?.());
        barCharts = {};
    };

    const createBarCharts = () => {
        const sectionKey = getActiveSectionKey();
        const allowedIds = SECTION_BAR_CHARTS[sectionKey] ?? [];
        if (!allowedIds.length) return;

        const bar = buildBarData();

        const ALL_PAIRS = [
            ['topSkillsChart', bar.topSkills],
            ['topInterestsChart', bar.topInterests],
            ['topCareersChart', bar.topCareers],
            ['lowSkillsChart', bar.lowSkills],
            ['lowInterestsChart', bar.lowInterests],
            ['lowCareersChart', bar.lowCareers],
            ['valoresOcupacionalesChart', bar.valoresOcupacionales]
        ];

        ALL_PAIRS.forEach(([id, data]) => {
            if (!allowedIds.includes(id)) return;
            const ctx = document.getElementById(id);
            if (ctx) barCharts[id] = new Chart(ctx, { type: 'bar', data, options: barOptions });
        });
    };

    window.refreshVocationalCharts = () => {
        const statsContent = document.getElementById('vocational-stats-content');
        if (!statsContent?.classList.contains('active')) return;
        updateRadarLabels();
        updateCognitiveLabels();
        destroyBarCharts();
        createBarCharts();
    };

    document.querySelectorAll('.vocational-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('data-section');

            document.querySelectorAll('.vocational-section-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.vocational-section-content').forEach(content => {
                content.classList.toggle('active',
                    content.getAttribute('data-section-content') === targetSection);
            });

            setTimeout(() => {
                destroyBarCharts();
                createBarCharts();
                syncCognitiveChart();
            }, 150);
        });
    });

    const vocationalStatsContent = document.getElementById('vocational-stats-content');

    if (vocationalStatsContent) {
        let wasActive = vocationalStatsContent.classList.contains('active');

        const observer = new MutationObserver(() => {
            const isActive = vocationalStatsContent.classList.contains('active');

            if (!wasActive && isActive) {
                setTimeout(() => {
                    createRadar();
                    destroyBarCharts();
                    createBarCharts();
                    syncCognitiveChart();
                }, 150);
            } else if (wasActive && !isActive) {
                destroyBarCharts();
                destroyRadar();
                destroyCognitiveChart();
            }

            wasActive = isActive;
        });

        observer.observe(vocationalStatsContent, { attributes: true, attributeFilter: ['class'] });

        if (wasActive) {
            setTimeout(() => {
                createRadar();
                createBarCharts();
                syncCognitiveChart();
            }, 150);
        }
    }
});