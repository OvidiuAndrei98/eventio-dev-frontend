import { Metadata } from 'next';
import HeroLayoutContent from '@/components/heroSectionLayoutContent/HeroLayoutContent';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Planyvite - Invitații Digitale de Botez',
  referrer: 'origin-when-cross-origin',
  publisher: 'planyvite.ro',
  alternates: {
    canonical: 'https://planyvite.ro/invitatii-digitale-botez',
  },
  openGraph: {
    siteName: 'Planyvite - Invitații Digitale de Botez',
    title: 'Planyvite - Invitații Digitale de Botez',
  },
  title: { absolute: 'Planyvite - Invitații Digitale de Botez' },
  description: `Creează invitații digitale de botez personalizate și ușor de distribuit. Alege dintr-o varietate de șabloane elegante și gestionează lista invitaților cu ușurință.`,
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HeroLayoutContent>{children}</HeroLayoutContent>
    </>
  );
};

export default HomeLayout;
