class TypewriterEffect {
    constructor(element, phrases, prefix, options = {}) {
        this.element = element;
        this.phrases = phrases;
        this.prefix = prefix;
        this.currentPhraseIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.timeoutId = null;

        this.config = {
            typingSpeed: options.typingSpeed ?? 100,
            deletingSpeed: options.deletingSpeed ?? 50,
            pauseAfterTyping: options.pauseAfterTyping ?? 2000,
            pauseAfterDeleting: options.pauseAfterDeleting ?? 500,
            loop: options.loop ?? true
        };
    }

    start() {
        this.type();
    }

    stop() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    type() {
        const currentPhrase = this.phrases[this.currentPhraseIndex];

        this.currentText = this.isDeleting
            ? currentPhrase.substring(0, this.currentText.length - 1)
            : currentPhrase.substring(0, this.currentText.length + 1);

        this.element.textContent = this.prefix + this.currentText;

        let speed = this.isDeleting ? this.config.deletingSpeed : this.config.typingSpeed;

        if (!this.isDeleting && this.currentText === currentPhrase) {
            speed = this.config.pauseAfterTyping;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
            if (!this.config.loop && this.currentPhraseIndex === 0) return;
            speed = this.config.pauseAfterDeleting;
        }

        this.timeoutId = setTimeout(() => this.type(), speed);
    }
}

let typewriterInstance = null;

const TYPEWRITER_FALLBACK = {
    es: { prefix: 'Soy ', phrases: ['Ricardo Alejandro Pérez Santillán', 'un amante de los Datos', 'un loco por las automatizaciones'] },
    en: { prefix: "I'm ", phrases: ['Ricardo Alejandro Pérez Santillán', 'a Data enthusiast', 'an automation fanatic'] }
};

const initTypewriter = (language = 'es') => {
    const h1Element = document.querySelector('.header-content h1');
    if (!h1Element) return;

    if (typewriterInstance) {
        typewriterInstance.stop();
        typewriterInstance = null;
    }

    const twConfig = window.currentTranslations?.typewriter;
    const { prefix, phrases } = twConfig ?? (TYPEWRITER_FALLBACK[language] ?? TYPEWRITER_FALLBACK.es);

    if (!phrases?.length) return;

    typewriterInstance = new TypewriterEffect(h1Element, phrases, prefix, {
        typingSpeed: 100,
        deletingSpeed: 50,
        pauseAfterTyping: 2000,
        pauseAfterDeleting: 500,
        loop: true
    });

    typewriterInstance.start();
};

window.TypewriterEffect = TypewriterEffect;
window.initTypewriter = initTypewriter;