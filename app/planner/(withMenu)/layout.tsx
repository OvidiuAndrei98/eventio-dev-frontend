import { Metadata } from 'next';
import LayoutContent from '../components/LayoutContent';
import '@/styles/globals.css';

export const metadata: Metadata = {
  generator: 'Next.js',
  applicationName: 'Planyvite - Planificator',
  referrer: 'origin-when-cross-origin',
  publisher: 'planyvite.ro',
  openGraph: {
    siteName: 'Planyvite - Planifictor digital',
    title: 'Planyvite - Planificator digital',
  },
  title: { absolute: 'Planyvite - Planificator digital' },
  description:
    'Planificator digital pentru organizarea și gestionarea evenimentelor.',
};

const PlannerLayout = ({ children }: { children: React.ReactNode }) => {
  return <LayoutContent>{children}</LayoutContent>;
};

export default PlannerLayout;
