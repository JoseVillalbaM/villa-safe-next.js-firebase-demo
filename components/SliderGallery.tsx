'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled, { keyframes } from 'styled-components';
import {sliderServicesImages} from '../lib/imgSliderServices'
// 1. Importamos tu botón existente
import { ButtonStyled } from './ui/ButtonStyled'; // Asumiendo que está en la misma carpeta

// --- Imágenes (misma data) ---
const images = [
  {
    url: '/assets/ai-images/painting.jpg',
    title: 'Painting Services',
    description: 'Professional painting for homes and businesses',
  },
  {
    url: '/assets/ai-images/cleaning.jpg',
    title: 'Cleaning Services',
    description: 'Deep cleaning and maintenance',
  },
  {
    url: '/assets/ai-images/remodel.jpg',
    title: 'Remodeling',
    description: 'Complete renovation solutions',
  },
  {
    url: '/assets/ai-images/standtv.jpg',
    title: 'TV Installation',
    description: 'Professional TV mounting and setup',
  },
];

// --- Animación (recreando animate-fade-in) ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- Styled Components ---

// 2. Extendemos tu ButtonStyled con los estilos específicos del slider
const SliderNavButton = styled(ButtonStyled)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease, background-color 0.3s ease;

  /* Asumiendo que tu ButtonStyled no tiene esto por defecto */
  /* Si ya lo tiene, puedes borrar estas líneas */
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  width: auto; /* Aseguramos que se ajuste al ícono */
  height: auto;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
  /* --- Fin de estilos opcionales --- */

  /* Posicionamiento */
  &.left {
    left: 1rem; /* left-4 */
  }
  &.right {
    right: 1rem; /* right-4 */
  }
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 0.75rem; /* rounded-xl */
  overflow: hidden;

  /* 3. El "group-hover" ahora apunta a nuestro SliderNavButton */
  &:hover ${SliderNavButton} {
    opacity: 1;
  }
`;

const ImageSlide = styled.div<{ $isActive: boolean }>`
  position: absolute;
  inset: 0;
  transition: opacity 700ms ease;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
`;

const ImageElement = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageGradient = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7),
    transparent
  );
  display: flex;
  align-items: flex-end;
`;

const TextWrapper = styled.div`
  padding: 2rem; /* p-8 */
  color: white;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h3`
  font-size: 1.875rem; /* text-3xl */
  line-height: 2.25rem;
  font-weight: 700; /* font-bold */
  margin-bottom: 0.5rem; /* mb-2 */
`;

const Description = styled.p`
  font-size: 1.125rem; /* text-lg */
  line-height: 1.75rem;
`;

const StyledChevron = styled.svg`
  height: 2rem; /* h-8 */
  width: 2rem; /* w-8 */
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 1rem; /* bottom-4 */
  left: 50%;
  transform: translateX(-50%);
  display: flex;

  & > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.5rem; /* space-x-2 */
  }
`;

const Dot = styled.button<{ $isActive: boolean }>`
  height: 0.5rem; /* h-2 */
  border-radius: 9999px; /* rounded-full */
  transition: all 0.3s ease;
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isActive ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  width: ${(props) => (props.$isActive ? '2rem' : '0.5rem')}; /* w-8 vs w-2 */
`;

// --- Componente ---

const SliderGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = sliderServicesImages;
  // Lógica de estado y efectos (sin cambios)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    // AQUÍ ESTABA EL ERROR (la coma extra)
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <SliderContainer>
      {/* Images */}
      {images.map((image, index) => (
        <ImageSlide key={index} $isActive={index === currentIndex}>
          <ImageElement src={image.url} alt={image.title} />
          <ImageGradient>
            <TextWrapper>
              <Title>{image.title}</Title>
              <Description>{image.description}</Description>
            </TextWrapper>
          </ImageGradient>
        </ImageSlide>
      ))}

      {/* 4. Usamos el nuevo SliderNavButton que extiende tu componente */}
      <SliderNavButton className="left" onClick={goToPrevious}>
        <StyledChevron as={ChevronLeft} />
      </SliderNavButton>
      <SliderNavButton className="right" onClick={goToNext}>
        <StyledChevron as={ChevronRight} />
        {/* AQUÍ ESTABA EL SEGUNDO ERROR (la etiqueta de cierre) */}
      </SliderNavButton>

      {/* Dots */}
      <DotsContainer>
        {images.map((_, index) => (
          <Dot
            key={index}
            $isActive={index === currentIndex}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </DotsContainer>
    </SliderContainer>
  );
};

export default SliderGallery;


