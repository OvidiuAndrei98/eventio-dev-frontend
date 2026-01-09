import { Metadata } from 'next';
import HeroLayoutContent from '@/components/heroSectionLayoutContent/HeroLayoutContent';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Planyvite - Invitații Digitale de Majorat',
  referrer: 'origin-when-cross-origin',
  publisher: 'planyvite.ro',
  alternates: {
    canonical: 'https://planyvite.ro/invitatii-digitale-majorat',
  },
  openGraph: {
    siteName: 'Planyvite - Invitații Digitale de Majorat',
    title: 'Planyvite - Invitații Digitale de Majorat',
  },
  title: { absolute: 'Planyvite - Invitații Digitale de Majorat' },
  description: `Creează invitații digitale de majorat personalizate și ușor de distribuit. Alege dintr-o varietate de șabloane moderne și gestionează lista invitaților cu ușurință.`,
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeroLayoutContent>{children}</HeroLayoutContent>
    </>
  );
};

export default HomeLayout;
