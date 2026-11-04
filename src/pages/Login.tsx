import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { Sprout } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, loading } = useAuth();
  const { config } = useTenant();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await signIn(email, password);
      navigate('/'); // Redireciona para o Dashboard em caso de sucesso
    } catch (error: any) {
      console.error("Falha no login", error);
      setErrorMessage(error?.message || "Falha no login. Verifique as credenciais.");
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage(null);
    try {
      await signIn('demo@fazendasantaclara.com.br', 'demo1234');
      navigate('/');
    } catch (error: any) {
      console.error("Falha no login de demonstração", error);
      setErrorMessage("Erro ao iniciar sessão de demonstração.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Sprout className="text-primary" size={48} />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-stone-900 dark:text-white">
          {config.appShortName}<span className="text-stone-900 dark:text-white font-normal">{config.appName.replace(config.appShortName, '').trim()}</span>
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">
          {config.appTagline}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-stone-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-stone-200 dark:border-stone-800">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Endereço de E-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-transparent dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-stone-300 dark:border-stone-700 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-transparent dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-stone-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-900 dark:text-stone-300">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-light">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
              >
                {loading ? 'Entrando...' : 'Entrar com E-mail'}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-stone-300 dark:border-stone-700 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 focus:outline-none transition-colors"
              >
                Acesso Rápido (Demonstração / Offline)
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-xs text-stone-500">
             Sistema SaaS/White-Label — Provedor atual: {import.meta.env.VITE_BAAS_PROVIDER || 'firebase'}
          </div>
        </div>
      </div>
    </div>
  );
}
