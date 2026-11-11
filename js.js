/*
Furkan M. Torun
@furkanmtorun
*/


// localStorage can throw (private mode, blocked site data)
const storage = {
  get: function (key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  set: function (key, value) {
    try { localStorage.setItem(key, value); } catch (e) { }
  }
};

$(document).ready(function () {

  const $html = $('html');
  const $window = $(window);
  const $nav = $('#nav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Icons are decorative for screen readers
  $('i.fas, i.fab').attr('aria-hidden', 'true');

  // Footer year: index.html holds a static year as the no-JS fallback
  $('#currentYear').text(new Date().getFullYear());

  // GDPR notification visibility
  if (!storage.get('gdprAccepted')) {
    $('#gdprNotification').fadeIn();
  }

  // Theme: index.html applies the saved or system theme before the first paint
  function applyTheme(isLight) {
    $html.toggleClass('light', isLight);
    $('meta[name="theme-color"]').attr('content', isLight ? '#f9fafb' : '#0e1115');
  }

  // Theme toggle: the new theme grows as a circle from the button
  $('.theme-toggle').on('click', function () {
    const isLight = !$html.hasClass('light');

    // Save theme preference to localStorage
    storage.set('theme', isLight ? 'light' : 'dark');

    if (!document.startViewTransition || reducedMotion.matches) {
      applyTheme(isLight);
      return;
    }

    const rect = this.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    document.startViewTransition(function () {
      applyTheme(isLight);
    }).ready.then(function () {
      document.documentElement.animate({
        clipPath: [
          'circle(0px at ' + x + 'px ' + y + 'px)',
          'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'
        ]
      }, {
        duration: 500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement: '::view-transition-new(root)'
      });
    }).catch(function () { });
  });

  // Follow the system theme until the visitor selects one
  const systemLight = window.matchMedia('(prefers-color-scheme: light)');
  if (systemLight.addEventListener) {
    systemLight.addEventListener('change', function (e) {
      if (!storage.get('theme')) {
        applyTheme(e.matches);
      }
    });
  }

  // Mobile menu toggle
  const $menuToggle = $('.menu-toggle');
  const $mobileMenu = $('.nav-mobile-menu');

  function setMenu(isOpen) {
    $menuToggle.toggleClass('open', isOpen).attr('aria-expanded', isOpen);
    $mobileMenu.toggleClass('open', isOpen);
    $nav.toggleClass('menu-open', isOpen);
  }

  $menuToggle.on('click', function () {
    setMenu(!$mobileMenu.hasClass('open'));
  });

  // Close mobile menu when clicking a link, clicking outside, or pressing Escape
  $('.nav-mobile-menu a').on('click', function () {
    setMenu(false);
  });

  $(document).on('click', function (e) {
    if ($mobileMenu.hasClass('open') && !$(e.target).closest('#nav').length) {
      setMenu(false);
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $mobileMenu.hasClass('open')) {
      setMenu(false);
      $menuToggle.trigger('focus');
    }
  });

  // Scroll reveal: only tag elements that are still below the viewport
  let observer = null;
  let $pending = $();

  function reveal(element, delay) {
    const $element = $(element);
    if (observer) {
      observer.unobserve(element);
    }
    $pending = $pending.not(element);
    $element.css('--reveal-delay', delay + 'ms').addClass('is-visible');

    // Give the element back to its own styles after the transition
    setTimeout(function () {
      $element.removeClass('reveal is-visible').css('--reveal-delay', '');
    }, 800 + delay);
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    observer = new IntersectionObserver(function (entries) {
      let order = 0;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target, Math.min(order++ * 70, 280));
        }
      });
    }, { rootMargin: '0px 0px -6% 0px' });

    $pending = $([
      '.section:not(.section-contact) > .container > :first-child',
      '.experience-item',
      '.talk-item',
      '.publication-item',
      '.honor-item',
      '.tech-category',
      '.volunteering-item',
      '.contact-grid > *'
    ].join(', ')).filter(function () {
      return this.getBoundingClientRect().top > window.innerHeight;
    });

    $pending.addClass('reveal').each(function () {
      observer.observe(this);
    });
  }

  // Navigation scroll behavior: background, progress bar, active link
  const $sections = $('section[id]');
  const $navLinks = $('.nav-links a, .nav-mobile-menu a');
  let activeId = null;
  let ticking = false;

  function onScroll() {
    ticking = false;

    const scrollTop = $window.scrollTop();
    const maxScroll = $(document).height() - $window.height();
    const atBottom = maxScroll - scrollTop < 4;

    $nav.toggleClass('scrolled', scrollTop > 20);
    $nav.css('--scroll', String(maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0));

    // Active section: the last one that starts above the upper third of the viewport
    const probe = scrollTop + $window.height() * 0.35;
    let currentId = '';
    $sections.each(function () {
      if ($(this).offset().top <= probe) {
        currentId = this.id;
      }
    });
    if (atBottom && maxScroll > 0) {
      currentId = $sections.last().attr('id');
    }

    if (currentId !== activeId) {
      activeId = currentId;
      $navLinks.each(function () {
        const isActive = this.getAttribute('href') === '#' + currentId;
        $(this).toggleClass('active', isActive).attr('aria-current', isActive ? 'location' : null);
      });
    }

    // Nothing stays hidden at the end of the page
    if (atBottom && $pending.length) {
      $pending.each(function () {
        reveal(this, 0);
      });
    }
  }

  $window.on('scroll resize', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  });

  onScroll();

});

// GDPR notification close function
function closeNotification() {
  $("#gdprNotification").fadeOut(200)
  storage.set("gdprAccepted", "true")
}
