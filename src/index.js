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

// console.log(loadMoreBtn);
// console.log(newsApiService);

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);


function onSearch (evt) {
    evt.preventDefault ()
    
    // берем форму (evt.currentTarget) у нее свойство elements в нем ссылка (query) на наш инпут и у него value
    newsApiService.query = evt.currentTarget.elements.searchQuery.value.trim();
    
    // если ничего не введено
    if (newsApiService.query === "") {
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.'); 
    // clearGalleryContainer ();
    return;
    }
    clearGalleryContainer () 
    newsApiService.resetPage();
    loadMoreBtn.show();
    loadMoreBtn.disable();
       // если введено правильное слово рендерим разметку
    newsApiService.fetchGallery().then(data => {
      appendGalleryMarKup (data);
      loadMoreBtn.enable();

      // если ввели не правильный запрос
      if (data.totalHits === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        loadMoreBtn.hide()
        return;
      }
      // 
      if (data.totalHits < 40) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        loadMoreBtn.hide()
        return;
      }
     
      // количество картинок
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    });
}

// // загрузка при нажатии на кнопку 
function onLoadMore () {
  loadMoreBtn.disable();
  newsApiService.fetchGallery().then(data => {
    appendGalleryMarKup (data);
    loadMoreBtn.enable();
  })
}

function appendGalleryMarKup (images) {
  refs.gallery.insertAdjacentHTML('beforeend', markupGallery (images));
//  SimpleLightbox
  lightbox.refresh();
}

function markupGallery (data) {
  return data.hits
    .map(
      ({
        largeImageURL,
        tags,
        webformatURL,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="card">
        <a class="card__link" href="${largeImageURL}">
          <img class="card__image" src="${webformatURL}" alt="${tags}" loading="lazy" />  
          <div class="info">
            <p class="info-text">
              <b class="info-text__name">Likes</b>
              <span class="info-text__number">${likes}</span>
            </p>
            <p class="info-text">
              <b class="info-text__name">Views</b>
              <span class="info-text__number">${views}</span>
            </p>
            <p class="info-text">
              <b class="info-text__name">Comments</b>
              <span class="info-text__number">${comments}</span>
            </p>
            <p class="info-text">
              <b class="info-text__name">Downloads</b>
              <span class="info-text__number">${downloads}</span>
            </p>
          
          </div>
          </a>
          </div>
         `;
      }
    )
    .join('');
}

// при каждом новом запросе (поиске) очищаем контейнер от старого запроса
function clearGalleryContainer () {
    refs.gallery.innerHTML = '';
}

// работа SimpleLightbox
// captionsData: "alt" (для вывода названия картинки)
let lightbox = new SimpleLightbox('.card a', {captionDelay: 250,});
