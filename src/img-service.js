import axios from "axios";

const API_KEY = '30111831-2eef1cdbdbde188a842c8e9ba';
const BASE_URL = 'https://pixabay.com/api/';


export default class NewsApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.per_page = 40;
    }
    async fetchGallery () {
        // console.log(this);
       
        // http запросы
        try {
            const response = await axios 
            .get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=trye&per_page=40&page=${this.page}`)
           const data = response.data.hits;
            this.incrementPage();
            
            return data;

        }
        catch(error){
        console.log(error);
    }
}
    //увеличение стр. чтоб увеличивался номер стр.
    incrementPage () {
        this.page += 1;
    }
    //сброс стр. чтоб когда ищу новый запрос начинало искать с 1 стр.
    resetPage () {
        this.page = 1;
    }
    get query () {
        return this.searchQuery;
    }
    set query (newQuery) {
        this.searchQuery = newQuery;
    }
}