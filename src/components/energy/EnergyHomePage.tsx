'use client';
import { CDN_URL } from '@/lib/cdn';
import HeroSection from './sections/HeroSection';
import CleanEnergy from './sections/CleanEnergy';
import SwitchAncestro from './sections/SwitchAncestro';
import SolarSlide from './sections/SolarSlide';
import ProductTabs from './sections/ProductTabs';
import ChooseCoverage from './sections/ChooseCoverage';
import MakesItEasy from './sections/MakesItEasy';
import GridDown from './sections/GridDown';
import AncestroApp from './sections/AncestroApp';
import PowerOn from './sections/PowerOn';
import InstallSolar from './sections/InstallSolar';
import LatamMap from './sections/LatamMap';
import FinalCta from './sections/FinalCta';

interface Props { lang: string }

export const IMG = `${CDN_URL}/energy-home`;
export const FLAGS = `${CDN_URL}/images/flags`;

export default function EnergyHomePage({ lang }: Props) {
  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <HeroSection lang={lang} />
      <CleanEnergy lang={lang} />
      <SwitchAncestro lang={lang} />
      <SolarSlide lang={lang} />
      <ProductTabs lang={lang} />
      <ChooseCoverage lang={lang} />
      <MakesItEasy lang={lang} />
      <GridDown lang={lang} />
      <AncestroApp lang={lang} />
      <PowerOn lang={lang} />
      <InstallSolar lang={lang} />
      <LatamMap lang={lang} />
      <FinalCta lang={lang} />
    </div>
  );
}
