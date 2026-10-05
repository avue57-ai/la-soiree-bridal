// Business details and appointment menu are edited in the site editor (/admin → Settings).
import business from '../../content/settings/business.json';
import appts from '../../content/settings/appointments.json';

export const site = business;
export const appointments = appts.appointments;

import navigation from '../../content/settings/navigation.json';
export const navigationData = navigation;
export const nav = [...navigation.header.left, ...navigation.header.right];
