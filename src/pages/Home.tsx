import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Gift, QrCode, Sparkles, Camera, Music, Check } from 'lucide-react';
import Squares from '../components/Squares';
import '../styles/Home.scss';

const Home = () => {
  return (
    <div className="home">
      <header className="hero">
        <Squares 
          speed={0.3}
          squareSize={50}
          direction="diagonal"
          borderColor="rgba(147, 51, 234, 0.1)"
          hoverFillColor="rgba(147, 51, 234, 0.2)"
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="hero__badge">
              <span className="hero__badge-text">
                <Sparkles className="hero__badge-icon" />
                <span className="hero__badge-label">Transforme Momentos em Memórias Eternas</span>
              </span>
            </div>
            
            <h1 className="hero__title">
              Crie Memórias Digitais Inesquecíveis
            </h1>
            
            <p className="hero__description">
              Transforme suas fotos, vídeos e mensagens em presentes românticos únicos. 
              Crie experiências memoráveis que podem ser compartilhadas com um simples QR Code.
            </p>
            
            <div className="hero__buttons">
              <Link to="/login" className="hero__buttons-primary">
                Começar Agora
              </Link>
              <a href="#como-funciona" className="hero__buttons-secondary">
                Saiba Mais
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="container mx-auto px-4">
          <div className="features__header">
            <h2 className="features__header-title">Recursos Exclusivos</h2>
            <p className="features__header-description">
              Ferramentas poderosas para criar experiências únicas e memoráveis
            </p>
          </div>

          <div className="features__grid">
            <div className="features__card">
              <div className="features__card-icon">
                <Camera />
              </div>
              <h3 className="features__card-title">Galeria Interativa</h3>
              <p className="features__card-description">
                Upload ilimitado de fotos e vídeos com layout personalizado
              </p>
            </div>

            <div className="features__card">
              <div className="features__card-icon">
                <Music />
              </div>
              <h3 className="features__card-title">Trilha Sonora</h3>
              <p className="features__card-description">
                Adicione músicas do Spotify ou YouTube para embalar os momentos
              </p>
            </div>

            <div className="features__card">
              <div className="features__card-icon">
                <QrCode />
              </div>
              <h3 className="features__card-title">QR Code Único</h3>
              <p className="features__card-description">
                Compartilhe facilmente com um QR Code personalizado
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="how-it-works__header">
              <h2 className="how-it-works__header-title">Como Funciona</h2>
              <p className="how-it-works__header-description">Três passos simples para criar sua memória digital</p>
            </div>

            <div className="how-it-works__grid">
              <div className="how-it-works__step group">
                <div className="how-it-works__step-icon">
                  <Heart />
                </div>
                <h3 className="how-it-works__step-title">Crie sua Memória</h3>
                <p className="how-it-works__step-description">
                  Faça upload de suas mídias favoritas e escreva sua mensagem especial
                </p>
              </div>

              <div className="how-it-works__step group">
                <div className="how-it-works__step-icon">
                  <Gift />
                </div>
                <h3 className="how-it-works__step-title">Personalize</h3>
                <p className="how-it-works__step-description">
                  Escolha o layout, adicione música e customize cada detalhe
                </p>
              </div>

              <div className="how-it-works__step group">
                <div className="how-it-works__step-icon">
                  <QrCode />
                </div>
                <h3 className="how-it-works__step-title">Compartilhe</h3>
                <p className="how-it-works__step-description">
                  Gere seu QR Code único e surpreenda quem você ama
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing py-24 bg-gradient-to-b from-purple-900/20 to-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
              Escolha seu Plano
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Comece a criar memórias inesquecíveis hoje mesmo. Escolha o plano que melhor se adapta a você.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano Mensal */}
            <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/10 p-8 hover:border-purple-500/30 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Plano Mensal</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-white">R$ 14,90</span>
                  <span className="text-gray-400">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>10 memórias por mês</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>Upload ilimitado de fotos</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>Integração com Spotify</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-purple-400" />
                  <span>QR Codes personalizados</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="block w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-center hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                Começar Agora
              </Link>
            </div>

            {/* Plano Anual */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-8 hover:border-purple-500/40 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-5 right-5">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                  Economize 20%
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Plano Anual</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-white">R$ 143,90</span>
                  <span className="text-gray-400">/ano</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Equivalente a R$ 11,90/mês</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-pink-400" />
                  <span>Memórias ilimitadas</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-pink-400" />
                  <span>Upload ilimitado de fotos</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-pink-400" />
                  <span>Integração com Spotify</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-pink-400" />
                  <span>QR Codes personalizados</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-pink-400" />
                  <span>Temas exclusivos</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Check className="h-5 w-5 text-pink-400" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>

              <Link
                to="/register"
                className="block w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-center hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                Assinar com Desconto
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 LoveMemory. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;