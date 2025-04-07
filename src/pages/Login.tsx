import React from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Squares from '../components/Squares';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative">
      <Squares 
        speed={0.3}
        squareSize={50}
        direction="diagonal"
        borderColor="rgba(147, 51, 234, 0.1)"
        hoverFillColor="rgba(147, 51, 234, 0.2)"
      />
      <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-500/10 w-full max-w-md p-8 relative z-10">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-xl flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white ml-3 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Entrar</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-purple-900/30 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-purple-900/30 border-purple-500/20 rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Lembrar-me
              </label>
            </div>

            <button type="button" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-400">
            Não tem uma conta?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;