let isEditMode = false;

export function setEditMode(state){
    isEditMode = state
    isEditMode ? displayEditBar() : deleteEditBar()
}

export function displayEditBar() {
    const element = document.querySelector('#edit-bar');
    if(!element){
        const htmlString =
          '<div class="edit-bar" id="edit-bar"><img src="./assets/icons/edit-white.png" alt="edit">Mode édition</div>';
        document.body.insertAdjacentHTML("afterbegin", htmlString);
        document.querySelector('header').style.marginTop = '97px';
    }

  }
  
export function deleteEditBar() {
    const element = document.querySelector(".edit-bar");
    element ? element.remove() : "";
  }


