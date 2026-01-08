'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const categories = [
  {
    id: 'nunta',
    title: 'Nuntă',
    description: 'Modele elegante și rafinate pentru o zi de neuitat.',
    image: '/thumbnails/wedding-cat-cover.jpg',
    path: '/invitatii-digitale-nunta/modele',
  },
  {
    id: 'botez',
    title: 'Botez',
    description: 'Invitații jucăușe și calde pentru micii sărbătoriți.',
    image: '/thumbnails/bapthism_cat_cover.jpg',
    path: '/invitatii-digitale-botez/modele',
  },
  {
    id: 'aniversare',
    title: 'Majorate & Aniversare',
    description: 'Modele festive pentru a marca momente speciale din viață.',
    image: '/thumbnails/aniversary_cat_cov.jpg',
    path: '/invitatii-digitale-aniversare/modele',
  },
];

export default function CategoriiPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen mx-auto max-w-7xl px-4 py-8 mt-[50px] lg:mt-[100px]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[var(--secondary-color)]">
          Alege Tipul Evenimentului
        </h1>
        <p className="text-gray-500 text-lg">
          Explorează colecțiile noastre de invitații digitale create special
          pentru tine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => router.push(category.path)}
            className="group cursor-pointer"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
                <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.description}
                </p>
                <div className="mt-4 inline-block px-6 py-2 bg-white text-black rounded-full font-medium transition-colors hover:bg-[var(--primary-color)] hover:text-white">
                  Vezi modele
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
