
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
    searchInputValue =  e.target.searchQuery.value.trim();
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
      const {data} = await imgApi(searchInputValue, perPage, page);
      console.log(data)
      if (data.hits.length === 0 ) {
        window.removeEventListener("scroll", handleScroll)
        clearImagesListHtml();
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
     else if(searchInputValue){
      createMarkup(data)
      Notify.info(
        `We found ${data.total} images!`
      );
      } 
      // else if(data.hits.length > 0 &&
      //   data.totalHits > perPage){
      //     window.removeEventListener("scroll", handleScroll)
      //     return;
      //   }
  
    } catch (error) {
        onError(error)
    
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
    const {data} = await imgApi(searchInputValue, perPage, page);
   
      if(data.hits.length > 0 &&
        data.totalHits >= perPage){
          lightbox.refresh();
          page += 1
          renderList(data);
       
      } else{
        window.removeEventListener("scroll", handleScroll)
        Notify.info(
          `You saw all Images`
        );
    }
      
      }
   catch (error) {
    

  }
}
function renderList({hits}){
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