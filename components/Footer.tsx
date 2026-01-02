' use client'

import { Facebook, Instagram ,Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
FooterContainer,
FooterContent,
FooterGrid,
FooterSection,
SectionTitle,
ContactList,
ContactItem,
ContactLink,
ContactText,
SocialGrid,
SocialLink,
BrandSection,
BrandSubtitle,
LogoContainer,
Copyright,
CopyrightText,
} from './Footer.styles';

export default function Footer() {
const { t } = useLanguage();

const socialLinks = [
{ icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
{ icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },

];

return (
<FooterContainer>
<FooterContent>
<FooterGrid>
<FooterSection>
<SectionTitle></SectionTitle>
<ContactList>
<ContactItem>
<Phone size={20} />
<ContactLink href='tel:+1234567890'>+1 (786) 7346928</ContactLink>
</ContactItem>
<ContactItem>
<Mail size={20} />
<ContactLink href='mailto:villasafesolutions2023@gmail.com'>villasafesolutions2023@gmail.com</ContactLink>
</ContactItem>
<ContactItem>
<MapPin size={20} />
<ContactText>1993 Carnostie Road 33884 fl Winter Haven</ContactText>
</ContactItem>
</ContactList>
</FooterSection>


      <FooterSection>
        <SectionTitle></SectionTitle>
        <SocialGrid>
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <SocialLink
                key={social.label}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={social.label}
              >
                <IconComponent size={20} />
              </SocialLink>
            );
          })}
        </SocialGrid>
      </FooterSection>

      <BrandSection>
        <SectionTitle>Villa Safe Solutions.</SectionTitle>
        <BrandSubtitle></BrandSubtitle>
        <div style={{ paddingTop: '0.5rem' }}>
          <LogoContainer>VS</LogoContainer>
        </div>
      </BrandSection>
    </FooterGrid>

    <Copyright>
      <CopyrightText>
        © {new Date().getFullYear()} {'Villa Safe Solutions.' }
      </CopyrightText>
    </Copyright>
  </FooterContent>
</FooterContainer>


);
}