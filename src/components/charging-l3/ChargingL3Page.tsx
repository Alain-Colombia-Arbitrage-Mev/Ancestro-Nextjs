import './charging-l3.css';
import HeroL3 from './sections/HeroL3';
import AskBox from '@/components/AskBox';
import WhatIsL3 from './sections/WhatIsL3';
import WhereChargers from './sections/WhereChargers';
import PerformanceL3 from './sections/PerformanceL3';
import HostingVsBuying from './sections/HostingVsBuying';
import SoftwareNetwork from './sections/SoftwareNetwork';
import NetworkTrust from './sections/NetworkTrust';
import DriverExperience from './sections/DriverExperience';
import FooterCtaL3 from './sections/FooterCtaL3';

interface Props { lang: string }

export default function ChargingL3Page({ lang }: Props) {
  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      <HeroL3 lang={lang} />
      <div className="cl3-askbox-wrap">
        <AskBox lang={lang} />
      </div>
      <WhatIsL3 lang={lang} />
      <WhereChargers lang={lang} />
      <PerformanceL3 lang={lang} />
      <HostingVsBuying lang={lang} />
      <SoftwareNetwork lang={lang} />
      <NetworkTrust lang={lang} />
      <DriverExperience lang={lang} />
      <FooterCtaL3 lang={lang} />
    </div>
  );
}
