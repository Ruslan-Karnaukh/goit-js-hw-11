
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {imgApi} from './js/imgApi.js'


const refs = {
    searchForm: document.querySelector("#search-form"),
    searchBtn: document.querySelector("button"),
    galery: document.querySelector(".galery")
}

const lightbox = new SimpleLightbox('.photo-card a', 250);
let page = 1;
const perPage = 40;
let searchInputValue = "";
refs.searchForm.addEventListener("submit", onSubmit)




function onSubmit(e){
    e.preventDefault()
    page = 1
    searchInputValue =  e.target.searchQuery.value;
    if (!searchInputValue) {
        clearImagesListHtml();
        Notify.info('Write your search query');
        return;
      }
      doSearch(searchInputValue)
}

async function doSearch() {
    try {
    //   loadMoreButton.classList.add('is-hidden');
      const resultFromQuery = await imgApi(searchInputValue, perPage, page);

      if (resultFromQuery.hits.length === 0) {
        clearImagesListHtml();
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
     else if(searchInputValue){
      createMarkup(resultFromQuery)
      
      } 
       if( resultFromQuery.hits.length > 0 &&
        resultFromQuery.totalHits <= perPage){
          Notify.info(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
  
    } catch (error) {
      if (resultFromQuery.hits.length === 0) {
        onError(error)}
      if (error.message === '404') {
        clearImagesListHtml();
        Notify.failure(
          'Oops, there are no images matching your search query. Please try again.'
        );
      }
      console.log(error);
    }
  }


function createMarkup({hits}){
    const result = hits.map(({ 
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,}) => {return `
    <div class="photo-card">
    <a class="gallery__link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
}).join("");
refs.galery.innerHTML = result
lightbox.refresh();
}
doSearch();



function clearImagesListHtml() {
    refs.galery.innerHTML = '';
  }
async function fetchArticles(){
  try {
     page += 1
      const resultFromQuery = await imgApi(searchInputValue, perPage, page);
      renderList(resultFromQuery.hits);

      }
   catch (error) {
    

  }
}
function renderList(markup){
  const result = markup.map(({ 
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,}) => {return `
    <div class="photo-card">
    <a class="gallery__link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
}).join("");
handleScroll()
refs.galery.insertAdjacentHTML("beforeend", result);

}
  function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  console.log(scrollTop, scrollHeight, clientHeight);
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchArticles();
  }
}

window.addEventListener("scroll", handleScroll);


function onError(err) {
  console.error(err);
  loadMoreBtn.hide();
  clearNewsList();
  Notify.failure(
    'Oops, there are no images matching your search query. Please try again.'
  );
}