const slides = document.querySelectorAll(".fade-image");
const currentEl = document.getElementById("current-slide");
const totalEl = document.getElementById("total-slide");

// total slide
totalEl.textContent = slides.length;

// update count berdasarkan slide aktif
function updateSlideCount() {
  slides.forEach((slide, index) => {
    if (slide.classList.contains("active")) {
      currentEl.textContent = index + 1;
    }
  });
}

// panggil pertama kali
updateSlideCount();

let currentIndex = 0;
let touchStartY = 0;

function updateImages(index) {
  const images = document.querySelectorAll(".fade-image");
  const titleEl = document.getElementById("title");
  const descEl = document.getElementById("description");

  images.forEach((img, i) => {
    img.classList.toggle("active", i === index);
    if (i === index) {
      titleEl.textContent = img.dataset.title;
      descEl.textContent = img.dataset.desc;
      updateSlideCount();
    }
  });
}

// Desktop scroll
function handleWheel(e) {
  const delta = e.deltaY;
  const threshold = 100;

  if (delta > threshold) currentIndex = Math.min(currentIndex + 1, document.querySelectorAll(".fade-image").length - 1);
  if (delta < -threshold) currentIndex = Math.max(currentIndex - 1, 0);

  updateImages(currentIndex);
}

// Mobile swipe
function handleTouchStart(e) {
  touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  const touchEndY = e.changedTouches[0].clientY;
  const deltaY = touchStartY - touchEndY;
  const threshold = 50;

  if (deltaY > threshold) {
    // Swipe up
    currentIndex = Math.min(currentIndex + 1, document.querySelectorAll(".fade-image").length - 1);
    updateImages(currentIndex);
  } else if (deltaY < -threshold) {
    // Swipe down
    currentIndex = Math.max(currentIndex - 1, 0);
    updateImages(currentIndex);
  }
}

function initMedia() {
  const section = document.querySelector(".section");
  if (!section) return;

  document.body.classList.add("ready");

  currentIndex = 0;
  updateImages(currentIndex);

  // Event desktop
  window.addEventListener("wheel", handleWheel, { passive: true });

  // Event mobile
  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });
}

// Langsung panggil initMedia saat DOM siap
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMedia);
} else {
  initMedia();
}

//* IMAGE MOBILE*//

const MOBILE_WIDTH = 768;

function handleMobileImages() {
  const isMobile = window.innerWidth <= MOBILE_WIDTH;
  const images = document.querySelectorAll(".fade-image");

  images.forEach(img => {
    // Simpan src desktop sekali saja
    if (!img.dataset.desktop) {
      img.dataset.desktop = img.src;
    }

    // Switch image
    if (isMobile) {
      if (img.dataset.mobile && img.src !== img.dataset.mobile) {
        img.src = img.dataset.mobile;
      }
    } else {
      if (img.src !== img.dataset.desktop) {
        img.src = img.dataset.desktop;
      }
    }
  });
}

// Saat halaman siap
window.addEventListener("DOMContentLoaded", handleMobileImages);

// Saat resize (rotate HP, responsive test, dll)
window.addEventListener("resize", handleMobileImages);


//*VIDEO PLAYER*//
const playButton = document.querySelector('.btn-play-circle');
const scrollContainer = document.querySelector('.scroll-container');
const buttonHome = document.querySelector('.btn-back');
const videoContainer = document.getElementById('video-player-container');
const images = document.querySelectorAll('.fade-image');

playButton.addEventListener('click', () => {
  const activeImage = document.querySelector('.fade-image.active');
  if (!activeImage) return;

  const videoSrc = activeImage.dataset.video;

  images.forEach(img => img.style.display = 'none');
  playButton.style.display = 'none';
  scrollContainer.style.display = 'none';
  buttonHome.style.display = 'none';

  videoContainer.innerHTML = '';
  videoContainer.style.display = 'flex';

  if (videoSrc.includes('youtube.com/embed')) {
    const iframe = document.createElement('iframe');

    iframe.src = videoSrc.includes('?')
      ? videoSrc + '&autoplay=1&mute=1&playsinline=1'
      : videoSrc + '?autoplay=1&mute=1&playsinline=1';

    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.allow = 'autoplay; encrypted-media';

    videoContainer.appendChild(iframe);

  } else {
    const videoEl = document.createElement('video');

    videoEl.src = videoSrc;
    videoEl.autoplay = true;
    videoEl.controls = true;
    videoEl.playsInline = true;
    videoEl.style.width = '100%';
    videoEl.style.height = '100%';

    videoContainer.appendChild(videoEl);

    const exitVideo = () => {
      videoContainer.style.display = 'none';
      videoContainer.innerHTML = '';
      images.forEach(img => img.style.display = 'block');
      playButton.style.display = 'flex';
      scrollContainer.style.display = 'flex';
      buttonHome.style.display = 'flex';
    };

    videoEl.addEventListener('ended', exitVideo);
    videoEl.addEventListener('pause', exitVideo);
  }
});
