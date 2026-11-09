// Fetch the works from the API
const response = await fetch("http://localhost:5678/api/works");
let works = await response.json();

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
        const clickedCategoryId = category.id;
        console.log("Ticket lu :", clickedCategoryId);

        // Move the "active" class to the clicked button
        clearActiveButton();
        button.classList.add("active");

        // Keep only the works of this category
        const filteredWorks = works.filter(function (work) {
            return work.categoryId === clickedCategoryId;
        });
        console.log("Travaux filtrés:", filteredWorks);
        // Clear the gallery
        projets.innerHTML = "";
        // Display the filtered works
        displayWorks(filteredWorks);
    });
}

// The gallery of the modal, where the thumbnails will be added
const modalGallery = document.querySelector(".modal-gallery");

// Display a list of works in the modal, as thumbnails with a trash button
function displayModalWorks(worksList) {
    for (let i = 0; i < worksList.length; i++) {
        const work = worksList[i];

        // Create a thumbnail: the image and a delete button
        const thumbnail = document.createElement("figure");
        const picture = document.createElement("img");
        picture.src = work.imageUrl;
        picture.alt = work.title;
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        // Put the image and the button into the thumbnail, then the thumbnail into the modal gallery
        thumbnail.appendChild(picture);
        thumbnail.appendChild(deleteButton);
        modalGallery.appendChild(thumbnail);

        // On click on the trash button: delete this work
        deleteButton.addEventListener("click", async function () {
            console.log("Travail à supprimer :", work.id, work.title);

            // Ask the API to delete the work (the token proves that we are allowed to)
            const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Code de la réponse :", response.status);

            if (response.ok) {
                console.log("Supprimé !");

                // Remove the deleted work from the list of works
                works = works.filter(function (oneWork) {
                    return oneWork.id !== work.id;
                });

                // Redraw the gallery of the page and the gallery of the modal
                projets.innerHTML = "";
                displayWorks(works);
                modalGallery.innerHTML = "";
                displayModalWorks(works);
            } else {
                console.log("Échec de la suppression");
            }
        });
    }
}

// Check if the user is logged in (a token is saved in the localStorage)
const token = localStorage.getItem("token");
console.log("Token trouvé :", token);

if (token !== null) {
    // Edit mode: hide the filters
    filters.classList.add("hidden");

    // Edit mode: "login" becomes "logout"
    const loginLink = document.querySelector("#login-link");
    loginLink.innerText = "logout";

    // Logout: remove the token and reload the page
    loginLink.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location.reload();
    });

    // Edit mode: show the black banner
    const editBanner = document.querySelector(".edit-banner");
    editBanner.classList.remove("hidden");

    // Edit mode: show the "modifier" button
    const editButton = document.querySelector(".edit-button");
    editButton.classList.remove("hidden");

    // Open the modal on click on the "modifier" button
    const modal = document.querySelector(".modal");
    // Display the works in the modal gallery
    displayModalWorks(works);

    editButton.addEventListener("click", function () {
        console.log("Clic sur modifier");
        modal.classList.remove("hidden");
    });

    // Close the modal on click on the cross
    const closeButton = document.querySelector(".modal-close");
    closeButton.addEventListener("click", function () {
        console.log("Clic sur la croix");
        modal.classList.add("hidden");
    });

    // Close the modal on click outside the window (on the grey background)
    modal.addEventListener("click", function (event) {
        console.log("Clic sur :", event.target);
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });

    // The two views of the modal, and the back arrow
    const galleryView = document.querySelector(".modal-gallery-view");
    const formView = document.querySelector(".modal-form-view");
    const backButton = document.querySelector(".modal-back");

    // Go to the form view on click on "Ajouter une photo"
    const addPhotoButton = document.querySelector(".modal-add-button");
    addPhotoButton.addEventListener("click", function () {
        console.log("Clic sur Ajouter une photo");
        galleryView.classList.add("hidden");
        formView.classList.remove("hidden");
        backButton.classList.remove("hidden");
    });

    // Go back to the gallery view on click on the arrow
    backButton.addEventListener("click", function () {
        console.log("Clic sur la flèche");
        galleryView.classList.remove("hidden");
        formView.classList.add("hidden");
        backButton.classList.add("hidden");
    });
}
