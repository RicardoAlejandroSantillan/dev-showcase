const DEFAULT_LANGUAGE = 'es';

const getCurrentLanguageFromBackend = async () => {
    try {
        const response = await fetch('/Home/GetCurrentLanguage');
        if (response.ok) {
            const data = await response.json();
            return data.language || DEFAULT_LANGUAGE;
        }
    } catch (error) {
        return DEFAULT_LANGUAGE;
    }
    return DEFAULT_LANGUAGE;
};

const loadTranslations = async (language) => {
    try {
        const response = await fetch(`/languages/${language}.json`);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch (error) {
        return null;
    }
};

const updateContent = (translations) => {
    if (!translations) {
        return;
    }

    const elements = document.querySelectorAll('[data-translate]');

    elements.forEach(element => {
        const key = element.dataset.translate;

        if (element.matches('.header-content h1')) {
            return;
        }

        const keys = key.split('.');
        let value = translations;
        for (const k of keys) {
            value = value?.[k];
        }

        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = value;
                } else {
                    element.value = value;
                }
            } else {
                element.textContent = value;
            }
        }
    });

    const tooltipElements = document.querySelectorAll('[data-tooltip-translate]');
    tooltipElements.forEach(element => {
        const key = element.dataset.tooltipTranslate;
        const keys = key.split('.');

        let value = translations;
        for (const k of keys) {
            value = value?.[k];
        }

        if (value) {
            element.dataset.tooltip = value;
        }
    });
};

const updateActiveButton = (language) => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === language);
    });
};

const updateURL = (language) => {
    const currentPath = window.location.pathname;
    let newPath;

    if (currentPath.startsWith('/es') || currentPath.startsWith('/en')) {
        newPath = currentPath.replace(/^\/(es|en)/, `/${language}`);
    } else {
        if (currentPath === '/' || currentPath === '') {
            newPath = `/${language}`;
        } else {
            newPath = `/${language}${currentPath}`;
        }
    }

    window.history.pushState({ language }, '', newPath);
};

const changeLanguage = async (language) => {
    const translations = await loadTranslations(language);

    if (translations) {
        localStorage.setItem('preferredLanguage', language);
        document.documentElement.lang = language;
        updateContent(translations);
        updateActiveButton(language);
        updateURL(language);

        if (window.updateCVLink) {
            window.updateCVLink();
        }

        if (window.initTypewriter) {
            window.initTypewriter(language);
        }

        if (window.refreshVocationalCharts) {
            window.refreshVocationalCharts();
        }
    } else {
        return;
    }

    try {
        const formData = new FormData();
        formData.append('language', language);
        formData.append('returnUrl', window.location.pathname);

        await fetch('/Home/SetLanguage', {
            method: 'POST',
            body: formData
        });
    } catch (error) {
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    let currentLanguage = await getCurrentLanguageFromBackend();

    const pathLanguage = window.location.pathname.match(/^\/(es|en)/)?.[1];
    if (pathLanguage) {
        currentLanguage = pathLanguage;
    }

    await changeLanguage(currentLanguage);

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const language = btn.dataset.lang;

            if (btn.classList.contains('active')) {
                return;
            }

            await changeLanguage(language);
        });
    });

    window.addEventListener('popstate', async (event) => {
        if (event.state && event.state.language) {
            await changeLanguage(event.state.language);
        }
    });
});