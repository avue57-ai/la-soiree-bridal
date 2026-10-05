// Section type → component. A section type in content/pages/*.json must be listed here.
import HeroVideo from './home/HeroVideo.astro';
import StatementSplit from './home/StatementSplit.astro';
import Pillars from './home/Pillars.astro';
import CollectionRail from './home/CollectionRail.astro';
import DesignerIndex from './home/DesignerIndex.astro';
import AppointmentFeature from './home/AppointmentFeature.astro';
import VipTeaser from './home/VipTeaser.astro';
import Proof from './home/Proof.astro';
import SalonMosaic from './home/SalonMosaic.astro';
import JournalTeaser from './home/JournalTeaser.astro';
import FinalCta from './home/FinalCta.astro';

export const sections = {
  'hero-video': HeroVideo, 'statement-split': StatementSplit, pillars: Pillars, 'collection-rail': CollectionRail,
  'designer-index': DesignerIndex, 'appointment-feature': AppointmentFeature, 'vip-teaser': VipTeaser, proof: Proof,
  'salon-mosaic': SalonMosaic, 'journal-teaser': JournalTeaser, 'final-cta': FinalCta,
};
