import AnimatedContent from '@/components/animatedContainer/AnimatedContent';
import React from 'react';
import PlannerThumnbnail from '@/public/planner-thumbnail.png';
import Image from 'next/image';
import {
  CalendarOutlined,
  DollarOutlined,
  ReadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { DotsPattern } from '@/components/ui/dots-pattern';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Calendar de Planificare',
    description:
      'Vezi pașii esențiali și ordinea lor pentru organizarea nunții.',
    icon: <CalendarOutlined />,
  },
  {
    title: 'Ghidul Mirilor',
    description: 'Sfaturi utile și indicații pentru o organizare eficientă.',
    icon: <ReadOutlined />,
  },
  {
    title: 'Cheltuieli',
    description: 'Află ce cheltuieli implică nunta și cum să le gestionezi.',
    icon: <DollarOutlined />,
  },
];

export default function Planner() {
  return (
    <div
      className="min-h-screen bg-white text-gray-900 font-sans lg:py-19"
      id="planner-section"
    >
      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 py-12 text-center">
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
            <span className="small-header">PLANIFICATOR</span>
            <span className="primary-title text-center md:!text-4xl">
              Planificator Digital de Evenimente
            </span>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Organizează-ți evenimentul cu ușurință: gestionează invitații,
              bugetul și sarcinile într-un singur loc, cu ajutorul unui planner
              digital modern și intuitiv.
            </p>
          </div>
        </AnimatedContent>
      </header>

      {/* Features */}
      <section className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <AnimatedContent
            distance={150}
            direction="horizontal"
            reverse={false}
            config={{ tension: 80, friction: 20 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
            classNamme="center-text min-h-full"
            key={feature.title}
          >
            <div
              key={feature.title}
              className="relative bg-[#fafafa] rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition h-full "
            >
              <DotsPattern
                className={cn(
                  '[mask-image:radial-gradient(200px_circle_at_center,white,transparent)]'
                )}
              />
              <div className="mb-4 text-3xl text-[var(--secondary-color)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--primary-color)]">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          </AnimatedContent>
        ))}
        <AnimatedContent
          distance={150}
          direction="horizontal"
          reverse={false}
          config={{ tension: 80, friction: 20 }}
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          classNamme="center-text min-h-full w-full md:col-span-3"
        >
          <div className="md:col-span-3 bg-gradient-to-l from-[#f2e3f7] to-white rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm hover:shadow-md transition w-full">
            <StarOutlined className="text-3xl text-[var(--secondary-color)] mb-2" />
            <h3 className="text-xl font-semibold text-[var(--primary-color)] text-left">
              Organizare completă, într-un singur loc
            </h3>
            <p className="text-gray-600 text-left mt-2 flex-1">
              Toate instrumentele de care ai nevoie pentru planificarea
              evenimentului tău sunt acum centralizate: calendar, buget,
              invitați și multe altele, ușor de folosit și accesibile oricând.
            </p>
          </div>
        </AnimatedContent>
      </section>

      {/* Preview Image */}
      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <AnimatedContent
          distance={150}
          direction="vertical"
          reverse={false}
          config={{ tension: 80, friction: 20 }}
          initialOpacity={0.2}
          animateOpacity
          scale={1.1}
          threshold={0.2}
          classNamme="center-text min-h-full w-full md:col-span-3"
        >
          <div className="bg-gradient-to-r from-[#f2e3f7] to-white rounded-2xl p-8 shadow flex flex-col md:flex-row items-center gap-8 ">
            <div className="flex-1 flex justify-center">
              <Image
                src={PlannerThumnbnail}
                alt="Planner Thumbnail"
                className="rounded-xl shadow-lg w-full max-w-md md:max-w-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 text-[var(--secondary-color)]">
                Vezi cum arată plannerul digital
              </h3>
              <p className="text-gray-700 mb-4">
                Descoperă interfața intuitivă și funcționalitățile care te ajută
                să planifici orice eveniment fără stres.
              </p>
              <a
                target="_blank"
                href="/planner"
                className="inline-block px-8 py-3 bg-[var(--primary-color)] !text-white rounded-lg font-medium shadow hover:bg-[var(--primary-color)]/80 transition"
              >
                Descoperă
              </a>
            </div>
          </div>
        </AnimatedContent>
      </section>
    </div>
  );
}
