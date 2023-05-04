import { render, RenderPosition } from './render.js';
import ListFiltersView from './view/list-filters-view.js';
import ListSortView from './view/list-sort-view.js';
import TripInfoView from './view/trip-info-view.js';
import WaypointListPresenter from './presenter/waypoint-list-presenter.js';
import PointsModel from './model/waypoint-model.js';

const siteHeaderElement = document.querySelector('.page-header');
const listFiltersContainer = siteHeaderElement.querySelector('.trip-controls__filters');
const tripInfoContainer = siteHeaderElement.querySelector('.trip-main');

const siteMainElement = document.querySelector('.page-main');
const tripEventsContainer = siteMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel();
const waypointListPresenter = new WaypointListPresenter({waypointListContainer: tripEventsContainer, pointsModel});

render(new TripInfoView(), tripInfoContainer, RenderPosition.AFTERBEGIN);
render(new ListFiltersView(), listFiltersContainer);
render(new ListSortView(), tripEventsContainer);

waypointListPresenter.init();
