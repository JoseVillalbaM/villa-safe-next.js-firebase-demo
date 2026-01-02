'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Importar componentes existentes

import { ButtonStyled } from '@/components/ui/ButtonStyled';
import { useLanguage } from '@/contexts/LanguageContext';

// --- Estilos Mejorados ---

const ContactPageContainer = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`;

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 6rem 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.palette.skyBlue},
    ${({ theme }) => theme.colors.palette.emeraldGreen}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

// --- Tarjeta CTA Mejorada ---
const QuoteCallToActionCard = styled.div`
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  background: linear-gradient(
    145deg,
    ${({ theme }) => theme.colors.palette.warmOrange},
    ${({ theme }) => theme.colors.palette.sunYellow}
  );
  color: white;
  box-shadow: ${({ theme }) => theme.colors.glowShadows.orange};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    animation: pulse 4s ease-in-out infinite;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 30px rgba(251, 146, 60, 0.4), 0 0 60px rgba(251, 146, 60, 0.2);
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`;

const CTATitle = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const CTASubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.95;
  margin-top: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
`;

const CTAButton = styled(ButtonStyled)`
  background-color: #ffffff;
  color: ${({ theme }) => theme.colors.palette.warmOrange};
  font-weight: 700;
  padding: 1rem 2.5rem;
  font-size: 1.125rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f8fafc;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

// --- Formulario de Contacto ---
const ContactFormCard = styled.div`
  background: ${({ theme }) => theme.colors.secondaryBg};
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.colors.glowShadows.blue};
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.glowShadows.blue},
      0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

const FormTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.palette.skyBlue},
    ${({ theme }) => theme.colors.palette.emeraldGreen}
  );
  color: white;
  font-size: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(10deg) scale(1.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.borders.secondary};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.colors.glowShadows.blue};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 2px solid ${({ theme }) => theme.colors.borders.secondary};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.colors.glowShadows.blue};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const SubmitButton = styled(ButtonStyled)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.palette.skyBlue},
    ${({ theme }) => theme.colors.palette.emeraldGreen}
  );
  color: white;
  font-weight: 700;
  padding: 1rem;
  font-size: 1.125rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.glowShadows.green};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.palette.emeraldGreen}20;
  border: 2px solid ${({ theme }) => theme.colors.palette.emeraldGreen};
  color: ${({ theme }) => theme.colors.palette.emeraldGreen};
  text-align: center;
  font-weight: 600;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// --- Componente Principal ---
export default function ContactPage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío (aquí integrarías tu lógica de envío real)
    // Por ejemplo: enviar a Firebase, API endpoint, etc.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <ContactPageContainer>
      <SectionContainer>
        <SectionTitle>{t('contact.title')}</SectionTitle>
        <SectionSubtitle>{t('contact.subtitle')}</SectionSubtitle>

        <ContactGrid>
          {/* Columna Izquierda */}
          <InfoColumn>
            <QuoteCallToActionCard>
              <CTATitle>{t('contact.cta.title')}</CTATitle>
              <CTASubtitle>{t('contact.cta.subtitle')}</CTASubtitle>

              <Link href={user ? '/quotes' : '/login'}>
                <CTAButton>{t('contact.cta.button')}</CTAButton>
              </Link>
            </QuoteCallToActionCard>

            {/* Tarjeta de Negocio */}
            
          </InfoColumn>

          {/* Columna Derecha: Formulario */}
          <InfoColumn>
            <ContactFormCard>
              <FormTitle>
                <IconWrapper>✉️</IconWrapper>
                {t('contact.form.title')}
              </FormTitle>

              {submitSuccess && (
                <SuccessMessage>{t('contact.form.success')}</SuccessMessage>
              )}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>
                    <span>👤</span>
                    {t('contact.form.name')}
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.namePlaceholder')}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <span>📧</span>
                    {t('contact.form.email')}
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.emailPlaceholder')}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <span>📱</span>
                    {t('contact.form.phone')}
                  </Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.phonePlaceholder')}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <span>💬</span>
                    {t('contact.form.message')}
                  </Label>
                  <TextArea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.messagePlaceholder')}
                    required
                  />
                </FormGroup>

                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? t('contact.form.sending')
                    : t('contact.form.submit')}
                </SubmitButton>
              </Form>
            </ContactFormCard>
          </InfoColumn>
        </ContactGrid>
      </SectionContainer>
    </ContactPageContainer>
  );
}