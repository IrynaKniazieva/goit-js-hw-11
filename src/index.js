import NewsApiService from './img-service';
import LoadMoreBtn from './btn-load-more';
import Notiflix from 'notiflix';
import './css/styles.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
// load More

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    // btnLoadMore: document.querySelector('.load-more'),
}

const loadMoreBtn = new LoadMoreBtn ({
  selector: '.load-more', hidden: true});

const newsApiService = new NewsApiService();

console.log(loadMoreBtn);
console.log(newsApiService);

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);


function onSearch (evt) {
    evt.preventDefault ()
    
    // берем форму (evt.currentTarget) у нее свойство elements в нем ссылка (query) на наш инпут и у него value
    newsApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
    clearGalleryContainer ()
    newsApiService.resetPage();
    
    newsApiService.fetchGallery().then(appendGalleryMarKup);
   
}

// рендерим разметку карточки, рисуем (вставляет результат вызова)
function appendGalleryMarKup (images) {
    const galleryCard = images.map(image => {
        return `<div class="photo-card">
        <a href="${image.largeImageURL}">
          <img class="photo-img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${image.downloads}
          </p>
        </div>
        </div>`;
    }).join('');

    // вешаем разметку
    refs.gallery.insertAdjacentHTML('beforeend', galleryCard);
}

// // загрузка при нажатии на кнопку 
function onLoadMore () {
    newsApiService.fetchGallery().then(appendGalleryMarKup);
}

// при каждом новом запросе (поиске) очищаем контейнер от старого запроса
function clearGalleryContainer () {
    refs.gallery.innerHTML = '';
}

// если ввели чушь
function onError () {
    Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
}
