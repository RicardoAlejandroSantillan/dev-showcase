const DEFAULT_LANGUAGE = 'es';
const SUPPORTED_LANGUAGES = ['es', 'en'];

const resolveInitialLanguage = () => {
    const pathMatch = window.location.pathname.match(/^\/(es|en)(?:\/|$)/);
    if (pathMatch) return pathMatch[1];

    const stored = localStorage.getItem('preferredLanguage');
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;

    const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(browserLang)) return browserLang;

    return DEFAULT_LANGUAGE;
};

const translationCache = {};

const loadTranslations = async (language) => {
    if (translationCache[language]) return translationCache[language];

    try {
        const response = await fetch(`/languages/${language}.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        translationCache[language] = data;
        return data;
    } catch (error) {
        if (language !== DEFAULT_LANGUAGE) {
            return loadTranslations(DEFAULT_LANGUAGE);
        }
        return null;
    }
};

const resolvePath = (obj, path) => {
    if (!path || obj == null) return undefined;
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

const resolveProfileKey = (path) => {
    if (path.includes('/datascience')) return 'aboutContent_dataScience';
    if (path.includes('/dataanalyst') ||
        path.includes('/dataanalysis')) return 'aboutContent_dataAnalyst';
    if (path.includes('/dataengineer')) return 'aboutContent_dataEngineer';
    if (path.includes('/pydev')) return 'aboutContent_pyDev';
    if (path.includes('/javadev')) return 'aboutContent_javaDev';
    if (path.includes('/cdev')) return 'aboutContent_cDev';
    if (path.includes('/fullstack')) return 'aboutContent_fullStack';
    if (path.includes('/erpdev')) return 'aboutContent_erpDev';
    return 'aboutContent_webDev';
};

const resolveRoleTitleKey = (path) => {
    if (path.includes('/datascience')) return 'roleTitle_dataScience';
    if (path.includes('/dataanalyst') ||
        path.includes('/dataanalysis')) return 'roleTitle_dataAnalyst';
    if (path.includes('/dataengineer')) return 'roleTitle_dataEngineer';
    if (path.includes('/pydev')) return 'roleTitle_pyDev';
    if (path.includes('/javadev')) return 'roleTitle_javaDev';
    if (path.includes('/cdev')) return 'roleTitle_cDev';
    if (path.includes('/fullstack')) return 'roleTitle_fullStack';
    if (path.includes('/erpdev')) return 'roleTitle_erpDev';
    return 'roleTitle_webDev';
};

const updateRoleTitle = (translations) => {
    const el = document.getElementById('headerRoleTitle');
    const sidebarEl = document.getElementById('sidebarRoleTitle');

    if (document.querySelector('.notfound-container')) {
        const notFoundText = translations?.header?.roleTitle_notFound || 'Rol no Encontrado';
        if (el) el.textContent = notFoundText;
        if (sidebarEl) sidebarEl.textContent = notFoundText;
        return;
    }

    if (!translations?.header) return;
    const key = resolveRoleTitleKey(window.location.pathname.toLowerCase());
    const roleText = translations.header[key] ?? '';
    
    if (el) el.textContent = roleText;
    if (sidebarEl) sidebarEl.textContent = roleText;
};

const updateContent = (translations) => {
    if (!translations) return;

    document.querySelectorAll('[data-translate]').forEach(element => {
        if (element.matches('.header-content h1')) return;

        if (element.dataset.translate === 'introduction.aboutContent') {
            const profileKey = resolveProfileKey(window.location.pathname.toLowerCase());
            const value = translations.introduction[profileKey];
            element.textContent = value || translations.introduction.aboutContent_webDev;
            return;
        }

        const value = resolvePath(translations, element.dataset.translate);
        if (value === undefined || value === null) return;

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.hasAttribute('placeholder')
                ? (element.placeholder = value)
                : (element.value = value);
        } else {
            element.textContent = value;
        }
    });

    document.querySelectorAll('[data-tooltip-translate]').forEach(element => {
        const value = resolvePath(translations, element.dataset.tooltipTranslate);
        if (value) element.dataset.tooltip = value;
    });

    updateRoleTitle(translations);
};

const applyProgressBars = (translations) => {
    const pBars = translations?.skills?.progressBars;
    if (!pBars) return;

    document.querySelectorAll('.stat-bar[data-bar-key]').forEach(bar => {
        const value = resolvePath(pBars, bar.getAttribute('data-bar-key'));
        if (typeof value !== 'number') return;

        bar.setAttribute('data-percent', value);
        bar.style.setProperty('--target-width', value + '%');

        const percentSpan = bar.closest('.stat-item')?.querySelector('.stat-percentage');
        if (percentSpan) percentSpan.textContent = value + '%';
    });
};

const animateVisibleBars = () => {
    const activeSection = document.querySelector('.skill-section.active');
    if (!activeSection) return;

    activeSection.querySelectorAll('.stat-bar[data-percent]').forEach(bar => {
        const percent = parseInt(bar.getAttribute('data-percent'), 10);
        if (!percent) return;
        bar.style.setProperty('--target-width', percent + '%');
        bar.classList.remove('animated');
        requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('animated')));
    });
};

const updateActiveButton = (language) => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === language);
    });
};

const updateURL = (language) => {
    const path = window.location.pathname;
    const hasLangPrefix = /^\/(es|en)(\/|$)/.test(path);

    const newPath = hasLangPrefix
        ? path.replace(/^\/(es|en)/, `/${language}`)
        : `/${language}${path === '/' ? '' : path}`;

    window.history.pushState({ language }, '', newPath);
};

const showLanguageError = (language) => {
    const existing = document.getElementById('lang-error-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'lang-error-banner';
    banner.setAttribute('role', 'alert');
    banner.style.cssText = `
        position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);
        background:#ff1744;color:#fff;padding:.6rem 1.2rem;
        border-radius:8px;font-size:.875rem;z-index:9999;
        box-shadow:0 4px 12px rgba(0,0,0,.4);
    `;
    banner.textContent = `No se pudo cargar el idioma "${language}". Mostrando versión en español.`;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 4000);
};

const syncLanguageWithServer = (language, returnUrl) => {
    const formData = new FormData();
    formData.append('language', language);
    formData.append('returnUrl', returnUrl);
    fetch('/Home/SetLanguage', { method: 'POST', body: formData }).catch(() => { });
};

const CV_MAP = {
    datascience: { es: 'CientificoDeDatos', en: 'DataScience' },
    dataanalyst: { es: 'AnalistaDeDatos', en: 'DataAnalyst' },
    dataanalysis: { es: 'AnalistaDeDatos', en: 'DataAnalyst' },
    dataengineer: { es: 'IngenieroDeDatos', en: 'DataEngineer' },
    pydev: { es: 'DesarrolladorPython', en: 'PythonDeveloper' },
    javadev: { es: 'DesarrolladorJava', en: 'JavaDeveloper' },
    cdev: { es: 'DesarrolladorC', en: 'cDeveloper' },
    fullstack: { es: 'DesarrolladorFullStack', en: 'FullStackDeveloper' },
    erpdev: { es: 'DesarrolladorERP', en: 'ERPDeveloper' },
};

window.updateCVLink = () => {
    const btn = document.getElementById('cvDownloadBtn');
    if (!btn) return;

    const lang = document.documentElement.lang || DEFAULT_LANGUAGE;
    const path = window.location.pathname.toLowerCase();

    const matchedKey = Object.keys(CV_MAP).find(key => path.includes(`/${key}`));
    const profile = matchedKey ? CV_MAP[matchedKey] : { es: 'DesarrolladorWeb', en: 'WebDeveloper' };

    btn.href = `/files/RicardoAlejandroPerezSantillan_${lang === 'en' ? profile.en : profile.es}.pdf`;
};

const changeLanguage = async (language) => {
    if (!SUPPORTED_LANGUAGES.includes(language)) language = DEFAULT_LANGUAGE;

    const translations = await loadTranslations(language);

    if (!translations) {
        showLanguageError(language);
        return;
    }

    window.currentTranslations = translations;

    document.documentElement.lang = language;
    updateContent(translations);
    applyProgressBars(translations);
    animateVisibleBars();
    updateActiveButton(language);
    updateURL(language);

    document.querySelectorAll('.role-link-btn').forEach(btn => {
        let href = btn.getAttribute('href');
        if (href) {
            const cleanHref = href.replace(/^\/(es|en)(?=\/|$)/, '');
            btn.setAttribute('href', `/${language}${cleanHref}`);
        }
    });

    localStorage.setItem('preferredLanguage', language);

    if (typeof window.initTypewriter === 'function') window.initTypewriter(language);
    if (typeof window.updateCVLink === 'function') window.updateCVLink();
    if (typeof window.refreshVocationalCharts === 'function') window.refreshVocationalCharts();

    syncLanguageWithServer(language, window.location.pathname);
};

window.changeLanguage = changeLanguage;

document.addEventListener('DOMContentLoaded', async () => {
    const initialLanguage = resolveInitialLanguage();
    await changeLanguage(initialLanguage);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!btn.classList.contains('active')) await changeLanguage(btn.dataset.lang);
        });
    });

    window.addEventListener('popstate', async (event) => {
        const lang = event.state?.language || resolveInitialLanguage();
        await changeLanguage(lang);
    });
});