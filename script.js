(() => {
    "use strict";

    /*
     * Todo el contenido sensible de la invitación queda aquí.
     * Puedes cambiar fechas, textos, rutas e incluso colores de la galería
     * sin tocar el HTML.
     */
    const CONFIG = {
        targetDate: "2026-06-30T08:00:00-06:00",
        letter: {
            date: "30 de junio",
            title: "Hola...",
            paragraphs: [
                "Esta no es una invitación cualquiera.",
                "Quería que se sintiera tranquila, bonita y un poquito inesperada.",
                "Así que preparé este pequeño rincón para invitarte a vivir un día especial conmigo."
            ],
            signature: "Con mucho cariño"
        },
        invitationDescription: "Un viaje hacia Perquín, con café, carretera, montaña y una conversación que no tenga prisa.",
        successMessage: "Gracias por decir que sí. Prometo cuidar cada detalle de esta pequeña aventura.",
        gallery: [
            {
                label: "Primera pausa",
                title: "Café",
                colors: ["#FFF9FB", "#FDECEF", "#D97A9A"],
                image: ""
            },
            {
                label: "Camino",
                title: "Carretera",
                colors: ["#FDECEF", "#F8E3E8", "#B45574"],
                image: ""
            },
            {
                label: "Destino",
                title: "Perquín",
                colors: ["#FFF9FB", "#F8E3E8", "#8C3F59"],
                image: ""
            },
            {
                label: "Cierre",
                title: "Mirador",
                colors: ["#F8E3E8", "#FFF9FB", "#D97A9A"],
                image: ""
            }
        ],
        memories: [
            { title: "Risas suaves", height: 260, colors: ["#FFF9FB", "#FDECEF"] },
            { title: "Flores en pausa", height: 360, colors: ["#F8E3E8", "#FFF9FB"] },
            { title: "Café lento", height: 300, colors: ["#FDECEF", "#D97A9A"] },
            { title: "Una vista bonita", height: 420, colors: ["#FFF9FB", "#B45574"] },
            { title: "Camino tranquilo", height: 280, colors: ["#F8E3E8", "#FDECEF"] },
            { title: "Detalles pequeños", height: 340, colors: ["#FFF9FB", "#8C3F59"] }
        ]
    };

    const state = {
        lenis: null,
        previousScrollY: 0,
        ticking: false,
        reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
    };

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const random = (min, max) => Math.random() * (max - min) + min;
    const pad = (number) => String(Math.max(0, number)).padStart(2, "0");

    const raf = (callback) => {
        if (state.reduceMotion) {
            callback();
            return 0;
        }

        return requestAnimationFrame(callback);
    };

    const setCssVar = (name, value) => {
        document.documentElement.style.setProperty(name, value);
    };

    const App = {
        init() {
            document.body.classList.add("is-loading");

            ContentModule.init();
            PreloaderModule.init();
            ScrollModule.init();
            AmbientModule.init();
            LetterModule.init();
            GalleryModule.init();
            AnimationModule.init();
            CountdownModule.init();
            RouteModule.init();
            MusicModule.init();
            AnswerModule.init();
            CursorModule.init();
            NavigationModule.init();
            AccessibilityModule.init();
        }
    };

    const ContentModule = {
        init() {
            const description = $("[data-invitation-description]");
            const success = $("[data-success-message]");
            const letterDate = $("[data-letter-date]");
            const letterTitle = $("[data-letter-title]");
            const letterSignature = $("[data-letter-signature]");

            if (description) {
                description.textContent = CONFIG.invitationDescription;
            }

            if (success) {
                success.textContent = CONFIG.successMessage;
            }

            if (letterDate) {
                letterDate.textContent = CONFIG.letter.date;
            }

            if (letterTitle) {
                letterTitle.textContent = CONFIG.letter.title;
            }

            if (letterSignature) {
                letterSignature.textContent = CONFIG.letter.signature;
            }
        }
    };

    const PreloaderModule = {
        init() {
            const preloader = $("[data-preloader]");

            if (!preloader) {
                document.body.classList.remove("is-loading");
                return;
            }

            const hide = () => {
                preloader.classList.add("is-hidden");
                document.body.classList.remove("is-loading");
            };

            window.addEventListener("load", () => {
                window.setTimeout(hide, state.reduceMotion ? 80 : 850);
            }, { once: true });

            window.setTimeout(hide, 2400);
        }
    };

    const ScrollModule = {
        init() {
            this.initLenis();
            this.bindScrollButtons();
            this.observeSections();
        },

        initLenis() {
            if (state.reduceMotion || typeof window.Lenis === "undefined") {
                return;
            }

            state.lenis = new window.Lenis({
                duration: 1.15,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true
            });

            const frame = (time) => {
                state.lenis.raf(time);
                requestAnimationFrame(frame);
            };

            requestAnimationFrame(frame);
        },

        bindScrollButtons() {
            $$("[data-scroll-target]").forEach((button) => {
                button.addEventListener("click", () => {
                    const target = $(button.dataset.scrollTarget);

                    if (!target) {
                        return;
                    }

                    if (state.lenis) {
                        state.lenis.scrollTo(target, { offset: -8 });
                    } else {
                        target.scrollIntoView({ behavior: state.reduceMotion ? "auto" : "smooth" });
                    }
                });
            });
        },

        observeSections() {
            const sections = $$(".section");

            if (!("IntersectionObserver" in window)) {
                sections.forEach((section) => section.classList.add("is-visible"));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                    }
                });
            }, {
                rootMargin: "0px 0px -18% 0px",
                threshold: 0.16
            });

            sections.forEach((section) => observer.observe(section));
        }
    };

    const AnimationModule = {
        init() {
            this.initAos();
            this.initGsap();
            this.bindParallax();
        },

        initAos() {
            if (typeof window.AOS === "undefined") {
                return;
            }

            window.AOS.init({
                once: true,
                duration: state.reduceMotion ? 0 : 950,
                easing: "ease-out-cubic",
                offset: 80
            });
        },

        initGsap() {
            if (state.reduceMotion || typeof window.gsap === "undefined") {
                return;
            }

            window.gsap.from(".hero__frame span", {
                opacity: 0,
                scale: 0.72,
                duration: 1.25,
                stagger: 0.08,
                ease: "power3.out",
                delay: 0.45
            });

            window.gsap.to(".hero__content", {
                y: -10,
                duration: 6,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        },

        bindParallax() {
            const cards = $$(".gallery-card");

            if (!cards.length || state.reduceMotion) {
                return;
            }

            const update = () => {
                state.ticking = false;
                const viewport = window.innerHeight || 1;

                cards.forEach((card, index) => {
                    const rect = card.getBoundingClientRect();
                    const progress = (rect.top - viewport) / (viewport + rect.height);
                    const depth = index % 2 === 0 ? -28 : 28;
                    card.style.setProperty("--parallax", `${clamp(progress * depth, -22, 22)}px`);
                });
            };

            const requestUpdate = () => {
                if (!state.ticking) {
                    state.ticking = true;
                    requestAnimationFrame(update);
                }
            };

            window.addEventListener("scroll", requestUpdate, { passive: true });
            window.addEventListener("resize", requestUpdate);
            requestUpdate();
        }
    };

    const AmbientModule = {
        petalCanvas: null,

        init() {
            this.petalCanvas = new PetalCanvas($("#petalCanvas"));
            this.petalCanvas.start();
            FireflyModule.init();
            ButterflyModule.init();
            MouseLightModule.init();
        }
    };

    class PetalCanvas {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas ? canvas.getContext("2d") : null;
            this.width = 0;
            this.height = 0;
            this.dpr = 1;
            this.petals = [];
            this.running = false;
            this.wind = 0;
            this.lastTime = 0;
            this.boundResize = this.resize.bind(this);
            this.boundFrame = this.frame.bind(this);
        }

        start() {
            if (!this.canvas || !this.ctx) {
                return;
            }

            this.running = true;
            this.resize();
            window.addEventListener("resize", this.boundResize);
            requestAnimationFrame(this.boundFrame);
        }

        resize() {
            this.dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = Math.floor(this.width * this.dpr);
            this.canvas.height = Math.floor(this.height * this.dpr);
            this.canvas.style.width = `${this.width}px`;
            this.canvas.style.height = `${this.height}px`;
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
            this.createPetals();
        }

        createPetals() {
            const baseCount = state.reduceMotion ? 16 : Math.round(clamp(this.width / 26, 32, 78));

            while (this.petals.length < baseCount) {
                this.petals.push(this.createPetal(true));
            }

            while (this.petals.length > baseCount) {
                this.petals.pop();
            }
        }

        createPetal(randomY = false) {
            const size = random(7, 20);

            return {
                x: random(-40, this.width + 40),
                y: randomY ? random(-this.height, this.height) : random(-80, -20),
                size,
                speed: random(9, 32),
                drift: random(-18, 18),
                phase: random(0, Math.PI * 2),
                rotation: random(0, Math.PI * 2),
                rotationSpeed: random(-0.9, 0.9),
                opacity: random(0.18, 0.62),
                color: Math.random() > 0.52 ? "217, 122, 154" : "180, 85, 116"
            };
        }

        frame(time) {
            if (!this.running) {
                return;
            }

            const delta = Math.min((time - this.lastTime) / 1000 || 0.016, 0.05);
            this.lastTime = time;
            this.wind = Math.sin(time * 0.00025) * 14 + Math.cos(time * 0.00011) * 8;
            this.ctx.clearRect(0, 0, this.width, this.height);

            this.petals.forEach((petal, index) => {
                this.updatePetal(petal, delta, time, index);
                this.drawPetal(petal);
            });

            requestAnimationFrame(this.boundFrame);
        }

        updatePetal(petal, delta, time, index) {
            const wave = Math.sin(time * 0.001 + petal.phase + index) * petal.drift;
            petal.y += petal.speed * delta;
            petal.x += (this.wind + wave) * delta;
            petal.rotation += petal.rotationSpeed * delta;

            if (petal.y > this.height + 60 || petal.x < -100 || petal.x > this.width + 100) {
                Object.assign(petal, this.createPetal(false));
            }
        }

        drawPetal(petal) {
            const ctx = this.ctx;
            const w = petal.size * 0.72;
            const h = petal.size * 1.42;

            ctx.save();
            ctx.translate(petal.x, petal.y);
            ctx.rotate(petal.rotation);
            ctx.globalAlpha = petal.opacity;
            ctx.fillStyle = `rgba(${petal.color}, 0.82)`;
            ctx.beginPath();
            ctx.moveTo(0, -h * 0.52);
            ctx.bezierCurveTo(w, -h * 0.46, w * 0.92, h * 0.22, 0, h * 0.55);
            ctx.bezierCurveTo(-w * 0.95, h * 0.22, -w, -h * 0.46, 0, -h * 0.52);
            ctx.fill();
            ctx.strokeStyle = `rgba(255, 255, 255, ${petal.opacity * 0.42})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(0, -h * 0.35);
            ctx.quadraticCurveTo(w * 0.16, 0, 0, h * 0.42);
            ctx.stroke();
            ctx.restore();
        }

        burst(count = 120) {
            if (!this.canvas || !this.ctx) {
                return;
            }

            for (let i = 0; i < count; i += 1) {
                const petal = this.createPetal(false);
                petal.x = random(0, this.width);
                petal.y = random(-40, this.height * 0.28);
                petal.speed = random(45, 120);
                petal.opacity = random(0.42, 0.92);
                this.petals.push(petal);
            }
        }
    }

    const FireflyModule = {
        init() {
            const field = $("#fireflyField");

            if (!field) {
                return;
            }

            const count = state.reduceMotion ? 8 : 26;
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < count; i += 1) {
                const firefly = document.createElement("span");
                firefly.className = "firefly";
                firefly.style.left = `${random(4, 96)}%`;
                firefly.style.top = `${random(8, 92)}%`;
                firefly.style.animationDelay = `${random(-6, 0)}s`;
                firefly.style.animationDuration = `${random(3, 5)}s, ${random(10, 18)}s`;
                fragment.appendChild(firefly);
            }

            field.appendChild(fragment);
        }
    };

    const ButterflyModule = {
        init() {
            const field = $("#butterflyField");

            if (!field) {
                return;
            }

            const count = state.reduceMotion ? 2 : 5;
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < count; i += 1) {
                const butterfly = document.createElement("span");
                butterfly.className = "butterfly";
                butterfly.style.left = `${random(7, 86)}%`;
                butterfly.style.top = `${random(12, 72)}%`;
                butterfly.style.animationDelay = `${random(-12, 0)}s`;
                butterfly.style.animationDuration = `${random(16, 26)}s`;
                butterfly.innerHTML = this.svg();
                fragment.appendChild(butterfly);
            }

            field.appendChild(fragment);
        },

        svg() {
            return `
                <svg viewBox="0 0 44 34" role="img" aria-label="">
                    <path class="wing-left" d="M21 17C12 5 4 2 2 9c-2 8 8 17 19 10Z" fill="rgba(217,122,154,.58)"></path>
                    <path class="wing-right" d="M23 17C32 5 40 2 42 9c2 8-8 17-19 10Z" fill="rgba(180,85,116,.5)"></path>
                    <path d="M21 15c1-3 3-3 4 0l-1 15h-2Z" fill="rgba(74,42,52,.42)"></path>
                </svg>
            `;
        }
    };

    const MouseLightModule = {
        init() {
            window.addEventListener("pointermove", (event) => {
                setCssVar("--mouse-x", `${event.clientX}px`);
                setCssVar("--mouse-y", `${event.clientY}px`);
            }, { passive: true });
        }
    };

    const LetterModule = {
        typed: false,
        typingTimer: 0,

        init() {
            const button = $("#envelopeButton");

            if (!button) {
                return;
            }

            button.addEventListener("click", () => {
                const isOpen = button.classList.toggle("is-open");
                button.setAttribute("aria-expanded", String(isOpen));

                if (isOpen && !this.typed) {
                    this.typeLetter();
                }
            });
        },

        typeLetter() {
            const target = $("[data-letter-body]");

            if (!target) {
                return;
            }

            this.typed = true;
            target.innerHTML = "";

            if (state.reduceMotion) {
                target.innerHTML = CONFIG.letter.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
                return;
            }

            const paragraphs = CONFIG.letter.paragraphs.map((paragraph) => ({
                text: paragraph,
                index: 0,
                element: document.createElement("p")
            }));

            paragraphs.forEach((paragraph) => target.appendChild(paragraph.element));

            let paragraphIndex = 0;

            const tick = () => {
                const paragraph = paragraphs[paragraphIndex];

                if (!paragraph) {
                    return;
                }

                paragraph.element.textContent += paragraph.text[paragraph.index] || "";
                paragraph.index += 1;

                if (paragraph.index >= paragraph.text.length) {
                    paragraphIndex += 1;
                    this.typingTimer = window.setTimeout(tick, 240);
                    return;
                }

                this.typingTimer = window.setTimeout(tick, random(18, 36));
            };

            tick();
        }
    };

    const GalleryModule = {
        init() {
            this.renderPremiumGallery();
            this.renderMemoryWall();
            this.lazyOptionalImages();
        },

        renderPremiumGallery() {
            const gallery = $("#premiumGallery");

            if (!gallery) {
                return;
            }

            const fragment = document.createDocumentFragment();

            CONFIG.gallery.forEach((item, index) => {
                const card = document.createElement("article");
                card.className = "gallery-card";
                card.setAttribute("data-aos", index % 2 ? "fade-up" : "fade-down");
                card.style.setProperty("--card-start", item.colors[0]);
                card.style.setProperty("--card-mid", item.colors[1]);
                card.style.setProperty("--card-end", item.colors[2]);

                if (item.image) {
                    card.dataset.image = item.image;
                    card.classList.add("has-image");
                }

                card.innerHTML = `
                    <div class="gallery-card__content">
                        <span>${item.label}</span>
                        <h3>${item.title}</h3>
                    </div>
                `;

                fragment.appendChild(card);
            });

            gallery.appendChild(fragment);
        },

        renderMemoryWall() {
            const wall = $("#memoryWall");

            if (!wall) {
                return;
            }

            const fragment = document.createDocumentFragment();

            CONFIG.memories.forEach((item, index) => {
                const tile = document.createElement("article");
                tile.className = "memory-tile";
                tile.setAttribute("data-aos", "fade-up");
                tile.setAttribute("data-aos-delay", String((index % 3) * 80));
                tile.style.setProperty("--tile-height", `${item.height}px`);
                tile.style.setProperty("--tile-a", item.colors[0]);
                tile.style.setProperty("--tile-b", item.colors[1]);
                tile.innerHTML = `<span>${item.title}</span>`;
                fragment.appendChild(tile);
            });

            wall.appendChild(fragment);
        },

        lazyOptionalImages() {
            const cards = $$("[data-image]");

            if (!cards.length || !("IntersectionObserver" in window)) {
                cards.forEach((card) => this.loadCardImage(card));
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.loadCardImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: "180px" });

            cards.forEach((card) => observer.observe(card));
        },

        loadCardImage(card) {
            const src = card.dataset.image;

            if (!src) {
                return;
            }

            const image = new Image();
            image.onload = () => {
                card.style.backgroundImage = `
                    linear-gradient(180deg, rgba(43,26,32,.08), rgba(43,26,32,.2)),
                    url("${src}")
                `;
                card.style.backgroundSize = "cover";
                card.style.backgroundPosition = "center";
            };
            image.src = src;
        }
    };

    const CountdownModule = {
        previous: {},
        timer: 0,

        init() {
            this.elements = {
                days: $("#days"),
                hours: $("#hours"),
                minutes: $("#minutes"),
                seconds: $("#seconds")
            };

            if (!Object.values(this.elements).every(Boolean)) {
                return;
            }

            this.update();
            this.timer = window.setInterval(() => this.update(), 1000);
        },

        update() {
            const target = new Date(CONFIG.targetDate).getTime();
            const now = Date.now();
            const distance = target - now;

            if (Number.isNaN(target)) {
                this.setAll("00");
                return;
            }

            if (distance <= 0) {
                window.clearInterval(this.timer);
                this.setUnit("days", "00");
                this.setUnit("hours", "00");
                this.setUnit("minutes", "00");
                this.setUnit("seconds", "00");
                this.announceArrival();
                return;
            }

            const values = {
                days: Math.floor(distance / 86400000),
                hours: Math.floor((distance % 86400000) / 3600000),
                minutes: Math.floor((distance % 3600000) / 60000),
                seconds: Math.floor((distance % 60000) / 1000)
            };

            Object.entries(values).forEach(([unit, value]) => {
                this.setUnit(unit, pad(value));
            });
        },

        setAll(value) {
            Object.keys(this.elements).forEach((unit) => this.setUnit(unit, value));
        },

        setUnit(unit, value) {
            const element = this.elements[unit];

            if (!element || this.previous[unit] === value) {
                return;
            }

            const card = element.closest(".time-card");
            this.previous[unit] = value;
            element.textContent = value;

            if (card && !state.reduceMotion) {
                card.classList.add("is-flipping");
                window.setTimeout(() => card.classList.remove("is-flipping"), 280);
            }
        },

        announceArrival() {
            const title = $("#countdownTitle");

            if (title) {
                title.textContent = "Llegó el día";
            }
        }
    };

    const RouteModule = {
        init() {
            const route = $("#routeLine");

            if (!route || !("IntersectionObserver" in window)) {
                return;
            }

            const steps = $$("li", route);
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-active");
                    }
                });
            }, { threshold: 0.55 });

            steps.forEach((step) => observer.observe(step));
        }
    };

    const MusicModule = {
        init() {
            this.audio = $("#music");
            this.button = $("#musicToggle");
            this.volume = $("#musicVolume");
            this.player = $(".music-player");

            if (!this.audio || !this.button) {
                return;
            }

            this.audio.volume = this.volume ? Number(this.volume.value) : 0.45;
            this.button.addEventListener("click", () => this.toggle());

            if (this.volume) {
                this.volume.addEventListener("input", () => {
                    this.audio.volume = Number(this.volume.value);
                });
            }

            this.audio.addEventListener("play", () => this.setPlaying(true));
            this.audio.addEventListener("pause", () => this.setPlaying(false));
            this.audio.addEventListener("error", () => this.disable());
        },

        toggle() {
            if (!this.audio || this.player?.classList.contains("is-disabled")) {
                return;
            }

            if (this.audio.paused) {
                this.audio.play().catch(() => this.disable());
            } else {
                this.audio.pause();
            }
        },

        setPlaying(isPlaying) {
            this.player?.classList.toggle("is-playing", isPlaying);
            this.button.setAttribute("aria-pressed", String(isPlaying));
            this.button.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
        },

        disable() {
            this.player?.classList.add("is-disabled");
            this.button.setAttribute("aria-label", "Agrega una canción en assets/music/song.mp3");
            this.button.disabled = false;
        }
    };

    const AnswerModule = {
        init() {
            this.yes = $("#yesButton");
            this.no = $("#noButton");
            this.modal = $("#successModal");
            this.close = $("#successClose");
            this.heart = new HeartParticles($("#heartCanvas"));

            this.bindYes();
            this.bindNo();
            this.bindModal();
        },

        bindYes() {
            if (!this.yes) {
                return;
            }

            this.yes.addEventListener("click", () => {
                this.openSuccess();
                this.heart.play();
                AmbientModule.petalCanvas?.burst(130);
                this.launchPetalConfetti();
                this.bloomScreen();
            });
        },

        bindNo() {
            if (!this.no) {
                return;
            }

            const flee = (event) => {
                event.preventDefault();
                this.moveNoButton();
            };

            this.no.addEventListener("pointerenter", flee);
            this.no.addEventListener("pointerdown", flee);
            this.no.addEventListener("touchstart", flee, { passive: false });
            this.no.addEventListener("click", flee);
        },

        bindModal() {
            if (!this.modal) {
                return;
            }

            this.close?.addEventListener("click", () => this.closeSuccess());
            this.modal.addEventListener("click", (event) => {
                if (event.target === this.modal) {
                    this.closeSuccess();
                }
            });

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape" && this.modal.classList.contains("is-open")) {
                    this.closeSuccess();
                }
            });
        },

        moveNoButton() {
            const wrapper = this.no.closest(".answer-actions");

            if (!wrapper) {
                return;
            }

            const wrapperRect = wrapper.getBoundingClientRect();
            const buttonRect = this.no.getBoundingClientRect();
            const maxX = Math.max(0, wrapperRect.width - buttonRect.width);
            const maxY = Math.max(0, wrapperRect.height - buttonRect.height);
            const nextX = random(0, maxX);
            const nextY = random(0, maxY);

            this.no.style.position = "absolute";
            this.no.style.left = `${nextX}px`;
            this.no.style.top = `${nextY}px`;
            this.no.animate([
                { transform: "scale(1)" },
                { transform: "scale(.94) rotate(-1deg)" },
                { transform: "scale(1)" }
            ], {
                duration: 260,
                easing: "cubic-bezier(.2,.8,.2,1)"
            });
        },

        openSuccess() {
            if (!this.modal) {
                return;
            }

            this.modal.classList.add("is-open");
            this.modal.setAttribute("aria-hidden", "false");
            this.close?.focus({ preventScroll: true });
        },

        closeSuccess() {
            if (!this.modal) {
                return;
            }

            this.modal.classList.remove("is-open");
            this.modal.setAttribute("aria-hidden", "true");
            this.yes?.focus({ preventScroll: true });
        },

        launchPetalConfetti() {
            const count = state.reduceMotion ? 18 : 90;
            const fragment = document.createDocumentFragment();

            for (let i = 0; i < count; i += 1) {
                const petal = document.createElement("span");
                const size = random(8, 18);

                petal.setAttribute("aria-hidden", "true");
                petal.style.position = "fixed";
                petal.style.zIndex = "124";
                petal.style.top = `${random(-12, 20)}vh`;
                petal.style.left = `${random(0, 100)}vw`;
                petal.style.width = `${size}px`;
                petal.style.height = `${size * 1.42}px`;
                petal.style.borderRadius = "60% 40% 60% 0";
                petal.style.background = `rgba(${Math.random() > 0.5 ? "217,122,154" : "180,85,116"}, ${random(0.46, 0.9)})`;
                petal.style.transform = `rotate(${random(0, 360)}deg)`;
                petal.style.pointerEvents = "none";
                petal.style.animation = `particleFall ${random(4.4, 8.2)}s linear forwards`;
                petal.style.animationDelay = `${random(0, 0.45)}s`;
                fragment.appendChild(petal);

                window.setTimeout(() => petal.remove(), 9000);
            }

            document.body.appendChild(fragment);
        },

        bloomScreen() {
            const count = state.reduceMotion ? 8 : 34;

            for (let i = 0; i < count; i += 1) {
                window.setTimeout(() => {
                    const bloom = document.createElement("span");
                    bloom.className = "rose-bloom";
                    bloom.style.left = `${random(8, 92)}vw`;
                    bloom.style.top = `${random(10, 90)}vh`;
                    bloom.style.animationDelay = `${random(0, 0.2)}s`;
                    document.body.appendChild(bloom);
                    window.setTimeout(() => bloom.remove(), 1800);
                }, i * 34);
            }
        }
    };

    class HeartParticles {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas ? canvas.getContext("2d") : null;
            this.width = 0;
            this.height = 0;
            this.dpr = 1;
            this.particles = [];
            this.startTime = 0;
            this.running = false;
            this.boundFrame = this.frame.bind(this);
            this.boundResize = this.resize.bind(this);
        }

        play() {
            if (!this.canvas || !this.ctx) {
                return;
            }

            this.resize();
            window.addEventListener("resize", this.boundResize);
            this.createParticles();
            this.startTime = performance.now();

            if (!this.running) {
                this.running = true;
                requestAnimationFrame(this.boundFrame);
            }
        }

        resize() {
            this.dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = Math.floor(this.width * this.dpr);
            this.canvas.height = Math.floor(this.height * this.dpr);
            this.canvas.style.width = `${this.width}px`;
            this.canvas.style.height = `${this.height}px`;
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }

        createParticles() {
            const centerX = this.width / 2;
            const centerY = this.height / 2;
            const scale = Math.min(this.width, this.height) / 34;
            const count = state.reduceMotion ? 80 : 220;
            this.particles = [];

            for (let i = 0; i < count; i += 1) {
                const t = (i / count) * Math.PI * 2;
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

                this.particles.push({
                    startX: centerX + random(-this.width * 0.45, this.width * 0.45),
                    startY: centerY + random(-this.height * 0.38, this.height * 0.38),
                    targetX: centerX + x * scale,
                    targetY: centerY + y * scale,
                    x: centerX,
                    y: centerY,
                    size: random(2, 5),
                    delay: random(0, 0.36),
                    color: Math.random() > 0.45 ? "217,122,154" : "255,255,255",
                    alpha: random(0.52, 0.98)
                });
            }
        }

        frame(now) {
            const elapsed = (now - this.startTime) / 1000;
            this.ctx.clearRect(0, 0, this.width, this.height);

            this.particles.forEach((particle) => {
                const raw = clamp((elapsed - particle.delay) / 1.35, 0, 1);
                const eased = 1 - Math.pow(1 - raw, 3);
                const dissolve = elapsed > 2.8 ? clamp(1 - (elapsed - 2.8) / 1.1, 0, 1) : 1;

                particle.x = particle.startX + (particle.targetX - particle.startX) * eased;
                particle.y = particle.startY + (particle.targetY - particle.startY) * eased;

                this.ctx.save();
                this.ctx.globalAlpha = particle.alpha * dissolve;
                this.ctx.fillStyle = `rgba(${particle.color}, 1)`;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });

            if (elapsed < 4.2) {
                requestAnimationFrame(this.boundFrame);
                return;
            }

            this.ctx.clearRect(0, 0, this.width, this.height);
            this.running = false;
            window.removeEventListener("resize", this.boundResize);
        }
    }

    const CursorModule = {
        init() {
            const cursor = $("#customCursor");
            const soft = $("#customCursorSoft");

            if (!cursor || !soft || window.matchMedia("(pointer: coarse)").matches) {
                return;
            }

            let x = window.innerWidth / 2;
            let y = window.innerHeight / 2;
            let softX = x;
            let softY = y;

            const animate = () => {
                softX += (x - softX) * 0.16;
                softY += (y - softY) * 0.16;
                cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
                soft.style.transform = `translate3d(${softX}px, ${softY}px, 0) translate(-50%, -50%)`;
                requestAnimationFrame(animate);
            };

            window.addEventListener("pointermove", (event) => {
                x = event.clientX;
                y = event.clientY;
            }, { passive: true });

            $$("a, button, input, .gallery-card, .memory-tile, .envelope").forEach((element) => {
                element.addEventListener("pointerenter", () => document.body.classList.add("is-pointer-active"));
                element.addEventListener("pointerleave", () => document.body.classList.remove("is-pointer-active"));
            });

            animate();
        }
    };

    const NavigationModule = {
        init() {
            this.header = $("[data-header]");
            this.backToTop = $("#backToTop");
            this.links = $$(".site-nav a");

            this.bindScrollState();
            this.bindBackToTop();
            this.bindActiveLinks();
        },

        bindScrollState() {
            window.addEventListener("scroll", () => {
                const scrollY = window.scrollY || document.documentElement.scrollTop;
                const shouldHide = scrollY > state.previousScrollY && scrollY > 220;

                this.header?.classList.toggle("is-hidden", shouldHide);
                this.backToTop?.classList.toggle("is-visible", scrollY > 720);
                state.previousScrollY = Math.max(0, scrollY);
            }, { passive: true });
        },

        bindBackToTop() {
            this.backToTop?.addEventListener("click", () => {
                if (state.lenis) {
                    state.lenis.scrollTo(0);
                } else {
                    window.scrollTo({ top: 0, behavior: state.reduceMotion ? "auto" : "smooth" });
                }
            });
        },

        bindActiveLinks() {
            const targets = this.links
                .map((link) => $(link.getAttribute("href")))
                .filter(Boolean);

            if (!targets.length || !("IntersectionObserver" in window)) {
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    this.links.forEach((link) => {
                        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
                    });
                });
            }, {
                rootMargin: "-45% 0px -45% 0px",
                threshold: 0
            });

            targets.forEach((target) => observer.observe(target));
        }
    };

    const AccessibilityModule = {
        init() {
            this.handleReducedMotionChanges();
            this.preventFocusLoss();
        },

        handleReducedMotionChanges() {
            const media = window.matchMedia("(prefers-reduced-motion: reduce)");

            media.addEventListener?.("change", (event) => {
                state.reduceMotion = event.matches;
            });
        },

        preventFocusLoss() {
            document.addEventListener("keydown", (event) => {
                if (event.key !== "Tab") {
                    return;
                }

                document.body.classList.add("is-keyboard-user");
            }, { once: true });
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => App.init(), { once: true });
    } else {
        App.init();
    }
})();
