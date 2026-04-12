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
      {/* 1 */}  <HeroSection lang={lang} />
      {/* 2 */}  <CleanEnergy lang={lang} />
      {/* 2.1 */}<SwitchAncestro lang={lang} />
      {/* 3 */}  <SolarSlide lang={lang} />
      {/* 4 */}  <ChooseCoverage lang={lang} />
      {/* 5 */}  <ProductTabs lang={lang} />
      {/* 6 */}  <GridDown lang={lang} />
      {/* 7 */}  <AncestroApp lang={lang} />
      {/* 8 */}  <PowerOn lang={lang} />
      {/* 9 */}  <MakesItEasy lang={lang} />
      {/* 10 */} <InstallSolar lang={lang} />
      {/* 11 */} <LatamMap lang={lang} />
      {/* 12 */} <FinalCta lang={lang} />
    </div>
  );
}
