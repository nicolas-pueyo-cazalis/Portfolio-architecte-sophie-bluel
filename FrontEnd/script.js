// Fetch the works from the API
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();

// The HTML gallery, where the works will be added
const projets = document.querySelector(".gallery");

// Display a list of works in the gallery
function displayWorks(worksList) {
    console.log("displayWorks reçoit :", worksList);
    // For each work: one figure in the gallery
    for (let i = 0; i < worksList.length; i++) {
        const work = worksList[i];
        console.log("Tour", i, work);
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
}
// On page load: display all the works
displayWorks(works);

// Fetch the categories from the API
const categoriesResponse = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesResponse.json();

// The HTML filters, where the categories will be added
const filters = document.querySelector(".filters");

// Remove the "active" class from all the filter buttons
function clearActiveButton() {
    const filterButtons = document.querySelectorAll(".filters button");
    console.log("Boutons trouvés :", filterButtons);
    for (let i = 0; i < filterButtons.length; i++) {
        filterButtons[i].classList.remove("active");
    }
}

// The "Tous" button, to show all the works (it does not exist in the API)
const allButton = document.createElement("button");
allButton.innerText = "Tous";
// "Tous" is selected by default
allButton.classList.add("active");

filters.appendChild(allButton);

// On click on "Tous": display all the works
allButton.addEventListener("click", function () {
    console.log("Tous button clicked");

    // Move the "active" class to the clicked button
    clearActiveButton();
    allButton.classList.add("active");
    // Clear the gallery
    projets.innerHTML = "";
    // Display all the works
    displayWorks(works);
});

// For each category: one button in the filters
for (let i = 0; i < categories.length; i++) {
    const category = categories[i];

    // Create a button for the category
    const button = document.createElement("button");
    button.innerText = category.name;

    // Add the button to the filters
    filters.appendChild(button);

    // On click on a category button: read its ticket
    button.addEventListener("click", function () {
        console.log("Category button clicked:", category.name);
        const categoryId = category.id;
        console.log("Ticket lu :", categoryId);

        // Move the "active" class to the clicked button
        clearActiveButton();
        button.classList.add("active");

        // Keep only the works of this category
        const filteredWorks = works.filter(function (work) {
            return work.categoryId === categoryId;
        });
        console.log("Travaux filtrés:", filteredWorks);
        // Clear the gallery
        projets.innerHTML = "";
        // Display the filtered works
        displayWorks(filteredWorks);
    });
}
