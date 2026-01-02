
/*
"use client";



import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ButtonStyled } from "@/components/ui/ButtonStyled";
import { CardStyled } from "@/components/ui/CardStyled";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  padding: 3rem 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const SelectStyled = styled.select`
  width: 100%;
  height: 2.5rem;
  padding: 0 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 0.875rem;
`;

const TextareaStyled = styled.textarea`
  width: 100%;
  min-height: 10rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 0.875rem;
  resize: vertical;
`;

const InfoBox = styled.div`
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #6b7280;
`;

export default function QuotesPage() {
  const [user, setUser] = useState<any>(null);
  const [service, setService] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/login");
      else setUser(currentUser);
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({ title: "¡Cotización enviada!", description: "Nos pondremos en contacto contigo pronto con tu cotización." });
      setService(""); setDetails(""); setLoading(false);
    }, 1000);
  };

  if (!user) return null;

  return (
    <Container>
      <CardStyled style={{ maxWidth: "42rem", margin: "0 auto", animation: "scale-in 0.3s ease-out" }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", background: "linear-gradient(135deg, #3b82f6, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t("quotes.title")}
          </h2>
          <p style={{ color: "#6b7280" }}>{t("quotes.description")}</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <div>
            <Label>{t("quotes.service")}</Label>
            <SelectStyled value={service} onChange={(e) => setService(e.target.value)} required>
              <option value="">{t("quotes.service")}</option>
              <option value="painting">{t("services.painting")}</option>
              <option value="cleaning">{t("services.cleaning")}</option>
              <option value="remodeling">{t("services.remodeling")}</option>
              <option value="tv">{t("services.tv")}</option>
              <option value="other">{t("services.other")}</option>
            </SelectStyled>
          </div>

          <div>
            <Label>{t("quotes.details")}</Label>
            <TextareaStyled
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe tu proyecto en detalle..."
              required
            />
          </div>

          <InfoBox>
            <strong>Información de Contacto:</strong>
            <p>Email: {user.email}</p>
          </InfoBox>

          <ButtonStyled type="submit" disabled={loading}>
            {loading ? "Enviando..." : t("quotes.submit")}
          </ButtonStyled>
        </Form>
      </CardStyled>
    </Container>
  );
}
*/

'use client';

import { useState } from 'react';
import styled from 'styled-components';

// Importar los componentes de UI que ya creamos
import {ButtonStyled} from '@/components/ui/ButtonStyled';
import InputStyled from '@/components/ui/InputStyled';
import LabelStyled from '@/components/ui/LabelStyled';
import { 
  CardStyled, 
  CardHeaderStyled, 
  CardTitleStyled, 
  CardContentStyled, 
  CardFooterStyled 
} from '@/components/ui/CardStyled';

// --- Estilos locales para esta página ---
const QuotesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; // Alinea arriba
  min-height: 80vh;
  padding: 2rem;
  background-color: ${({ theme }) => theme.colors.secondaryBg}; // Un fondo suave
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const TextAreaStyled = styled.textarea`
  display: flex;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.375rem;
  min-height: 100px;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    border-color: #2563EB; // blue-600
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }

  &::placeholder {
    color: #9CA3AF; // gray-400
  }
`;

// --- Componente de Página de Cotizaciones ---
export default function QuotesPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría tu lógica para enviar la cotización (ej. a Firebase)
    console.log({ name, email, service, details });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <QuotesContainer>
        <CardStyled style={{ width: '100%', maxWidth: '500px' }}>
          <CardHeaderStyled>
            <CardTitleStyled>¡Gracias!</CardTitleStyled>
          </CardHeaderStyled>
          <CardContentStyled>
            <p>Hemos recibido tu solicitud de cotización. Te contactaremos pronto.</p>
            <ButtonStyled $primary style={{marginTop: '1rem'}} onClick={() => setSubmitted(false)}>
              Solicitar otra cotización
            </ButtonStyled>
          </CardContentStyled>
        </CardStyled>
      </QuotesContainer>
    );
  }

  return (
    <QuotesContainer>
      <CardStyled style={{ width: '100%', maxWidth: '500px' }}>
        <CardHeaderStyled>
          <CardTitleStyled>Solicitar una Cotización</CardTitleStyled>
        </CardHeaderStyled>
        <CardContentStyled>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <div>
                <LabelStyled htmlFor="name">Nombre</LabelStyled>
                <InputStyled
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <LabelStyled htmlFor="email">Email</LabelStyled>
                <InputStyled
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <LabelStyled htmlFor="service">Servicio de Interés</LabelStyled>
                {/* Aquí podrías usar un <select> estilizado, 
                  pero un Input es más simple por ahora. 
                */}
                <InputStyled
                  id="service"
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="Ej: Pintura, Limpieza..."
                  required
                />
              </div>
              <div>
                <LabelStyled htmlFor="details">Detalles del Proyecto</LabelStyled>
                <TextAreaStyled
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe lo que necesitas..."
                  required
                />
              </div>
              <ButtonStyled type="submit" $primary style={{ width: '100%', marginTop: '1rem' }}>
                Enviar Solicitud
              </ButtonStyled>
            </FormGrid>
          </form>
        </CardContentStyled>
      </CardStyled>
    </QuotesContainer>
  );
}

