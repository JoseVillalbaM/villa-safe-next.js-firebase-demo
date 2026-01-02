'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { ButtonStyled } from '@/components/ui/ButtonStyled';
import InputStyled from '@/components/ui/InputStyled';
import LabelStyled from '@/components/ui/LabelStyled';
import {
  CardStyled,
  CardHeaderStyled,
  CardTitleStyled,
  CardContentStyled,
  CardFooterStyled,
} from '@/components/ui/CardStyled';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useLanguage } from '@/contexts/LanguageContext';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.bg};
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.palette.coralRed};
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 0.875rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.palette.skyBlue};
  }
`;

// Componentes extendidos para los nuevos estilos
const StyledCard = styled(CardStyled)`
  box-shadow: 
    0 0 20px ${({ theme }) => theme.colors.palette.skyBlue}40,
    0 0 40px ${({ theme }) => theme.colors.primary}30,
    0 0 60px ${({ theme }) => theme.colors.palette.coralRed}20;
  border: 1px solid ${({ theme }) => theme.colors.palette.skyBlue}30;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 
      0 0 25px ${({ theme }) => theme.colors.palette.skyBlue}50,
      0 0 50px ${({ theme }) => theme.colors.primary}40,
      0 0 75px ${({ theme }) => theme.colors.palette.coralRed}30;
  }
`;

const StyledButton = styled(ButtonStyled)`
  box-shadow: 
    0 0 15px ${({ theme }) => theme.colors.palette.skyBlue}50,
    0 0 25px ${({ theme }) => theme.colors.primary}30;
  border: 1px solid ${({ theme }) => theme.colors.palette.skyBlue}40;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 
      0 0 20px ${({ theme }) => theme.colors.palette.skyBlue}60,
      0 0 35px ${({ theme }) => theme.colors.primary}40;
    transform: translateY(-2px);
  }
`;

const GradientTitle = styled(CardTitleStyled)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.palette.skyBlue} 0%,
    ${({ theme }) => theme.colors.palette.coralRed} 50%,
    ${({ theme }) => theme.colors.primary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Intentando iniciar sesión con:', email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Inicio de sesión exitoso');
      router.push('/');
    } catch (err: any) {
      console.error('Error completo:', err);
      console.error('Código de error:', err.code);

      switch (err.code) {
        case 'auth/user-not-found':
          setError(t('auth.error.userNotFound'));
          break;
        case 'auth/wrong-password':
          setError(t('auth.error.wrongPassword'));
          break;
        case 'auth/invalid-email':
          setError(t('auth.error.invalidEmail'));
          break;
        case 'auth/invalid-credential':
          setError(t('auth.error.wrongPassword'));
          break;
        default:
          setError(`${t('auth.error.generic')}: ${err.message}`);
      }
    }
  };

  return (
    <LoginContainer>
      <StyledCard style={{ width: '100%', maxWidth: '400px' }}>
        <CardHeaderStyled>
          <GradientTitle>{t('auth.login')}</GradientTitle>
        </CardHeaderStyled>
        <CardContentStyled>
          <form onSubmit={handleLogin}>
            <FormGrid>
              <div>
                <LabelStyled htmlFor="email">{t('auth.email')}</LabelStyled>
                <InputStyled
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                />
              </div>
              <div>
                <LabelStyled htmlFor="password">{t('auth.password')}</LabelStyled>
                <InputStyled
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                />
              </div>
              <StyledButton type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                {t('auth.loginButton')}
              </StyledButton>
            </FormGrid>
          </form>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </CardContentStyled>
        <CardFooterStyled>
          <FooterText>
            {t('auth.noAccount')}{' '}
            <StyledLink href="/register">{t('auth.register')}</StyledLink>
          </FooterText>
        </CardFooterStyled>
      </StyledCard>
    </LoginContainer>
  );
}