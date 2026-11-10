import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ChevronDown,
  Check,
  Star,
  Menu,
  X,
  ArrowRight,
  Shield,
  BarChart3,
  CloudSun,
  Tractor,
  Warehouse,
  Users,
  Smartphone,
  Wifi,
  Clock,
  TrendingUp,
  FlaskConical,
  ScrollText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { PWAInstallButton } from '../components/PWAInstallButton';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
  ];

  const content = {
    pt: {
      badge: 'Solução Agropecuária 2026 • 100% Offline-First',
      heroTitlePrefix: 'Sua fazenda sob controle total. ',
      heroTitleHighlight: 'Sem achismos.',
      heroDesc:
        'Elimine planilhas manuais, anotações perdidas e perdas no campo. O AgroTech unifica cotações da CME e B3, controle sanitário de carência, gestão de estoque com leitor QR e tarefas da equipe em um hub robusto.',
      btnLaunch: 'Acessar Plataforma',
      btnStart: 'Iniciar Demonstração',
      btnSignIn: 'Entrar',
      btnModules: 'Conhecer Recursos',
      proofNoContract: 'Sem fidelidade',
      proofOffline: '100% Funcional Offline',
      proofSetup: 'Configuração em 20 min',
      statsFarms: 'Propriedades Ativas',
      statsAnimals: 'Animais Monitorados',
      statsAcres: 'Hectares Mapeados',
      statsRetention: 'Satisfação dos Clientes',
      modulesTitle: 'Tudo o que sua Operação Agropecuária Precisa',
      modulesSubtitle: 'Seis módulos integrados e sincronizados para o dia a dia da lavoura e da pecuária.',
      howTitle: 'Pronto para Uso em Menos de 20 Minutos',
      howSubtitle: 'Sem implementação demorada ou consultoria complexa. Desenvolvido para o campo.',
      testimonialsTitle: 'Confiado por Produtores e Veterinários',
      testimonialsSubtitle: 'Veja como o AgroTech transforma a gestão rural de fazendas de todos os portes.',
      pricingTitle: 'Planos Transparentes para Cada Etapa do seu Agronegócio',
      pricingSubtitle: 'Previsibilidade de custos, desde pequenas propriedades familiares a grandes agropecuárias.',
      faqTitle: 'Perguntas Frequentes',
      faqSubtitle: 'Respostas diretas sobre tecnologia, funcionamento offline e contratação.',
      finalTitle: 'Sua Fazenda Merece uma Gestão Profissional e Precisa',
      finalDesc: 'Junte-se a mais de 850 produtores que aposentaram o caderno de campo e agora gerenciam com dados em tempo real.',
      finalBtnPrimary: 'Começar Agora Mesmo',
      finalBtnDemo: 'Acessar Ambiente de Testes',
      navFeatures: 'Recursos',
      navHow: 'Como Funciona',
      navPricing: 'Planos',
      navFaq: 'Dúvidas',
    },
    es: {
      badge: 'Solución Agropecuaria 2026 • 100% Offline-First',
      heroTitlePrefix: 'Su campo bajo control total. ',
      heroTitleHighlight: 'Sin conjeturas.',
      heroDesc:
        'Elimine cuadernos de papel, retrasos climáticos y registros perdidos. AgroTech unifica cotizaciones de futuros (CME/CBOT), períodos de carencia veterinaria, inventario con código QR y tareas del personal en un hub integral.',
      btnLaunch: 'Abrir Plataforma',
      btnStart: 'Iniciar Prueba Gratuita',
      btnSignIn: 'Iniciar Sesión',
      btnModules: 'Ver Módulos',
      proofNoContract: 'Sin contrato de permanencia',
      proofOffline: '100% Capaz Fuera de Línea',
      proofSetup: 'Listo en 20 Minutos',
      statsFarms: 'Campos y Estancias',
      statsAnimals: 'Cabezas de Ganado',
      statsAcres: 'Hectáreas Monitoreadas',
      statsRetention: 'Tasa de Retención',
      modulesTitle: 'Todo lo que su Empresa Agropecuaria Requiere',
      modulesSubtitle: 'Seis módulos integrados y sincronizados para la administración rural moderna.',
      howTitle: 'En Marcha en Menos de 20 Minutos',
      howSubtitle: 'Sin consultorías complejas ni retrasos técnicos. Diseñado para trabajar en el lote.',
      testimonialsTitle: 'Aprobado por Productores Líderes',
      testimonialsSubtitle: 'Experiencias reales de ganaderos y agricultores en la gestión diaria.',
      pricingTitle: 'Planes Claros que Crecen con su Establecimiento',
      pricingSubtitle: 'Costos previsibles desde explotaciones familiares hasta grandes grupos agrícolas.',
      faqTitle: 'Preguntas Frecuentes',
      faqSubtitle: 'Respuestas sobre funcionamiento offline, seguridad y soporte agronómico.',
      finalTitle: 'Su Explotación Merece una Gestión Precisa y Eficiente',
      finalDesc: 'Únase a cientos de establecimientos agropecuarios que optimizaron sus costos y tiempos operativos con AgroTech.',
      finalBtnPrimary: 'Comenzar Prueba Gratuita',
      finalBtnDemo: 'Explorar Modo Demostración',
      navFeatures: 'Módulos',
      navHow: 'Cómo Funciona',
      navPricing: 'Precios',
      navFaq: 'Preguntas',
    },
    en: {
      badge: 'Enterprise Ag Edition 2026 • 100% Offline-First',
      heroTitlePrefix: 'Your farm under total command. ',
      heroTitleHighlight: 'Not guesswork.',
      heroDesc:
        'Eliminate lost paper logs, delayed weather alerts, and reactive livestock treatments. AgroTech brings CME commodity tickers, veterinary withholding, QR inventory, and field crew tasks into one unified offline-ready hub.',
      btnLaunch: 'Launch Live App',
      btnStart: 'Start Free Trial',
      btnSignIn: 'Sign In',
      btnModules: 'Explore Modules',
      proofNoContract: 'No Lock-in Contract',
      proofOffline: '100% Offline Capable',
      proofSetup: 'Ready in 20 Minutes',
      statsFarms: 'Commercial Farms Enrolled',
      statsAnimals: 'Livestock Head Monitored',
      statsAcres: 'Acres Actively Managed',
      statsRetention: 'Client Retention Rate',
      modulesTitle: 'Everything Your Agricultural Enterprise Requires',
      modulesSubtitle: 'Six synchronized modules designed specifically for real-world farming and ranching operations.',
      howTitle: 'Up and Running in Under 20 Minutes',
      howSubtitle: 'No protracted software implementation. No complex IT consulting. Built for direct field deployment.',
      testimonialsTitle: 'Trusted by Leading Growers & Ranchers',
      testimonialsSubtitle: 'Real farm operators across the Heartland share their operational experience.',
      pricingTitle: 'Transparent Plans That Grow with Your Operation',
      pricingSubtitle: 'Predictable pricing from single family parcels to multi-state cattle operations.',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Clear answers to technical, operational, and commercial questions.',
      finalTitle: 'Your Farm Deserves Management Built for Modern Agriculture',
      finalDesc: 'Join 850+ forward-thinking producers who traded paper notebooks for data-driven precision. Test the system free for 14 days.',
      finalBtnPrimary: 'Start Your Free Trial',
      finalBtnDemo: 'Access Demo Workspace',
      navFeatures: 'Features',
      navHow: 'How It Works',
      navPricing: 'Pricing',
      navFaq: 'FAQ',
    },
  }[language];

  const benefits = [
    {
      icon: BarChart3,
      title: language === 'pt' ? 'Painel Integrado da Fazenda' : language === 'es' ? 'Panel Agropecuario Unificado' : 'Unified Ag Dashboard',
      description:
        language === 'pt'
          ? 'Visão consolidada de animais, lavouras, clima e cotações sem planilhas confusas.'
          : language === 'es'
          ? 'Visión consolidada del rodeo, lotes, clima y cotizaciones sin planillas confusas.'
          : 'Every ranch and farm operation in one single command center without messy spreadsheets.',
    },
    {
      icon: CloudSun,
      title: language === 'pt' ? 'Clima & Cotações Futuras' : language === 'es' ? 'Clima y Cotizaciones Futuras' : 'Real-Time Climate & CME Futures',
      description:
        language === 'pt'
          ? 'Alertas de geada, estresse hídrico e índices de commodities agrícolas em tempo real.'
          : language === 'es'
          ? 'Alertas de heladas, estrés hídrico y cotizaciones de futuros integradas a la operativa.'
          : 'Frost alerts, moisture stress metrics, and live commodity tickers integrated into operations.',
    },
    {
      icon: FlaskConical,
      title: language === 'pt' ? 'Manejo Sanitário & Carência' : language === 'es' ? 'Sanidad y Períodos de Carencia' : 'Veterinary Health & Withholding',
      description:
        language === 'pt'
          ? 'Controle de vacinas, cálculo de tempo de carência para abate/leite e leitura de brinco.'
          : language === 'es'
          ? 'Control de vacunas, cálculo de retiro para faena/ordeñe y trazabilidad por caravana.'
          : 'Automated vaccine protocols, withdrawal period tracking for meat and dairy, and digital ear tags.',
    },
    {
      icon: Tractor,
      title: language === 'pt' ? 'Agricultura de Precisão' : language === 'es' ? 'Agricultura y Lotes de Siembra' : 'Precision Crop Management',
      description:
        language === 'pt'
          ? 'Cálculo de Graus-Dia (GDD), densidade de semeadura e histórico de colheita dos talhões.'
          : language === 'es'
          ? 'Cálculo de Grados Día (GDD), densidad de siembra y estadios fenológicos por lote.'
          : 'Field mapping, Growing Degree Day (GDD) calculations, planting density, and plot yield history.',
    },
    {
      icon: Warehouse,
      title: language === 'pt' ? 'Estoque com Câmera QR' : language === 'es' ? 'Inventario con Lector QR' : 'QR-Enabled Stock & Inventory',
      description:
        language === 'pt'
          ? 'Aponte a câmera para registrar entradas e saídas de defensivos e sementes em segundos.'
          : language === 'es'
          ? 'Escanee códigos QR con la cámara del dispositivo para ingresos y egresos inmediatos.'
          : 'Scan QR codes directly with device cameras to check in/out inventory items with low-stock warnings.',
    },
    {
      icon: Users,
      title: language === 'pt' ? 'Ordens de Serviço no Campo' : language === 'es' ? 'Órdenes de Trabajo de Cuadrilla' : 'Field Crew Work Orders',
      description:
        language === 'pt'
          ? 'Distribua tarefas por talhão e acompanhe o maquinário, operando 100% sem sinal de internet.'
          : language === 'es'
          ? 'Asignación de tareas por lote para personal de campo, con funcionamiento 100% offline.'
          : 'Task assignment by field plot, equipment operator dispatch, and real-time status — fully offline.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: language === 'pt' ? 'Cadastre sua Propriedade' : language === 'es' ? 'Conecte su Establecimiento' : 'Connect Your Farm',
      description:
        language === 'pt'
          ? 'Insira piquetes, rebanho, estoque inicial e colaboradores em menos de 20 minutos.'
          : language === 'es'
          ? 'Registre lotes, rodeo, insumos iniciales y personal en menos de 20 minutos.'
          : 'Register acreage, livestock lots, input inventory, and crew members in under 20 minutes.',
    },
    {
      number: '02',
      title: language === 'pt' ? 'Monitore no Campo Offline' : language === 'es' ? 'Opere en el Lote Sin Conexión' : 'Monitor Operations Live',
      description:
        language === 'pt'
          ? 'Use o celular para escanear QR codes, registrar pesagens e vacinas mesmo sem sinal.'
          : language === 'es'
          ? 'Use el teléfono o tableta para escanear QR, pesar animales y aplicar tratamientos sin cobertura.'
          : 'Automated dashboards with live weather radar, futures prices, withdrawal alerts, and camera QR scanning.',
    },
    {
      number: '03',
      title: language === 'pt' ? 'Decida com Dados Precisos' : language === 'es' ? 'Decida con Certeza Financiera' : 'Decide with Confidence',
      description:
        language === 'pt'
          ? 'Relatórios para crédito rural, seguro agrícola e auditorias sanitárias em poucos cliques.'
          : language === 'es'
          ? 'Informes para entidades bancarias, seguros agrícolas y auditorías veterinarias en un clic.'
          : 'Audit-ready reports for agricultural lenders, USDA compliance, crop insurance, and budgeting.',
    },
  ];

  const plans = [
    {
      name: language === 'pt' ? 'Fazenda Starter' : language === 'es' ? 'Starter Campo' : 'Starter Farm',
      price: '$49',
      period: language === 'pt' ? '/mês' : language === 'es' ? '/mes' : '/month',
      description:
        language === 'pt'
          ? 'Ideal para produtores familiares que desejam digitalizar o rebanho e estoque.'
          : language === 'es'
          ? 'Para establecimientos familiares que inician la digitalización rural.'
          : 'For family farms beginning to digitize field records and stock.',
      features: [
        language === 'pt' ? 'Até 200 hectares' : language === 'es' ? 'Hasta 200 hectáreas' : 'Up to 500 acres',
        language === 'pt' ? 'Até 150 cabeças de gado' : language === 'es' ? 'Hasta 150 cabezas' : 'Up to 150 livestock head',
        language === 'pt' ? 'Estoque completo com leitor QR' : language === 'es' ? 'Inventario con lector QR' : 'Core inventory with QR scanning',
        language === 'pt' ? 'Previsão do tempo e cotações' : language === 'es' ? 'Clima y cotizaciones de futuros' : 'Weather forecasts & CME futures',
        language === 'pt' ? 'Modo 100% offline no celular' : language === 'es' ? 'Modo offline en móvil' : 'Offline-first mobile mode',
        language === 'pt' ? '2 usuários inclusos' : language === 'es' ? '2 usuarios incluidos' : '2 user seats',
      ],
      cta: language === 'pt' ? 'Iniciar Teste de 14 Dias' : language === 'es' ? 'Iniciar Prueba Gratuita' : 'Start 14-Day Free Trial',
      highlighted: false,
    },
    {
      name: language === 'pt' ? 'Profissional Agro' : language === 'es' ? 'Profesional Agro' : 'Professional Ag',
      price: '$129',
      period: language === 'pt' ? '/mês' : language === 'es' ? '/mes' : '/month',
      description:
        language === 'pt'
          ? 'Para fazendas comerciais e confinamentos que buscam automação completa.'
          : language === 'es'
          ? 'Para empresas agropecuarias con necesidad de trazabilidad integral.'
          : 'For commercial farms and ranches requiring full operational automation.',
      features: [
        language === 'pt' ? 'Até 1.000 hectares' : language === 'es' ? 'Hasta 1.000 hectáreas' : 'Up to 2,500 acres',
        language === 'pt' ? 'Até 1.000 cabeças de gado' : language === 'es' ? 'Hasta 1.000 cabezas' : 'Up to 1,000 livestock head',
        language === 'pt' ? 'Tudo do plano Starter' : language === 'es' ? 'Todo lo del plan Starter' : 'Everything in Starter Farm',
        language === 'pt' ? 'Controle sanitário de carência' : language === 'es' ? 'Control de períodos de carencia' : 'Complete sanitary withdrawal tracking',
        language === 'pt' ? 'Calculadoras de colheita GDD' : language === 'es' ? 'Calculadora GDD y densidad' : 'Precision GDD & planting density calculators',
        language === 'pt' ? 'Relatórios para crédito rural' : language === 'es' ? 'Reportes bancarios y seguros' : 'Audit-ready lender reports',
        language === 'pt' ? '5 usuários inclusos' : language === 'es' ? '5 usuarios incluidos' : '5 user seats',
      ],
      cta: language === 'pt' ? 'Iniciar Teste de 14 Dias' : language === 'es' ? 'Iniciar Prueba Gratuita' : 'Start 14-Day Free Trial',
      highlighted: true,
    },
    {
      name: language === 'pt' ? 'Corporativo Enterprise' : language === 'es' ? 'Empresarial Custom' : 'Commercial Enterprise',
      price: language === 'pt' ? 'Sob Medida' : language === 'es' ? 'A Medida' : 'Custom',
      period: '',
      description:
        language === 'pt'
          ? 'Para cooperativas, propriedades múltiplas e grandes grupos do agronegócio.'
          : language === 'es'
          ? 'Para cooperativas y grandes grupos agroindustriales.'
          : 'For multi-location agribusinesses, cooperatives, and large estates.',
      features: [
        language === 'pt' ? 'Área e rebanho ilimitados' : language === 'es' ? 'Superficie y rodeo ilimitados' : 'Unlimited acreage & herd size',
        language === 'pt' ? 'Marca própria (White-Label)' : language === 'es' ? 'Marca blanca y dominio propio' : 'White-label branding & custom domain',
        language === 'pt' ? 'Tudo do plano Profissional' : language === 'es' ? 'Todo lo del plan Profesional' : 'Everything in Professional Ag',
        language === 'pt' ? 'Integração ERP e IoT rural' : language === 'es' ? 'Integración API y telemetría' : 'ERP & IoT telemetry API integrations',
        language === 'pt' ? 'Gerente agronômico dedicado' : language === 'es' ? 'Gestor agronómico dedicado' : 'Dedicated agricultural account manager',
        language === 'pt' ? 'Usuários ilimitados' : language === 'es' ? 'Usuarios ilimitados' : 'Unlimited user seats',
      ],
      cta: language === 'pt' ? 'Falar com Consultor' : language === 'es' ? 'Contactar Asesor' : 'Contact Sales',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: language === 'pt' ? 'O aplicativo funciona sem sinal de internet na fazenda?' : language === 'es' ? '¿El sistema funciona sin señal de internet en el campo?' : 'Does AgroTech require internet connection in the field?',
      a: language === 'pt'
        ? 'Sim! O AgroTech é 100% offline-first. Você pode registrar pesagens, vacinas e movimentações com a câmera QR no pasto. Os dados ficam salvos no aparelho e sincronizam automaticamente ao reconectar.'
        : language === 'es'
        ? '¡Sí! AgroTech fue concebido como offline-first. Puede registrar pesadas, tratamientos veterinarios y movimientos QR en lotes remotos. Todo se sincroniza en cuanto recupera señal.'
        : 'No. AgroTech is built offline-first. You can record livestock treatments, scan stock QR codes, and log work orders in remote pastures. Everything synchronizes automatically once connection returns.',
    },
    {
      q: language === 'pt' ? 'Posso instalar no meu celular como um aplicativo?' : language === 'es' ? '¿Se puede instalar en el móvil como una app nativa?' : 'Can I install it on my phone like a native mobile app?',
      a: language === 'pt'
        ? 'Sim. Como Progressive Web App (PWA), você pode clicar em "Instalar App" no topo da página ou adicionar à tela inicial no iPhone/Android, obtendo acesso direto na tela do seu aparelho.'
        : language === 'es'
        ? 'Sí. Al ser una PWA oficial, puede pulsar "Instalar App" o añadirla a la pantalla de inicio en Android o iOS, accediendo con un toque desde su teléfono.'
        : 'Yes. As a Progressive Web App, you can click "Install App" or add it to your home screen on iOS and Android with full camera QR scanning capabilities.',
    },
    {
      q: language === 'pt' ? 'Posso importar meus dados atuais do Excel ou planilhas?' : language === 'es' ? '¿Puedo importar mis datos desde planillas Excel o CSV?' : 'Can I import existing data from Excel or CSV files?',
      a: language === 'pt'
        ? 'Sim. Oferecemos suporte para importação em massa de cadastro de brincos, insumos e lotes agrícolas através de arquivos CSV padrão.'
        : language === 'es'
        ? 'Sí. Es posible importar registros de caravanas, catálogo de agroquímicos y coordenadas de lotes mediante planillas estándar CSV.'
        : 'Yes. You can import cattle tag records, inventory item catalogs, and field coordinates via standard CSV files.',
    },
    {
      q: language === 'pt' ? 'Existe período de teste gratuito?' : language === 'es' ? '¿Hay período de prueba sin compromiso?' : 'Is there a free trial period?',
      a: language === 'pt'
        ? 'Sim. Você conta com 14 dias de teste completo sem necessidade de cartão de crédito. É possível testar todas as funcionalidades na prática.'
        : language === 'es'
        ? 'Sí. Cuenta con 14 días de acceso completo sin requerir tarjeta de crédito. Puede probar todos los módulos con sus datos.'
        : 'Yes. All plans include 14 days of full access without upfront credit card requirements. Test every module in real conditions.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-300">
      {/* NAVIGATION BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer shrink-0"
              onClick={() => (user ? navigate('/dashboard') : scrollTo('hero'))}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                <Sprout size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">
                AGRO<span className="text-stone-900 dark:text-white">TECH</span>
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
              <button onClick={() => scrollTo('benefits')} className="hover:text-primary transition-colors cursor-pointer">
                {content.navFeatures}
              </button>
              <button onClick={() => scrollTo('how-it-works')} className="hover:text-primary transition-colors cursor-pointer">
                {content.navHow}
              </button>
              <button onClick={() => scrollTo('pricing')} className="hover:text-primary transition-colors cursor-pointer">
                {content.navPricing}
              </button>
              <button onClick={() => scrollTo('faq')} className="hover:text-primary transition-colors cursor-pointer">
                {content.navFaq}
              </button>
            </nav>

            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              {/* Language Switcher */}
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLanguage(item.code)}
                    className={`px-2 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                      language === item.code
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <ThemeToggle />

              <PWAInstallButton variant="outline" />

              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{content.btnLaunch}</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {content.btnSignIn}
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer"
                  >
                    {content.btnStart}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                <button onClick={() => scrollTo('benefits')} className="p-2.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-left">
                  {content.navFeatures}
                </button>
                <button onClick={() => scrollTo('how-it-works')} className="p-2.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-left">
                  {content.navHow}
                </button>
                <button onClick={() => scrollTo('pricing')} className="p-2.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-left">
                  {content.navPricing}
                </button>
                <button onClick={() => scrollTo('faq')} className="p-2.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl text-left">
                  {content.navFaq}
                </button>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-1">
                    {languages.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => setLanguage(item.code)}
                        className={`px-2 py-1 text-xs font-bold rounded-lg ${
                          language === item.code ? 'bg-primary text-white' : 'text-stone-500'
                        }`}
                      >
                        {item.flag} {item.label}
                      </button>
                    ))}
                  </div>
                  <ThemeToggle />
                </div>

                <div className="pt-2">
                  <PWAInstallButton className="w-full justify-center" />
                </div>

                <button
                  onClick={() => navigate(user ? '/dashboard' : '/login')}
                  className="p-3 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-xl text-center mt-2 cursor-pointer shadow-md"
                >
                  {user ? content.btnLaunch : content.btnStart}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold rounded-full mb-6 border border-primary/20">
              <Smartphone size={14} />
              {content.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-stone-900 dark:text-white">
              {content.heroTitlePrefix}
              <span className="text-primary">{content.heroTitleHighlight}</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
              {content.heroDesc}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                className="px-8 py-4 text-sm sm:text-base font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
              >
                <span>{user ? content.btnLaunch : content.btnStart}</span>
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => scrollTo('benefits')}
                className="px-8 py-4 text-sm sm:text-base font-semibold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-2xl transition-colors w-full sm:w-auto justify-center flex items-center gap-2 cursor-pointer"
              >
                <span>{content.btnModules}</span>
                <ChevronDown size={16} />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-primary" /> {content.proofNoContract}</span>
              <span className="flex items-center gap-1.5"><Wifi size={14} className="text-primary" /> {content.proofOffline}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {content.proofSetup}</span>
            </div>
          </div>

          {/* Operational Preview Banner */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden transition-colors">
              <div className="flex items-center justify-between px-6 py-4 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-stone-500 dark:text-stone-400 font-mono">agrotech.app/dashboard</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Offline-Ready Sync
                </span>
              </div>
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-5 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">
                    <CloudSun size={16} className="text-blue-500" />
                    Radar & Alertas
                  </div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-white">26°C · 64%</div>
                  <div className="text-xs text-stone-500 mt-1">Previsão sem geada nas próximas 48h</div>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-5 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">
                    <TrendingUp size={16} className="text-emerald-500" />
                    Boi Gordo & Grãos
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">$188.50 /cwt</div>
                  <div className="text-xs text-emerald-600 mt-1">▲ +1.2% cotações em tempo real</div>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-5 border border-stone-200/60 dark:border-stone-700/60">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">
                    <FlaskConical size={16} className="text-orange-500" />
                    Manejo Sanitário
                  </div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-white">100% Regular</div>
                  <div className="text-xs text-stone-500 mt-1">Nenhum lote com carência vencida</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-12 border-y border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">850+</div>
              <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">{content.statsFarms}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">42,000+</div>
              <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">{content.statsAnimals}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">180,000+</div>
              <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">{content.statsAcres}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">99.2%</div>
              <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">{content.statsRetention}</div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULES / BENEFITS */}
      <section id="benefits" className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              {content.modulesTitle}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-400">
              {content.modulesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <benefit.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">{benefit.title}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 bg-stone-100/50 dark:bg-stone-900/30 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              {content.howTitle}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-400">
              {content.howSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                viewport={{ once: true }}
                className="text-center bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs"
              >
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto shadow-lg shadow-primary/20">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-6 mb-3">{step.title}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="px-8 py-4 text-sm sm:text-base font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 cursor-pointer"
            >
              {user ? content.btnLaunch : content.btnStart}
            </button>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              {content.pricingTitle}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-400">
              {content.pricingSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className={`rounded-3xl border-2 p-8 flex flex-col justify-between ${
                  plan.highlighted
                    ? 'border-primary bg-white dark:bg-stone-900 shadow-xl shadow-primary/10 scale-105'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs'
                }`}
              >
                <div>
                  {plan.highlighted && (
                    <div className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block w-fit mb-4">
                      {language === 'pt' ? 'MAIS ESCOLHIDO' : language === 'es' ? 'MÁS POPULAR' : 'MOST POPULAR'}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-stone-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">{plan.description}</p>

                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-extrabold text-stone-900 dark:text-white">{plan.price}</span>
                    {plan.period && <span className="text-stone-400 text-sm ml-1">{plan.period}</span>}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                        <Check size={16} className="text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${
                    plan.highlighted
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 flex items-center justify-center gap-2">
              <Shield size={14} className="text-primary" />
              {language === 'pt'
                ? 'Garantia total de 14 dias sem compromisso. Cancele diretamente no painel.'
                : language === 'es'
                ? 'Prueba de 14 días sin permanencia. Cancele en cualquier momento.'
                : 'Full 14-day free access. No credit card required upfront. Cancel anytime.'}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 sm:py-28 px-4 bg-stone-100/50 dark:bg-stone-900/30 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              {content.faqTitle}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-400">
              {content.faqSubtitle}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-900 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-stone-900 dark:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-stone-400 transition-transform duration-200 shrink-0 ml-2 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed border-t border-stone-100 dark:border-stone-800/50 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 px-4 bg-stone-900 dark:bg-stone-950 text-white border-t border-stone-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {content.finalTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-stone-400 leading-relaxed">
            {content.finalDesc}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="px-8 py-4 text-sm sm:text-base font-bold text-stone-900 bg-white hover:bg-stone-100 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
            >
              <span>{user ? content.btnLaunch : content.finalBtnPrimary}</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-sm sm:text-base font-semibold text-white border border-stone-700 hover:border-stone-500 rounded-2xl transition-colors w-full sm:w-auto justify-center flex items-center gap-2 cursor-pointer"
            >
              <span>{content.finalBtnDemo}</span>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-stone-500">
            <span className="flex items-center gap-1.5"><Shield size={14} /> {content.proofNoContract}</span>
            <span className="flex items-center gap-1.5"><ScrollText size={14} /> {content.proofOffline}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {content.proofSetup}</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 bg-stone-950 text-stone-400 border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-white mb-4">
                <Sprout size={22} className="text-primary" />
                <span className="text-lg font-bold tracking-tight">
                  AGRO<span className="text-primary">TECH</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === 'pt'
                  ? 'Gestão de fazendas, pecuária de precisão e controle sanitário offline-first para o agronegócio moderno.'
                  : language === 'es'
                  ? 'Gestión integral agropecuaria y trazabilidad sanitaria offline para el campo moderno.'
                  : 'Precision farm management, sanitary monitoring, and inventory tracking for commercial agricultural operators.'}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-4">{content.navFeatures}</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => scrollTo('benefits')} className="hover:text-white transition-colors cursor-pointer">{content.navFeatures}</button></li>
                <li><button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors cursor-pointer">{content.navPricing}</button></li>
                <li><button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors cursor-pointer">{content.navHow}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-4">PWA & Offline</h4>
              <ul className="space-y-2 text-xs">
                <li><PWAInstallButton variant="compact" /></li>
                <li><span className="text-stone-500">Service Worker Active</span></li>
                <li><span className="text-stone-500">Offline-Ready Sync</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-4">AgroTech Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors cursor-pointer">{content.btnSignIn}</button></li>
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer">{content.btnLaunch}</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-800 text-xs text-stone-600 text-center">
            &copy; {new Date().getFullYear()} AgroTech Management Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
