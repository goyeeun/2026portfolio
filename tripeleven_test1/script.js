/* ===========================================================
   숲결 (SOOPGYUL) Pension — 공통 스크립트
   네비/푸터 주입, 스크롤 애니메이션, 모바일 메뉴, 예약폼
   =========================================================== */

(function () {
  "use strict";

  // 현재 페이지 파일명 (활성 메뉴 표시에 사용)
  var current = location.pathname.split("/").pop() || "index.html";

  /* ---------- 객실 데이터 (유동적으로 추가/수정 가능) ---------- */
  var ROOMS = [
    {
      id: "forest",
      tag: "Standard",
      name: "포레스트 룸",
      summary: "숲을 향한 통창과 아늑한 우드 인테리어. 2인 커플을 위한 감성 공간.",
      desc: "숲을 향한 통창과 따뜻한 우드톤 인테리어가 어우러진 아늑한 객실. 두 사람을 위한 가장 다정한 공간입니다. 아침이면 창 너머 숲의 결을 따라 햇살이 스며듭니다.",
      features: ["기준 2인 / 최대 3인", "더블 침대", "통창 뷰", "미니 주방", "욕조"],
      meta: "기준 2인 · 최대 3인",
      price: "180,000원~",
      images: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80"
      ]
    },
    {
      id: "poolvilla",
      tag: "Pool Villa",
      name: "풀빌라 스위트",
      summary: "프라이빗 야외 풀과 스파가 더해진 단 하나뿐인 독채 객실.",
      desc: "프라이빗 야외 수영장과 스파를 독채로 누리는 숲결의 시그니처 객실. 특별한 기념일과 프라이빗한 휴식에 어울립니다.",
      features: ["기준 4인 / 최대 6인", "침실 2개", "프라이빗 풀", "야외 스파", "거실 & 다이닝"],
      meta: "기준 4인 · 최대 6인",
      price: "390,000원~",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1400&q=80"
      ]
    },
    {
      id: "garden",
      tag: "Family",
      name: "가든 테라스 룸",
      summary: "바베큐 데크와 정원을 품은, 가족 여행에 어울리는 넉넉한 객실.",
      desc: "바베큐 데크와 넓은 정원을 품은 패밀리 객실. 아이와 함께하는 가족 여행, 친구들과의 모임에 넉넉한 공간입니다.",
      features: ["기준 4인 / 최대 5인", "침실 2개", "전용 BBQ 데크", "정원 테라스", "주방 풀옵션"],
      meta: "기준 4인 · 최대 5인",
      price: "260,000원~",
      images: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1400&q=80"
      ]
    },
    {
      id: "sky",
      tag: "Suite",
      name: "스카이 스위트",
      summary: "고원의 하늘과 맞닿은 복층 구조로 탁 트인 전망을 즐기는 객실.",
      desc: "고원의 하늘과 맞닿은 복층 구조의 스위트. 2층 통창 너머로 펼쳐지는 능선과 별빛을 오롯이 누릴 수 있습니다.",
      features: ["기준 2인 / 최대 4인", "복층 구조", "파노라마 뷰", "스파 욕조", "라운지 소파"],
      meta: "기준 2인 · 최대 4인",
      price: "320,000원~",
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1400&q=80"
      ]
    },
    {
      id: "cabin",
      tag: "Cabin",
      name: "우드 캐빈",
      summary: "통원목으로 지은 아담한 독채. 벽난로와 함께하는 따뜻한 쉼.",
      desc: "통원목으로 지은 아담한 독채 객실. 장작 벽난로와 나무 향이 가득한 공간에서 느리게 흐르는 시간을 만끽하세요.",
      features: ["기준 2인 / 최대 3인", "독채형", "벽난로", "원목 인테리어", "테라스"],
      meta: "기준 2인 · 최대 3인",
      price: "210,000원~",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=80"
      ]
    },
    {
      id: "riverview",
      tag: "Riverview",
      name: "리버뷰 룸",
      summary: "계곡물 소리가 흐르는 창가에서 즐기는 평온한 휴식 공간.",
      desc: "계곡을 향해 자리한 리버뷰 룸. 창을 열면 물소리가 방 안 가득 들어와, 자연이 들려주는 소리로 하루를 마무리할 수 있습니다.",
      features: ["기준 2인 / 최대 4인", "계곡 뷰", "넓은 창", "원목 데크", "차 세트"],
      meta: "기준 2인 · 최대 4인",
      price: "230,000원~",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1505881502353-a1986add3762?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80"
      ]
    }
  ];

  function getRoom(id) {
    for (var i = 0; i < ROOMS.length; i++) {
      if (ROOMS[i].id === id) return ROOMS[i];
    }
    return ROOMS[0];
  }

  /* ---------- 헤더 / 네비게이션 ---------- */
  var roomSubmenu = ROOMS.map(function (room) {
    return '<li><a href="room-detail.html?id=' + room.id + '">' + room.name + "</a></li>";
  }).join("");

  var navHTML = `
    <header class="site-header" id="siteHeader">
      <div class="wrap nav">
        <a href="index.html" class="brand">
          숲결
          <small>SOOPGYUL PENSION</small>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="메뉴 열기">
          <span></span><span></span><span></span>
        </button>
        <ul class="menu" id="menu">
          <li class="menu__close-item">
            <button class="menu-close" id="menuClose" aria-label="메뉴 닫기">&times;</button>
          </li>
          <li>
            <a href="about-landscape.html">ABOUT</a>
            <ul class="submenu">
              <li><a href="about-landscape.html">외부풍경</a></li>
              <li><a href="about-location.html">오시는길</a></li>
            </ul>
          </li>
          <li>
            <a href="rooms.html">ROOMS</a>
            <ul class="submenu">
              <li><a href="rooms.html">객실 미리보기</a></li>
              ${roomSubmenu}
            </ul>
          </li>
          <li>
            <a href="special-pool.html">SPECIAL</a>
            <ul class="submenu">
              <li><a href="special-pool.html">야외수영장</a></li>
              <li><a href="special-bbq.html">바베큐</a></li>
              <li><a href="special-spa.html">스파</a></li>
            </ul>
          </li>
          <li>
            <a href="reserve-booking.html">RESERVE</a>
            <ul class="submenu">
              <li><a href="reserve-booking.html">예약하기</a></li>
              <li><a href="reserve-info.html">이용안내</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </header>
    <div class="nav-overlay" id="navOverlay"></div>`;

  /* ---------- 푸터 ---------- */
  var footerHTML = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">숲결</div>
            <p>숲의 결을 따라 흐르는 시간.<br>도심을 벗어나 온전한 쉼을 누리는 자연 속 프라이빗 펜션입니다.</p>
          </div>
          <div>
            <h4>둘러보기</h4>
            <ul>
              <li><a href="about-landscape.html">외부풍경</a></li>
              <li><a href="about-location.html">오시는길</a></li>
              <li><a href="rooms.html">객실 소개</a></li>
              <li><a href="special-pool.html">부대시설</a></li>
            </ul>
          </div>
          <div>
            <h4>예약 문의</h4>
            <ul>
              <li>전화 · 010-1234-5678</li>
              <li>운영 · 09:00 – 21:00</li>
              <li>강원도 평창군 봉평면 숲결로 24</li>
              <li><a href="reserve-booking.html">온라인 예약하기</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 SOOPGYUL Pension. All rights reserved.</span>
          <span>숲결 펜션 · 대표 이수림 · 사업자번호 123-45-67890 · <a href="admin.html" class="footer-admin">관리자</a></span>
        </div>
      </div>
    </footer>`;

  /* ---------- DOM 주입 ---------- */
  function inject(id, html, where) {
    var slot = document.getElementById(id);
    if (slot) {
      slot.innerHTML = html;
    } else {
      document.body.insertAdjacentHTML(where, html);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    inject("nav-slot", navHTML, "afterbegin");
    inject("footer-slot", footerHTML, "beforeend");

    setupHeader();
    setupMobileMenu();
    setupReveal();
    setupBookingForm();
    setupReserveDefaults();
    setupRoomList();
    setupRoomSlider();
    setupRoomDetail();
    setupHeroSlider();
    setupAdmin();
  });

  /* ---------- 객실 리스트 자동 생성 (index 슬라이더 / rooms 미리보기) ---------- */
  function setupRoomList() {
    // 배치도 범례 (번호 + 객실명, 클릭 시 상세 이동)
    document.querySelectorAll("[data-room-legend]").forEach(function (legend) {
      legend.innerHTML = ROOMS.map(function (room, i) {
        return '<li><a href="room-detail.html?id=' + room.id + '">' +
          "<span>" + (i + 1) + "</span>" + room.name +
          " <em>" + room.tag + "</em></a></li>";
      }).join("");
    });

    var containers = document.querySelectorAll("[data-room-list]");
    if (!containers.length) return;

    containers.forEach(function (box) {
      var html = "";
      ROOMS.forEach(function (room) {
        html +=
          '<a class="room-link" href="room-detail.html?id=' + room.id + '">' +
            '<article class="card">' +
              '<div class="card__media">' +
                '<img src="' + room.images[0] + '" alt="' + room.name + '" />' +
              "</div>" +
              '<div class="card__body">' +
                '<span class="card__tag">' + room.tag + "</span>" +
                '<h3 class="card__title">' + room.name + "</h3>" +
                '<p class="card__text">' + room.summary + "</p>" +
                '<div class="card__meta">' + room.meta + "</div>" +
              "</div>" +
            "</article>" +
          "</a>";
      });
      box.innerHTML = html;
    });
  }

  /* ---------- 객실 상세 (모자이크 갤러리) ---------- */
  function setupRoomDetail() {
    var gallery = document.getElementById("rdGallery");
    if (!gallery) return;

    var params = new URLSearchParams(location.search);
    var room = getRoom(params.get("id"));

    document.title = room.name + " · 숲결 SOOPGYUL";

    var slidesWrap = document.getElementById("rdSlides");
    if (slidesWrap) {
      var crumb = room.name;
      slidesWrap.innerHTML = room.images.map(function (src, i) {
        return '<div class="hero__slide' + (i === 0 ? " is-active" : "") +
          "\" style=\"background-image:url('" + src + "')\">" +
            '<div class="hero__inner">' +
              '<p class="hero__eyebrow">' + room.tag + "</p>" +
              "<h1>" + room.name + "</h1>" +
              '<p class="breadcrumb">' + crumb + "</p>" +
            "</div>" +
          "</div>";
      }).join("");
    }
    setText("rdInfoTag", room.tag);
    setText("rdInfoName", room.name);
    setText("rdDesc", room.desc);

    var priceEl = document.getElementById("rdPrice");
    if (priceEl) priceEl.innerHTML = room.price + ' <small>/ 1박 기준</small>';

    var feat = document.getElementById("rdFeatures");
    if (feat) {
      feat.innerHTML = room.features.map(function (f) {
        return "<li>" + f + "</li>";
      }).join("");
    }

    gallery.innerHTML = room.images.map(function (src, i) {
      return '<figure class="rd-shot' + (i === 0 ? " rd-shot--hero" : "") + '">' +
        '<img src="' + src + '" alt="' + room.name + " 사진 " + (i + 1) +
        '" loading="lazy" /></figure>';
    }).join("");

    // 사진 클릭 시 라이트박스로 확대
    gallery.addEventListener("click", function (e) {
      var img = e.target.closest(".rd-shot img");
      if (img) openLightbox(img.getAttribute("src"), img.getAttribute("alt"));
    });
  }

  /* ---------- 라이트박스 ---------- */
  function openLightbox(src, alt) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML =
      '<button class="lightbox__close" aria-label="닫기">&times;</button>' +
      '<img src="' + src + '" alt="' + (alt || "") + '" />';
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("is-open"); });

    function close() {
      box.classList.remove("is-open");
      setTimeout(function () { box.remove(); }, 300);
      document.removeEventListener("keydown", onKey);
    }
    function onKey(ev) { if (ev.key === "Escape") close(); }

    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.closest(".lightbox__close")) close();
    });
    document.addEventListener("keydown", onKey);
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  /* ---------- 히어로 슬라이드 (메인 + 하위 페이지 공통) ---------- */
  function setupHeroSlider() {
    document.querySelectorAll(".hero").forEach(function (slider) {
      var slides = slider.querySelectorAll(".hero__slide");
      if (slides.length < 2) return;

      var dotsWrap = slider.querySelector(".hero__dots");
      var prevBtn = slider.querySelector(".hero__arrow--prev");
      var nextBtn = slider.querySelector(".hero__arrow--next");
      var index = 0;
      var timer = null;
      var INTERVAL = 6000;

      // 카운터 생성 (현재 / 전체)
      var curEl = null;
      if (dotsWrap) {
        dotsWrap.innerHTML =
          '<span class="hero__count-cur">1</span>' +
          '<span class="hero__count-sep"></span>' +
          '<span class="hero__count-total">' + slides.length + "</span>";
        curEl = dotsWrap.querySelector(".hero__count-cur");
      }

      function render() {
        slides.forEach(function (s, i) {
          s.classList.toggle("is-active", i === index);
        });
        if (curEl) curEl.textContent = index + 1;
      }

      function go(i, manual) {
        index = (i + slides.length) % slides.length;
        render();
        if (manual) restart();
      }

      function next() { go(index + 1); }
      function prev() { go(index - 1); }

      function start() { timer = setInterval(next, INTERVAL); }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      function restart() { stop(); start(); }

      if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
      if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) { stop(); } else { restart(); }
      });

      render();
      start();
    });
  }

  /* ---------- 객실 슬라이더 (한 번에 3개, 좌우 이동) ---------- */
  function setupRoomSlider() {
    document.querySelectorAll(".room-slider").forEach(function (slider) {
      var track = slider.querySelector(".room-slider__track");
      if (!track) return;
      var cards = track.children;
      var prevBtn = slider.querySelector(".room-slider__arrow--prev");
      var nextBtn = slider.querySelector(".room-slider__arrow--next");
      if (cards.length === 0) return;

      var GAP = 32;
      var index = 0; // 현재 첫 카드 인덱스

      function perView() {
        return window.innerWidth <= 900 ? 1 : 3;
      }

      function maxIndex() {
        return Math.max(0, cards.length - perView());
      }

      function render() {
        if (index > maxIndex()) index = maxIndex();
        if (index < 0) index = 0;
        var step = cards[0].offsetWidth + GAP;
        track.style.transform = "translateX(" + (-step * index) + "px)";
        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= maxIndex();
      }

      if (nextBtn) nextBtn.addEventListener("click", function () {
        index = Math.min(index + perView(), maxIndex());
        render();
      });
      if (prevBtn) prevBtn.addEventListener("click", function () {
        index = Math.max(index - perView(), 0);
        render();
      });

      window.addEventListener("resize", render);
      render();
    });
  }

  /* ---------- 스크롤 시 헤더 배경 ---------- */
  function setupHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;

    // 내부 페이지(히어로 없는 페이지)는 항상 밝은 배경 헤더
    var isInner = document.body.classList.contains("inner-page");

    function onScroll() {
      if (isInner) return;
      if (window.scrollY > 60) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 모바일 메뉴 (열기/닫기 + 서브메뉴 아코디언) ---------- */
  function setupMobileMenu() {
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("menu");
    if (!toggle || !menu) return;

    var closeBtn = document.getElementById("menuClose");
    var overlay = document.getElementById("navOverlay");

    function openMenu() {
      menu.classList.add("open");
      if (overlay) overlay.classList.add("show");
      document.body.classList.add("nav-open");
    }
    function closeMenu() {
      menu.classList.remove("open");
      if (overlay) overlay.classList.remove("show");
      document.body.classList.remove("nav-open");
      // 접힌 상태로 초기화
      menu.querySelectorAll("li.open").forEach(function (li) {
        li.classList.remove("open");
      });
    }

    toggle.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    if (overlay) overlay.addEventListener("click", closeMenu);

    // 서브메뉴가 있는 상위 항목: 모바일에서는 탭하면 펼침/접힘
    var topItems = menu.children;
    for (var i = 0; i < topItems.length; i++) {
      (function (li) {
        var sub = li.querySelector(".submenu");
        var link = li.querySelector("a");
        if (!sub || !link) return;
        li.classList.add("has-sub");
        link.addEventListener("click", function (e) {
          if (window.innerWidth <= 900) {
            e.preventDefault();
            li.classList.toggle("open");
          }
        });
      })(topItems[i]);
    }

    // 실제 이동하는 하위 링크 클릭 시 메뉴 닫기
    menu.querySelectorAll(".submenu a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- 스크롤 등장 애니메이션 ---------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 예약 폼 (데모) ---------- */
  /* ---------- 예약 데이터 저장소 (localStorage) ---------- */
  var RES_KEY = "soopgyul_reservations";
  var ADMIN_PASS = "soopgyul";

  var ROOM_LABELS = {
    forest: "포레스트 룸",
    poolvilla: "풀빌라 스위트",
    garden: "가든 테라스 룸"
  };
  var BBQ_LABELS = {
    none: "신청 안 함",
    hanwoo: "한우 모둠 세트",
    pork: "삼겹살 세트",
    grill: "그릴 대여만"
  };

  function getReservations() {
    try {
      return JSON.parse(localStorage.getItem(RES_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveReservations(list) {
    localStorage.setItem(RES_KEY, JSON.stringify(list));
  }

  function addReservation(obj) {
    var list = getReservations();
    list.push(obj);
    saveReservations(list);
  }

  function deleteReservation(id) {
    saveReservations(
      getReservations().filter(function (r) { return r.id !== id; })
    );
  }

  function fieldVal(form, name) {
    var el = form.querySelector("[name=" + name + "]");
    return el ? (el.value || "").trim() : "";
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function setupBookingForm() {
    var form = document.getElementById("bookingForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("formMsg");
      var data = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: fieldVal(form, "name") || "고객",
        phone: fieldVal(form, "phone"),
        checkin: fieldVal(form, "checkin"),
        checkout: fieldVal(form, "checkout"),
        room: fieldVal(form, "room"),
        guests: fieldVal(form, "guests"),
        bbq: fieldVal(form, "bbq"),
        memo: fieldVal(form, "memo"),
        createdAt: new Date().toISOString()
      };
      addReservation(data);
      if (msg) {
        msg.textContent =
          data.name + "님, 예약 신청이 접수되었습니다. 확인 후 입력하신 연락처로 안내드리겠습니다. 감사합니다.";
        msg.classList.add("show");
        msg.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
      setupReserveDefaults();
    });
  }

  /* ---------- 관리자 페이지: 예약 현황 ---------- */
  function setupAdmin() {
    var root = document.getElementById("adminRoot");
    if (!root) return;

    if (sessionStorage.getItem("soopgyul_admin") === "1") {
      renderAdmin(root);
    } else {
      renderAdminLogin(root);
    }
  }

  function renderAdminLogin(root) {
    root.innerHTML =
      '<div class="admin-login">' +
      '<p class="admin-login__label">관리자 인증</p>' +
      '<p class="admin-login__desc">예약 현황을 확인하려면 비밀번호를 입력해 주세요.</p>' +
      '<div class="admin-login__row">' +
      '<input type="password" id="adminPass" placeholder="비밀번호" />' +
      '<button type="button" id="adminLoginBtn" class="btn btn--primary">확인</button>' +
      "</div>" +
      '<p class="admin-login__hint">* 임시 비밀번호: soopgyul</p>' +
      "</div>";

    var input = document.getElementById("adminPass");
    var btn = document.getElementById("adminLoginBtn");
    var tryLogin = function () {
      if (input.value === ADMIN_PASS) {
        sessionStorage.setItem("soopgyul_admin", "1");
        renderAdmin(root);
      } else {
        input.value = "";
        input.placeholder = "비밀번호가 올바르지 않습니다";
        input.classList.add("is-error");
      }
    };
    btn.addEventListener("click", tryLogin);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryLogin();
    });
    input.focus();
  }

  function renderAdmin(root) {
    var list = getReservations().slice().sort(function (a, b) {
      return (a.checkin || "").localeCompare(b.checkin || "");
    });

    var html =
      '<div class="admin-bar">' +
      '<div class="admin-stat"><strong>' + list.length + "</strong><span>건의 예약 신청</span></div>" +
      '<div class="admin-bar__actions">' +
      '<button type="button" id="adminRefresh" class="btn btn--wood">새로고침</button>' +
      '<button type="button" id="adminClear" class="btn btn--ghost-dark">전체 삭제</button>' +
      '<button type="button" id="adminLogout" class="btn btn--ghost-dark">로그아웃</button>' +
      "</div></div>";

    if (!list.length) {
      html += '<p class="admin-empty">아직 접수된 예약이 없습니다.</p>';
    } else {
      html +=
        '<div class="admin-table-wrap"><table class="admin-table"><thead><tr>' +
        "<th>체크인</th><th>체크아웃</th><th>예약자</th><th>연락처</th>" +
        "<th>객실</th><th>인원</th><th>바베큐</th><th>요청사항</th><th>신청일시</th><th></th>" +
        "</tr></thead><tbody>";

      list.forEach(function (r) {
        var created = r.createdAt ? new Date(r.createdAt) : null;
        var createdStr = created
          ? created.toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" })
          : "-";
        html +=
          "<tr>" +
          "<td><strong>" + escapeHtml(r.checkin) + "</strong></td>" +
          "<td>" + escapeHtml(r.checkout) + "</td>" +
          "<td>" + escapeHtml(r.name) + "</td>" +
          "<td>" + escapeHtml(r.phone) + "</td>" +
          "<td>" + escapeHtml(ROOM_LABELS[r.room] || r.room || "-") + "</td>" +
          "<td>" + escapeHtml(r.guests ? r.guests + "인" : "-") + "</td>" +
          "<td>" + escapeHtml(BBQ_LABELS[r.bbq] || r.bbq || "-") + "</td>" +
          '<td class="admin-memo">' + escapeHtml(r.memo || "-") + "</td>" +
          "<td>" + escapeHtml(createdStr) + "</td>" +
          '<td><button type="button" class="admin-del" data-id="' + escapeHtml(r.id) + '">삭제</button></td>' +
          "</tr>";
      });

      html += "</tbody></table></div>";
    }

    root.innerHTML = html;

    var refresh = document.getElementById("adminRefresh");
    if (refresh) refresh.addEventListener("click", function () { renderAdmin(root); });

    var clear = document.getElementById("adminClear");
    if (clear) clear.addEventListener("click", function () {
      if (window.confirm("모든 예약 내역을 삭제할까요? 되돌릴 수 없습니다.")) {
        saveReservations([]);
        renderAdmin(root);
      }
    });

    var logout = document.getElementById("adminLogout");
    if (logout) logout.addEventListener("click", function () {
      sessionStorage.removeItem("soopgyul_admin");
      renderAdminLogin(root);
    });

    Array.prototype.forEach.call(root.querySelectorAll(".admin-del"), function (b) {
      b.addEventListener("click", function () {
        if (window.confirm("이 예약을 삭제할까요?")) {
          deleteReservation(b.getAttribute("data-id"));
          renderAdmin(root);
        }
      });
    });
  }

  /* ---------- 날짜 입력 기본값(오늘/내일) ---------- */
  function setupReserveDefaults() {
    var ci = document.querySelector("input[name=checkin]");
    var co = document.querySelector("input[name=checkout]");
    if (!ci || !co) return;
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    var fmt = function (d) { return d.toISOString().split("T")[0]; };
    ci.min = fmt(today);
    co.min = fmt(tomorrow);
  }
})();
