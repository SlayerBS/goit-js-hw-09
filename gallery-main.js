import gallery from './gallery-items.js';

const lightBoxContainerRef = document.querySelector('.js-lightbox');
const lightBoxImageRef = document.querySelector('.lightbox__image');
const lightBoxCloseRef = document.querySelector('.lightbox__button');
const galleryContainer = document.querySelector('.js-gallery');
const overlayRef = document.querySelector('.lightbox__overlay');

const galleryMarkup = createGalleryMarkup(gallery); //создание разметки

galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup);

galleryContainer.addEventListener('click', onGalleryContainerClick);

overlayRef.addEventListener('click', onBtnCloseLightBox);

const galleryImagesList = [...document.querySelectorAll('.gallery__image')]; //массив список всех изображений

lightBoxCloseRef.addEventListener('click', onBtnCloseLightBox);

function createGalleryMarkup() {
  return gallery
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item">
      <a
        class="gallery__link"
        href="${original}"
      >
        <img
          class="gallery__image"
          src="${preview}"
          data-source="${original}"
          alt="${description}"
        />
      </a>
    </li>`;
    })
    .join('');
}

function onGalleryContainerClick(evt) {
  evt.preventDefault();

  const isGalleryImageEl = evt.target.classList.contains('gallery__image'); //проверка источника клика
  if (!isGalleryImageEl) {
    return;
  }
  const openedImage = evt.target;
  lightBoxOpen(openedImage);
}

function lightBoxOpen(image) {
  lightBoxContainerRef.classList.add('is-open');
  lightBoxImageRef.src = image.dataset.source;
  lightBoxImageRef.dataset.index = galleryImagesList.indexOf(image);
  window.addEventListener('keydown', onKeyPress);
}

function onBtnCloseLightBox() {
  lightBoxContainerRef.classList.remove('is-open');
  lightBoxImageRef.src = '';
  window.removeEventListener('keydown', onKeyPress);
}

function onKeyPress(evt) {
  if (
    evt.key !== 'ArrowLeft' &&
    evt.key !== 'ArrowRight' &&
    evt.key !== 'Escape'
  ) {
    return;
  }
  switch (evt.key) {
    case 'ArrowLeft':
      gallerySlide(-1);
      break;
    case 'ArrowRight':
      gallerySlide(1);
      break;
    case 'Escape':
      onBtnCloseLightBox();
      break;
  }
  return;
}

function gallerySlide(changePositionIndex) {
  let currentImageIndex = Number(lightBoxImageRef.dataset.index);
  let nextImageIndex = currentImageIndex + changePositionIndex;

  if (nextImageIndex > galleryImagesList.length - 1) {
    nextImageIndex = 0;
  }
  if (nextImageIndex < 0) {
    nextImageIndex = galleryImagesList.length - 1;
  }

  lightBoxImageRef.dataset.index = nextImageIndex;
  lightBoxImageRef.src = galleryImagesList[nextImageIndex].dataset.source;
}
