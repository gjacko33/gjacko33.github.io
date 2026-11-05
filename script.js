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
const revealText = '.display-heading, .strip-heading, .work-heading p, .work-count, .experience-heading p, .about-copy > *, .client-meta, .gfx-index, .gfx-head, .gfx-foot > *, .contact-kicker, .contact-panel h2, .contact-description, .contact-links';
const revealMedia = '.skills-panel, .career-list .panel-top, .career-row, .client-row, .project-card > .project-visual, .project-card > .project-info, .site-row, .site-preview, .gfx-wall .gfx-card, .gfx-phone, .contact-panel';
const revealSelector = `${revealText}, ${revealMedia}`;
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // A fast flick can carry an element past the viewport between frames; anything already above it counts as seen.
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
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

// Story reels with a build-in and no exit: while a reel is on screen, its [data-in] layers enter in order, the finished ad
// holds, then everything cuts back and builds again once per --loop. Entrances add their movement on top of the running
// CSS idle loops (composite: 'add'), so the floats and breathing never jump. Reduced motion skips it all and shows the
// finished design.
const reelEntrances = {
  zoom: 'scale(1.12)',
  down: 'translateY(-3cqw)',
  up: 'translateY(4cqw)',
  rise: 'translateY(14cqw)',
  pop: 'scale(.6)',
  drop: 'translateY(-16cqw)',
  slam: 'scale(1.5)',
  fade: 'none',
};
const buildInReels = [...document.querySelectorAll('.reel')].filter((reel) => reel.querySelector('[data-in]'));
if (buildInReels.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const loops = new Map();
  const buildIn = (reel) => {
    reel.querySelectorAll('[data-in]').forEach((layer) => {
      layer.getAnimations().filter((animation) => animation.id === 'build-in').forEach((animation) => animation.cancel());
      const pop = layer.dataset.in === 'pop';
      const timing = { id: 'build-in', duration: pop ? 700 : 1000, delay: Number(layer.dataset.t || 0), fill: 'backwards' };
      layer.animate([{ opacity: 0 }, { opacity: 1 }], { ...timing, easing: 'ease-out' });
      layer.animate([{ transform: reelEntrances[layer.dataset.in] || 'none' }, { transform: 'none' }], { ...timing, composite: 'add', easing: pop ? 'cubic-bezier(.34,1.56,.64,1)' : 'cubic-bezier(.2,.7,.2,1)' });
    });
  };
  const start = (reel) => {
    const screen = reel.closest('.is-reel');
    const loop = (parseFloat(getComputedStyle(screen || reel).getPropertyValue('--loop')) || 8) * 1000;
    const progress = screen && screen.querySelector('.gfx-story-bars i:first-child');
    reel.classList.add('is-live');
    const cycle = () => {
      buildIn(reel);
      if (progress) progress.animate([{ backgroundPosition: '100% 0' }, { backgroundPosition: '0 0' }], { duration: loop, easing: 'linear' });
    };
    cycle();
    loops.set(reel, window.setInterval(cycle, loop));
  };
  const stop = (reel) => {
    reel.classList.remove('is-live');
    window.clearInterval(loops.get(reel));
    loops.delete(reel);
  };
  const reelObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.45 && !loops.has(entry.target)) start(entry.target);
      else if (!entry.isIntersecting && loops.has(entry.target)) stop(entry.target);
    });
  }, { threshold: [0, 0.45] });
  buildInReels.forEach((reel) => { reel.classList.add('is-armed'); reelObserver.observe(reel); });
}

// On mobile the stage scrolls under a sticky phone; --cut fades each graphic out as it reaches the phone.
document.querySelectorAll('.gfx-stage').forEach((stage) => {
  const rail = stage.querySelector('.gfx-rail');
  if (!rail) return;
  let frame = 0;
  stage.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => rail.style.setProperty('--cut', `${stage.scrollLeft}px`));
  }, { passive:true });
});

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
      <div><h2 data-artwork-title>Artwork</h2></div>
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
  // Fit the artwork to the space the viewport actually has, so it never pushes the panel past the screen.
  const viewportStyle = getComputedStyle(artworkZoomViewport);
  const availableWidth = artworkZoomViewport.clientWidth - (Number.parseFloat(viewportStyle.paddingLeft) || 0) - (Number.parseFloat(viewportStyle.paddingRight) || 0);
  const availableHeight = artworkZoomViewport.clientHeight - (Number.parseFloat(viewportStyle.paddingTop) || 0) - (Number.parseFloat(viewportStyle.paddingBottom) || 0);
  const [, ratioW = 4, ratioH = 5] = (artworkZoomContent.style.aspectRatio.match(/([\d.]+)\s*\/\s*([\d.]+)/) || []).map(Number);
  const baseWidth = Math.max(180, Math.min(availableWidth, availableHeight * ratioW / ratioH));
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
  artworkDialog.hidden = false;
  artworkDialog.classList.add('is-open');
  setArtworkZoom(100);
  artworkZoomViewport.scrollTo(0, 0);
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


// Hero reveal: a circle over the portrait shows the Batman version and eases toward the pointer so it trails instead of snapping.
// A mouse drives it on hover. On touch it follows a finger pressed on the photo, and it plays once on its own so phone visitors find it.
const heroVisual = document.querySelector('.hero-visual');
const heroAlt = heroVisual?.querySelector('.hero-portrait-alt');
if (heroVisual && heroAlt) {
  const target = { x:0, y:0 };
  const spot = { x:0, y:0 };
  let revealFrame = 0;
  let closeTimer = 0;

  const moveReveal = () => {
    const ease = reduceMotion.matches ? 1 : 0.2;
    spot.x += (target.x - spot.x) * ease;
    spot.y += (target.y - spot.y) * ease;
    heroVisual.style.setProperty('--rx', `${spot.x}px`);
    heroVisual.style.setProperty('--ry', `${spot.y}px`);
    revealFrame = Math.abs(target.x - spot.x) + Math.abs(target.y - spot.y) > 0.3 ? window.requestAnimationFrame(moveReveal) : 0;
  };

  const trackReveal = (point) => {
    const box = heroAlt.getBoundingClientRect();
    target.x = point.clientX - box.left;
    target.y = point.clientY - box.top;
    if (!revealFrame) revealFrame = window.requestAnimationFrame(moveReveal);
  };

  const openReveal = (point) => {
    window.clearTimeout(closeTimer);
    trackReveal(point);
    spot.x = target.x;
    spot.y = target.y;
    heroVisual.classList.add('is-revealing');
  };
  const closeReveal = () => heroVisual.classList.remove('is-revealing');

  heroVisual.classList.add('has-reveal');
  // Decode the Batman image now so the first reveal never opens onto an empty circle.
  heroAlt.decode?.().catch(() => {});
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    heroVisual.addEventListener('pointerenter', openReveal);
    heroVisual.addEventListener('pointermove', trackReveal);
    heroVisual.addEventListener('pointerleave', closeReveal);
  } else {
    heroVisual.classList.add('is-touch');
    const release = () => { closeTimer = window.setTimeout(closeReveal, 700); };
    heroVisual.addEventListener('pointerdown', openReveal);
    heroVisual.addEventListener('pointermove', (event) => { if (heroVisual.classList.contains('is-revealing')) trackReveal(event); });
    heroVisual.addEventListener('pointerup', release);
    heroVisual.addEventListener('pointercancel', release);

    // Once the intro has cleared and the photo is on screen, open the circle over the face for a moment.
    if (!reduceMotion.matches && 'IntersectionObserver' in window) {
      // The intro covers the page for about four seconds; after that the hint plays soon after the photo scrolls into view.
      const introEnds = performance.now() + 4200;
      const hint = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        hint.disconnect();
        window.setTimeout(() => {
          const box = heroAlt.getBoundingClientRect();
          openReveal({ clientX: box.left + box.width * 0.5, clientY: box.top + box.height * 0.28 });
          closeTimer = window.setTimeout(closeReveal, 1600);
        }, Math.max(600, introEnds - performance.now()));
      }, { threshold: 0.5 });
      hint.observe(heroVisual);
    }
  }
}
