import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ESCSIMULADOS | Simulados Gratuitos e Sem Cadastro para Ensino Fundamental e Médio',
  description: 'Plataforma 100% gratuita e sem cadastro de simulados para Ensino Fundamental e Médio do Brasil. Treine para ENEM, Prova Paulista, SARESP, OBMEP, OBA, SAEB e ETEC com gabarito comentado instantâneo.',
  openGraph: {
    title: 'ESCSIMULADOS | Simulados Gratuitos e Sem Cadastro',
    description: 'Treine para as principais provas do Brasil instantaneamente. Escolha seu exame e comece agora sem login!',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESCSIMULADOS | Simulados Gratuitos e Sem Cadastro',
    description: 'Treine para as principais provas do Brasil instantaneamente sem cadastro!',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="bg-[#F9F9FF] text-[#151C27] font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
