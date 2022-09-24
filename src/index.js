import NewsApiService from './img-service'
import Notiflix from 'notiflix';

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    galleryContainer: document.querySelector('.load-more'),
}

const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearch);


function onSearch (evt) {
    evt.preventDefault ()
    

    clearGalleryContainer ()
    // берем форму (evt.currentTarget) у нее свойство elements в нем ссылка (query) на наш инпут и у него value
    newsApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
    newsApiService.resetPage();
    newsApiService.fetchGallery(appendGalleryMarKup);

    // fetchGallery(newsApiService.query)
    // .then(onGallery)
    // .catch(onError)


}


// рендерим разметку карточки, рисуем (вставляет результат вызова)
function appendGalleryMarKup (cards) {
    const galleryCard = cards.map(card => {
        return `<div class="photo-card">
        <a href="${card.largeImageURL}">
          <img class="photo-img" src="${card.webformatURL}" alt="${card.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${card.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${card.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${card.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${card.downloads}
          </p>
        </div>
        </div>`;
    }).join('');

    // вешаем разметку
    refs.gallery.insertAdjacentHTML = ('beforeend', galleryCard);
}

// загрузка при нажатии на кнопку 
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
