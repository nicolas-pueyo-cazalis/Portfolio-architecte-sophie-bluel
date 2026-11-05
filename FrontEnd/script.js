// Fetch the works from the API
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();

// The HTML gallery, where the works will be added
const projets = document.querySelector(".gallery");

// For each work: one figure in the gallery
for (let i = 0; i < works.length; i++) {
    const work = works[i];

    // Create a figure: the image and its title
    const card = document.createElement("figure");
    const picture = document.createElement("img");
    picture.src = work.imageUrl;
    picture.alt = work.title;
    const caption = document.createElement("figcaption");
    caption.innerText = work.title;

    // Put the image and the title into the figure, then the figure into the gallery
    card.appendChild(picture);
    card.appendChild(caption);
    projets.appendChild(card);
}
