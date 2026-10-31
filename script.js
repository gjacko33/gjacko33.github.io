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

const statTicker = document.querySelector('.stat-ticker');
if (statTicker) {
  const slides = [...statTicker.querySelectorAll('.stat-slide')];
  const segments = [...statTicker.querySelectorAll('.stat-progress span')];
  const statIndex = statTicker.querySelector('.stat-index');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pad = (value) => String(value).padStart(2, '0');
  let activeStat = 0;

  const countUp = (number) => {
    const target = Number(number.dataset.count);
    if (prefersReducedMotion.matches) {
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
    statIndex.textContent = `${pad(next + 1)} / ${pad(slides.length)}`;
    countUp(slides[next].querySelector('[data-count]'));
    activeStat = next;
  };

  // A timer drives the rotation; the progress bar is decoration, so a paused or throttled animation can't stall it.
  window.setInterval(() => showStat((activeStat + 1) % slides.length), 3000);
}

// Each logo row scrolls by half its width, so it needs a second, hidden copy of its tiles to loop seamlessly.
document.querySelectorAll('.client-track').forEach((track) => {
  track.append(...[...track.children].map((tile) => {
    const clone = tile.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  }));
});

const siteRows = [...document.querySelectorAll('.site-row')];
const siteShots = [...document.querySelectorAll('.site-shot')];
const previewUrl = document.querySelector('[data-preview-url]');
const showSite = (row) => {
  siteRows.forEach((item) => item.classList.toggle('is-active', item === row));
  siteShots.forEach((shot) => shot.classList.toggle('is-active', shot.dataset.site === row.dataset.site));
  if (previewUrl) previewUrl.textContent = row.dataset.url;
};
// Hover and keyboard focus both drive the preview, so it works without a mouse.
siteRows.forEach((row) => {
  row.addEventListener('mouseenter', () => showSite(row));
  row.querySelector('.site-link').addEventListener('focus', () => showSite(row));
});

// Scroll reveal: each heading, paragraph, card, row and tile blurs and rises in as it enters the viewport,
// staggered against its matching siblings. Classes are removed afterwards so hover transitions keep working.
const revealText = '.section-label, .display-heading, .strip-heading, .work-heading p, .work-count, .experience-heading p, .about-copy > *, .client-meta, .gfx-index, .gfx-head, .gfx-foot > *, .contact-kicker, .contact-panel h2, .contact-description, .contact-links';
const revealMedia = '.skills-panel, .career-list .panel-top, .career-row, .client-row, .project-card > .project-visual, .project-card > .project-info, .site-row, .site-preview, .gfx-wall .gfx-card, .gfx-phone, .contact-panel';
const revealSelector = `${revealText}, ${revealMedia}`;
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll(revealSelector).forEach((element) => {
    if (element.closest('.hero, .intro, .story-dialog')) return;
    const siblings = [...element.parentElement.children].filter((child) => child.matches(revealSelector));
    element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 6) * 80}ms`);
    element.classList.add('will-reveal');
    if (element.matches(revealMedia)) element.classList.add('is-media');
    element.addEventListener('transitionend', (event) => {
      if (event.target !== element || event.propertyName !== 'transform') return;
      element.classList.remove('will-reveal', 'is-media', 'is-in');
      element.style.removeProperty('--reveal-delay');
    });
    revealObserver.observe(element);
  });
}

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
const openArtwork = (tile) => {
  const brand = tile.closest('.gfx-brand')?.querySelector('.gfx-head h3')?.textContent.trim() || 'Graphic';
  const label = tile.querySelector('.gfx-format')?.textContent.trim() || 'Artwork';
  artworkDialog.querySelector('[data-artwork-title]').textContent = `${brand} · ${label}`;
  const expandedImage = tile.querySelector('.art-image').cloneNode(true);
  expandedImage.className = '';
  expandedImage.setAttribute('aria-label', `Click to zoom in on ${brand} ${label}`);
  expandedImage.tabIndex = 0;
  artworkZoomContent.style.aspectRatio = getComputedStyle(tile).aspectRatio || '4/5';
  artworkZoomContent.replaceChildren(expandedImage);
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
  const card = event.target.closest('[data-artwork-content] > img');
  if (card) toggleArtworkZoom(card, event.clientX, event.clientY);
});
artworkZoomViewport.addEventListener('keydown', (event) => {
  const card = event.target.closest('[data-artwork-content] > img');
  if (card && ['Enter', ' '].includes(event.key)) {
    event.preventDefault();
    const bounds = card.getBoundingClientRect();
    toggleArtworkZoom(card, bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && artworkDialog.classList.contains('is-open')) closeArtwork();
});

const artTiles = [...document.querySelectorAll('.gfx-card')];
// Only tiles that already hold a real artwork image open the zoom lightbox; brand placeholders stay static.
artTiles.filter((tile) => tile.querySelector('.art-image')).forEach((tile) => {
  tile.tabIndex = 0;
  tile.setAttribute('role', 'button');
  tile.classList.add('has-art');
  tile.addEventListener('click', () => openArtwork(tile));
  tile.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    openArtwork(tile);
  });
});

const projectCards = [...document.querySelectorAll('.project-card')];
const storyDialog = document.querySelector('.story-dialog');
if (storyDialog && projectCards.length) {
  const storyPanel = storyDialog.querySelector('.story-panel');
  const storyBody = storyDialog.querySelector('.story-body');
  const storyCount = storyDialog.querySelector('.story-count');
  const storyNext = storyDialog.querySelector('.story-next');
  const pad = (value) => String(value).padStart(2, '0');
  let activeStory = 0;

  const openStory = (index) => {
    activeStory = index;
    const card = projectCards[index];
    storyBody.replaceChildren(card.querySelector('.story-template').content.cloneNode(true));
    storyCount.textContent = `STORY ${pad(index + 1)} / ${pad(projectCards.length)}`;
    storyNext.querySelector('strong').textContent = projectCards[(index + 1) % projectCards.length].dataset.name;
    if (!storyDialog.open) {
      document.documentElement.classList.add('has-dialog');
      storyDialog.showModal();
    }
    storyPanel.scrollTop = 0;
  };

  projectCards.forEach((card, index) => {
    card.querySelector('.story-open').addEventListener('click', () => openStory(index));
  });
  storyNext.addEventListener('click', () => openStory((activeStory + 1) % projectCards.length));
  storyDialog.querySelector('.story-close').addEventListener('click', () => storyDialog.close());
  // The panel fills the dialog, so a click that lands on the dialog itself came from the backdrop.
  storyDialog.addEventListener('click', (event) => {
    if (event.target === storyDialog) storyDialog.close();
  });
  storyDialog.addEventListener('close', () => {
    document.documentElement.classList.remove('has-dialog');
    projectCards[activeStory].querySelector('.story-open').focus({ preventScroll: true });
  });
}

const stackQuery = window.matchMedia('(min-width: 641px) and (min-height: 701px)');
let stackFrame = 0;
const updateStack = () => {
  stackFrame = 0;
  projectCards.forEach((card, index) => {
    const next = projectCards[index + 1];
    if (!next || !stackQuery.matches || reduceMotion.matches) {
      card.style.removeProperty('--stack');
      return;
    }
    const covered = 1 - (next.getBoundingClientRect().top - card.getBoundingClientRect().top) / card.offsetHeight;
    card.style.setProperty('--stack', Math.min(Math.max(covered, 0), 1).toFixed(3));
  });
};
window.addEventListener('scroll', () => {
  if (!stackFrame) stackFrame = window.requestAnimationFrame(updateStack);
}, { passive:true });
window.addEventListener('resize', updateStack, { passive:true });
updateStack();

// The intro hides itself with CSS; drop it from the page once its curtain animation ends.
const intro = document.querySelector('.intro');
intro?.addEventListener('animationend', (event) => {
  if (event.target === intro) intro.remove();
});


// Hero hover: the reveal circle eases toward the cursor so it trails instead of snapping.
const heroVisual = document.querySelector('.hero-visual');
const heroAlt = heroVisual?.querySelector('.hero-portrait-alt');
if (heroVisual && heroAlt && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const target = { x:0, y:0 };
  const spot = { x:0, y:0 };
  let revealFrame = 0;

  const moveReveal = () => {
    const ease = reduceMotion.matches ? 1 : 0.2;
    spot.x += (target.x - spot.x) * ease;
    spot.y += (target.y - spot.y) * ease;
    heroVisual.style.setProperty('--rx', `${spot.x}px`);
    heroVisual.style.setProperty('--ry', `${spot.y}px`);
    revealFrame = Math.abs(target.x - spot.x) + Math.abs(target.y - spot.y) > 0.3 ? window.requestAnimationFrame(moveReveal) : 0;
  };

  const trackReveal = (event) => {
    const box = heroAlt.getBoundingClientRect();
    target.x = event.clientX - box.left;
    target.y = event.clientY - box.top;
    if (!revealFrame) revealFrame = window.requestAnimationFrame(moveReveal);
  };

  heroVisual.addEventListener('pointerenter', (event) => {
    trackReveal(event);
    spot.x = target.x;
    spot.y = target.y;
    heroVisual.classList.add('is-revealing');
  });
  heroVisual.addEventListener('pointermove', trackReveal);
  heroVisual.addEventListener('pointerleave', () => heroVisual.classList.remove('is-revealing'));
}
