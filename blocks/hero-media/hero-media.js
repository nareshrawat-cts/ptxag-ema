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
    const videoMap = {
      'homepage-bg-video-AVS': 'https://s7mbrstream.scene7.com/is/content/agco/_media_/2a1/2a10b4b8-5c18-4e4f-833f-8daab205ce7f-stream.mp4?utm_medium=fmp4_dash',
    };
    const posterSrc = posterImg ? (posterImg.currentSrc || posterImg.src || posterImg.getAttribute('src') || '') : '';
    const videoKey = Object.keys(videoMap).find((k) => posterSrc.includes(k));
    if (videoKey) {
      const posterUrl = `https://s7d9.scene7.com/is/image/agco/${videoKey}?fit=constrain,1&wid=1440&hei=661`;
      const video = document.createElement('video');
      video.className = 'hero-media-video';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('aria-hidden', 'true');
      video.poster = posterUrl;
      const source = document.createElement('source');
      source.src = videoMap[videoKey];
      source.type = 'video/mp4';
      video.append(source);
      const pic = mediaRow.querySelector('picture');
      (pic || posterImg).replaceWith(video);
      video.play?.().catch(() => { /* autoplay may be blocked; poster remains */ });
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
