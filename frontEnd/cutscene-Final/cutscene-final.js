document.addEventListener('DOMContentLoaded', () => {

  const PROXIMA_TELA = '../Ranking/ranking.html';

  const stage = document.getElementById('cutsceneStage');
  const video = document.getElementById('cutsceneVideo');
  const captionOne = document.getElementById('captionOne');
  const captionErro = document.getElementById('captionErro');
  const btnPular = document.getElementById('btnPular');
  const btnSom = document.getElementById('btnSom');
  const btnPlayFallback = document.getElementById('btnPlayFallback');
  const fade = document.getElementById('cutsceneFade');

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

  if (!video) return;

  let jaSeguiu = false;


  setTimeout(() => {
    if (captionOne) captionOne.classList.add('is-hidden');
  }, 4000);

  function seguirParaJogo() {
    if (jaSeguiu) return;
    jaSeguiu = true;
    try { video.pause(); } catch (err) {}
    if (fade) {
      fade.classList.add('is-active');
      setTimeout(() => { window.location.href = PROXIMA_TELA; }, 850);
    } else {
      window.location.href = PROXIMA_TELA;
    }
  }


  function tentarAutoplay() {
    const promessa = video.play();
    if (promessa && typeof promessa.catch === 'function') {
      promessa.catch(() => {

        if (btnPlayFallback) btnPlayFallback.hidden = false;
      });
    }
  }
  tentarAutoplay();

  if (btnPlayFallback) {
    btnPlayFallback.addEventListener('click', (e) => {
      e.stopPropagation();
      btnPlayFallback.hidden = true;
      if (video.error) {
        seguirParaJogo();
      } else {
        video.play();
      }
    });
  }

  // --- Quando o vídeo termina, segue automaticamente para o ranking
  video.addEventListener('ended', seguirParaJogo);

  // --- Se o vídeo não carregar, avisa e libera um jeito de continuar
  video.addEventListener('error', () => {
    if (captionErro) captionErro.hidden = false;
    if (btnPlayFallback) {
      btnPlayFallback.hidden = false;
      btnPlayFallback.textContent = 'Continuar mesmo assim';
    }
  });

  // --- Botão de pular: para o vídeo e já segue pro ranking
  if (btnPular) {
    btnPular.addEventListener('click', seguirParaJogo);
  }

  // --- Botão de som: liga/desliga o áudio do vídeo
  if (btnSom) {
    btnSom.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      btnSom.classList.toggle('is-active', !video.muted);
      btnSom.setAttribute('aria-pressed', String(!video.muted));
      btnSom.textContent = video.muted ? '🔇 Som' : '🔊 Som';
    });
  }

});
