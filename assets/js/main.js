/* AX Consulting - mobile menu, smooth scroll, legal modals */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Current year in footer */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Mobile menu */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var toggleLabel = document.getElementById('menu-toggle-label');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('hidden', !open);
    toggle.querySelector('.icon-open').classList.toggle('hidden', open);
    toggle.querySelector('.icon-close').classList.toggle('hidden', !open);
    if (toggleLabel) toggleLabel.textContent = open ? 'Close menu' : 'Open menu';
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* Smooth scroll for in-page links */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      setMenu(false);

      if (id === 'top') {
        window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      } else {
        target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      }

      /* Move focus for keyboard and screen reader users */
      var focusTarget = id === 'top' ? document.getElementById('main') : target;
      if (focusTarget) {
        if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus({ preventScroll: true });
      }

      if (history.pushState) {
        history.pushState(null, '', id === 'top' ? window.location.pathname : '#' + id);
      }
    });
  });

  /* Legal modals (native dialog: Esc closes by default) */
  var lastTrigger = null;

  function openModal(dialog, trigger) {
    if (!dialog) return;
    lastTrigger = trigger || null;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.classList.add('modal-open');
    var body = dialog.querySelector('.legal-modal__body');
    if (body) body.scrollTop = 0;
  }

  function closeModal(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
      onClosed();
    }
  }

  function onClosed() {
    document.body.classList.remove('modal-open');
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(document.getElementById(btn.getAttribute('data-modal-open')), btn);
    });
  });

  document.querySelectorAll('dialog.legal-modal').forEach(function (dialog) {
    dialog.querySelectorAll('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeModal(dialog);
      });
    });

    /* Click on the backdrop closes the dialog */
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeModal(dialog);
    });

    dialog.addEventListener('close', onClosed);
  });
})();
