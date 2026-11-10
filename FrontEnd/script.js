// Fetch the works from the API
const response = await fetch("http://localhost:5678/api/works");
let works = await response.json();

// The HTML gallery, where the works will be added
const gallery = document.querySelector(".gallery");

// Display a list of works in the gallery
function displayWorks(worksList) {
    // For each work: one figure in the gallery
    for (let i = 0; i < worksList.length; i++) {
        const work = worksList[i];
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
        gallery.appendChild(card);
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
    // Move the "active" class to the clicked button
    clearActiveButton();
    allButton.classList.add("active");
    // Clear the gallery
    gallery.innerHTML = "";
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
        const clickedCategoryId = category.id;

        // Move the "active" class to the clicked button
        clearActiveButton();
        button.classList.add("active");

        // Keep only the works of this category
        const filteredWorks = works.filter(function (work) {
            return work.categoryId === clickedCategoryId;
        });
        // Clear the gallery
        gallery.innerHTML = "";
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
            // Ask the API to delete the work (the token proves that we are allowed to)
            const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            // The token has expired: the user must log in again
            if (response.status === 401) {
                handleExpiredToken();
                return;
            }

            // Remove the deleted work from the list of works
            if (response.ok) {
                works = works.filter(function (oneWork) {
                    return oneWork.id !== work.id;
                });

                // Redraw the gallery of the page and the gallery of the modal
                gallery.innerHTML = "";
                displayWorks(works);
                modalGallery.innerHTML = "";
                displayModalWorks(works);
            }
        });
    }
}

// When the token has expired: remove it and go back to the login page
function handleExpiredToken() {
    alert("Votre session a expiré. Veuillez vous reconnecter.");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Check if the user is logged in (a token is saved in the localStorage)
const token = localStorage.getItem("token");

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
        modal.classList.remove("hidden");
    });

    // Close the modal on click on the cross
    const closeButton = document.querySelector(".modal-close");
    closeButton.addEventListener("click", function () {
        modal.classList.add("hidden");
    });

    // Close the modal on click outside the window (on the grey background)
    modal.addEventListener("click", function (event) {
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
        galleryView.classList.add("hidden");
        formView.classList.remove("hidden");
        backButton.classList.remove("hidden");
    });

    // Go back to the gallery view on click on the arrow
    backButton.addEventListener("click", function () {
        galleryView.classList.remove("hidden");
        formView.classList.add("hidden");
        backButton.classList.add("hidden");
    });

    // Fill the category list of the form with the categories of the API
    const categoryInput = document.querySelector("#category-input");
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const option = document.createElement("option");
        option.value = category.id;
        option.innerText = category.name;
        categoryInput.appendChild(option);
    }
    // Show a preview of the chosen photo
    const photoInput = document.querySelector("#photo-input");
    const photoPreview = document.querySelector(".photo-preview");
    photoInput.addEventListener("change", function () {
        const file = photoInput.files[0];
        if (file) {
            photoPreview.src = URL.createObjectURL(file);
            photoPreview.classList.remove("hidden");
        }
    });
    // Change the photo on click on the preview
    photoPreview.addEventListener("click", function () {
        photoInput.click();
    });

    // Enable the "Valider" button only when the form is complete
    const addWorkForm = document.querySelector(".add-work-form");
    const titleInput = document.querySelector("#title-input");
    const validateButton = document.querySelector(".validate-button");
    const formError = document.querySelector(".form-error");

    function updateValidateButton() {
        const isComplete = photoInput.files.length > 0 && titleInput.value.trim() !== "" && categoryInput.value !== "";
        validateButton.disabled = !isComplete;
        // Clear the error message as soon as the user changes the form
        formError.innerText = "";
    }

    // At the start the form is empty, so the button is grey
    updateValidateButton();

    // Check again at each change in the form
    addWorkForm.addEventListener("input", updateValidateButton);

    // On submit: check the photo, then send the new work to the API
    addWorkForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const file = photoInput.files[0];

        // Check the type and the size of the photo
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            formError.innerText = "La photo doit être au format jpg ou png.";
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            formError.innerText = "La photo ne doit pas dépasser 4 Mo.";
            return;
        }
        formError.innerText = "";

        // Prepare the data in the format expected by the API (multipart/form-data)
        const formData = new FormData();
        formData.append("image", file);
        formData.append("title", titleInput.value.trim());
        formData.append("category", categoryInput.value);

        // Send the new work, with the token (no Content-Type: the browser sets it)
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        // The token has expired: the user must log in again
        if (response.status === 401) {
            handleExpiredToken();
            return;
        }

        if (response.ok) {
            const newWork = await response.json();
            // The API returns categoryId as a text: convert it to a number, like the other works
            newWork.categoryId = Number(newWork.categoryId);

            // Add the new work to the list of works
            works.push(newWork);

            // Redraw the gallery of the page and the gallery of the modal
            gallery.innerHTML = "";
            displayWorks(works);
            modalGallery.innerHTML = "";
            displayModalWorks(works);

            // Empty the form, hide the preview, and grey the button again
            addWorkForm.reset();
            photoPreview.classList.add("hidden");
            updateValidateButton();

            // Go back to the gallery view, and close the modal
            galleryView.classList.remove("hidden");
            formView.classList.add("hidden");
            backButton.classList.add("hidden");
            modal.classList.add("hidden");
        } else {
            formError.innerText = "Erreur lors de l'envoi. Veuillez réessayer.";
        }
    });
}
