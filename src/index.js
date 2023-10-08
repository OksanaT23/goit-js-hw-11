import { perPage, search } from "./pixabay-api";
import { Notify } from "notiflix";

const loadMoreBtn = document.querySelector('#loadMore');
const searchForm = document.querySelector('#search-form');
const queryInput = searchForm.elements.searchQuery;
const galleryContainer = document.querySelector('#gallery');

let lastQuery = '';
let page = 1;

function addClass(element, className) {
    if (!element.classList.contains(className)) {
        element.classList.add(className);
    }
}

function removeClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
}

function hideLoadMoreBtn() {
    addClass(loadMoreBtn, 'hidden');
}

function showLoadMoreBtn() {
    removeClass(loadMoreBtn, 'hidden');
}

function addImageToPage(imageData) {
    const { webformatURL, likes, views, comments, downloads, tags } = imageData;
    const photoCard = `
        <div class="photo-card">
          <img src="${webformatURL}" loading="lazy" alt="${tags}" />
          <div class="info">
            <p class="info-item"><b>Likes</b> ${likes}</p>
            <p class="info-item"><b>Views</b> ${views}</p>
            <p class="info-item"><b>Comments</b> ${comments}</p>
            <p class="info-item"><b>Downloads</b> ${downloads}</p>
          </div>
        </div>
    `;

    galleryContainer.insertAdjacentHTML('beforeend', photoCard);
}

function isLastPage(pageImagesCount, total) {
    const totalLoaded = (page - 1) * perPage + pageImagesCount;

    return totalLoaded >= total;
}

function addImagesToPage(imagesData, total) {
    imagesData.forEach(addImageToPage);

    if (!isLastPage(imagesData.length, total)) {
        showLoadMoreBtn();
    } else {
        hideLoadMoreBtn();
    }
}

function submitHandler(event) {
    event.preventDefault();

    galleryContainer.innerHTML = '';
    lastQuery = queryInput.value;

    page = 1;

    search(lastQuery, page)
        .then(response => response.data)
        .then(jsonData => {
            const foundImagesCount = jsonData.totalHits;

            if (!foundImagesCount) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            } else {
                Notify.success(`Hooray! We found ${jsonData.totalHits} images.`);
            }

            addImagesToPage(jsonData.hits, jsonData.totalHits);
        })
        .catch(reason => Notify.failure(reason));
}

function clickLoadMoreHandler() {
    page++;

    search(lastQuery, page)
        .then(response => response.data)
        .then(jsonData => {
            if (!jsonData.hits.length) {
                Notify.failure("We're sorry, but you're reached the end of search results.");
            }

            addImagesToPage(jsonData.hits, jsonData.totalHits);
        })
        .catch(reason => Notify.failure(reason));
}

function init() {
    hideLoadMoreBtn();

    searchForm.addEventListener('submit', submitHandler);
    loadMoreBtn.addEventListener('click', clickLoadMoreHandler);
    
    console.log('init');
}

init();
