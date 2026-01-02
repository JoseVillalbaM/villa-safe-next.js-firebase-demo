'use client'; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { ArrowRight, Star, MessageSquare, LogIn } from 'lucide-react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// --- Importa los componentes ---
import {ButtonStyled} from '@/components/ui/ButtonStyled';
import SliderGallery from '@/components/SliderGallery';

// --- Importa el hook de idioma ---
import { useLanguage } from '@/contexts/LanguageContext';


// --- Tipos para las reseñas ---
interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
  userPhoto?: string;
}

// --- Todos los estilos anteriores se mantienen igual ---
const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg};
`;

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  box-sizing: border-box; 
  background-color: ${({ theme}) => theme.colors.bg};

  @media (min-width: 768px) {
    padding: 6rem 2rem;
  }
`;

const HeroContainer = styled(SectionContainer)`
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh; 
  background-color: ${({ theme }) => theme.colors.bg};
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  
  background: linear-gradient(
    135deg, 
    ${({ theme }) => theme.colors.palette.skyBlue},
    ${({ theme }) => theme.colors.palette.emeraldGreen},
    ${({ theme }) => theme.colors.palette.sunYellow}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  filter: drop-shadow(0 0 20px ${({ theme }) => theme.colors.palette.skyBlue}40);

  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 1.5rem;
  max-width: 600px;
  line-height: 1.6;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
  align-items: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.palette.skyBlue},
    ${({ theme }) => theme.colors.palette.emeraldGreen}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.125rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
`;

const ServicesSection = styled(SectionContainer)`
  background-color: ${({ theme }) => theme.colors.secondaryBg};
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: start;
  margin-top: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr; 
  }
`;

const ContactInfo = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 1rem;
    
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.palette.skyBlue},
      ${({ theme }) => theme.colors.palette.emeraldGreen}
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 1rem;
  }
`;

const BusinessCardSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.secondaryBg}80,
    ${({ theme }) => theme.colors.secondaryBg}40
  );
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.borders.primary}30;
  
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.15),
    0 0 40px ${({ theme }) => theme.colors.palette.skyBlue}20,
    inset 0 1px 1px ${({ theme }) => theme.colors.palette.skyBlue}20;
  
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 12px 48px rgba(59, 130, 246, 0.25),
      0 0 60px ${({ theme }) => theme.colors.palette.skyBlue}30,
      inset 0 1px 1px ${({ theme }) => theme.colors.palette.skyBlue}30;
  }
`;

const BusinessCardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
  
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.palette.skyBlue},
    ${({ theme }) => theme.colors.palette.emeraldGreen},
    ${({ theme }) => theme.colors.palette.sunYellow}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  filter: drop-shadow(0 0 10px ${({ theme }) => theme.colors.palette.skyBlue}30);
`;

const BusinessCardImageContainer = styled.div`
  width: 100%;
  max-width: 400px;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  
  border: 2px solid transparent;
  background: linear-gradient(
      ${({ theme }) => theme.colors.secondaryBg},
      ${({ theme }) => theme.colors.secondaryBg}
    ) padding-box,
    linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.palette.skyBlue},
      ${({ theme }) => theme.colors.palette.emeraldGreen},
      ${({ theme }) => theme.colors.palette.sunYellow}
    ) border-box;
  
  box-shadow: 
    0 4px 20px rgba(59, 130, 246, 0.2),
    0 0 30px ${({ theme }) => theme.colors.palette.skyBlue}15;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &:empty {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.palette.deepBlue}40,
      ${({ theme }) => theme.colors.palette.skyBlue}20
    );
  }
  
  &:empty::after {
    content: 'Imagen de tarjeta de negocios';
    color: ${({ theme }) => theme.colors.textSecondary};
    text-align: center;
    padding: 2rem;
    font-size: 0.9rem;
  }
`;
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

// --- Estilos para la sección de reseñas ---

const ReviewsSection = styled(SectionContainer)`
  background-color: ${({ theme }) => theme.colors.secondaryBg};
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border-radius: 20px;
  
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.bg}60,
    ${({ theme }) => theme.colors.bg}30
  );
  backdrop-filter: blur(10px);
  
  border: 1px solid transparent;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-image: 
    linear-gradient(
      ${({ theme }) => theme.colors.bg},
      ${({ theme }) => theme.colors.bg}
    ),
    linear-gradient(
      135deg,
      ${({ theme }) => theme.colors.palette.skyBlue}40,
      ${({ theme }) => theme.colors.palette.emeraldGreen}40
    );
  
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.1),
    0 0 40px ${({ theme }) => theme.colors.palette.skyBlue}10,
    inset 0 1px 1px ${({ theme }) => theme.colors.palette.skyBlue}10;
  
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 12px 48px rgba(59, 130, 246, 0.2),
      0 0 60px ${({ theme }) => theme.colors.palette.skyBlue}20,
      inset 0 1px 1px ${({ theme }) => theme.colors.palette.skyBlue}20;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.palette.skyBlue},
    ${({ theme }) => theme.colors.palette.emeraldGreen}
  );
  
  box-shadow: 
    0 4px 15px ${({ theme }) => theme.colors.palette.skyBlue}30,
    0 0 20px ${({ theme }) => theme.colors.palette.skyBlue}20;
  
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  font-size: 1.25rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const ReviewDate = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  margin: 0.5rem 0;
`;

const StarIcon = styled(Star)<{ $filled: boolean }>`
  width: 18px;
  height: 18px;
  fill: ${({ $filled, theme }) => 
    $filled ? theme.colors.palette.sunYellow : 'transparent'};
  stroke: ${({ theme }) => theme.colors.palette.sunYellow};
  filter: ${({ $filled }) => 
    $filled ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))' : 'none'};
`;

const ReviewComment = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const ReviewFormContainer = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  border-radius: 20px;
  
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.bg}80,
    ${({ theme }) => theme.colors.bg}40
  );
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.borders.primary}30;
  
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.15),
    0 0 40px ${({ theme }) => theme.colors.palette.skyBlue}20;
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.palette.skyBlue},
    ${({ theme }) => theme.colors.palette.emeraldGreen}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.bg}80;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.palette.skyBlue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.palette.skyBlue}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem 1rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  background-color: ${({ theme }) => theme.colors.bg}80;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.palette.skyBlue};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.palette.skyBlue}20;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RatingSelector = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    width: 48px;
    height: 48px;
    margin: 0 auto 1rem;
    opacity: 0.5;
  }
`;

// --- NUEVO: Estado de login requerido ---
const LoginRequiredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.bg}60,
    ${({ theme }) => theme.colors.bg}30
  );
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.borders.primary}30;
  
  box-shadow: 
    0 8px 32px rgba(59, 130, 246, 0.15),
    0 0 40px ${({ theme }) => theme.colors.palette.skyBlue}20;
`;

const LoginIcon = styled(LogIn)`
  width: 64px;
  height: 64px;
  color: ${({ theme }) => theme.colors.palette.skyBlue};
  filter: drop-shadow(0 0 20px ${({ theme }) => theme.colors.palette.skyBlue}40);
`;

const LoginMessage = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 500px;
  line-height: 1.6;
`;

// --- Componente Principal ---
export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  //const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Cargar reseñas desde localStorage al montar
  useEffect(() => {
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert(t('home.reviews.loginRequired'));
      return;
    }

    if (!newReview.comment.trim()) {
      alert('Por favor completa el comentario');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userName: user.displayName || 'Usuario',
      userEmail: user.email || '',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString(
        t('home.reviews.title') === 'Testimonios y Reseñas' ? 'es-ES' : 'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      ),
      userPhoto: user.photoURL || undefined
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    
    // Reset form
    setNewReview({
      rating: 5,
      comment: ''
    });
  };

  // Mostrar solo las últimas 3-4 reseñas
  const displayedReviews = reviews.slice(0, 4);
  
 

  

  return (
    <PageContainer>
      
      {/* --- 1. Sección Hero --- */}
      <HeroContainer>
        <HeroTitle>
          {t('home.hero.title')}
        </HeroTitle>
        <HeroSubtitle>
          {t('home.hero.subtitle')}
        </HeroSubtitle>
        
        <ButtonRow>
          <Link href={user ? "/quotes" : "/login"}>
            <ButtonStyled $primary>
              {t('home.hero.quoteButton')}
              <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </ButtonStyled>
          </Link>
          
          <Link href="/contact">
            <ButtonStyled>
              {t('home.hero.contactButton')}
            </ButtonStyled>
          </Link>
        </ButtonRow>
      </HeroContainer>

      {/* --- 2. Sección de Servicios --- */}
      <ServicesSection>
        <SectionTitle>
          {t('home.services.title')}
        </SectionTitle>
        <SectionSubtitle>
          {t('home.services.subtitle')}
        </SectionSubtitle>
        
        <SliderGallery />
      </ServicesSection>

      {/* --- 3. Sección de Contacto --- */}
      <SectionContainer>
        <SectionTitle>
          {t('home.contact.title')}
</SectionTitle>
<SectionSubtitle>
{t('home.contact.subtitle')}
</SectionSubtitle>
<ContactGrid>
      <ContactInfo>
        <h3>
          {t('home.contact.qualityTitle')}
        </h3>
        <p>
          {t('home.contact.description')}
        </p>
        <p>
          {t('home.contact.contactText')}
        </p>
        <Link href="/contact" style={{marginTop: '1.5rem', display: 'inline-block'}}>
          <ButtonStyled $primary>
            {t('home.contact.formButton')}
          </ButtonStyled>
        </Link>
      </ContactInfo>

      <BusinessCardSection>
        <BusinessCardTitle>
          {t('home.contact.businessCardTitle')}
        </BusinessCardTitle>
        <BusinessCardImageContainer>
          
          <img 
            src="/images/business-card.jpg" 
            alt={t('home.contact.businessCardTitle')}
          />
        </BusinessCardImageContainer>
        <Link href="/digital-card">
          <OpenCardButton>
            Tarjeta de negocios 
          </OpenCardButton>
        </Link>
          
        
        
      

      </BusinessCardSection>
    </ContactGrid>
  </SectionContainer>

  {/* --- 4. SECCIÓN DE RESEÑAS --- */}
  <ReviewsSection>
    <SectionTitle>
      {t('home.reviews.title')}
    </SectionTitle>
    <SectionSubtitle>
      {t('home.reviews.subtitle')}
    </SectionSubtitle>

    {displayedReviews.length > 0 ? (
      <ReviewsGrid>
        {displayedReviews.map((review) => (
          <ReviewCard key={review.id}>
            <ReviewHeader>
              <UserAvatar>
                {review.userName.charAt(0).toUpperCase()}
              </UserAvatar>
              <UserInfo>
                <UserName>{review.userName}</UserName>
                <ReviewDate>{review.date}</ReviewDate>
              </UserInfo>
            </ReviewHeader>
            
            <RatingContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} $filled={star <= review.rating} />
              ))}
            </RatingContainer>
            
            <ReviewComment>{review.comment}</ReviewComment>
          </ReviewCard>
        ))}
      </ReviewsGrid>
    ) : (
      <EmptyState>
        <MessageSquare />
        <p>{t('home.reviews.emptyState')}</p>
      </EmptyState>
    )}

    {/* Formulario para agregar reseña - Solo si está autenticado */}
    <ReviewFormContainer>
      <FormTitle>{t('home.reviews.formTitle')}</FormTitle>
      
      {user ? (
        <Form onSubmit={handleSubmitReview}>
          <FormGroup>
            <Label>{t('home.reviews.nameLabel')}</Label>
            <Input
              type="text"
              value={user.displayName || user.email || ''}
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('home.reviews.ratingLabel')}</Label>
            <RatingSelector>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  $filled={star <= newReview.rating}
                  onClick={() => setNewReview({...newReview, rating: star})}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </RatingSelector>
          </FormGroup>

          <FormGroup>
            <Label>{t('home.reviews.commentLabel')}</Label>
            <TextArea
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              placeholder={t('home.reviews.commentPlaceholder')}
              required
            />
          </FormGroup>

          <ButtonStyled $primary type="submit">
            {t('home.reviews.submitButton')}
          </ButtonStyled>
        </Form>
      ) : (
        <LoginRequiredContainer>
          <LoginIcon />
          <div>
            <FormTitle>{t('home.reviews.loginRequired')}</FormTitle>
            <LoginMessage>
              {t('home.reviews.loginMessage')}
            </LoginMessage>
          </div>
          <Link href="/login">
            <ButtonStyled $primary>
              <LogIn size={18} style={{ marginRight: '8px' }} />
              {t('home.reviews.loginButton')}
            </ButtonStyled>
          </Link>
        </LoginRequiredContainer>
      )}
    </ReviewFormContainer>
  </ReviewsSection>

</PageContainer>
  );
}
