import { Metadata } from 'next';
import HeroLayoutContent from '@/components/heroSectionLayoutContent/HeroLayoutContent';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Planyvite - Invitații Digitale de Nuntă',
  referrer: 'origin-when-cross-origin',
  publisher: 'planyvite.ro',
  alternates: {
    canonical: 'https://planyvite.ro/invitatii-digitale-nunta',
  },
  openGraph: {
    siteName: 'Planyvite - Invitații Digitale de Nuntă',
    title: 'Planyvite - Invitații Digitale de Nuntă',
  },
  title: { absolute: 'Planyvite - Invitații Digitale de Nuntă' },
  description: `Creează invitații digitale de nuntă personalizate, gata in 2 minute, economisește timp și impresionează-ți oaspeții cu designuri elegante și funcționalități moderne.`,
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeroLayoutContent>{children}</HeroLayoutContent>
    </>
  );
};

export default HomeLayout;
