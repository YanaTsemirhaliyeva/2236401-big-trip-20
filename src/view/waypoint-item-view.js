import dayjs from 'dayjs';
import { calculateDuration, formatDuration } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';

function createWaypointItemTemplate(point, pointDestination, pointOffers) {
  const { type, basePrice, dateFrom, dateTo, isFavorite } = point;
  const name = pointDestination?.name;
  const favorite = isFavorite ? 'event__favorite-btn--active' : '';

  const startDay = dayjs(dateFrom).format('MMM D');
  const startDayDateTime = dayjs(dateFrom).format('YYYY-MM-DD');
  const startTime = dayjs(dateFrom).format('HH:mm');
  const startTimeDateTime = dayjs(dateFrom).format('YYYY-MM-DDTHH:mm');
  const endTime = dayjs(dateTo).format('HH:mm');
  const endTimeDateTime = dayjs(dateTo).format('YYYY-MM-DDTHH:mm');

  const duration = calculateDuration(dateFrom, dateTo);
  const eventDuration = formatDuration(duration);

  const checkedOffers = pointOffers?.filter((offer) => point.offers.includes(offer.id));

  const getTitleOffersByType = () => {
    let needsOffers = '';
    checkedOffers?.forEach((checkedOffer) => {
      const { title, price } = checkedOffer;
      const selectedOffer = `
        <li class="event__offer">
          <span class="event__offer-title">${he.encode(title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${he.encode(price.toString())}</span>
       </li>`;
      needsOffers += selectedOffer;
    });
    return needsOffers;
  };

  return (/*html*/
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${startDayDateTime}">${startDay}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(type.toLowerCase())}.png" alt="Event ${he.encode(type)} icon">
        </div>
        <h3 class="event__title">${he.encode(type)} ${he.encode(name)}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startTimeDateTime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endTimeDateTime}">${endTime}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice.toString())}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">${getTitleOffersByType()}</ul>

        <button class="event__favorite-btn ${favorite}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class WaypointItemView extends AbstractView {
  #point = null;
  #pointDestination = null;
  #pointOffers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, pointDestination, pointOffers, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;


    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createWaypointItemTemplate(this.#point, this.#pointDestination, this.#pointOffers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
