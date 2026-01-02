"use client";
import { useState } from "react"; // Eliminado useEffect porque ya no se usa aquí para auth
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth"; // Eliminado onAuthStateChanged
import { Menu, X, Sun, Moon, Globe, User as UserIcon } from "lucide-react";
import { ButtonStyled } from "@/components/ui/ButtonStyled";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext"; 
import { auth } from "@/lib/firebase"; 
import styled from "styled-components";
import LogoSvg from "@/components/image-svg/LogoSvg";
import { User } from '@/types/user';

// --- ESTILOS (Intactos) ---
const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 0 1rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  max-width: 80rem;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #F59E0B);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  display: none;
  @media (min-width: 640px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  &:hover { background: ${({ theme }) => theme.colors.primary}; }
`;

const MobileMenuToggle = styled(IconButton)`
  display: flex;
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 4rem;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.bg};
  border-top: 1px solid ${({ theme }) => theme.colors.secondary};
  padding: 1rem;
  display: ${(p) => (p.$open ? "flex" : "none")};
  flex-direction: column;
  gap: 1rem;
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  padding: 0.5rem 0;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const DesktopAuthButtons = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 0.5rem;
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.secondaryBg};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
`;

const UserName = styled.span`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.palette.skyBlue},
    ${({ theme }) => theme.colors.palette.emeraldGreen}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoutButton = styled(ButtonStyled)`
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.palette.emeraldGreen},
    ${({ theme }) => theme.colors.palette.skyBlue}
  );
  box-shadow: 
    0 0 10px ${({ theme }) => theme.colors.palette.coralRed}40,
    0 0 20px ${({ theme }) => theme.colors.palette.warmOrange}30;
  border: 1px solid ${({ theme }) => theme.colors.palette.coralRed}40;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color:white;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 
      0 0 15px ${({ theme }) => theme.colors.palette.coralRed}60,
      0 0 25px ${({ theme }) => theme.colors.palette.warmOrange}40;
    transform: translateY(-2px);
  }
`;

interface HeaderProps {
  user: User | null | undefined;
}

// --- COMPONENTE CORREGIDO ---
export default function Header({ user }: HeaderProps) {
  // Solo estado para UI local (menú)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();


  const displayName = user?.name || user?.email?.split('@')[0] || t("header.user");

  const changeLanguage = (newLang: 'es' | 'en') => {
    localStorage.setItem('language', newLang);
    window.dispatchEvent(new Event('languageChanged'));
    setLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
     
      
      setIsMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <HeaderBar>
      <Nav>
        <Logo href="/">
          <LogoSvg width={40} height={40}/>
          <LogoText>Villa Safe Solutions Pro</LogoText>
        </Logo>
     
        <NavLinks>
          <NavLink href="/services">{t("header.services")}</NavLink>
          <NavLink href="/gallery">{t("header.gallery")}</NavLink>
          <NavLink href="/contact">{t("header.contact")}</NavLink>
          <NavLink href="/about">{t("header.about")}</NavLink>
          {user && <NavLink href="/quotes">{t("header.quotes")}</NavLink>}
          {user && <NavLink href="/booking">{t("header.booking")}</NavLink>} 
        </NavLinks>

        <Actions>
          <IconButton onClick={toggleTheme} title={t("header.changeTheme")}>
            {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
          </IconButton>

          <IconButton onClick={() => changeLanguage(language === "es" ? "en" : "es")} title={t("header.changeLanguage")}>
            <Globe size={14} />
            <span style={{ fontSize: "0.75rem", marginLeft: 2 }}>{language.toUpperCase()}</span>
          </IconButton>

          {/* Botones de Auth para Escritorio */}
          <DesktopAuthButtons>
            {user ? (
              <UserInfo>
                <UserName>
                  <UserIcon size={16} />
                  {/* Usamos la variable calculada displayName */}
                  {displayName}
                </UserName>
                <LogoutButton onClick={handleLogout}>
                  {t("header.logout")}
                </LogoutButton>
              </UserInfo>
            ) : (
              <>
                <Link href="/login" passHref legacyBehavior>
                  <ButtonStyled as="a" $primary style={{ marginLeft: 8 }}>
                    {t("header.login")}
                  </ButtonStyled>
                </Link>
                <Link href="/register" passHref legacyBehavior>
                  <ButtonStyled as="a" style={{ marginLeft: 8 }}>
                    {t("header.register")}
                  </ButtonStyled>
                </Link>
              </>
            )}
          </DesktopAuthButtons>

          <MobileMenuToggle onClick={() => setIsMenuOpen(!isMenuOpen)} title={t("header.toggleMenu")}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </MobileMenuToggle>
        </Actions>
      </Nav>

      {/* Menú Móvil */}
      <MobileMenu $open={isMenuOpen}>
        <MobileNavLink href="/services" onClick={() => setIsMenuOpen(false)}>
          {t("header.services")}
        </MobileNavLink>
        <MobileNavLink href="/gallery" onClick={() => setIsMenuOpen(false)}>
          {t("header.gallery")}
        </MobileNavLink>
        <MobileNavLink href="/contact" onClick={() => setIsMenuOpen(false)}>
          {t("header.contact")}
        </MobileNavLink>
        {user && (
          <MobileNavLink href="/quotes" onClick={() => setIsMenuOpen(false)}>
            {t("header.quotes")}
          </MobileNavLink>
        )}
        {user && (
          <MobileNavLink href="/booking" onClick={() => setIsMenuOpen(false)}> 
            {t("header.booking")}
          </MobileNavLink>
        )}

        <MobileAuthButtons>
          {user ? (
            <UserInfo>
              <UserName>
                <UserIcon size={16} />
                {/* Usamos la variable calculada displayName */}
                {displayName}
              </UserName>
              <LogoutButton onClick={handleLogout}>
                {t("header.logout")}
              </LogoutButton>
            </UserInfo>
          ) : (
            <>
              <Link href="/login" passHref legacyBehavior>
                <ButtonStyled as="a" $primary onClick={() => setIsMenuOpen(false)}>
                  {t("header.login")}
                </ButtonStyled>
              </Link>
              <Link href="/register" passHref legacyBehavior>
                <ButtonStyled as="a" onClick={() => setIsMenuOpen(false)}>
                  {t("header.register")}
                </ButtonStyled>
              </Link>
            </>
          )}
        </MobileAuthButtons>
      </MobileMenu>
    </HeaderBar>
  );
}
