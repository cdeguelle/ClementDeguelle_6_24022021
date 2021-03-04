// DOM Elements
const dropdownMenu = document.querySelector('.dropdown');
const dropdownLink = document.querySelector('.filter-dropdown-link');

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
    var tagsContainerProfile = document.querySelector('.photographer__tags--profile');
    for (let i = 0; i < photographer.tags.length; i++) {
        tagsContainerProfile.innerHTML += `<li class="tags__name tags__name--profile">#${photographer.tags[i]}</li>`
    }
}

// Remplissage dynamique de la grille de photos
function displayPhotographerGrid (photographerMedia) {
    let photographerGrid = document.querySelector('.photo-grid');
    for (let index = 0; index < photographerMedia.length; index++) {
        photographerGrid.innerHTML += `
        <article class="photo-grid__picture">
            <figure class="photo-grid__link" onclick="openCarousel()">
                ${photographerMedia[index].hasOwnProperty('image') ? `<img src="./public/img/Sample_Photos/${photographerMedia[index].name}/${photographerMedia[index].image}" alt="${photographerMedia[index].description}" class="photo">` : ''}
                ${photographerMedia[index].hasOwnProperty('video') ? `<video controls><source src="./public/img/Sample_Photos/${photographerMedia[index].name}/${photographerMedia[index].video}" alt="${photographerMedia[index].description}" class="video" type="video/mp4"></video>` : ''}
            </figure>
            <div class="photo-grid__description">
                <h2 class="photo__name">${photographerMedia[index].description}</h2>
                <p class="photo__price">${photographerMedia[index].price} €</p>
                <p class="photo__like">
                <span class="photo__like-count" id="photo__like-count-${photographerMedia[index].id}">${photographerMedia[index].likes}</span>
                <i class="fas fa-heart photo__like-icon" id="photo__like-icon-${photographerMedia[index].id}" onclick="incrementPhotoLikesCount('photo__like-count-${photographerMedia[index].id}')"></i>
                </p>
            </div>
        </article>`
    }
}

// Compteur de likes par photos
function incrementPhotoLikesCount (id) {
    let elem = document.getElementById(id)
    let likes = parseInt(elem.textContent, 10)
    likes++
    elem.innerHTML = likes
}

// Carousel
function openCarousel () {
    let photographerMedia = media
    let carousel = document.getElementById('carousel')
    let carouselContainer = document.getElementById('carousel__container')
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
    document.getElementById('carousel__container').style.width = (ratio * 100) + "%"
    document.querySelectorAll('.carousel__item').forEach(elt => elt.style.width = 100 / ratio + "%")
}

function closeCarousel () {
    document.getElementById('carousel').style.display = "none"
}

function nextCarousel () {
    let photographerMedia = media
    let carouselContainer = document.getElementById('carousel__container')
    let translateX = -100 / photographerMedia.length
    carouselContainer.style.transform += 'translateX(' + translateX + '%)'
}

function prevCarousel () {
    let photographerMedia = media
    let carouselContainer = document.getElementById('carousel__container')
    let translateX = 100 / photographerMedia.length
    carouselContainer.style.transform += 'translateX(' + translateX + '%)'
}






