import { projects } from "./app.js";
import { setEditMode } from "./edit-bar.js";

export function showModal(event) {
  
  event.preventDefault();

  if (document.querySelector("#modal")) {
    removeModal();
  }

  const mapping = {
    editLink: "delete",
    modalButton: "add",
    modalArrowLeft: "delete",
  };

  const context = mapping[event.target.id];

  const contextData = {
    delete: {
      title: "Galerie Photo",
      buttonText: "Ajouter une photo",
      arrowLeft: "",
      bodyClass: "modal__cards",
    },
    add: {
      title: "Ajout photo",
      buttonText: "Valider",
      arrowLeft:
        '<img src="./assets/icons/arrow-left.png" alt="arrow left" class="modal__arrow-left" id="modalArrowLeft">',
      bodyClass: "modal__form",
    },
  };

  let htmlString = `
    
    <div class="modal" id="modal" role="dialog">
        <div class="modal__content">
            ${contextData[context].arrowLeft}
            <img src="./assets/icons/close.png" alt="closing cross" class="modal__closing-cross" id="modal-closing-cross">
            <h1 class="modal__title">${contextData[context].title}</h1>
            <div class="${contextData[context].bodyClass}">
           
    `;

  if (context === "delete") {
    projects.forEach((project) => {
      htmlString += `
           
                <div class="modal__card">
                    <img src="${project.imageUrl}" alt="${project.title}" class="modal__card-image">
                    <a href="#"><img src="./assets/icons/bin.png" alt="bin" class="modal__card-bin" id="modal-card-bin" data-id="${project.id}"></a>
                </div>
            `;
    });
  }

  if (context === "add") {
    htmlString += `

    <form action="#" id="modal-form">

    <div class="modal__form-photo-area" id="form-photo-area">
      <div class="modal__form-file-group"animationiteration>
          <img class="modal__form-landscape" src="./assets/icons/landscape.png" alt="landscape">
          <label for="file" class="modal__form-file-input-label">+ Ajouter photo</label>
          <input type="file" name="modal__form-file-input" id="file" class="modal__form-file-input" accept="image/*">
          <p>jpg, png : 4mo max</p>  
      </div>
      <img >

    </div>

    
    <div class="modal__form-group form-group-title">
        <label for="modal-form-title">Titre</label>
        <input type="text" name="title" id="modal-form-title">
    </div>
    <div class="modal__form-group form-group-categorie">
        <label for="modal-form-categorie">Catégorie</label>
          <select name="categorie" id="modal-form-categorie">
            <option value=""></option>
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hotel & restaurants</option>
          </select> 
    </div>
    </form>   
        
        
        `;
  }

  htmlString += `
    
    </div>
    <button class="modal__button" id="modalButton">${contextData[context].buttonText}</button>
    </div>
    </div>`;

    

  document.body.insertAdjacentHTML("beforeend", htmlString);

  //General modal
  document
    .querySelector("#modal-closing-cross")
    .addEventListener("click", removeModal);
  const modal = document.querySelector("#modal");
  modal.addEventListener("click", removeModal);
  modal.children[0].addEventListener("click", function (e) {
    e.stopPropagation();
  });

  if (context === "delete") {
    document
      .querySelectorAll("#modal-card-bin")
      .forEach((bin) => bin.addEventListener("click", deleteProject));

    document.querySelector("#modalButton").addEventListener("click", showModal);
  }

  if (context === "add") {
    document
      .querySelector("#modalArrowLeft")
      .addEventListener("click", showModal);

    document
      .querySelector(".modal__form #file")
      .addEventListener("change", previewUploadFile);

    document
      .querySelector("#modalButton")
      .addEventListener("click", addProject);
  }

  setEditMode(true)
}

function removeModal() {
  const modal = document.querySelector("#modal");
  modal.remove();
  setEditMode(false);
}

async function deleteProject(event) {
  event.preventDefault();
  const id = event.target.dataset.id;

  const token = localStorage.getItem("token");

  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

async function addProject(event) {
  event.preventDefault();

  const form = document.querySelector("#modal-form");
  const token = localStorage.getItem("token");
  const formData = new FormData();
  const selectElement = form.querySelector("#modal-form-categorie");
  formData.append("image", selectedFile);
  formData.append("title", form.querySelector("#modal-form-title").value);
  formData.append(
    "category",
    selectElement.options[selectElement.selectedIndex].value
  );

  let response = await fetch("http://localhost:5678/api/works/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

function previewUploadFile(event) {
  if (event.target.files.length > 0) {
    const src = URL.createObjectURL(event.target.files[0]);
    const preview = document.querySelector("#form-photo-area");
    document.querySelector(".modal__form-file-group").style.display = "none";

    preview.innerHTML += `
      <img class="form__preview" id="form-preview" src="${src}" alt="preview">
    
    `;

    selectedFile = event.target.files[0];
  }
}

let selectedFile = null;
