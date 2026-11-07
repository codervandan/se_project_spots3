import "./index.css";
import { enableValidation, resetValidation } from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "b3b6c0fc-281f-417a-84f0-c0e04e66bc03",
    "Content-Type": "application/json",
  },
});

const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};


// No longer needed since we are fetching the initial cards from the API

// const initialCards = [
//   {
//         name: "Landscape View",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"
//     },
//     {
//         name: "Val Thorens",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
//     },
//     {
//         name: "Restarant terrace",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
//     },
//         {
//         name: "An outdoor cafe",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
//     },
//         {
//         name: "A very long bridge, over the forest and through the trees",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
//     },
//         {
//         name: "Tunnel with morning light",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
//     },
//         {
//         name: "Mountain house",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
//     },
// ];



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

const profileAvatarEl = document.querySelector(".profile__avatar");

const previewModal = document.querySelector('#preview-modal');
const previewCloseBtn = previewModal.querySelector('.modal__close-btn');
const previewImageEl = previewModal.querySelector('.modal__image');
const previewCaptionEl = previewModal.querySelector('.modal__caption');


const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardCloseBtn = deleteCardModal.querySelector(".modal__close-btn");
const deleteCardForm = deleteCardModal.querySelector(".modal__form");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const editAvatarFormEl = editAvatarModal.querySelector(".modal__form");
const editAvatarUrlInput = editAvatarModal.querySelector("#avatar-url-input");

let selectedCard = null;
let selectedCardId = null;


const avatarEditBtn = document.querySelector(".profile__avatar-edit-btn");
avatarEditBtn.addEventListener("click", () => {
  resetValidation(editAvatarFormEl, validationConfig);
  openModal(editAvatarModal);
});

editAvatarCloseBtn.addEventListener("click", () => {
  closeModal(editAvatarModal);
});



editAvatarFormEl.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!editAvatarFormEl.checkValidity()) {
    return;
  }

  const submitButton = editAvatarFormEl.querySelector(".modal__submit-btn");
  submitButton.dataset.originalText = submitButton.textContent;

  const avatarUrl = editAvatarUrlInput.value;

  setButtonLoading(submitButton, true, "Saving...");

  api.updateAvatar(avatarUrl)
    .then((updatedUser) => {
      profileAvatarEl.src = updatedUser.avatar;

      closeModal(editAvatarModal);
      editAvatarFormEl.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonLoading(submitButton, false);
      resetValidation(editAvatarFormEl, validationConfig);
    });
});




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

  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");

  // Display the like state received from the server.
  cardLikeBtnEl.classList.toggle(
    "card__like-button_is-active",
    data.isLiked
  );

  cardLikeBtnEl.addEventListener("click", () => {
    const isLiked = cardLikeBtnEl.classList.contains(
      "card__like-button_is-active"
    );

    const request = isLiked
      ? api.unlikeCard(data._id)
      : api.likeCard(data._id);

    cardLikeBtnEl.disabled = true;

    request
      .then((updatedCard) => {
        cardLikeBtnEl.classList.toggle(
          "card__like-button_is-active",
          updatedCard.isLiked
        );
      })
      .catch(console.error)
      .finally(() => {
        cardLikeBtnEl.disabled = false;
      });
  });




  const cardDeleteBtnEl = cardElement.querySelector('.card__delete-button');

  cardDeleteBtnEl.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;

    openModal(deleteCardModal);
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

deleteCardCloseBtn.addEventListener("click", () => {
  closeModal(deleteCardModal);
});

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


function setButtonLoading(button, isLoading, loadingText) {
  if (isLoading) {
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText;
    button.disabled = false;
  }
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

  const submitButton = editProfileFormEl.querySelector(".modal__submit-btn");
  submitButton.dataset.originalText = submitButton.textContent;

  const name = editProfileNameInput.value;
  const about = editProfileDescriptionInput.value;

  setButtonLoading(submitButton, true, "Saving...");

  api.editUserInfo({ name, about })
    .then((userData) => {
      profileNameEl.textContent = userData.name;
      profileDescriptionEl.textContent = userData.about;

      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonLoading(submitButton, false);
      resetValidation(editProfileFormEl, validationConfig);
    });
}






function handleAddCardSubmit(evt) {
  evt.preventDefault();

  if (!newPostFormEl.checkValidity()) {
    return;
  }

  const submitButton = newPostFormEl.querySelector(".modal__submit-btn");
  submitButton.dataset.originalText = submitButton.textContent;

  const newCardData = {
    name: newPostCaptionInput.value,
    link: newPostLinkInput.value,
  };

  setButtonLoading(submitButton, true, "Saving...");

  api.addCard(newCardData)
    .then((cardData) => {
      const newCardElement = getCardElement(cardData);

      cardsList.prepend(newCardElement);
      closeModal(newPostModal);

      newPostFormEl.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonLoading(submitButton, false);
      resetValidation(newPostFormEl, validationConfig);
    });
}



function handleDeleteSubmit(evt) {
  evt.preventDefault();

  if (!selectedCard || !selectedCardId) {
    return;
  }

  const submitButton = deleteCardForm.querySelector(".modal__submit-btn");
  submitButton.dataset.originalText = submitButton.textContent;

  setButtonLoading(submitButton, true, "Deleting...");

  api.removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();

      closeModal(deleteCardModal);

      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      setButtonLoading(submitButton, false);
    });
}





deleteCardForm.addEventListener("submit", handleDeleteSubmit);


editProfileFormEl.addEventListener("submit", handleProfileFormSubmit);
newPostFormEl.addEventListener("submit", handleAddCardSubmit);

// no longer needed since we are fetching the initial cards from the API

// initialCards.forEach(function (card) {
//   const cardElement = getCardElement(card);
//   // console.log(cardElement);
//   cardsList.append(cardElement);
// });


api.getUserInfo()
  .then((userData) => {
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;
  })
  .catch(console.error);


api.getInitialCards()
  .then((cards) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);



enableValidation(validationConfig);
