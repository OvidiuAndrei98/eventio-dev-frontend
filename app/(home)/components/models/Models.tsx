'use client';

import { useState } from 'react';
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent';
import InvitationModal from '../../../../components/invitationsModal/InvitationsModal';
import Masonry from '../../../../components/masonryContainer/Masonry';
import './Models.css';

const Models = () => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const onModalOk = () => {
    setOpen(false);
  };

  const onModalClose = () => {
    setOpen(false);
  };

  const data = [
    {
      id: 1,
      image: '/thumbnails/wedding-cat-cover.jpg',
      height: 800,
      text: 'NUNTA',
      type: 'wedding',
    },
    {
      id: 2,
      image: '/thumbnails/bapthism_cat_cover.jpg',
      height: 800,
      text: 'BOTEZ',
      type: 'bapthism',
    },
    {
      id: 3,
      image: '/thumbnails/aniversary_cat_cov.jpg',
      height: 800,
      text: 'ANIVERSARE',
      type: 'anniversary',
    },
    {
      id: 4,
      image: '/thumbnails/corporate_cat_cover.jpg',
      height: 800,
      text: 'CORPORATE',
      type: 'corporate',
    },
  ];

  return (
    <div className="models-section" id="models-section">
      <AnimatedContent
        distance={150}
        direction="horizontal"
        reverse={false}
        config={{ tension: 80, friction: 20 }}
        initialOpacity={0.2}
        animateOpacity
        scale={1.1}
        threshold={0.2}
      >
        <div className="models-section-description">
          <span className="small-header">MODELE DE INVITATII DIGITALE</span>
          <span className="primary-title md:!text-4xl">Modelele noastre</span>
        </div>
      </AnimatedContent>
      <Masonry
        data={data}
        onClick={(type) => {
          setSelectedType(type);
          setOpen(true);
        }}
      />
      <InvitationModal
        open={open}
        onOk={() => onModalOk()}
        templateType={selectedType}
        onClose={onModalClose}
      />
    </div>
  );
};

export default Models;
