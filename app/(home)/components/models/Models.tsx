'use client'

import { useState } from 'react'
import AnimatedContent from '../../../../components/animatedContainer/AnimatedContent'
import InvitationModal from '../../../../components/invitationsModal/InvitationsModal'
import Masonry from '../../../../components/masonryContainer/Masonry'
import './Models.css'

const Models = () => {
  const [open, setOpen] = useState(false)

  const onModalOk = () => {
    setOpen(false)
  }

  const onModalClose = () => {
    setOpen(false)
  }

  const data = [
    {
      id: 1,
      image: 'https://picsum.photos/id/10/200/300',
      height: 800,
      text: 'NUNTA',
    },
    {
      id: 2,
      image: 'https://picsum.photos/id/14/200/300',
      height: 800,
      text: 'BOTEZ',
    },
    {
      id: 3,
      image: 'https://picsum.photos/id/15/200/300',
      height: 800,
      text: 'ANIVERSARE',
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1683512611593-59aa784f5f16?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8',
      height: 800,
      text: 'CORPORATE',
    },
  ]

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
          <span className="primary-title">Modelele noastre</span>
        </div>
      </AnimatedContent>
      <Masonry data={data} onClick={() => setOpen(true)} />
      <InvitationModal
        open={open}
        onOk={() => onModalOk()}
        onClose={onModalClose}
      />
    </div>
  )
}

export default Models
