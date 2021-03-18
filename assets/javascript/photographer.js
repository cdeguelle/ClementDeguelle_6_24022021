// DOM Elements
const dropdownMenu = document.querySelector('.dropdown');
const dropdownLink = document.querySelector('.filter__dropdown-link');
const likesTotal = document.getElementById('info-stat__likes');
const carousel = document.getElementById('carousel');
const carouselContainer = document.getElementById('carousel__container');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal__close');
const modalTitleName = document.getElementById('modal__title--name');
const modalSubmit = document.getElementById('modal__submit');

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
let photographerID = parseInt(new URLSearchParams(window.location.search).get('photographerID'), 10);

// Requête objet JSON
let request = new XMLHttpRequest();
let photographerMedia = [];
let listOfphotographers = [];

request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log(response);
        listOfphotographers = response.photographers
        displayPhotographerInfo(response.photographers.find(photographer => {
            return photographer.id === photographerID
        }))
        photographerMedia = response.media.filter(filterById)
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
        <button id="contact" aria-label="Contact me" onclick="launchModal()">Contactez moi</button>
        <img src="./public/img/Sample_Photos/Photographers_ID_Photos/${photographer.portrait}" alt="${photographer.name}" class="photographer__picture photographer__picture--profile">
    </div>`;
    document.getElementById('info-stat__price').innerHTML = `${photographer.price}€/jour`
    modalTitleName.innerHTML = photographer.name 
    var tagsContainerProfile = document.querySelector('.photographer__tags--profile');
    for (let i = 0; i < photographer.tags.length; i++) {
        tagsContainerProfile.innerHTML += `<li class="tags__name tags__name--profile" onclick="displayPhotographersByTags('${photographer.tags[i]}')"><a href=""></a><span class="hidden">Tag ${photographer.tags[i]}</span>#${photographer.tags[i]}</li>`
    }
}

// Redirection vers la page d'acceuil au clic sur un tag + filtre en fonction du tag
function displayPhotographersByTags(id) {
    document.location.href = "./index.html?tag=" + id  
}

// Tri du menu déroulant 
function sortByPopularity () {
    let photographerMediaLikes = photographerMedia
    photographerMediaLikes.sort((a, b) => a.likes - b.likes)
    console.log(photographerMediaLikes)
    displayPhotographerGrid(photographerMediaLikes)
    document.getElementById('chevron__popularity').style.color = "white"
    document.getElementById('chevron__date').style.color = "#901C1C"
    document.getElementById('chevron__title').style.color = "#901C1C"
}

function sortByDate () {
    let photographerMediaDate = photographerMedia
    photographerMediaDate.sort((a, b) => new Date(a.date) - new Date(b.date))
    console.log(photographerMediaDate) 
    displayPhotographerGrid(photographerMediaDate)
    document.getElementById('chevron__popularity').style.color = "#901C1C"
    document.getElementById('chevron__date').style.color = "white"
    document.getElementById('chevron__title').style.color = "#901C1C"
}

function sortByTitle () {
    let photographerMediaTitle = photographerMedia
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
                ${array[index].hasOwnProperty('image') ? `<img src="./public/img/Sample_Photos/${array[index].name}/${array[index].image}" alt="${array[index].description}, vue rapprochée" class="photo">` : ''}
                ${array[index].hasOwnProperty('video') ? `<video controls><source src="./public/img/Sample_Photos/${array[index].name}/${array[index].video}" alt="${array[index].description}, vue rapprochée" class="video" type="video/mp4"></video>` : ''}
            </figure>
            <div class="photo-grid__description">
                <h2 class="photo__name">${array[index].description}</h2>
                <p class="photo__price">${array[index].price} €</p>
                <p class="photo__like">
                <span class="photo__like-count" id="photo__like-count-${array[index].id}">${array[index].likes}</span>
                <i class="fas fa-heart photo__like-icon" id="photo__like-icon-${array[index].id}" aria-label="likes" onclick="incrementPhotoLikesCount('photo__like-count-${array[index].id}')"></i>
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
    carouselContainer.innerHTML = ""
    carouselContainer.style.transform = 'translateX(0%)'
    carousel.style.display = "block"
    for (let index = 0; index < photographerMedia.length; index++) {
        carouselContainer.innerHTML += `
        <figure class="carousel__item" aria-label="image vue rapprochée">
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
    let translateX = -100 / photographerMedia.length
    carouselContainer.style.transform += 'translateX(' + translateX + '%)'
}

function prevCarousel () {
    let translateX = 100 / photographerMedia.length
    carouselContainer.style.transform += 'translateX(' + translateX + '%)'
}

// Modal form
modalClose.addEventListener('click', closeModal)
modalSubmit.addEventListener('click', closeModal)

function launchModal () {
    modal.style.display = "block"
}

function closeModal (e) {
    e.preventDefault()
    modal.style.display = "none"
}