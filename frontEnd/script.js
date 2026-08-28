document.addEventListener('DOMContentLoaded', () => {

  if (!window.location.hash) {
    history.replaceState(null, "", "#home");
  }

  try {
    const revealTargets = document.querySelectorAll('.reveal, .reveal-zoom');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealTargets.forEach(el => observer.observe(el));
    } else {
      revealTargets.forEach(el => el.classList.add('active'));
    }
  } catch (err) {
    document.querySelectorAll('.reveal, .reveal-zoom').forEach(el => el.classList.add('active'));
  }

  try {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
      }, { passive: true });
    }
  } catch (err) {}

  try {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navActions = document.getElementById('navActions');

    if (navToggle && navLinks && navActions) {
      navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navActions.classList.toggle('open', isOpen);
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });

      [...navLinks.querySelectorAll('a'), ...navActions.querySelectorAll('a')].forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          navActions.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  } catch (err) {}

  try {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.toggle(
              'active',
              a.getAttribute('href') === `#${entry.target.id}`
            ));
            history.replaceState(null, "", `#${entry.target.id}`);
          }
        });
      }, { threshold: 0.5 });
      sections.forEach(s => navObserver.observe(s));
    }
  } catch (err) {}

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  try {
    const firefliesWrap = document.getElementById('fireflies');
    if (firefliesWrap && !prefersReducedMotion) {
      const COUNT = 20;
      for (let i = 0; i < COUNT; i++) {
        const f = document.createElement('span');
        f.className = 'firefly';
        const startX = Math.random() * 100;
        const startY = 20 + Math.random() * 70;
        const dx = (Math.random() - 0.5) * 160;
        const dy = -(60 + Math.random() * 140);
        const duration = 6 + Math.random() * 8;
        const delay = Math.random() * 8;
        f.style.left = `${startX}%`;
        f.style.top = `${startY}%`;
        f.style.setProperty('--dx', `${dx}px`);
        f.style.setProperty('--dy', `${dy}px`);
        f.style.animationDuration = `${duration}s`;
        f.style.animationDelay = `${delay}s`;
        firefliesWrap.appendChild(f);
      }
    }
  } catch (err) {}

  try {
    const heroModel = document.getElementById('heroModel');
    const heroModelWrap = document.getElementById('heroModelWrap');
    if (heroModel && heroModelWrap) {
      heroModel.addEventListener('load', () => heroModelWrap.classList.add('model-ready'));
      heroModel.addEventListener('error', () => heroModelWrap.classList.add('model-error'));
    }
  } catch (err) {}

  try {
    const roster = Array.from(document.querySelectorAll('.roster-item'));
    const fighterModel = document.getElementById('fighterModel');
    const fighterModelWrap = document.getElementById('fighterModelWrap');
    const fighterFallback = document.getElementById('fighterFallback');
    const fighterName = document.getElementById('fighterName');
    const fighterRole = document.getElementById('fighterRole');
    const fighterIndex = document.getElementById('fighterIndex');
    const fighterBadge = document.getElementById('fighterBadge');
    const fighterEnter = document.getElementById('fighterEnter');
    const equipeSection = document.getElementById('equipe');

    if (roster.length && fighterModel && fighterModelWrap && fighterFallback && fighterName && fighterRole && fighterIndex && fighterBadge && fighterEnter) {
      let currentIndex = 0;

      // Só um avatar pequeno gira por vez (o selecionado, ou o que está sob
      // o mouse/foco) — girar os 14 ao mesmo tempo o tempo todo é o que
      // deixava a seção pesada. Parado, ele continua sempre no ângulo certo
      // (nunca de cabeça para baixo) graças ao min/max-camera-orbit.
      function setSpin(item, on) {
        const mv = item.querySelector('.roster-thumb model-viewer');
        if (mv) mv.toggleAttribute('auto-rotate', on);
      }

      function selectFighter(index, { focus = false, scroll = true } = {}) {
        const item = roster[index];
        if (!item) return;
        currentIndex = index;

        roster.forEach(r => {
          r.classList.remove('is-active');
          r.setAttribute('aria-selected', 'false');
          setSpin(r, false);
        });
        item.classList.add('is-active');
        item.setAttribute('aria-selected', 'true');
        setSpin(item, true);
        if (scroll) {
          item.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }
        if (focus) item.focus();

        const { name, role, model, page, badge, bg } = item.dataset;
        fighterName.textContent = name;
        fighterRole.textContent = role;
        fighterIndex.textContent = `Integrante ${String(index + 1).padStart(2, '0')}`;
        fighterFallback.querySelector('.initials').textContent = name.charAt(0).toUpperCase();

        if (page) {
          fighterEnter.hidden = false;
          fighterEnter.setAttribute('href', page);
        } else {
          // Sem página de perfil cadastrada (ex.: Raissa) — o botão some
          // em vez de levar a lugar nenhum.
          fighterEnter.hidden = true;
          fighterEnter.removeAttribute('href');
        }

        fighterModel.setAttribute('src', model);
        fighterModelWrap.classList.remove('model-ready', 'model-error');
        fighterModelWrap.style.backgroundImage = bg ? `url('${bg}')` : 'none';

        if (badge) {
          fighterBadge.textContent = badge;
          fighterBadge.hidden = false;
          const badgeLower = badge.toLowerCase();
          const badgeType = badgeLower.includes('mestre')
            ? 'mestre'
            : (badgeLower.includes('back') ? 'back' : 'front');
          fighterBadge.setAttribute('data-type', badgeType);
        } else {
          fighterBadge.hidden = true;
          fighterBadge.removeAttribute('data-type');
        }
      }

      roster.forEach((item, i) => {
        item.classList.add('tts-trigger');
        item.setAttribute('data-tts', `${item.dataset.name}. ${item.dataset.role}${item.dataset.badge ? '. ' + item.dataset.badge : ''}.`);
        item.addEventListener('click', () => selectFighter(i));
        item.addEventListener('mouseenter', () => setSpin(item, true));
        item.addEventListener('mouseleave', () => setSpin(item, item.classList.contains('is-active')));
        item.addEventListener('focus', () => setSpin(item, true));
        item.addEventListener('blur', () => setSpin(item, item.classList.contains('is-active')));

        const thumbViewer = item.querySelector('model-viewer');
        const thumbWrap = item.querySelector('.roster-thumb');
        if (thumbViewer && thumbWrap) {
          thumbViewer.addEventListener('load', () => thumbWrap.classList.add('model-ready'));
          thumbViewer.addEventListener('error', () => thumbWrap.classList.remove('model-ready'));
        }
      });

      fighterModel.addEventListener('load', () => fighterModelWrap.classList.add('model-ready'));
      fighterModel.addEventListener('error', () => fighterModelWrap.classList.add('model-error'));

      document.addEventListener('keydown', (e) => {
        if (!equipeSection) return;
        const rect = equipeSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (!isVisible) return;
        if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          selectFighter((currentIndex + 1) % roster.length, { focus: true });
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          selectFighter((currentIndex - 1 + roster.length) % roster.length, { focus: true });
        }
        if (e.key === 'Enter' && document.activeElement !== fighterEnter) {
          fighterEnter.click();
        }
      });

      selectFighter(0, { scroll: false });
    }
  } catch (err) {}

  try {
    const lazyModels = Array.from(document.querySelectorAll('.roster-thumb model-viewer[data-src]'));

    if (lazyModels.length) {
      if ('IntersectionObserver' in window) {
        const STAGGER_MS = 120;
        let queued = 0;

        // Só busca o .glb de cada avatar quando ele realmente se aproxima da
        // tela, e ainda assim em fila (um pouco espaçado no tempo) — em vez
        // de disparar os 14 modelos ao mesmo tempo e travar a página.
        const loadObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const mv = entry.target;
            if (entry.isIntersecting && !mv.src) {
              const delay = queued * STAGGER_MS;
              queued += 1;
              setTimeout(() => {
                if (!mv.src) mv.src = mv.dataset.src;
              }, delay);
              loadObserver.unobserve(mv);
            }
          });
        }, { rootMargin: '200px 0px', threshold: 0.01 });

        lazyModels.forEach(mv => {
          loadObserver.observe(mv);
        });
      } else {
        lazyModels.forEach(mv => { mv.src = mv.dataset.src; });
      }
    }
  } catch (err) {}

  try {
    let vozAtivada = false;
    const sintetizador = window.speechSynthesis;
    let vozPortugues = null;

    if (sintetizador) {
      function carregarVozes() {
        const vozes = sintetizador.getVoices();
        vozPortugues =
          vozes.find(v => v.lang === 'pt-BR') ||
          vozes.find(v => v.lang.startsWith('pt')) ||
          null;
      }
      carregarVozes();
      if (sintetizador.onvoiceschanged !== undefined) {
        sintetizador.onvoiceschanged = carregarVozes;
      }

      function falar(texto) {
        if (!vozAtivada || !texto) return;
        sintetizador.cancel();
        const fala = new SpeechSynthesisUtterance(texto);
        fala.lang = 'pt-BR';
        if (vozPortugues) fala.voice = vozPortugues;
        fala.rate = 1;
        fala.pitch = 1;
        fala.volume = 1;
        sintetizador.speak(fala);
      }

      const btnAcessibilidade = document.getElementById('btn-acessibilidade');
      const a11yStatus = document.getElementById('a11yStatus');

      if (btnAcessibilidade) {
        function alternarVoz() {
          vozAtivada = !vozAtivada;

          btnAcessibilidade.classList.toggle('is-active', vozAtivada);
          btnAcessibilidade.setAttribute('aria-pressed', String(vozAtivada));
          btnAcessibilidade.setAttribute(
            'aria-label',
            vozAtivada ? 'Desativar leitura por voz' : 'Ativar leitura por voz'
          );

          if (a11yStatus) {
            a11yStatus.textContent = vozAtivada
              ? 'Leitura por voz ativada.'
              : 'Leitura por voz desativada.';
          }

          if (vozAtivada) {
            falar('Acessibilidade ativada. Passe o mouse pelos elementos para ouvir a descrição.');
          } else {
            sintetizador.cancel();
          }
        }

        btnAcessibilidade.addEventListener('click', alternarVoz);

        document.addEventListener('keydown', (e) => {
          if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
          if (e.key.toLowerCase() === 'v') alternarVoz();
        });

        document.addEventListener('mouseover', (event) => {
          const elemento = event.target.closest('.tts-trigger');
          if (!elemento || !vozAtivada) return;
          if (elemento._ttsHover) return;
          elemento._ttsHover = true;
          falar(elemento.getAttribute('data-tts'));
        });

        document.addEventListener('mouseout', (event) => {
          const elemento = event.target.closest('.tts-trigger');
          if (!elemento) return;
          if (elemento.contains(event.relatedTarget)) return;
          elemento._ttsHover = false;
        });

        document.addEventListener('focusin', (event) => {
          const elemento = event.target.closest('.tts-trigger');
          if (elemento) falar(elemento.getAttribute('data-tts'));
        });

        document.addEventListener('click', (event) => {
          const elemento = event.target.closest('.tts-trigger');
          if (elemento && elemento !== btnAcessibilidade) falar(elemento.getAttribute('data-tts'));
        });
      }
    }
  } catch (err) {}

});
