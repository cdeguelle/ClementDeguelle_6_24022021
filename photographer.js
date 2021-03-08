// DOM Elements
const dropdownMenu = document.querySelector('.dropdown');
const dropdownLink = document.querySelector('.filter-dropdown-link');
const likesTotal = document.getElementById('info-stat__likes');
const carousel = document.getElementById('carousel');
const carouselContainer = document.getElementById('carousel__container');

// Menu déroulant 
function toggleNavbar() {
    if (!dropdownMenu.getAttribute('style') || dropdownMenu.getAttribute('style') === 'display: none;') {
        dropdownMenu.style.display = 'block';
        dropdownLink.setAttribute('aria-expanded', 'true');
    } else {
        dropdownMenu.style.display = 'none';
        dropdownLink.setAttribute('aria-expanded', 'false');
    }
}

dropdownLink.addEventListener('click', function(e) {
    e.preventDefault();
    toggleNavbar();
})

// PAGE DYNAMIQUE \\
// Lecture de photographerID dans l'URL
var photographerID = parseInt(new URLSearchParams(window.location.search).get('photographerID'), 10);

// Requête objet JSON
var request = new XMLHttpRequest();
var media = [];

request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log(response);
        displayPhotographerInfo(response.photographers.find(photographer => {
            return photographer.id === photographerID
        }))
        media = response.media.filter(filterById)
        let photographerMedia = media
        displayPhotographerGrid(photographerMedia)
    }
};
request.open("GET", "data.json");
request.send();

// Récupération des photos/videos par id de photographe
function filterById (media) {
    if (media.photographerId === photographerID) {
        return true
    } else {
        return false
    }
}

// Remplissage dynamique des champs infos photographes
function displayPhotographerInfo (photographer) {
    let photographerCard = document.querySelector('.photographer-card');
    photographerCard.innerHTML += `
    <div class="photographer__infos">
        <div class="photographer__infos-txt">
            <h1 class="photographer__name photographer__name--profile">${photographer.name}</h1>
            <p class="photographer__city photographer__city--profile">${photographer.city}, ${photographer.country}</p>
            <p class="photographer__description photographer__description--profile">${photographer.tagline}</p>
            <ul class="photographer__tags photographer__tags--profile"></ul>
        </div>
        <button id="contact">Contactez moi</button>
        <img src="./public/img/Sample_Photos/Photographers_ID_Photos/${photographer.portrait}" alt="${photographer.name}" class="photographer__picture photographer__picture--profile">
    </div>`;
    document.getElementById('info-stat__price').innerHTML = `${photographer.price}€/jour`
    var tagsContainerProfile = document.querySelector('.photographer__tags--profile');
    for (let i = 0; i < photographer.tags.length; i++) {
        tagsContainerProfile.innerHTML += `<li class="tags__name tags__name--profile">#${photographer.tags[i]}</li>`
    }
}

// Tri du menu déroulant 
function sortByPopularity () {
    let photographerMediaLikes = media
    photographerMediaLikes.sort((a, b) => a.likes - b.likes)
    console.log(photographerMediaLikes)
    displayPhotographerGrid(photographerMediaLikes)
    document.getElementById('chevron__popularity').style.color = "white"
    document.getElementById('chevron__date').style.color = "#901C1C"
    document.getElementById('chevron__title').style.color = "#901C1C"
}

function sortByDate () {
    let photographerMediaDate = media
    photographerMediaDate.sort((a, b) => new Date(a.date) - new Date(b.date))
    console.log(photographerMediaDate) 
    displayPhotographerGrid(photographerMediaDate)
    document.getElementById('chevron__popularity').style.color = "#901C1C"
    document.getElementById('chevron__date').style.color = "white"
    document.getElementById('chevron__title').style.color = "#901C1C"
}

function sortByTitle () {
    let photographerMediaTitle = media
    photographerMediaTitle.sort((a, b) => a.description > b.description)
    console.log(photographerMediaTitle) 
    displayPhotographerGrid(photographerMediaTitle)
    document.getElementById('chevron__popularity').style.color = "#901C1C"
    document.getElementById('chevron__date').style.color = "#901C1C"
    document.getElementById('chevron__title').style.color = "white"
}

// Remplissage dynamique de la grille de photos
function displayPhotographerGrid (array) {
    let photographerGrid = document.querySelector('.photo-grid')
    photographerGrid.innerHTML = ""
    let likesSum = 0
    for (let index = 0; index < array.length; index++) {
        photographerGrid.innerHTML += `
        <article class="photo-grid__picture">
            <figure class="photo-grid__link" onclick="openCarousel()">
                ${array[index].hasOwnProperty('image') ? `<img src="./public/img/Sample_Photos/${array[index].name}/${array[index].image}" alt="${array[index].description}" class="photo">` : ''}
                ${array[index].hasOwnProperty('video') ? `<video controls><source src="./public/img/Sample_Photos/${array[index].name}/${array[index].video}" alt="${array[index].description}" class="video" type="video/mp4"></video>` : ''}
            </figure>
            <div class="photo-grid__description">
                <h2 class="photo__name">${array[index].description}</h2>
                <p class="photo__price">${array[index].price} €</p>
                <p class="photo__like">
                <span class="photo__like-count" id="photo__like-count-${array[index].id}">${array[index].likes}</span>
                <i class="fas fa-heart photo__like-icon" id="photo__like-icon-${array[index].id}" onclick="incrementPhotoLikesCount('photo__like-count-${array[index].id}')"></i>
                </p>
            </div>
        </article>`
        likesSum += array[index].likes
    }
    likesTotal.innerHTML = likesSum + `<i class="fas fa-heart"></i>`
}

// Compteur de likes par photos
function incrementPhotoLikesCount (id) {
    let elem = document.getElementById(id)
    let likes = parseInt(elem.textContent, 10)
    let likesTotalNumber = parseInt(likesTotal.textContent, 10)
    likes++
    likesTotalNumber++
    elem.innerHTML = likes
    likesTotal.innerHTML = likesTotalNumber + `<i class="fas fa-heart"></i>`
}

// Carousel
function openCarousel () {
    let photographerMedia = media
    carouselContainer.innerHTML = ""
    carouselContainer.style.transform = 'translateX(0%)'
    carousel.style.display = "block"
    for (let index = 0; index < photographerMedia.length; index++) {
        carouselContainer.innerHTML += `
        <figure class="carousel__item">
            ${photographerMedia[index].hasOwnProperty('image') ? `<img src="./public/img/Sample_Photos/${photographerMedia[index].name}/${photographerMedia[index].image}" alt="${photographerMedia[index].description}" class="carousel__photo">` : ''}
            ${photographerMedia[index].hasOwnProperty('video') ? `<video controls><source src="./public/img/Sample_Photos/${photographerMedia[index].name}/${photographerMedia[index].video}" alt="${photographerMedia[index].description}" class="carousel__video" type="video/mp4"></video>` : ''}
            <h2 class="photo__name--carousel">${photographerMedia[index].description}</h2>
        <figure>`
    }
    let ratio = photographerMedia.length  
    carouselContainer.style.width = (ratio * 100) + "%"
    document.querySelectorAll('.carousel__item').forEach(elt => elt.style.width = 100 / ratio + "%")
}

function closeCarousel () {
    carousel.style.display = "none"
}

function nextCarousel () {
    let photographerMedia = media
    let translateX = -100 / photographerMedia.length
    carouselContainer.style.transform += 'translateX(' + translateX + '%)'
}

function prevCarousel () {
    let photographerMedia = media
    let translateX = 100 / photographerMedia.length
    carouselContainer.style.transform += 'translateX(' + translateX + '%)'
}