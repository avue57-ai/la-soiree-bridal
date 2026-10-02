// Business details and appointment menu are edited in the site editor (/admin → Settings).
import business from '../../content/settings/business.json';
import appts from '../../content/settings/appointments.json';

export const site = business;
export const appointments = appts.appointments;

export const nav = [
  { href: '/collection/', label: 'Collection' },
  { href: '/designers/', label: 'Designers' },
  { href: '/experience/', label: 'The Experience' },
  { href: '/vip/', label: 'VIP' },
  { href: '/about/', label: 'About' },
  { href: '/journal/', label: 'Journal' },
];
