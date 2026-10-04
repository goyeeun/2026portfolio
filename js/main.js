(function () {
    // 첫 진입 시 인트로로 보내기(인트로 → index 복귀 시 무한 루프 방지)
    // - intro.js가 sessionStorage.from_intro=1 을 세팅한 뒤 index.html로 replace 함
    // - index에서 이 값을 확인하고 즉시 제거해서 "해당 탭 세션"에서 1회만 인트로가 뜨도록 함
    try {
        var params = null;
        try { params = new URLSearchParams(window.location.search || ''); } catch (e) {}
        var skipIntro = params && params.get('skipIntro') === '1';

        var path = (window.location && window.location.pathname) ? window.location.pathname : '';
        var isIndex = /(?:\/|\\)(index\.html)?$/.test(path) || path === '' || path === '/';
        var cameFromIntro = sessionStorage.getItem('from_intro') === '1';
        if (isIndex && skipIntro) {
            // 로고 클릭 등으로 index에 "바로 진입"해야 할 때: 인트로 스킵 + URL 정리
            try {
                if (window.history && window.history.replaceState) {
                    params.delete('skipIntro');
                    var q = params.toString();
                    var clean = window.location.pathname + (q ? '?' + q : '') + (window.location.hash || '');
                    window.history.replaceState(null, '', clean);
                }
            } catch (e) {}
        } else if (isIndex && !cameFromIntro) {
            window.location.replace('intro.html');
            return;
        }
        if (cameFromIntro) sessionStorage.removeItem('from_intro');
    } catch (e) {}

    var header = document.getElementById('header');
    var nav = header && header.querySelector('.nav');
    var toggle = header && header.querySelector('.nav-toggle');
    var closeBtn = header && header.querySelector('.nav-close');
    var backdrop = document.querySelector('.nav-backdrop');
    var themeToggle = header && header.querySelector('.theme-toggle');

    if (!nav || !toggle) return;

    function setOpen(isOpen) {
        nav.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
        if (backdrop) {
            backdrop.hidden = !isOpen;
            backdrop.classList.toggle('is-visible', isOpen);
        }
    }

    toggle.addEventListener('click', function () {
        setOpen(!nav.classList.contains('is-open'));
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            setOpen(false);
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', function () {
            setOpen(false);
        });
    }

    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            setOpen(false);
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setOpen(false);
    });
})();

(function () {
    // JS로 생성하는 움직이는 그라데이션(메인 비주얼/히어로 전용)
    var hero = document.querySelector('#hero');
    var canvas = document.querySelector('.hero-gradient');
    if (!hero || !canvas) return;

    function getTheme() {
        var t = document.documentElement.dataset.theme;
        return t === 'light' ? 'light' : 'dark';
    }

    // 라이트 모드에서는 '떠다니는 배경' FX를 사용하지 않음(CSS에서 정적 배경으로 처리)
    if (getTheme() === 'light') return;

    var reduceMotion = false;
    try {
        reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {}
    if (reduceMotion) return;

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = 0, h = 0;

    function resize() {
        w = Math.max(1, hero.clientWidth || 1);
        h = Math.max(1, hero.clientHeight || 1);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        // CSS로 100% cover를 이미 주고 있어서 스타일 width/height는 건드리지 않음
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function palette() {
        if (getTheme() === 'light') {
            // 파스텔 블롭: 라벤더 / 피치 / 민트 / 버터 — 에어로솔처럼 옅게 겹침
            return {
                base: 'rgb(252,248,244)',
                blobs: [
                    'rgba(230,210,255,0.42)',
                    'rgba(255,205,210,0.38)',
                    'rgba(190,235,220,0.36)',
                    'rgba(255,228,180,0.40)'
                ],
                spray: [
                    'rgba(255,192,203,0.18)',
                    'rgba(186,220,255,0.20)',
                    'rgba(200,255,230,0.16)',
                    'rgba(255,218,185,0.18)',
                    'rgba(230,210,255,0.15)'
                ]
            };
        }
        return {
            base: 'rgba(13,13,13,1)',
            blobs: ['rgba(201,168,108,0.30)', 'rgba(255,255,255,0.10)', 'rgba(201,168,108,0.18)', 'rgba(120,180,255,0.06)'],
            spray: null
        };
    }

    // 블롭(라디얼 그라데이션) 4개를 서로 다른 주기로 움직이게 함
    var blobs = [
        { x: 0.18, y: 0.20, r: 0.55, sx: 0.11, sy: 0.09, ph: 0.0 },
        { x: 0.82, y: 0.18, r: 0.50, sx: 0.09, sy: 0.11, ph: 1.4 },
        { x: 0.55, y: 0.78, r: 0.65, sx: 0.08, sy: 0.07, ph: 2.2 },
        { x: 0.35, y: 0.62, r: 0.45, sx: 0.12, sy: 0.08, ph: 3.1 }
    ];

    // 라이트 모드 스프레이 입자(작은 원 + 불규칙 궤적)
    var sprays = [];
    for (var si = 0; si < 22; si++) {
        sprays.push({
            x: Math.random(),
            y: Math.random(),
            r: 0.028 + Math.random() * 0.048,
            ph: Math.random() * Math.PI * 2,
            vx: 0.45 + Math.random() * 0.85,
            vy: 0.4 + Math.random() * 0.75,
            idx: si
        });
    }

    function clearWithBase(base) {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, w, h);
    }

    function drawBlob(cx, cy, radius, color) {
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        g.addColorStop(0, color);
        g.addColorStop(0.55, color.replace(/[\d.]+\)\s*$/, '0.10)'));
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    /** 라이트 모드 스프레이: 가장자리가 금방 사라지는 부드러운 원 */
    function drawSprayBlob(cx, cy, radius, color) {
        var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        g.addColorStop(0, color);
        g.addColorStop(0.42, color.replace(/,\s*[\d.]+\)$/, ',0.09)'));
        g.addColorStop(0.78, color.replace(/,\s*[\d.]+\)$/, ',0.02)'));
        g.addColorStop(1, 'rgba(252,248,244,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    var start = performance.now();
    var rafId = 0;
    function tick(now) {
        var t = (now - start) / 1000;
        var p = palette();
        clearWithBase(p.base);

        ctx.globalCompositeOperation = 'screen';
        for (var i = 0; i < blobs.length; i++) {
            var b = blobs[i];
            var amp = getTheme() === 'light' ? 0.14 : 0.10;
            var cx = (b.x + Math.sin(t * b.sx + b.ph) * amp) * w;
            var cy = (b.y + Math.cos(t * b.sy + b.ph) * amp) * h;
            var r = b.r * Math.min(w, h) * (0.55 + 0.10 * Math.sin(t * 0.5 + b.ph));
            drawBlob(cx, cy, r, p.blobs[i % p.blobs.length]);
        }

        if (p.spray && p.spray.length) {
            ctx.globalCompositeOperation = 'lighter';
            for (var j = 0; j < sprays.length; j++) {
                var s = sprays[j];
                var spx = (s.x + Math.sin(t * s.vx + s.ph) * 0.18 + Math.sin(t * 0.33 + s.idx) * 0.04) * w;
                var spy = (s.y + Math.cos(t * s.vy + s.ph * 1.3) * 0.16 + Math.cos(t * 0.27 + s.idx) * 0.035) * h;
                var sr = s.r * Math.min(w, h) * (0.85 + 0.15 * Math.sin(t * 0.8 + s.ph));
                drawSprayBlob(spx, spy, sr, p.spray[s.idx % p.spray.length]);
            }
        }

        // 다크만 비네트(multiply) — 라이트는 이미 CSS 파스텔이 비치므로 가장자리만 어둡게 하면 배경이 죽음
        if (getTheme() !== 'light') {
            ctx.globalCompositeOperation = 'multiply';
            var vg = ctx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.2, w * 0.5, h * 0.45, Math.min(w, h) * 0.85);
            vg.addColorStop(0, 'rgba(0,0,0,0)');
            vg.addColorStop(1, 'rgba(0,0,0,0.22)');
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, w, h);
        }

        ctx.globalCompositeOperation = 'source-over';
        rafId = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // 히어로 높이가 반응형으로 바뀌는 경우까지 커버
    if ('ResizeObserver' in window) {
        try {
            var ro = new ResizeObserver(function () { resize(); });
            ro.observe(hero);
        } catch (e) {}
    }

    // 테마가 라이트로 바뀌면 캔버스 애니메이션을 멈춤(라이트는 CSS 정적 배경)
    if ('MutationObserver' in window) {
        try {
            var mo = new MutationObserver(function () {
                if (getTheme() === 'light') {
                    if (rafId) cancelAnimationFrame(rafId);
                    rafId = 0;
                    ctx.clearRect(0, 0, w, h);
                }
            });
            mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        } catch (e) {}
    }

    rafId = requestAnimationFrame(tick);
})();

(function () {
    var header = document.getElementById('header');
    if (!header) return;
    var last = 0;
    function onScroll() {
        var y = window.scrollY || 0;
        if (Math.abs(y - last) < 6) return;
        last = y;
        header.classList.toggle('is-scrolled', y > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

(function () {
    var btns = document.querySelectorAll('.theme-toggle, .dark-light-toggle');
    if (!btns.length) return;

    function getTheme() {
        var t = document.documentElement.dataset.theme;
        return t === 'light' ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        btns.forEach(function (btn) {
            btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
            var label = btn.querySelector('.theme-toggle-label');
            if (label) label.textContent = theme === 'light' ? 'Light' : 'Dark';
        });
        try { localStorage.setItem('theme', theme); } catch (e) {}
    }

    // 초기 상태 동기화(헤드에서 이미 dataset.theme를 세팅했을 수 있음)
    applyTheme(getTheme());

    btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
        });
    });
})();

(function () {
    // 스크롤 리빌: 섹션 타이틀/설명/카드를 자동으로 대상으로 잡아줌
    var targets = [];
    document.querySelectorAll('.section-title, .section-desc, .about-profile-wrap, .about-content, .work-card, .contact-list li, .hero-content > *, .portfolio-body p, .portfolio-meta li, .showcase-heading, .showcase-lead, .popup-tile, .browser-mockup')
        .forEach(function (el) { targets.push(el); });
    if (!targets.length) return;

    // reveal 클래스가 없으면 부여
    targets.forEach(function (el, idx) {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        var d = String(Math.min(4, (idx % 5)));
        if (d !== '0' && !el.hasAttribute('data-reveal-delay')) el.setAttribute('data-reveal-delay', d);
    });

    if (!('IntersectionObserver' in window)) {
        targets.forEach(function (el) { el.classList.add('is-inview'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-inview');
                io.unobserve(entry.target);
            }
        });
    }, { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { io.observe(el); });
})();

(function () {
    // 히어로 패럴럭스(마우스에 따라 배경이 아주 살짝 이동)
    var hero = document.querySelector('.hero');
    var bg = hero && hero.querySelector('.hero-image');
    if (!hero || !bg) return;
    var isCoarse = false;
    try { isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches; } catch (e) {}
    if (isCoarse) return;

    var targetX = 0, targetY = 0;
    var curX = 0, curY = 0;
    var raf = 0;

    function tick() {
        curX += (targetX - curX) * 0.08;
        curY += (targetY - curY) * 0.08;
        bg.style.transform = 'translate3d(' + curX.toFixed(2) + 'px,' + curY.toFixed(2) + 'px,0)';
        raf = requestAnimationFrame(tick);
    }

    hero.addEventListener('mousemove', function (e) {
        var r = hero.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        targetX = nx * 14;
        targetY = ny * 12;
        if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    hero.addEventListener('mouseleave', function () {
        targetX = 0; targetY = 0;
    });
})();

(function () {
    // Edwin Le 스타일: 반복 타이포 레이어를 스크롤에 따라 아주 미세하게 어긋나게
    var hero = document.getElementById('hero');
    if (!hero) return;
    var stack = hero.querySelector('.hero-stack');
    if (!stack) return;
    var lines = stack.querySelectorAll('.hero-stack-line');
    if (!lines.length) return;

    var isReduced = false;
    try { isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    if (isReduced) return;

    var base = [0, 0.8, 1.6, 2.4]; // px
    var scrollShift = 0;
    var raf = 0;

    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

    function computeShift() {
        var r = hero.getBoundingClientRect();
        var vh = Math.max(1, window.innerHeight || 1);
        // 히어로가 뷰포트에 있는 동안만 0..1
        var t = (vh - r.top) / (vh + r.height);
        var p = clamp(t, 0, 1);
        // 과하면 거슬림 → 0~8px 사이에서만 움직이게
        scrollShift = (p - 0.5) * 16;
    }

    function render() {
        raf = 0;
        // 첫 줄(실제 읽는 줄)은 고정, 나머지 레이어만 이동
        for (var i = 1; i < lines.length; i++) {
            var baseX = typeof base[i] === 'number' ? base[i] : 0;
            var x = baseX + scrollShift * (0.22 * i);
            lines[i].style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
        }
    }

    function request() {
        if (!raf) raf = requestAnimationFrame(render);
    }

    function onScroll() {
        computeShift();
        request();
    }

    computeShift();
    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
})();

(function () {
    // Typing effect: "welcome to"는 고정, 뒤 문자열만 타이핑
    var hero = document.getElementById('hero');
    if (!hero) return;
    var typedEls = hero.querySelectorAll('.hero-typed[data-typed-text]');
    if (!typedEls.length) return;

    var isReduced = false;
    try { isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

    var fullText = typedEls[0].getAttribute('data-typed-text') || '';
    if (!fullText) return;

    // 타이핑 시작 전에 최종 폭을 측정해 미리 확보(줄바꿈/흔들림 방지)
    // 단, 모바일(특히 375px 이하)에서는 폭 고정이 오히려 잘림을 유발하므로 비활성화
    (function reserveWidth() {
        var vw = Math.max(0, window.innerWidth || 0);
        if (vw && vw <= 420) return;
        try {
            var probe = document.createElement('span');
            probe.className = 'hero-typed';
            probe.style.position = 'absolute';
            probe.style.visibility = 'hidden';
            probe.style.whiteSpace = 'nowrap';
            probe.style.pointerEvents = 'none';
            probe.textContent = fullText;
            // 첫 typed 요소 옆에 붙여서 동일 폰트/스타일을 상속받게 함
            var parent = typedEls[0].parentElement || hero;
            parent.appendChild(probe);
            var w = Math.ceil(probe.getBoundingClientRect().width);
            probe.remove();
            if (w > 0) {
                typedEls.forEach(function (el) {
                    el.style.setProperty('--typed-width', w + 'px');
                });
            }
        } catch (e) {}
    })();

    if (isReduced) {
        typedEls.forEach(function (el) {
            el.textContent = fullText;
            el.classList.add('is-done');
        });
        return;
    }

    // 초기화
    typedEls.forEach(function (el) { el.textContent = ''; el.classList.remove('is-done'); });

    var i = 0;
    var speed = 70; // ms per char
    var startDelay = 250;

    function tick() {
        i += 1;
        var slice = fullText.slice(0, i);
        typedEls.forEach(function (el) { el.textContent = slice; });
        if (i < fullText.length) {
            setTimeout(tick, speed);
        } else {
            typedEls.forEach(function (el) { el.classList.add('is-done'); });
        }
    }

    setTimeout(tick, startDelay);
})();

(function () {
    var wraps = document.querySelectorAll('.work-slider-wrap');
    if (!wraps.length) return;

    wraps.forEach(function (wrap) {
        var track = wrap.querySelector('.work-track');
        var slides = wrap.querySelectorAll('.work-slide');
        var prevBtn = wrap.querySelector('.work-btn-prev');
        var nextBtn = wrap.querySelector('.work-btn-next');
        var dotsEl = wrap.querySelector('.work-dots');
        var totalSlides = slides.length;
        var currentPage = 0;
        var perView = 1;
        var totalPages = 0;

        if (!track || !totalSlides) return;

        var isSiteMockup = wrap.classList.contains('site-mockup-slider');
        var isPopupSlider = wrap.classList.contains('popup-slider-wrap');

        function readPerView() {
            if (isSiteMockup) {
                perView = 1;
                totalPages = Math.max(1, Math.ceil(totalSlides / perView));
                return;
            }
            var raw = '';
            try { raw = getComputedStyle(wrap).getPropertyValue('--work-per-view'); } catch (e) {}
            var n = parseInt(String(raw).trim(), 10);
            perView = Number.isFinite(n) && n > 0 ? n : 1;
            if (isPopupSlider) {
                totalPages = Math.max(1, totalSlides - perView + 1);
            } else {
                totalPages = Math.max(1, Math.ceil(totalSlides / perView));
            }
        }

        /* flex %가 깨질 때 px 고정 (1열·팝업 슬라이더) */
        function usePixelSlideLayout() {
            return isSiteMockup || isPopupSlider || perView === 1;
        }

        function slideWidthPx() {
            var sliderW = sliderViewportWidthPx();
            if (isPopupSlider && perView > 1) {
                return perView > 0 ? Math.floor(sliderW / perView) : sliderW;
            }
            return sliderW;
        }

        function clearPixelSlideStyles() {
            slides.forEach(function (slide) {
                slide.style.removeProperty('flex');
                slide.style.removeProperty('width');
                slide.style.removeProperty('min-width');
                slide.style.removeProperty('max-width');
            });
        }

        function applyPixelWidths() {
            if (!usePixelSlideLayout()) return;
            var sw = slideWidthPx();
            slides.forEach(function (slide) {
                slide.style.setProperty('flex', '0 0 ' + sw + 'px', 'important');
                slide.style.setProperty('width', sw + 'px', 'important');
                slide.style.setProperty('min-width', sw + 'px', 'important');
                slide.style.setProperty('max-width', sw + 'px', 'important');
            });
        }

        function sliderViewportWidthPx() {
            var slider = wrap.querySelector('.work-slider');
            if (!slider) return 0;
            return Math.max(0, Math.floor(slider.getBoundingClientRect().width));
        }

        function renderDots() {
            if (!dotsEl) return;
            dotsEl.innerHTML = '';
            for (var i = 0; i < totalPages; i++) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'dot' + (i === 0 ? ' is-active' : '');
                dot.setAttribute('aria-label', '슬라이드 ' + (i + 1));
                (function (idx) {
                    dot.addEventListener('click', function () {
                        goTo(idx);
                    });
                })(i);
                dotsEl.appendChild(dot);
            }
        }

        function goTo(index) {
            if (isPopupSlider && totalPages > 1) {
                if (index < 0) index = totalPages - 1;
                else if (index >= totalPages) index = 0;
            } else {
                if (index < 0) index = 0;
                if (index >= totalPages) index = totalPages - 1;
            }
            currentPage = index;
            if (usePixelSlideLayout()) {
                applyPixelWidths();
                track.style.transform = 'translateX(-' + (currentPage * slideWidthPx()) + 'px)';
            } else {
                clearPixelSlideStyles();
                var pct = totalSlides > 0 ? (currentPage * perView / totalSlides) * 100 : 0;
                track.style.transform = 'translateX(-' + pct + '%)';
            }
            if (dotsEl) {
                dotsEl.querySelectorAll('.dot').forEach(function (dot, i) {
                    dot.classList.toggle('is-active', i === currentPage);
                });
            }
        }

        function updateNavVisibility() {
            [prevBtn, nextBtn, dotsEl].filter(Boolean).forEach(function (el) {
                el.style.display = totalPages <= 1 ? 'none' : '';
            });
        }

        readPerView();
        renderDots();
        goTo(0);
        updateNavVisibility();

        if (usePixelSlideLayout()) {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    applyPixelWidths();
                    goTo(currentPage);
                });
            });
        }

        if ('ResizeObserver' in window) {
            try {
                var roSlider = wrap.querySelector('.work-slider');
                if (roSlider) {
                    var ro = new ResizeObserver(function () {
                        var pv = perView;
                        readPerView();
                        if (pv !== perView) {
                            renderDots();
                            updateNavVisibility();
                        }
                        if (usePixelSlideLayout()) {
                            applyPixelWidths();
                        } else {
                            clearPixelSlideStyles();
                        }
                        goTo(Math.min(currentPage, totalPages - 1));
                    });
                    ro.observe(roSlider);
                }
            } catch (e) {}
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                goTo(currentPage - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                goTo(currentPage + 1);
            });
        }

        window.addEventListener('resize', function () {
            var before = perView;
            readPerView();
            if (before !== perView) {
                renderDots();
                updateNavVisibility();
            }
            if (usePixelSlideLayout()) {
                applyPixelWidths();
            } else {
                clearPixelSlideStyles();
            }
            goTo(Math.min(currentPage, totalPages - 1));
        });
    });
})();

(function () {
    var lb = document.getElementById('work-lightbox');
    if (!lb) return;

    var backdrop = lb.querySelector('.work-lightbox__backdrop');
    var closeBtn = lb.querySelector('.work-lightbox__close');
    var visual = lb.querySelector('.work-lightbox__visual');
    var titleEl = lb.querySelector('.work-lightbox__title');
    var descEl = lb.querySelector('.work-lightbox__desc');
    var lastFocus = null;

    function buildPlaceholder(theme, cardTitle, cardLine) {
        var wrap = document.createElement('div');
        wrap.className = 'lb-placeholder lb-placeholder--' + theme;
        var card = document.createElement('div');
        card.className = 'lb-placeholder__card';
        var strong = document.createElement('strong');
        strong.textContent = cardTitle;
        var p = document.createElement('p');
        p.textContent = cardLine;
        card.appendChild(strong);
        card.appendChild(p);
        wrap.appendChild(card);
        return wrap;
    }

    function buildCompareSide(label, src, altText) {
        var side = document.createElement('figure');
        side.className = 'lb-compare__side';

        var caption = document.createElement('figcaption');
        caption.className = 'lb-compare__label';
        caption.textContent = label;
        side.appendChild(caption);

        var frame = document.createElement('div');
        frame.className = 'lb-compare__frame';

        if (src) {
            var im = document.createElement('img');
            im.src = src;
            im.alt = altText || label;
            im.addEventListener('error', function () {
                frame.innerHTML = '';
                var ph = document.createElement('div');
                ph.className = 'lb-compare__placeholder';
                ph.textContent = label + ' 이미지를 불러올 수 없습니다';
                frame.appendChild(ph);
            });
            frame.appendChild(im);
        } else {
            var ph2 = document.createElement('div');
            ph2.className = 'lb-compare__placeholder';
            ph2.textContent = label + ' 이미지를 추가해 주세요';
            frame.appendChild(ph2);
        }

        side.appendChild(frame);
        return side;
    }

    function buildComparePair(beforeSrc, afterSrc, beforeEl, afterEl) {
        var wrap = document.createElement('div');
        wrap.className = 'lb-compare';
        wrap.appendChild(buildCompareSide('Before', beforeSrc, beforeEl && beforeEl.getAttribute('alt')));
        wrap.appendChild(buildCompareSide('After', afterSrc, afterEl && afterEl.getAttribute('alt')));
        return wrap;
    }

    function openFromButton(btn) {
        if (!visual || !titleEl || !descEl) return;
        var theme = btn.getAttribute('data-lb-theme') || 'tripeleven';
        var t = btn.getAttribute('data-lb-title') || '';
        var d = btn.getAttribute('data-lb-desc') || '';
        var cardTitle = btn.getAttribute('data-lb-card-title') || t;
        var cardLine = btn.getAttribute('data-lb-card-line') || '';

        var item = btn.closest('.work-item');

        var beforeEl = item ? item.querySelector('.popup-tile__lb-image--before') : null;
        var afterEl = item ? item.querySelector('.popup-tile__lb-image--after') : null;
        var beforeSrc = beforeEl ? (beforeEl.getAttribute('src') || '').trim() : '';
        var afterSrc = afterEl ? (afterEl.getAttribute('src') || '').trim() : '';
        var isCompare = !!(beforeEl && afterEl);

        visual.innerHTML = '';
        visual.classList.remove('work-lightbox__visual--image');
        visual.classList.remove('work-lightbox__visual--compare');
        lb.classList.remove('work-lightbox--wide');

        if (isCompare) {
            visual.classList.add('work-lightbox__visual--compare');
            lb.classList.add('work-lightbox--wide');
            visual.appendChild(buildComparePair(beforeSrc, afterSrc, beforeEl, afterEl));
        } else {
            var lbImgEl = item ? item.querySelector('.popup-tile__lb-image') : null;
            var imgSrc = lbImgEl ? (lbImgEl.getAttribute('src') || '').trim() : '';
            if (!imgSrc) {
                var previewImgEl = item ? item.querySelector('.popup-tile__preview-image') : null;
                imgSrc = previewImgEl ? (previewImgEl.getAttribute('src') || '').trim() : '';
            }
            if (!imgSrc) {
                imgSrc = (btn.getAttribute('data-lb-img') || '').trim();
            }
            if (imgSrc) {
                visual.classList.add('work-lightbox__visual--image');
                var im = document.createElement('img');
                im.src = imgSrc;
                im.alt = (lbImgEl && lbImgEl.getAttribute('alt')) || t || '';
                im.addEventListener('error', function () {
                    visual.innerHTML = '';
                    visual.classList.remove('work-lightbox__visual--image');
                    visual.appendChild(buildPlaceholder(theme, cardTitle, cardLine));
                });
                visual.appendChild(im);
            } else {
                visual.appendChild(buildPlaceholder(theme, cardTitle, cardLine));
            }
        }

        titleEl.textContent = t;
        descEl.textContent = d;
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
    }

    function closeLb() {
        lb.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus && typeof lastFocus.focus === 'function') {
            try { lastFocus.focus(); } catch (e) {}
        }
        lastFocus = null;
    }

    document.querySelectorAll('.popup-tile[data-lb-title]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            lastFocus = btn;
            openFromButton(btn);
        });
    });

    if (backdrop) backdrop.addEventListener('click', closeLb);
    if (closeBtn) closeBtn.addEventListener('click', closeLb);

    document.addEventListener('keydown', function (e) {
        if (!lb.hidden && e.key === 'Escape') closeLb();
    });
})();
