import { enableValidation, resetValidation } from './validation.js';

const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};


const initialCards = [
  {
        name: "Landscape View",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
    },
    {
        name: "Val Thorens",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
    },
    {
        name: "Restarant terrace",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
    },
        {
        name: "An outdoor cafe",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
    },
        {
        name: "A very long bridge, over the forest and through the trees",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
    },
        {
        name: "Tunnel with morning light",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
    },
        {
        name: "Mountain house",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
    },
];



const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector('#edit-profile-modal');
const editProfileCloseBtn = editProfileModal.querySelector('.modal__close-btn');
const editProfileFormEl = editProfileModal.querySelector('.modal__form');
const editProfileNameInput = editProfileModal.querySelector('#profile-name-input');
const editProfileDescriptionInput = editProfileModal.querySelector('#profile-description-input'); 

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector('#new-post-modal');
const newPostCloseBtn = newPostModal.querySelector('.modal__close-btn');

// TODO - Select form and both inputs 
const newPostFormEl = newPostModal.querySelector(".modal__form");
const newPostLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const profileNameEl = document.querySelector('.profile__name');
const profileDescriptionEl = document.querySelector('.profile__description');

const previewModal = document.querySelector('#preview-modal');
const previewCloseBtn = previewModal.querySelector('.modal__close-btn');
const previewImageEl = previewModal.querySelector('.modal__image');
const previewCaptionEl = previewModal.querySelector('.modal__caption');

const cardTemplate = document
.querySelector('#card-template')
.content
.querySelector('.card');


const cardsList = document.querySelector(".cards__list");


function getCardElement(data) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardTitleEl = cardElement.querySelector('.card__title');
    const cardImageEl = cardElement.querySelector('.card__image');

    cardTitleEl.textContent = data.name;
    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;
    
    // 1. Select the card elements like button
    const cardLikeBtnEl = cardElement.querySelector('.card__like-button');
    // 2. Set a click listner on it
    cardLikeBtnEl.addEventListener('click', () => {
        cardLikeBtnEl.classList.toggle('card__like-button_is-active');
    });

    const cardDeleteBtnEl = cardElement.querySelector('.card__delete-button');
    cardDeleteBtnEl.addEventListener('click', () => {
        cardElement.remove();
        // can also use the closest() method to find the parent card element
        // cardDeleteBtnEl.closest('.card').remove();
        // You can set cardElement to null this helps garbase collector to know 
        // when it's time to throw away what is stored in memory 
        // cardElement = null;
    });

    cardImageEl.addEventListener('click', () => {
      previewImageEl.src = cardImageEl.src;
      previewCaptionEl.textContent = cardTitleEl.textContent;
      openModal(previewModal);
    });

    return cardElement;
  }

  
  function handleEscClose(event) {
    if (event.key === "Escape") {
    const openedModal = document.querySelector(
      ".modal_is-opened"
    );

    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");

  document.addEventListener(
    "keydown",
    handleEscClose
  );
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  
  document.removeEventListener(
    "keydown",
    handleEscClose
  );
}



const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});




editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value =
    profileDescriptionEl.textContent;

  resetValidation(editProfileFormEl, validationConfig);
  openModal(editProfileModal);
});


editProfileCloseBtn.addEventListener('click', () => {
    closeModal(editProfileModal);
});

newPostBtn.addEventListener('click', () => {
    openModal(newPostModal);
});

newPostCloseBtn.addEventListener('click', () => {
    closeModal(newPostModal);
});

previewCloseBtn.addEventListener('click', () => {
    closeModal(previewModal);
});

 
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); 
 
if (!editProfileFormEl.checkValidity()) {
  return;
}


  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  // property of the corresponding input element.

  // Insert these new values into the textContent
  // property of the corresponding profile elements.

  // Close the modal.
  closeModal(editProfileModal);
}


    function handleAddCardSubmit(evt) {
    evt.preventDefault();

    
    if (!newPostFormEl.checkValidity()) {
      return;
    }
    
    
    console.log(newPostLinkInput.value);
    console.log(newPostCaptionInput.value);
    const newCardData = {
        link: newPostLinkInput.value,
        name: newPostCaptionInput.value
    };
    const newCardElement = getCardElement(newCardData);
    cardsList.prepend(newCardElement);
    closeModal(newPostModal);

    newPostFormEl.reset();
    resetValidation(newPostFormEl, validationConfig);
    
  }

  


  
editProfileFormEl.addEventListener("submit", handleProfileFormSubmit);
newPostFormEl.addEventListener("submit", handleAddCardSubmit);



initialCards.forEach(function (card) {
  const cardElement = getCardElement(card);
  // console.log(cardElement);
  cardsList.append(cardElement);
});


enableValidation(validationConfig);