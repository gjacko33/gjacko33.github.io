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
  // It skips its turns while the ticker is off screen or the tab is hidden.
  let statOnScreen = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { statOnScreen = entry.isIntersecting; }).observe(statTicker);
  window.setInterval(() => { if (statOnScreen && !document.hidden) showStat((activeStat + 1) % slides.length); }, 3000);
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
// Showcase scenes hold two full-page captures each, so a scene's images load only once it is shown.
// Tablets and phones show the smaller panel, so they take the lighter captures.
const compactSites = window.matchMedia('(max-width: 900px)');
const loadScene = (scene) => scene?.querySelectorAll('img[data-src]').forEach((img) => {
  img.src = (compactSites.matches && img.dataset.srcSm) || img.dataset.src;
  img.removeAttribute('data-src');
  img.removeAttribute('data-src-sm');
});
// On small screens a scene's images are released once it is no longer shown, so only one site's captures stay in memory.
const releaseScene = (scene) => scene.querySelectorAll('img.site-page[src]').forEach((img) => {
  img.dataset.src = img.dataset.src || img.getAttribute('src');
  img.dataset.srcSm = img.getAttribute('src');
  img.removeAttribute('src');
});
const showSite = (row) => {
  siteRows.forEach((item) => item.classList.toggle('is-active', item === row));
  siteShots.forEach((shot) => shot.classList.toggle('is-active', shot.dataset.site === row.dataset.site));
  if (compactSites.matches) siteShots.filter((shot) => shot.dataset.site !== row.dataset.site).forEach(releaseScene);
  loadScene(siteShots.find((shot) => shot.dataset.site === row.dataset.site));
  if (previewUrl) previewUrl.textContent = row.dataset.url;
};
// Hover and keyboard focus both drive the preview, so it works without a mouse.
siteRows.forEach((row) => {
  row.addEventListener('mouseenter', () => showSite(row));
  row.querySelector('.site-link').addEventListener('focus', () => showSite(row));
});
// There is no hover on touch screens: the row crossing the middle of the list, below the pinned panel, drives the showcase.
if ('IntersectionObserver' in window) {
  const centerObserver = new IntersectionObserver((entries) => {
    if (!compactSites.matches) return;
    const hit = entries.filter((entry) => entry.isIntersecting).pop();
    if (hit) showSite(hit.target);
  }, { rootMargin:'-62% 0px -32% 0px' });
  siteRows.forEach((row) => centerObserver.observe(row));
}
const sitePreview = document.querySelector('.site-preview');
if (sitePreview && 'IntersectionObserver' in window) {
  const previewObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    loadScene(siteShots.find((shot) => shot.classList.contains('is-active')));
    previewObserver.disconnect();
  }, { rootMargin:'600px 0px' });
  previewObserver.observe(sitePreview);
} else {
  loadScene(siteShots.find((shot) => shot.classList.contains('is-active')));
}
// Long site names shrink so the wordmark behind each showcase stays inside the panel; cqw keeps it scaling with the stage.
const fitWords = () => document.querySelectorAll('.sx-word').forEach((word) => {
  const room = word.parentElement.clientWidth * 0.88;
  if (!room) return;
  word.style.fontSize = '';
  if (word.scrollWidth > room) word.style.fontSize = `${(18 * room / word.scrollWidth).toFixed(2)}cqw`;
});
document.fonts.ready.then(fitWords);
// The panel is hidden on phones, so fit again once a resize shows it.
let fitTimer = 0;
window.addEventListener('resize', () => { window.clearTimeout(fitTimer); fitTimer = window.setTimeout(fitWords, 200); }, { passive:true });

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

// Looping animations pause while their section is off screen, for browsers without content-visibility.
if ('IntersectionObserver' in window) {
  const idleObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => target.classList.toggle('is-offscreen', !isIntersecting));
  }, { rootMargin:'200px 0px' });
  document.querySelectorAll('.gfx-brand, .client-row, .site-preview, .mail-showcase, .contact-panel').forEach((section) => idleObserver.observe(section));
}

// The reels' brand fonts are only needed in Graphics, so their stylesheet loads once that section is close.
const graphicsSection = document.querySelector('[data-fonts]');
if (graphicsSection) {
  const loadReelFonts = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = graphicsSection.dataset.fonts;
    document.head.append(link);
  };
  if ('IntersectionObserver' in window) {
    const fontObserver = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      fontObserver.disconnect();
      loadReelFonts();
    }, { rootMargin:'1500px 0px' });
    fontObserver.observe(graphicsSection);
  } else loadReelFonts();
}

// Motion covers load and play only while on screen; with reduced motion the poster stays.
const coverVisuals = [...document.querySelectorAll('.project-visual')].filter((visual) => visual.querySelector('.cover-video'));
if (coverVisuals.length && 'IntersectionObserver' in window) {
  const coverObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      const videos = [...target.querySelectorAll('.cover-video')].filter((video) => video.offsetParent !== null);
      if (!isIntersecting || reduceMotion.matches) { videos.forEach((video) => video.pause()); return; }
      videos.forEach((video) => {
        if (video.dataset.src) { video.src = video.dataset.src; video.removeAttribute('data-src'); }
        video.preload = 'auto';
        video.play().catch(() => {});
      });
    });
  }, { threshold:0.25 });
  // Posters attach a screen ahead of the card, and only for the variant this layout shows.
  // Touch screens also drop a cover's video once it is more than a screen away, freeing its decoder memory, and reload it on return.
  const touchScreen = window.matchMedia('(hover: none)');
  const posterObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.querySelectorAll('.cover-video').forEach((video) => {
        if (isIntersecting) {
          if (video.dataset.src) { video.src = video.dataset.src; video.removeAttribute('data-src'); }
          if (video.dataset.poster && video.offsetParent !== null) { video.poster = video.dataset.poster; video.removeAttribute('data-poster'); }
        } else if (touchScreen.matches && video.getAttribute('src')) {
          video.pause();
          video.dataset.src = video.getAttribute('src');
          video.removeAttribute('src');
          video.load();
        }
      });
    });
  }, { rootMargin:'100% 0px' });
  coverVisuals.forEach((visual) => { coverObserver.observe(visual); posterObserver.observe(visual); });
}
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
  // Long emails fit the width and scroll; everything else fits the whole artwork on screen.
  const tall = artworkZoomViewport.classList.contains('is-tall');
  const baseWidth = tall ? Math.min(availableWidth, 600) : Math.max(180, Math.min(availableWidth, availableHeight * ratioW / ratioH));
  artworkZoomContent.style.width = `${baseWidth * artworkZoom / 100}px`;
  artworkZoomContent.classList.toggle('is-zoomed', artworkZoom > 100);
  artworkZoomViewport.classList.toggle('is-zoomed', artworkZoom > 100);
};
const openArtwork = (tile) => {
  const brand = tile.closest('.gfx-brand')?.querySelector('.gfx-head h3')?.textContent.trim() || 'Graphic';
  const label = tile.querySelector('.gfx-format')?.textContent.trim() || 'Artwork';
  artworkDialog.querySelector('[data-artwork-title]').textContent = `${brand} · ${label}`;
  const expandedImage = tile.querySelector('.art-image').cloneNode(true);
  // Cards show a small copy; the lightbox swaps in the full-size original.
  if (expandedImage.dataset.full) expandedImage.src = expandedImage.dataset.full;
  expandedImage.className = '';
  expandedImage.setAttribute('aria-label', `Click to zoom in on ${brand} ${label}`);
  presentArtwork(expandedImage, getComputedStyle(tile).aspectRatio || '4/5', false);
};
const openEmail = (brand, name, source) => {
  artworkDialog.querySelector('[data-artwork-title]').textContent = `${brand} · ${name}`;
  const image = new Image(source.dataset.w, source.dataset.h);
  image.src = source.dataset.full;
  image.alt = `${brand} email: ${name}`;
  image.decoding = 'async';
  presentArtwork(image, `${source.dataset.w} / ${source.dataset.h}`, true);
};
const presentArtwork = (expandedImage, ratio, tall) => {
  expandedImage.tabIndex = 0;
  artworkZoomViewport.classList.toggle('is-tall', tall);
  artworkZoomContent.style.aspectRatio = ratio;
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

// Email showcase: the brand list picks an email, the phone plays it, and tapping the phone opens the full-size version.
const mailShowcase = document.querySelector('.mail-showcase');
if (mailShowcase) {
  const phone = mailShowcase.querySelector('.mail-phone');
  const page = mailShowcase.querySelector('.mail-page');
  const view = mailShowcase.querySelector('.mail-view');
  const scrollButtons = [...mailShowcase.querySelectorAll('.mail-scroll-btn')];
  const captionBrand = mailShowcase.querySelector('.mail-caption-brand');
  const captionName = mailShowcase.querySelector('.mail-caption-name');
  const brands = [...mailShowcase.querySelectorAll('.mail-brand')];
  const items = [...mailShowcase.querySelectorAll('.mail-item')];
  const brandOf = (item) => item.closest('.mail-brand');
  const brandName = (group) => group.querySelector('.mail-logo').alt;
  const emailName = (item) => item.querySelector('.mail-item-name').textContent;
  let current = items.find((item) => item.getAttribute('aria-pressed') === 'true') || items[0];
  let swap = 0;

  // Up and down buttons: the first press freezes the auto-scroll where it is, then each press moves 60% of a screen.
  // Holding a button keeps it going. Picking another email hands control back to the auto-scroll.
  let manual = false;
  let offset = 0;
  const maxOffset = () => Math.max(0, page.offsetHeight - view.clientHeight);
  const syncScrollButtons = () => {
    scrollButtons[0].disabled = manual && offset <= 1;
    scrollButtons[1].disabled = manual && offset >= maxOffset() - 1;
  };
  const scrollEmail = (direction) => {
    if (!manual) {
      const transform = getComputedStyle(page).transform;
      offset = transform === 'none' ? 0 : -new DOMMatrixReadOnly(transform).m42;
      page.style.transform = `translateY(${-offset}px)`;
      page.classList.add('is-manual');
      manual = true;
    }
    offset = Math.min(maxOffset(), Math.max(0, offset + direction * view.clientHeight * 0.6));
    page.style.transform = `translateY(${-offset}px)`;
    syncScrollButtons();
  };
  const resetEmailScroll = () => {
    manual = false;
    offset = 0;
    page.classList.remove('is-manual');
    page.style.transform = '';
    syncScrollButtons();
  };
  scrollButtons.forEach((button) => {
    const direction = Number(button.dataset.dir);
    let hold = 0;
    const release = () => { window.clearTimeout(hold); window.clearInterval(hold); };
    button.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      scrollEmail(direction);
      hold = window.setTimeout(() => {
        hold = window.setInterval(() => (button.disabled ? release() : scrollEmail(direction)), 260);
      }, 420);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((type) => button.addEventListener(type, release));
    // Keyboard presses arrive as clicks with no pointer behind them.
    button.addEventListener('click', (event) => { if (event.detail === 0) scrollEmail(direction); });
  });
  window.addEventListener('resize', () => {
    if (!manual) return;
    offset = Math.min(offset, maxOffset());
    page.style.transform = `translateY(${-offset}px)`;
    syncScrollButtons();
  }, { passive:true });

  const openBrand = (group) => brands.forEach((other) => {
    const open = other === group;
    other.classList.toggle('is-open', open);
    other.querySelector('.mail-brand-head').setAttribute('aria-expanded', String(open));
    // Collapsed lists stay out of the tab order.
    other.querySelector('.mail-items-wrap').inert = !open;
  });

  const showEmail = (item, bringPhoneIntoView) => {
    if (item === current) return;
    current = item;
    const group = brandOf(item);
    items.forEach((other) => other.setAttribute('aria-pressed', String(other === item)));
    mailShowcase.style.setProperty('--mail-tone', group.style.getPropertyValue('--tone'));
    captionBrand.textContent = brandName(group);
    captionName.textContent = emailName(item);
    phone.setAttribute('aria-label', `Open the full ${brandName(group)} email: ${emailName(item)}`);
    // Fade the old email out, swap in the new one once it has decoded, and restart the scroll from its header.
    const ticket = ++swap;
    page.classList.add('is-swapping');
    const next = new Image();
    next.src = item.dataset.src;
    Promise.all([next.decode().catch(() => {}), new Promise((resolve) => setTimeout(resolve, 350))]).then(() => {
      if (ticket !== swap) return;
      page.width = item.dataset.w;
      page.height = item.dataset.h;
      page.src = item.dataset.src;
      page.style.setProperty('--scroll', `${Math.round(item.dataset.h / item.dataset.w * 6)}s`);
      resetEmailScroll();
      page.style.animation = 'none';
      void page.offsetWidth;
      page.style.animation = '';
      page.classList.remove('is-swapping');
    });
    // On one-column layouts the list sits below the phone, so bring the phone back up.
    const box = phone.getBoundingClientRect();
    if (bringPhoneIntoView && (box.bottom < 80 || box.top > innerHeight)) phone.scrollIntoView({ behavior:reduceMotion.matches ? 'auto' : 'smooth', block:'center' });
  };

  brands.forEach((group) => group.querySelector('.mail-brand-head').addEventListener('click', () => {
    if (group.classList.contains('is-open')) return;
    openBrand(group);
    showEmail(group.querySelector('.mail-item'), false);
  }));
  items.forEach((item) => item.addEventListener('click', () => showEmail(item, true)));
  phone.addEventListener('click', () => openEmail(brandName(brandOf(current)), emailName(current), current));
  openBrand(brandOf(current));
}

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
let stackCleared = false;
const updateStack = () => {
  stackFrame = 0;
  // Phones and short screens don't stack the cards, so after clearing once there is nothing to do per scroll frame.
  if (!stackQuery.matches || reduceMotion.matches) {
    if (!stackCleared) projectCards.forEach((card) => card.style.removeProperty('--stack'));
    stackCleared = true;
    return;
  }
  stackCleared = false;
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
    if (heroAlt.dataset.src) loadHeroAlt();
    trackReveal(point);
    spot.x = target.x;
    spot.y = target.y;
    heroVisual.classList.add('is-revealing');
  };
  const closeReveal = () => heroVisual.classList.remove('is-revealing');

  heroVisual.classList.add('has-reveal');
  // The Batman image only shows on hover or touch, so it loads once the page has, then decodes so the first reveal is never empty.
  const loadHeroAlt = () => {
    if (heroAlt.dataset.src) { heroAlt.src = heroAlt.dataset.src; heroAlt.removeAttribute('data-src'); }
    heroAlt.decode?.().catch(() => {});
  };
  if (document.readyState === 'complete') loadHeroAlt();
  else window.addEventListener('load', loadHeroAlt, { once:true });
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
      const introEnds = performance.now() + (document.documentElement.classList.contains('no-intro') ? 600 : 4200);
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
