// Business details and appointment menu are edited in the site editor (/admin → Settings).
import business from '../../content/settings/business.json';
import appts from '../../content/settings/appointments.json';

export const site = business;
export const appointments = appts.appointments;

import navigation from '../../content/settings/navigation.json';
export const navigationData = navigation;
export const nav = [...navigation.header.left, ...navigation.header.right];

// Facts that appear in prose across the site, derived so a change in settings reaches every page.
const byId = (id) => appointments.find((a) => a.id === id);
export const facts = {
  guests: byId('two-hour').guests,
  vipGuests: byId('vip').guests,
  vipPrice: byId('vip').price,
  priceRange: site.priceRange.replace(/ /g, ''),
};
