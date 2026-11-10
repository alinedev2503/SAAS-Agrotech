import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTenant } from '../contexts/TenantContext';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { Sprout, ShieldCheck, Zap } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, loading } = useAuth();
  const { config } = useTenant();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login failure", error);
      setErrorMessage(
        language === 'es' 
          ? 'Error de inicio de sesión. Por favor verifique sus credenciales.' 
          : language === 'pt'
          ? 'Falha no login. Verifique suas credenciais.'
          : 'Login failed. Please verify your credentials.'
      );
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage(null);
    try {
      await signIn('manager@agrotech-farm.com', 'demo1234');
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Demo login failure", error);
      setErrorMessage(
        language === 'es'
          ? 'No se pudo iniciar la sesión de demostración. Intente nuevamente.'
          : language === 'pt'
          ? 'Não foi possível iniciar a demonstração. Tente novamente.'
          : 'Could not launch demo session. Please try again.'
      );
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setLanguage(item.code)}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                language === item.code
                  ? 'bg-white dark:bg-stone-700 text-primary shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <span>{item.flag}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-2 shadow-inner">
          <Sprout className="text-primary" size={40} />
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
          {config.appShortName}<span className="text-stone-900 dark:text-white font-normal">{config.appName.replace(config.appShortName, '').trim()}</span>
        </h2>
        <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400 max-w-xs">
          {language === 'es' 
            ? 'Gestión integral de explotaciones agrícolas y ganaderas de precisión.'
            : language === 'pt'
            ? 'Gestão integrada de fazendas agrícolas e pecuárias de precisão.'
            : config.appTagline}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-stone-900 py-8 px-5 sm:px-10 shadow-xl rounded-3xl border border-stone-200 dark:border-stone-800 transition-colors">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                {t.login_email}
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@agrotech-farm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3.5 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-transparent dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                {t.login_password}
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3.5 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-transparent dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-stone-700 dark:text-stone-300">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-stone-300 rounded"
                />
                {t.login_remember}
              </label>

              <button type="button" className="font-semibold text-primary hover:underline">
                {t.login_forgot}
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 font-medium">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer"
              >
                {loading ? t.loading : t.login_submit}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 focus:outline-none transition-colors cursor-pointer"
              >
                <Zap size={16} className="text-amber-500" />
                {t.login_demo_btn}
              </button>
            </div>
          </form>
          
          <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 flex flex-col items-center gap-3 text-xs text-stone-400 text-center">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>{t.login_offline_notice}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-primary hover:underline font-semibold cursor-pointer"
            >
              {language === 'es' ? '← Volver a la página principal' : language === 'pt' ? '← Voltar à página inicial' : '← Back to Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
