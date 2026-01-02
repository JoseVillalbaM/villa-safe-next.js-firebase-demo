'use client';

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { RotateCw, X, Maximize2 } from 'lucide-react'; 

// --- ANIMACIONES ---

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// --- ESTILOS DEL MODAL (CONTENEDOR GLOBAL) ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(10, 25, 49, 0.9); /* Fondo oscuro profundo */
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px; /* Un poco más ancho para acomodar al personaje */
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${slideUp} 0.4s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -3rem;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.palette.coralRed};
    border-color: ${({ theme }) => theme.colors.palette.coralRed};
    transform: scale(1.05);
  }

  @media (min-width: 768px) {
    top: -2rem;
    right: -2rem;
  }
`;

// --- ESTILOS DE LA TARJETA (FLIP LOGIC) ---

const CardContainer3D = styled.div`
  perspective: 1500px; /* Mayor perspectiva para mejor efecto 3D */
  width: 100%;
  max-width: 600px; 
  height: 380px; 
`;

const CardWrapper = styled.div<{ $isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  transform: ${({ $isFlipped }) => ($isFlipped ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 1.5rem;
  display: flex;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5); /* Sombra más dramática */
  background-color: ${({ theme }) => theme.colors.secondaryBg};
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  overflow: hidden;
`;

// Cara Frontal
const CardFront = styled(CardFace)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.secondaryBg} 0%, ${({ theme }) => theme.colors.bg} 100%);
  transform: rotateY(0deg);
  z-index: 2;
`;

// Cara Trasera (Donde va el personaje)
const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
  flex-direction: column;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #e0e7ff 0%, #ffffff 100%); /* Fondo claro como en tu imagen de referencia */
  border: 4px solid ${({ theme }) => theme.colors.primary}; /* Borde azul suave */
`;

// Botón de Flip interno
const FlipActionBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1) rotate(180deg);
    background-color: ${({ theme }) => theme.colors.palette.skyBlue};
    color: white;
  }
`;

// --- ELEMENTOS INTERNOS (FRENTE) ---

const ServiceColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
  z-index: 10;
`;

const ServiceLink = styled.a`
  display: block;
  text-align: center;
  padding: 0.6rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  border-radius: 0.75rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1.2;
  text-align: center;
  z-index: 10;
`;

const LogoImage = styled.img`
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.colors.glowShadows.orange};
  margin-bottom: 0.8rem;
  background-color: white;
`;

const CompanyName = styled.h2`
  background: linear-gradient(to right, ${({ theme }) => theme.colors.palette.sunYellow}, ${({ theme }) => theme.colors.palette.warmOrange});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
`;

// --- ELEMENTOS INTERNOS (REVERSO / BACK) ---

const BackHeader = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 10;
`;

const TitleBack = styled.h3`
  color: #1e3a8a; /* Azul oscuro para contraste en fondo claro */
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BackBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const SocialColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem; /* Espacio vertical entre botones */
  width: 30%;
  z-index: 20;
`;

const SocialButton = styled.a`
  display: block;
  text-align: center;
  padding: 0.8rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
  color: #1f2937; /* Texto oscuro */
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid rgba(59, 130, 246, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: scale(1.05);
    box-shadow: 0 10px 15px rgba(59, 130, 246, 0.2);
  }
`;

const CharacterContainer = styled.div`
  width: 40%; /* El personaje ocupa el centro */
  height: 100%;
  display: flex;
  align-items: flex-end; /* Alinear abajo */
  justify-content: center;
  position: relative;
  z-index: 10;
`;

const CharacterImg = styled.img`
  width: 100%;
  max-width: 180px; /* Ajusta esto según el tamaño de tu imagen */
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 10px rgba(0,0,0,0.3));
  animation: ${float} 4s ease-in-out infinite;
`;

// --- BOTÓN DE APERTURA (Para usar en page.tsx) ---

const OpenCardButton = styled.button`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.palette.deepBlue} 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${({ theme }) => theme.colors.glowShadows.blue};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

// --- COMPONENTE PRINCIPAL ---

const BusinessCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Datos
  const leftServices = [
    { name: 'Home Cleaning', url: '#' },
    { name: 'Painting', url: '#' },
    { name: 'Epoxy Garage Floor', url: '#' }
  ];
  const rightServices = [
    { name: 'TV Wall Stand', url: '#' },
    { name: 'Backsplash', url: '#' },
    { name: 'Pressure Washing', url: '#' }
  ];
  
  // Separamos los links sociales en izquierda y derecha para el diseño
  const socialLeft = [
    { name: 'Facebook', url: '#' },
    { name: 'WhatsApp', url: '#' },
    { name: 'Instagram', url: '#' },
  ];
  
  const socialRight = [
    { name: 'Tik Tok', url: '#' },
    { name: 'Email', url: '#' },
    { name: 'OfferUp', url: '#' }
  ];

  const openModal = () => {
    setIsOpen(true);
    setIsFlipped(false);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* 1. BOTÓN DE APERTURA 
        Coloca este componente <BusinessCard /> donde quieras que aparezca el botón
      */}
      <OpenCardButton onClick={openModal}>
        <Maximize2 size={18} />
        Ver Tarjeta Digital
      </OpenCardButton>

      {/* 2. EL MODAL */}
      {isOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>
              <X size={20} /> Cerrar
            </CloseButton>

            <CardContainer3D>
              <CardWrapper $isFlipped={isFlipped}>
                
                {/* --- LADO A: SERVICIOS (FRENTE) --- */}
                <CardFront>
                  <FlipActionBtn onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }} aria-label="Ver Reverso">
                    <RotateCw size={20} />
                  </FlipActionBtn>

                  <ServiceColumn>
                    {leftServices.map((s, i) => (
                      <ServiceLink key={i} href={s.url}>{s.name}</ServiceLink>
                    ))}
                  </ServiceColumn>

                  <LogoSection>
                    <LogoImage src="https://i.postimg.cc/ZRp95gBp/IMG-9564.jpg" alt="Logo" />
                    <CompanyName>Villa Safe Solutions</CompanyName>
                  </LogoSection>

                  <ServiceColumn>
                    {rightServices.map((s, i) => (
                      <ServiceLink key={i} href={s.url}>{s.name}</ServiceLink>
                    ))}
                  </ServiceColumn>
                </CardFront>

                {/* --- LADO B: CONTACTO (REVERSO) --- */}
                <CardBack>
                  <FlipActionBtn onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} aria-label="Ver Frente">
                     <RotateCw size={20} />
                  </FlipActionBtn>
                  
                  <BackHeader>
                    <TitleBack>Contact Us</TitleBack>
                  </BackHeader>

                  <BackBody>
                    {/* Columna Izquierda */}
                    <SocialColumn>
                      {socialLeft.map((s, i) => (
                        <SocialButton key={i} href={s.url} target="_blank">
                          {s.name}
                        </SocialButton>
                      ))}
                    </SocialColumn>

                    {/* Centro: Personaje */}
                    <CharacterContainer>
                      {/* IMPORTANTE: Cambia este src por la URL de tu imagen de personaje 3D */}
                      <CharacterImg 
                        src="https://cdn-icons-png.flaticon.com/512/4600/4600326.png" 
                        alt="Character" 
                      />
                    </CharacterContainer>

                    {/* Columna Derecha */}
                    <SocialColumn>
                      {socialRight.map((s, i) => (
                        <SocialButton key={i} href={s.url} target="_blank">
                          {s.name}
                        </SocialButton>
                      ))}
                    </SocialColumn>
                  </BackBody>

                </CardBack>

              </CardWrapper>
            </CardContainer3D>

          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default BusinessCard;


