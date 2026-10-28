const menuButton = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (menuButton && primaryNav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    primaryNav.classList.toggle('is-open', open);
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
      primaryNav.classList.remove('is-open');
    });
  });
}

const websiteStage = document.querySelector('.website-stage');
const siteCards = [...document.querySelectorAll('.website-card')];
const stageName = document.querySelector('[data-stage-name]');
const stageTitle = document.querySelector('[data-stage-title]');
const stageUrl = document.querySelector('[data-stage-url]');
const stageLink = document.querySelector('[data-stage-link]');

siteCards.forEach((card) => {
  const selectButton = card.querySelector('.site-select');
  if (!selectButton) return;
  selectButton.addEventListener('click', () => {
    const { name, url, link } = card.dataset;
    siteCards.forEach((item) => {
      const selected = item === card;
      item.classList.toggle('is-selected', selected);
      item.querySelector('.site-select')?.classList.toggle('is-selected', selected);
      item.querySelector('.site-select')?.setAttribute('aria-pressed', String(selected));
    });
    websiteStage.dataset.site = name;
    stageName.textContent = name;
    stageTitle.textContent = name;
    stageUrl.textContent = url;
    if (link) {
      stageLink.href = link;
      stageLink.hidden = false;
    } else {
      stageLink.hidden = true;
    }
  });
  selectButton.setAttribute('aria-pressed', String(selectButton.classList.contains('is-selected')));
});

document.querySelectorAll('.viewport-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.viewport-button').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    websiteStage.dataset.viewport = button.dataset.viewport;
  });
});

document.querySelectorAll('.story-details').forEach((details) => {
  details.addEventListener('toggle', () => {
    const marker = details.querySelector('summary span');
    if (marker) marker.textContent = details.open ? '−' : '+';
  });
});

const revealTargets = document.querySelectorAll('.section-block, .project-card, .website-card, .brand-gallery-row, .contact-panel');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealTargets.forEach((target) => {
    target.classList.add('reveal');
    observer.observe(target);
  });
}

const graphicCarousels = [...document.querySelectorAll('.brand-marquee')];
const brandGalleries = document.querySelector('.brand-galleries');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const artworkDialog = document.createElement('div');
artworkDialog.className = 'artwork-dialog';
artworkDialog.setAttribute('role', 'dialog');
artworkDialog.setAttribute('aria-modal', 'true');
artworkDialog.setAttribute('aria-label', 'Expanded graphic artwork');
artworkDialog.hidden = true;
artworkDialog.innerHTML = `
  <div class="artwork-dialog-panel">
    <header class="artwork-dialog-header">
      <div><span class="section-label">GRAPHIC PLAYGROUND</span><h2 data-artwork-title>Artwork</h2></div>
      <button class="artwork-close" type="button" aria-label="Close expanded artwork">×</button>
    </header>
    <div class="artwork-zoom-viewport"><div class="artwork-zoom-content" data-artwork-content></div></div>
    <footer class="artwork-dialog-footer">
      <span>ZOOM <output data-zoom-value>100%</output></span>
      <span>CLICK TO ZOOM · DRAG TO MOVE · CLICK AGAIN TO RESET</span>
    </footer>
  </div>`;
document.body.append(artworkDialog);
const artworkZoomViewport = artworkDialog.querySelector('.artwork-zoom-viewport');
const artworkZoomContent = artworkDialog.querySelector('[data-artwork-content]');
let artworkZoom = 100;
let pendingArtworkFocus = null;
let artworkFocusTimer = 0;
const scrollToArtworkFocus = () => {
  if (!pendingArtworkFocus || artworkZoom <= 100) return;
  const { x, y } = pendingArtworkFocus;
  pendingArtworkFocus = null;
  window.clearTimeout(artworkFocusTimer);
  const horizontalPadding = Number.parseFloat(getComputedStyle(artworkZoomViewport).paddingLeft) || 0;
  const verticalPadding = Number.parseFloat(getComputedStyle(artworkZoomViewport).paddingTop) || 0;
  const visibleWidth = artworkZoomViewport.clientWidth - horizontalPadding * 2;
  const visibleHeight = artworkZoomViewport.clientHeight - verticalPadding * 2;
  artworkZoomViewport.scrollTo({
    left:Math.max(0, x * artworkZoomContent.offsetWidth - visibleWidth / 2),
    top:Math.max(0, y * artworkZoomContent.offsetHeight - visibleHeight / 2),
    behavior:'smooth'
  });
};
artworkZoomContent.addEventListener('transitionend', (event) => {
  if (event.propertyName === 'width') scrollToArtworkFocus();
});
const setArtworkZoom = (value) => {
  artworkZoom = Math.max(100, Math.min(180, Number(value)));
  artworkDialog.querySelector('[data-zoom-value]').textContent = `${artworkZoom}%`;
  const availableHeight = window.innerHeight - (window.matchMedia('(max-width: 640px)').matches ? 210 : 200);
  const baseWidth = Math.max(180, Math.min(window.innerWidth * 0.9, availableHeight * 0.8));
  artworkZoomContent.style.width = `${baseWidth * artworkZoom / 100}px`;
  artworkZoomContent.classList.toggle('is-zoomed', artworkZoom > 100);
  artworkZoomViewport.classList.toggle('is-zoomed', artworkZoom > 100);
};
const openArtwork = (card) => {
  const brand = card.closest('.brand-gallery-row')?.querySelector('.brand-row-head h3')?.textContent.trim() || 'Graphic';
  const label = card.querySelector('small')?.textContent.trim() || 'Artwork';
  artworkDialog.querySelector('[data-artwork-title]').textContent = `${brand} · ${label}`;
  const expandedCard = card.cloneNode(true);
  expandedCard.removeAttribute('aria-hidden');
  expandedCard.setAttribute('aria-label', `Click to zoom in on ${brand} ${label}`);
  expandedCard.tabIndex = 0;
  artworkZoomContent.replaceChildren(expandedCard);
  setArtworkZoom(100);
  artworkZoomViewport.scrollTo(0, 0);
  artworkDialog.hidden = false;
  artworkDialog.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  artworkDialog.querySelector('.artwork-close').focus();
};
const closeArtwork = () => {
  artworkDialog.classList.remove('is-open');
  artworkDialog.hidden = true;
  document.body.style.overflow = '';
};
artworkDialog.querySelector('.artwork-close').addEventListener('click', closeArtwork);
artworkDialog.addEventListener('click', (event) => {
  if (event.target === artworkDialog) closeArtwork();
});
const toggleArtworkZoom = (card, clientX, clientY) => {
  if (artworkZoom > 100) {
    pendingArtworkFocus = null;
    window.clearTimeout(artworkFocusTimer);
    setArtworkZoom(100);
    artworkZoomViewport.scrollTo({ left:0, top:0, behavior:'smooth' });
    return;
  }
  const bounds = card.getBoundingClientRect();
  const focusX = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
  const focusY = Math.max(0, Math.min(1, (clientY - bounds.top) / bounds.height));
  pendingArtworkFocus = { x:focusX, y:focusY };
  setArtworkZoom(180);
  window.clearTimeout(artworkFocusTimer);
  artworkFocusTimer = window.setTimeout(scrollToArtworkFocus, 300);
};
let artworkPanStart = null;
let artworkWasPanned = false;
artworkZoomContent.addEventListener('pointerdown', (event) => {
  if (artworkZoom <= 100 || event.isPrimary === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
  artworkWasPanned = false;
  artworkPanStart = {
    x:event.clientX,
    y:event.clientY,
    left:artworkZoomViewport.scrollLeft,
    top:artworkZoomViewport.scrollTop
  };
});
window.addEventListener('pointermove', (event) => {
  if (!artworkPanStart) return;
  if (event.pointerType !== 'touch' && event.buttons === 0) return;
  const dx = event.clientX - artworkPanStart.x;
  const dy = event.clientY - artworkPanStart.y;
  if (!artworkWasPanned && Math.hypot(dx, dy) < 4) return;
  artworkWasPanned = true;
  artworkZoomContent.classList.add('is-panning');
  event.preventDefault();
  artworkZoomViewport.scrollLeft = artworkPanStart.left - dx;
  artworkZoomViewport.scrollTop = artworkPanStart.top - dy;
});
['pointerup', 'pointercancel', 'lostpointercapture'].forEach((eventName) => {
  window.addEventListener(eventName, () => {
    artworkPanStart = null;
    artworkZoomContent.classList.remove('is-panning');
  });
});
artworkZoomViewport.addEventListener('click', (event) => {
  if (artworkWasPanned) {
    artworkWasPanned = false;
    event.preventDefault();
    return;
  }
  const card = event.target.closest('.brand-art-placeholder');
  if (card) toggleArtworkZoom(card, event.clientX, event.clientY);
});
artworkZoomViewport.addEventListener('keydown', (event) => {
  const card = event.target.closest('.brand-art-placeholder');
  if (card && ['Enter', ' '].includes(event.key)) {
    event.preventDefault();
    const bounds = card.getBoundingClientRect();
    toggleArtworkZoom(card, bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && artworkDialog.classList.contains('is-open')) closeArtwork();
});

const motionToggle = document.querySelector('[data-motion-toggle]');
let carouselsPaused = false;
if (motionToggle) {
  motionToggle.addEventListener('click', () => {
    carouselsPaused = !carouselsPaused;
    motionToggle.setAttribute('aria-pressed', String(carouselsPaused));
    motionToggle.textContent = carouselsPaused ? 'Resume motion' : 'Pause motion';
    brandGalleries?.classList.toggle('is-paused', carouselsPaused);
  });
}

graphicCarousels.forEach((carousel) => {
  let dragStart = null;
  let dragged = false;
  const track = carousel.querySelector('.brand-track');
  const artwork = [...track.querySelectorAll('.brand-art-placeholder')].slice(0, 3).map((item) => item.cloneNode(true));
  const buildLoop = () => {
    const firstRun = artwork.map((item) => {
      const clone = item.cloneNode(true);
      clone.removeAttribute('aria-hidden');
      return clone;
    });
    track.replaceChildren(...firstRun);
    let nextArtwork = 0;
    while (track.scrollWidth < carousel.clientWidth + firstRun[0].offsetWidth + 10) {
      const clone = artwork[nextArtwork++ % artwork.length].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.append(clone);
    }
    const loopWidth = track.scrollWidth;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.style.setProperty('--loop-distance', `${loopWidth + gap}px`);
    track.append(...[...track.children].map((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    }));
    track.querySelectorAll('.brand-art-placeholder').forEach((card, index) => {
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Expand ${card.querySelector('small')?.textContent.trim() || 'artwork'}`);
      card.tabIndex = index < firstRun.length ? 0 : -1;
    });
    carousel.scrollLeft = 0;
  };
  buildLoop();
  let interactionTimer;
  const pauseForInteraction = () => {
    carousel.classList.add('is-interacting');
    window.clearTimeout(interactionTimer);
    interactionTimer = window.setTimeout(() => carousel.classList.remove('is-interacting'), 1200);
  };
  carousel.addEventListener('click', (event) => {
    if (dragged) {
      dragged = false;
      event.preventDefault();
      return;
    }
    const card = event.target.closest('.brand-art-placeholder');
    if (card) openArtwork(card);
  });
  carousel.addEventListener('keydown', (event) => {
    const card = event.target.closest('.brand-art-placeholder');
    if (!card || !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    openArtwork(card);
  });
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach((eventName) => {
    carousel.addEventListener(eventName, pauseForInteraction, { passive:true });
  });
  carousel.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    dragged = false;
    dragStart = { x:event.clientX, scrollLeft:carousel.scrollLeft };
  });
  carousel.addEventListener('pointermove', (event) => {
    if (!dragStart) return;
    const distance = event.clientX - dragStart.x;
    if (Math.abs(distance) > 3) {
      event.preventDefault();
      if (!dragged) {
        dragged = true;
        carousel.setPointerCapture(event.pointerId);
      }
    }
    pauseForInteraction();
    carousel.scrollLeft = dragStart.scrollLeft - distance;
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((eventName) => {
    carousel.addEventListener(eventName, () => { dragStart = null; });
  });
});
window.addEventListener('resize', () => {
  graphicCarousels.forEach((carousel) => {
    const track = carousel.querySelector('.brand-track');
    const artwork = [...track.querySelectorAll('.brand-art-placeholder')].slice(0, 3).map((item) => item.cloneNode(true));
    const firstRun = artwork.map((item) => { const clone = item.cloneNode(true); clone.removeAttribute('aria-hidden'); return clone; });
    track.replaceChildren(...firstRun);
    let nextArtwork = 0;
    while (track.scrollWidth < carousel.clientWidth + firstRun[0].offsetWidth + 10) {
      const clone = artwork[nextArtwork++ % artwork.length].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.append(clone);
    }
    const loopWidth = track.scrollWidth;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    track.style.setProperty('--loop-distance', `${loopWidth + gap}px`);
    track.append(...[...track.children].map((item) => { const clone = item.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); return clone; }));
    track.querySelectorAll('.brand-art-placeholder').forEach((card, index) => {
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Expand ${card.querySelector('small')?.textContent.trim() || 'artwork'}`);
      card.tabIndex = index < firstRun.length ? 0 : -1;
    });
    carousel.scrollLeft = 0;
  });
}, { passive:true });

const parallaxItems = [...document.querySelectorAll('.project-visual, .website-preview')];
let scrollFrame = 0;
const updateParallax = () => {
  scrollFrame = 0;
  if (reduceMotion.matches) return;
  const viewportMidpoint = window.innerHeight / 2;
  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
    const itemMidpoint = rect.top + rect.height / 2;
    const offset = Math.max(-32, Math.min(32, (viewportMidpoint - itemMidpoint) * 0.07));
    item.style.setProperty('--scroll-offset', `${offset.toFixed(1)}px`);
  });
};

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateParallax);
}, { passive:true });
window.addEventListener('resize', updateParallax, { passive:true });
updateParallax();

reduceMotion.addEventListener?.('change', () => {
  if (reduceMotion.matches) {
    parallaxItems.forEach((item) => item.style.removeProperty('--scroll-offset'));
  }
});

const statRotator = document.querySelector('.stat-rotator');
if (statRotator) {
  const slides = [...statRotator.querySelectorAll('.stat-slide')];
  const segments = [...statRotator.querySelectorAll('.stat-progress span')];
  const statIndex = statRotator.querySelector('.stat-index');
  let activeStat = 0;

  const countUp = (number) => {
    const target = Number(number.dataset.count);
    if (reduceMotion.matches) {
      number.textContent = target;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 900, 1);
      number.textContent = Math.round(target * (1 - (1 - progress) ** 3));
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };

  const showStat = (next) => {
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-leaving', index === activeStat);
      slide.classList.toggle('is-active', index === next);
    });
    segments.forEach((segment, index) => {
      segment.classList.toggle('is-done', index < next);
      segment.classList.toggle('is-current', index === next);
    });
    statIndex.textContent = `(${String(next + 1).padStart(2, '0')})`;
    countUp(slides[next].querySelector('[data-count]'));
    activeStat = next;
  };

  // The progress bar's animation drives the rotation, so hovering the card pauses both.
  statRotator.addEventListener('animationend', (event) => {
    if (event.animationName !== 'stat-progress' || reduceMotion.matches) return;
    showStat((activeStat + 1) % slides.length);
  });
  window.setInterval(() => {
    if (reduceMotion.matches && !statRotator.matches(':hover')) showStat((activeStat + 1) % slides.length);
  }, 5000);
  countUp(slides[0].querySelector('[data-count]'));
}
