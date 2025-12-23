/**
 * Typing Effect for Terminal-style Text Animation
 */
(function () {
    'use strict';

    class TypingEffect {
        constructor(element, options = {}) {
            this.element = element;
            this.text = options.text || element.textContent;
            this.speed = options.speed || 80;
            this.delay = options.delay || 0;
            this.cursor = options.cursor !== false;
            this.cursorChar = options.cursorChar || '█';
            this.onComplete = options.onComplete || null;

            this.currentIndex = 0;
            this.cursorElement = null;

            if (element) {
                this.init();
            }
        }

        init() {
            this.element.textContent = '';
            this.element.style.visibility = 'visible';

            if (this.cursor) {
                this.cursorElement = document.createElement('span');
                this.cursorElement.className = 'typing-cursor';
                this.cursorElement.textContent = this.cursorChar;
                this.element.appendChild(this.cursorElement);
            }

            setTimeout(() => this.type(), this.delay);
        }

        type() {
            if (this.currentIndex < this.text.length) {
                const textNode = document.createTextNode(this.text.charAt(this.currentIndex));

                if (this.cursorElement) {
                    this.element.insertBefore(textNode, this.cursorElement);
                } else {
                    this.element.appendChild(textNode);
                }

                this.currentIndex++;

                // Variable speed for more natural typing
                const variance = Math.random() * 40 - 20;
                setTimeout(() => this.type(), this.speed + variance);
            } else {
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }
    }

    // Staggered typing for multiple elements
    class StaggeredTyping {
        constructor(selector, options = {}) {
            this.elements = document.querySelectorAll(selector);
            this.staggerDelay = options.staggerDelay || 500;
            this.baseOptions = options;

            this.init();
        }

        init() {
            let delay = 0;

            this.elements.forEach((element, index) => {
                const text = element.getAttribute('data-typing-text') || element.textContent;
                element.style.visibility = 'hidden';

                new TypingEffect(element, {
                    ...this.baseOptions,
                    text: text,
                    delay: delay,
                    onComplete: index === this.elements.length - 1 ? this.baseOptions.onComplete : null
                });

                delay += this.staggerDelay + (text.length * (this.baseOptions.speed || 80));
            });
        }
    }

    // Export to window
    window.TypingEffect = TypingEffect;
    window.StaggeredTyping = StaggeredTyping;

    // Auto-initialize elements with data-typing attribute
    document.addEventListener('DOMContentLoaded', () => {
        // Typing effect for hero elements
        const heroName = document.querySelector('.hero-name[data-typing]');
        if (heroName) {
            const text = heroName.textContent;
            new TypingEffect(heroName, {
                text: text,
                speed: 100,
                delay: 800
            });
        }

        const heroRole = document.querySelector('.hero-role[data-typing]');
        if (heroRole) {
            const text = heroRole.textContent;
            new TypingEffect(heroRole, {
                text: text,
                speed: 60,
                delay: 2000,
                cursor: false
            });
        }

        // Command typing effect
        const command = document.querySelector('.command[data-typing]');
        if (command) {
            const text = command.textContent;
            new TypingEffect(command, {
                text: text,
                speed: 120,
                delay: 300,
                cursor: false
            });
        }
    });
})();
