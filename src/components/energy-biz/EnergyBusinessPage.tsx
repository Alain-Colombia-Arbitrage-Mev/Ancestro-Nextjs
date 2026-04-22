import './energy-biz.css';
import '../energy/energy-home.css';
import { CDN_URL } from '@/lib/cdn';
import HeroBiz from './sections/HeroBiz';
import EnergyVariable from './sections/EnergyVariable';
import SwitchingSimple from './sections/SwitchingSimple';
import NoCapital from './sections/NoCapital';
import ControlCost from './sections/ControlCost';
import BatteryShowcase from './sections/BatteryShowcase';
import NoRoof from './sections/NoRoof';
import ChooseCoverageBiz from './sections/ChooseCoverageBiz';
import AppBiz from './sections/AppBiz';
import HandlesEverything from './sections/HandlesEverything';
import LatamMap from '../energy/sections/LatamMap';
import FooterCtaBiz from './sections/FooterCtaBiz';

interface Props { lang: string }

export const IMG_BIZ = `${CDN_URL}/energy-biz`;
export const IMG = `${CDN_URL}/energy-home`;
export const FLAGS = `${CDN_URL}/images/flags`;

export default function EnergyBusinessPage({ lang }: Props) {
  return (
    <div key={`energy-biz-${lang}`} style={{ background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      {/* 1 */}  <HeroBiz lang={lang} />
      {/* 2 */}  <EnergyVariable lang={lang} />
      {/* 3 */}  <SwitchingSimple lang={lang} />
      {/* 4 */}  <NoCapital lang={lang} />
      {/* 5 */}  <ControlCost lang={lang} />
      {/* 6 */}  <BatteryShowcase lang={lang} />
      {/* 7 */}  <NoRoof lang={lang} />
      {/* 8 */}  <ChooseCoverageBiz lang={lang} />
      {/* 9 */}  <AppBiz lang={lang} />
      {/* 10 */} <HandlesEverything lang={lang} />
      {/* 11 */} <LatamMap lang={lang} />
      {/* 12 */} <FooterCtaBiz lang={lang} />
    </div>
  );
}
