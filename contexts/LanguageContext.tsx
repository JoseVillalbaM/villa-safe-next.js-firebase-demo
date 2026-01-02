'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Traducciones ampliadas ---
type TranslationKey = 
  | "header.services"
  | "header.gallery"
  | "header.contact"
  |  "header.about"
  | "header.quotes"
  | "header.logout"
  | "header.login"
  | "header.register"
  | "header.booking"
  | "header.changeTheme"
  | "header.changeLanguage"
  | "header.toggleMenu"
  | "header.user"
  // --- Traducciones para la página principal ---
  | "home.hero.title"
  | "home.hero.subtitle"
  | "home.hero.quoteButton"
  | "home.hero.contactButton"
  | "home.services.title"
  | "home.services.subtitle"
  | "home.contact.title"
  | "home.contact.subtitle"
  | "home.contact.qualityTitle"
  | "home.contact.description"
  | "home.contact.contactText"
  | "home.contact.formButton"
  | "home.contact.businessCardTitle"
  // --- Traducciones para la sección de reseñas ---
  | "home.reviews.title"
  | "home.reviews.subtitle"
  | "home.reviews.emptyState"
  | "home.reviews.formTitle"
  | "home.reviews.nameLabel"
  | "home.reviews.namePlaceholder"
  | "home.reviews.ratingLabel"
  | "home.reviews.commentLabel"
  | "home.reviews.commentPlaceholder"
  | "home.reviews.submitButton"
  | "home.reviews.loginRequired"
  | "home.reviews.loginButton"
  | "home.reviews.loginMessage"
  // --- Traducciones para Auth (Login/Register) ---
  | "auth.login"
  | "auth.register"
  | "auth.email"
  | "auth.password"
  | "auth.createAccount"
  | "auth.alreadyHaveAccount"
  | "auth.noAccount"
  | "auth.loginButton"
  | "auth.registerButton"
  | "auth.emailPlaceholder"
  | "auth.passwordPlaceholder"
  | "auth.firstName"
  | "auth.lastName"
  | "auth.firstNamePlaceholder"
  | "auth.lastNamePlaceholder"
  | "auth.error.emailInUse"
  | "auth.error.invalidEmail"
  | "auth.error.weakPassword"
  | "auth.error.userNotFound"
  | "auth.error.wrongPassword"
  | "auth.error.generic"
  | "auth.error.shortPassword"
  | "auth.error.operationNotAllowed"
  | "auth.error.nameRequired"
  // --- Traducciones para la página de Contacto ---
  | "contact.title"
  | "contact.subtitle"
  | "contact.cta.title"
  | "contact.cta.subtitle"
  | "contact.cta.button"
  | "contact.form.title"
  | "contact.form.name"
  | "contact.form.email"
  | "contact.form.phone"
  | "contact.form.message"
  | "contact.form.submit"
  | "contact.form.sending"
  | "contact.form.success"
  | "contact.form.namePlaceholder"
  | "contact.form.emailPlaceholder"
  | "contact.form.phonePlaceholder"
  | "contact.form.messagePlaceholder";

const translations: Record<'es' | 'en', Record<TranslationKey, string>> = {
  es: {
    "header.services": "Servicios",
    "header.about": "Acerca de Nosotros",
    "header.gallery": "Galería",
    "header.contact": "Contacto",
    "header.quotes": "Cotizaciones",
    "header.logout": "Cerrar Sesión",
    "header.login": "Iniciar Sesión",
    "header.register": "Registrarse",
    "header.booking": "Reservar",
    "header.changeTheme": "Cambiar tema",
    "header.changeLanguage": "Cambiar idioma",
    "header.toggleMenu": "Abrir/Cerrar menú",
    "header.user": "Usuario",
    // --- Página principal ---
    "home.hero.title": "Villa Safe Solutions",
    "home.hero.subtitle": "Soluciones profesionales para tu hogar y negocio",
    "home.hero.quoteButton": "Solicitar Cotización",
    "home.hero.contactButton": "Contacto",
    "home.services.title": "Servicios",
    "home.services.subtitle": "Soluciones profesionales para todas tus necesidades",
    "home.contact.title": "Contáctanos",
    "home.contact.subtitle": "Estamos listos para ayudarte con tu próximo proyecto.",
    "home.contact.qualityTitle": "Calidad y Confianza",
    "home.contact.description": "Con años de experiencia en la industria, nuestro equipo se dedica a proveer soluciones confiables y de alta calidad. Nos enorgullecemos de nuestro trabajo y de la satisfacción de nuestros clientes.",
    "home.contact.contactText": "Puedes contactarnos directamente o llenar nuestro formulario de contacto.",
    "home.contact.formButton": "Ver formulario de contacto",
    "home.contact.businessCardTitle": "Tarjeta de Negocios",
    // --- Sección de reseñas ---
    "home.reviews.title": "Testimonios y Reseñas",
    "home.reviews.subtitle": "Lo que nuestros clientes dicen sobre nuestro trabajo",
    "home.reviews.emptyState": "Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!",
    "home.reviews.formTitle": "Deja tu opinión",
    "home.reviews.nameLabel": "Nombre",
    "home.reviews.namePlaceholder": "Tu nombre",
    "home.reviews.ratingLabel": "Calificación",
    "home.reviews.commentLabel": "Comentario",
    "home.reviews.commentPlaceholder": "Comparte tu experiencia...",
    "home.reviews.submitButton": "Publicar Reseña",
    "home.reviews.loginRequired": "Inicia sesión para dejar una reseña",
    "home.reviews.loginButton": "Iniciar Sesión",
    "home.reviews.loginMessage": "Solo los clientes registrados pueden dejar reseñas sobre nuestros servicios.",
    // --- Auth ---
    "auth.firstName": "Nombre",
    "auth.lastName": "Apellido", 
    "auth.firstNamePlaceholder": "Ingresa tu nombre",
    "auth.lastNamePlaceholder": "Ingresa tu apellido",
    "auth.login": "Iniciar sesión",
    "auth.register": "Registrarse",
    "auth.email": "Email",
    "auth.password": "Contraseña",
    "auth.createAccount": "Crear una cuenta",
    "auth.alreadyHaveAccount": "¿Ya tienes cuenta?",
    "auth.noAccount": "¿No tienes cuenta?",
    "auth.loginButton": "Iniciar sesión",
    "auth.registerButton": "Registrarse",
    "auth.emailPlaceholder": "tu@email.com",
    "auth.passwordPlaceholder": "••••••••",
    "auth.error.emailInUse": "Este correo electrónico ya está en uso.",
    "auth.error.invalidEmail": "El correo electrónico no es válido.",
    "auth.error.weakPassword": "La contraseña es muy débil.",
    "auth.error.userNotFound": "Usuario no encontrado.",
    "auth.error.wrongPassword": "Contraseña incorrecta.",
    "auth.error.generic": "Error al procesar la solicitud.",
    "auth.error.shortPassword": "La contraseña debe tener al menos 6 caracteres.",
    "auth.error.operationNotAllowed": "El registro con email/contraseña no está habilitado.",
    "auth.error.nameRequired": "El nombre y apellido son requeridos.",
    // --- Página de Contacto ---
    "contact.title": "Contáctanos",
    "contact.subtitle": "Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.",
    "contact.cta.title": "¿Listo para empezar tu proyecto?",
    "contact.cta.subtitle": "Solicita una cotización gratuita y descubre cómo podemos transformar tus espacios",
    "contact.cta.button": "Solicitar Cotización",
    "contact.form.title": "Envíanos un mensaje",
    "contact.form.name": "Nombre completo",
    "contact.form.email": "Correo electrónico",
    "contact.form.phone": "Teléfono",
    "contact.form.message": "Mensaje",
    "contact.form.submit": "Enviar Mensaje",
    "contact.form.sending": "Enviando...",
    "contact.form.success": "¡Mensaje enviado con éxito! Te contactaremos pronto.",
    "contact.form.namePlaceholder": "Juan Pérez",
    "contact.form.emailPlaceholder": "juan@ejemplo.com",
    "contact.form.phonePlaceholder": "+1 (555) 123-4567",
    "contact.form.messagePlaceholder": "Cuéntanos sobre tu proyecto...",
  },
  en: {
    "header.services": "Services",
    "header.gallery": "Gallery",
    "header.contact": "Contact",
    "header.about": "About Us",
    "header.quotes": "Quotes",
    "header.logout": "Logout",
    "header.login": "Login",
    "header.register": "Register",
    "header.booking": "Booking",
    "header.changeTheme": "Change theme",
    "header.changeLanguage": "Change language",
    "header.toggleMenu": "Toggle menu",
    "header.user": "User",
    // --- Home page ---
    "home.hero.title": "Villa Safe Solutions",
    "home.hero.subtitle": "Professional solutions for your home and business",
    "home.hero.quoteButton": "Request Quote",
    "home.hero.contactButton": "Contact",
    "home.services.title": "Services",
    "home.services.subtitle": "Professional solutions for all your needs",
    "home.contact.title": "Contact Us",
    "home.contact.subtitle": "We are ready to help you with your next project.",
    "home.contact.qualityTitle": "Quality and Trust",
    "home.contact.description": "With years of experience in the industry, our team is dedicated to providing reliable and high-quality solutions. We take pride in our work and customer satisfaction.",
    "home.contact.contactText": "You can contact us directly or fill out our contact form.",
    "home.contact.formButton": "View contact form",
    "home.contact.businessCardTitle": "Business Card",
    // --- Reviews section ---
    "home.reviews.title": "Testimonials and Reviews",
    "home.reviews.subtitle": "What our clients say about our work",
    "home.reviews.emptyState": "No reviews yet. Be the first to share your experience!",
    "home.reviews.formTitle": "Leave your review",
    "home.reviews.nameLabel": "Name",
    "home.reviews.namePlaceholder": "Your name",
    "home.reviews.ratingLabel": "Rating",
    "home.reviews.commentLabel": "Comment",
    "home.reviews.commentPlaceholder": "Share your experience...",
    "home.reviews.submitButton": "Submit Review",
    "home.reviews.loginRequired": "Log in to leave a review",
    "home.reviews.loginButton": "Log In",
    "home.reviews.loginMessage": "Only registered customers can leave reviews about our services.",
    // --- Auth ---
    "auth.firstName": "First Name",
    "auth.lastName": "Last Name",
    "auth.firstNamePlaceholder": "Enter your first name",
    "auth.lastNamePlaceholder": "Enter your last name",
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.createAccount": "Create an account",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.noAccount": "Don't have an account?",
    "auth.loginButton": "Login",
    "auth.registerButton": "Register",
    "auth.emailPlaceholder": "you@email.com",
    "auth.passwordPlaceholder": "••••••••",
    "auth.error.emailInUse": "This email is already in use.",
    "auth.error.invalidEmail": "The email is invalid.",
    "auth.error.weakPassword": "The password is too weak.",
    "auth.error.userNotFound": "User not found.",
    "auth.error.wrongPassword": "Incorrect password.",
    "auth.error.generic": "Error processing request.",
    "auth.error.shortPassword": "Password must be at least 6 characters.",
    "auth.error.operationNotAllowed": "Email/password registration is not enabled.",
    "auth.error.nameRequired": "First and last name are required.",
    // --- Contact Page ---
    "contact.title": "Contact Us",
    "contact.subtitle": "We're here to help. Send us a message and we'll get back to you as soon as possible.",
    "contact.cta.title": "Ready to start your project?",
    "contact.cta.subtitle": "Request a free quote and discover how we can transform your spaces",
    "contact.cta.button": "Request Quote",
    "contact.form.title": "Send us a message",
    "contact.form.name": "Full name",
    "contact.form.email": "Email address",
    "contact.form.phone": "Phone",
    "contact.form.message": "Message",
    "contact.form.submit": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success": "Message sent successfully! We'll contact you soon.",
    "contact.form.namePlaceholder": "John Doe",
    "contact.form.emailPlaceholder": "john@example.com",
    "contact.form.phonePlaceholder": "+1 (555) 123-4567",
    "contact.form.messagePlaceholder": "Tell us about your project...",
  },
};

// --- Tipo del Contexto ---
interface LanguageContextType {
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  t: (key: TranslationKey) => string;
}

// --- Creación del Contexto ---
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// --- Provider ---
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// --- Hook para usar el contexto ---
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage debe usarse dentro de un LanguageProvider');
  }
  return context;
};