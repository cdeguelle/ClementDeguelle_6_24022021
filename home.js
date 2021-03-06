// Requête objet JSON
var request = new XMLHttpRequest();
var listOfphotographers = [];

request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log(response);
        displayPhotographers(response.photographers);
        listOfphotographers = response.photographers
    }
};
request.open("GET", "data.json");
request.send();

// Affichage dynamique de la page d'acceuil
function displayPhotographers (photographers) {
    let photographersContainer = document.querySelector('#photographers-grid');
    for (let index = 0; index < photographers.length; index++) {
        photographersContainer.innerHTML += `
        <article class="photographer" id="${photographers[index].id}">
            <a href="./photographer.html?photographerID=${photographers[index].id}" class="photographer__link" id="photographer-${photographers[index].id}">
                <figure>
                    <img src="./public/img/Sample_Photos/Photographers_ID_Photos/${photographers[index].portrait}" alt="${photographers[index].name}" class="photographer__picture">
                </figure>
                <h2 class="photographer__name">${photographers[index].name}</h2>
            </a>
            <p class="photographer__city">${photographers[index].city}, ${photographers[index].country}</p><br>
            <p class="photographer__description">${photographers[index].tagline}</p><br>
            <p class="photographer__price">${photographers[index].price}€/jour</p><br>
            <ul class="photographer__tags" id="photographer-tags-${photographers[index].id}"></ul>
        </article>`;
        var tagsContainer = document.querySelector('#photographer-tags-' + photographers[index].id);
        for (let i = 0; i < photographers[index].tags.length; i++) {
            tagsContainer.innerHTML += `<li class="tags__name tags__${photographers[index].id}">#${photographers[index].tags[i]}</li>`        
        }
    } 
}

// Affichage des photographes par tags
function displayPhotographersByTags (id) {
    let photographers = listOfphotographers
    let tag = id
    for (let index = 0; index < photographers.length; index++) {
        let tagsContent = photographers[index].tags
        let photographer = document.getElementById(photographers[index].id)
        if (tagsContent.includes(tag)) {
            photographer.style.display = "flex"
        } else {
            photographer.style.display = "none"
        }
    }   
}

