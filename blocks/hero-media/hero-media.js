/**
 * hero-media
 * Full-bleed background media (video/image) with overlaid, centered
 * heading, subheading and CTA. Source: PTx Ag homepage "text-and-asset".
 *
 * Expected authored structure (rows):
 *   row 1 -> background media cell (picture/img)
 *   row 2 -> content cell (heading + subheading + CTA link)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  // Locate the background-media row (the one containing a picture/img).
  const mediaRow = rows.find((row) => row.querySelector('picture, img'));
  const contentRow = rows.find((row) => row !== mediaRow);

  if (mediaRow) {
    mediaRow.classList.add('hero-media-bg');

    // The imported image is often wrapped in a dead `blob:` anchor.
    // Strip that anchor so the media is a passive background, not a link.
    const mediaLink = mediaRow.querySelector('a');
    if (mediaLink) {
      const media = mediaLink.querySelector('picture, img');
      if (media) {
        mediaLink.replaceWith(media);
      } else {
        mediaLink.removeAttribute('href');
        mediaLink.style.pointerEvents = 'none';
      }
    }

    // Ambient background video: when the poster image is a Dynamic Media
    // video poster (its source URL identifies a video asset), render an
    // autoplay/muted/looping background <video> using the poster as the
    // still frame. Content-driven: no hardcoded per-page markup.
    const posterImg = mediaRow.querySelector('img');
    // Ambient background video for the hero. The homepage hero uses the PTx
    // Scene7 video; the source URL can be overridden per-instance via a
    // `data-video` attribute on the block. The poster falls back to the
    // authored image so there is always a still frame.
    const defaultVideo = 'https://s7mbrstream.scene7.com/is/content/agco/_media_/2a1/2a10b4b8-5c18-4e4f-833f-8daab205ce7f-stream.mp4?utm_medium=fmp4_dash';
    const videoSrc = block.dataset.video || defaultVideo;
    if (videoSrc && posterImg) {
      const posterUrl = posterImg.currentSrc || posterImg.src || posterImg.getAttribute('src') || '';
      const video = document.createElement('video');
      video.className = 'hero-media-video';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('aria-hidden', 'true');
      if (posterUrl) video.poster = posterUrl;
      const source = document.createElement('source');
      source.src = videoSrc;
      source.type = 'video/mp4';
      video.append(source);
      const pic = mediaRow.querySelector('picture');
      (pic || posterImg).replaceWith(video);
      video.play?.().catch(() => { /* autoplay may be blocked; poster remains */ });

      // Play/pause control (matches live: circular button, top-right of hero).
      const playIcon = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
      const pauseIcon = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>';
      const control = document.createElement('button');
      control.type = 'button';
      control.className = 'hero-media-toggle';
      control.setAttribute('aria-label', 'Pause');
      control.innerHTML = pauseIcon;
      control.addEventListener('click', () => {
        if (video.paused) {
          video.play?.();
          control.innerHTML = pauseIcon;
          control.setAttribute('aria-label', 'Pause');
        } else {
          video.pause();
          control.innerHTML = playIcon;
          control.setAttribute('aria-label', 'Play');
        }
      });
      block.append(control);
    }
  } else {
    // No background media -> render on a solid background with dark text.
    block.classList.add('no-image');
  }

  if (contentRow) {
    contentRow.classList.add('hero-media-content');

    // Decorate the CTA link as the brand primary (green) button.
    const cta = contentRow.querySelector('a');
    if (cta && !cta.classList.contains('button')) {
      cta.classList.add('button', 'primary');
      const wrapper = cta.closest('p');
      if (wrapper) wrapper.classList.add('button-container');
    }
  }
}
