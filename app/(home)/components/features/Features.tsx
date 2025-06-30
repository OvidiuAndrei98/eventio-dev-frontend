'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import AnimatedContent from '@/components/animatedContainer/AnimatedContent';
import {
  ExportOutlined,
  EditOutlined,
  TableOutlined,
  QuestionCircleOutlined,
  LineChartOutlined,
  CheckOutlined,
  MobileOutlined,
  UserSwitchOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { DotsPattern } from '@/components/ui/dots-pattern';

const data = [
  {
    title: 'Vezi răspunsurile în timp real',
    content:
      'Primește feedback instantaneu de la participanți și urmărește răspunsurile pe măsură ce acestea sunt trimise, fără a reîncărca pagina.',
    srcImage: '/landing_images/videos/feat_responses_v2.mp4',
  },
  {
    title: 'Analizează statisticile evenimentului',
    content:
      'Vizualizează rapid statistici relevante despre participare, răspunsuri și tendințe, pentru a lua decizii informate în timp real.',
    srcImage: '/landing_images/videos/feat_statistics_v3.mp4',
  },
  {
    title: 'Planul salonului',
    content:
      'Organizează și vizualizează planul salonului pentru a gestiona eficient aranjarea meselor și a invitaților.',
    srcImage: '/landing_images/videos/feat_tables.mp4',
  },
  {
    title: 'Editare completa a invitației',
    content:
      'Personalizează invitația după preferințele tale, adauga sectiuni noi, adauga si modifica elemente, pozitioneaza schimba culori și fonturi, totul cu un editor intuitiv.',
    srcImage: '/landing_images/videos/feat_editor.mp4',
  },
];

export function Features() {
  const [featureOpen, setFeatureOpen] = useState<number>(0);
  const [minHeight, setMinHeight] = useState('340px');

  // Set minHeight based on window width on client side
  useEffect(() => {
    function handleResize() {
      setMinHeight(window.innerWidth >= 1024 ? '420px' : '340px');
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="max-w-[1200px] mx-auto px-4 py-19 flex flex-col items-center justify-center"
      id="features-section"
    >
      <AnimatedContent
        distance={150}
        direction="horizontal"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
        classNamme="center-text"
      >
        <div className="flex flex-col items-center justify-center mb-8 space-y-2">
          <span className="small-header">FUNCTIONALITATI</span>
          <span className="primary-title text-center md:!text-4xl">
            Principalele funcționalități ale aplicației
          </span>
        </div>
      </AnimatedContent>

      <AnimatedContent
        distance={150}
        direction="horizontal"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0}
        classNamme="center-text"
      >
        <div className=" grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-6 ">
            {data.map((item, index) => (
              <button
                className="w-full"
                key={item.title}
                onClick={() => {
                  setFeatureOpen(index);
                }}
                type="button"
              >
                <TextComponent
                  content={item.content}
                  isOpen={featureOpen === index}
                  number={index + 1}
                  title={item.title}
                />
              </button>
            ))}
          </div>
          <div className="h-full flex items-center justify-center">
            <div
              className={cn(
                // Increase max-w and minHeight on larger screens
                'relative w-full max-w-2xl overflow-hidden rounded-2xl aspect-video md:aspect-[16/9] lg:aspect-[16/7] xl:aspect-[16/8]',
                'lg:max-w-4xl xl:max-w-5xl' // Add larger max widths for lg/xl
              )}
              style={{
                minHeight: minHeight,
                minWidth: '100%',
                height: '100%',
              }}
            >
              {data.map((item, index) => (
                <div
                  className={cn(
                    'absolute w-full aspect-video w-full h-full top-0 left-0 transition-transform duration-500 ease-in-out rounded-2xl overflow-hidden',
                    featureOpen === index ? 'scale-100' : 'scale-70',
                    featureOpen > index ? 'translate-y-full' : ''
                  )}
                  key={item.title}
                  style={{ zIndex: data.length - index }}
                >
                  <video
                    className="absolute inset-0 w-full h-full object-fill border border-neutral-200 dark:border-neutral-800 rounded-2xl"
                    controls={false}
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src={item.srcImage} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              label: 'Exportă datele participanților rapid',
              icon: <ExportOutlined />,
            },
            {
              label: 'Personalizare completă a invitației',
              icon: <EditOutlined />,
            },
            {
              label: 'Planificatator excel gratuit',
              icon: <TableOutlined />,
            },
            {
              label: 'Adauga intrebări personalizate',
              icon: <QuestionCircleOutlined />,
            },
            {
              label: 'Gestioneaza locatiile evenimentului',
              icon: <EnvironmentOutlined />,
            },
            {
              label: 'Adauga si gestioneaza invitatții',
              icon: <UserSwitchOutlined />,
            },
            {
              label: 'Descoperă statistici detaliate ale evenimentului',
              icon: <LineChartOutlined />,
            },
            {
              label: 'Gestionare RSVP avansată',
              icon: <CheckOutlined />,
            },
            {
              label: 'Acces de pe orice dispozitiv',
              icon: <MobileOutlined />,
            },
          ].map(({ label, icon }) => (
            <div
              key={label}
              className="relative rounded-xl bg-[#fafafa] dark:bg-neutral-900 p-5 shadow-[0_8px_48px_0_rgba(186,116,206,0.12)] border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center text-base font-medium text-neutral-700 dark:text-neutral-200 w-full min-h-[180px]"
              style={{
                boxShadow:
                  '0 8px 48px 0 rgba(186,116,206,0.12), 0 0 0 2px rgba(186,116,206,0.06)',
              }}
            >
              <DotsPattern
                className={cn(
                  '[mask-image:radial-gradient(150px_circle_at_center,white,transparent)]'
                )}
              />
              <span className="mb-2 flex items-center justify-center text-4xl">
                {icon}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </AnimatedContent>
    </div>
  );
}

function TextComponent({
  number,
  title,
  content,
  isOpen,
  loadingWidthPercent,
}: Readonly<{
  number: number;
  title: string;
  content: string;
  isOpen: boolean;
  loadingWidthPercent?: number;
}>) {
  return (
    <div
      className={cn(
        'transform-gpu rounded-lg border transition-all',
        isOpen
          ? 'border-neutral-500/10 bg-linear-to-b from-neutral-200/15 to-neutral-200/5 dark:border-neutral-500/15 dark:from-neutral-600/15 dark:to-neutral-600/5 dark:shadow-[2px_4px_25px_0px_rgba(248,248,248,0.06)_inset] '
          : 'scale-90 border-transparent opacity-50 saturate-0'
      )}
    >
      <div className="flex w-full items-center gap-4 p-4">
        <p
          className={cn(
            'inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-500/20 text-neutral-600'
          )}
        >
          {number}
        </p>
        <h2
          className={cn(
            'text-left font-medium text-neutral-800 text-xl dark:text-neutral-200'
          )}
        >
          {title}
        </h2>
      </div>
      <div
        className={cn(
          'w-full transform-gpu overflow-hidden text-left text-neutral-600 transition-all duration-500 dark:text-neutral-400',
          isOpen ? ' max-h-64' : 'max-h-0'
        )}
      >
        <p className="p-4 text-lg">{content}</p>
        <div className="w-full px-4 pb-4">
          <div className="relative h-1 w-full overflow-hidden rounded-full">
            <div
              className={cn('absolute top-0 left-0 h-1 bg-neutral-500')}
              style={{ width: `${loadingWidthPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
