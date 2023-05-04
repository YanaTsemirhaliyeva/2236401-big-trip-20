import { saveNewWaypoint, getRandomDestination } from '../mock/data-structure.js';
import { createElement } from '../render.js';
import { Offers, WAYPOINTS_TYPES } from '../const.js';
// import { getRandomOffersByType } from '../utils.js';

import dayjs from 'dayjs';

function createEditWaypointElement(point) {
  const { basePrice, dateFrom, dateTo, destination, type } = point;

  const timeFrom = dayjs(dateFrom).format('DD/MM/YY HH:mm');
  const timeTo = dayjs(dateTo).format('DD/MM/YY HH:mm');

  const { description, name, pictures } = getRandomDestination();
  const cityDestination = name;

  // const offersByTypes = getRandomOffersByType(Offers, type.toLowerCase());

  const picturesByDestination = (photos) => {
    const picturesArr = [];
    for (let i = 0; i < photos.length; i++) {
      const picItem = photos[i];
      picturesArr.push(picItem);
    }
    return picturesArr;
  };
  const destinationPictures = picturesByDestination(pictures);

  const getOffersByType = (offs, t) => {
    const offersByType = offs.filter((o) => o.type === t);
    if(offersByType && offersByType.length && offersByType[0].offers) {
      return offersByType[0].offers;
    }
  };

  const offersArray = getOffersByType(Offers, type.toLowerCase());

  const createOffersByType = () => {
    let callOffers = '';
    if(offersArray.length) {
      callOffers = '';
      offersArray.forEach((offer) =>{
        const checked = Math.random() > 0.5 ? 'checked' : '';
        if(offer.title && offer.price && offer.id) {
          callOffers += `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${checked}>
            <label class="event__offer-label" for="event-offer-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`;
        }
      });
    }
    return callOffers;
  };

  const createDestinationPictures = () => {
    let pics = '';
    if (destinationPictures.length) {
      destinationPictures.forEach((photo) => {
        if (photo.src && photo.description) {
          pics += `
        <img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
        }
      });
    }
    return pics;
  };

  const createSelectionType = () => {
    let selectType = '';
    if (WAYPOINTS_TYPES.length) {
      WAYPOINTS_TYPES.forEach((typeEvent) => {
        const checked = typeEvent === type ? 'checked' : '';
        if(typeEvent) {
          selectType += `
          <div class="event__type-item">
            <input id="event-type-${typeEvent.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeEvent.toLowerCase()}" ${checked}>
            <label class="event__type-label  event__type-label--${typeEvent.toLowerCase()}" for="event-type-${typeEvent.toLowerCase()}-1">${typeEvent}</label>
          </div>`;
        }
      });
    }
    return selectType;
  };

  return (/*html*/
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${createSelectionType()}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${cityDestination}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="${destination}"></option>
              <option value="${destination}"></option>
              <option value="${destination}"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${timeFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${timeTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffersByType()}
            </div>
          </section>

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${cityDestination} ${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${createDestinationPictures()}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>`
  );
}

export default class EditionWaypointFormView {
  constructor({ point = saveNewWaypoint() }) {
    this.point = point;
  }

  getTemplate() {
    return createEditWaypointElement(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
