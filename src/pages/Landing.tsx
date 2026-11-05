import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const benefits = [
  {
    icon: BarChart3,
    title: 'Unified Ag Dashboard',
    description: 'Every ranch and farm operation in one single command center. From seeds and fertilizer to livestock sales, without messy spreadsheets.',
  },
  {
    icon: CloudSun,
    title: 'Real-Time Climate & CME Futures',
    description: 'Frost alerts, moisture stress metrics, and live Chicago Mercantile Exchange commodity tickers integrated directly into operations.',
  },
  {
    icon: FlaskConical,
    title: 'Veterinary Health & Withholding',
    description: 'Automated vaccine protocols, withdrawal period tracking for meat and dairy, and digital ear tag scanning.',
  },
  {
    icon: Tractor,
    title: 'Precision Crop Management',
    description: 'Field boundary mapping, Growing Degree Day (GDD) calculations, planting density calibrations, and plot yield history.',
  },
  {
    icon: Warehouse,
    title: 'QR-Enabled Stock & Inventory',
    description: 'Scan QR codes directly with device cameras to check in/out inventory items, with low-stock warnings and restock intelligence.',
  },
  {
    icon: Users,
    title: 'Field Crew Work Orders',
    description: 'Task assignment by field plot, equipment operator dispatch, and real-time operational status — fully functional offline.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Connect Your Farm',
    description: 'Register acreage, livestock lots, input inventory, and crew members in under 20 minutes with our quick onboarding wizard.',
  },
  {
    number: '02',
    title: 'Monitor Operations Live',
    description: 'Automated dashboards with live weather radar, futures prices, withdrawal alerts, and QR camera scanning on mobile or tablet.',
  },
  {
    number: '03',
    title: 'Decide with Confidence',
    description: 'Audit-ready reports for agricultural lenders, USDA compliance, crop insurance claims, and next season budgeting.',
  },
]

const testimonials = [
  {
    name: 'Charles Miller',
    farm: 'Heartland Valley Farms, IA',
    text: 'We reduced crop frost losses by 40% thanks to proactive temperature alerts. AgroTech has become indispensable for our 3,200 acres.',
    rating: 5,
  },
  {
    name: 'Sarah Jenkins',
    farm: 'Black Angus Cattle Co., NE',
    text: 'Replacing fragmented spreadsheets with the camera QR scanner saved our ranch hands over 10 hours a week on inventory checkouts.',
    rating: 5,
  },
  {
    name: 'Robert Vance',
    farm: 'Vance Prairie Agronomy, IL',
    text: 'The veterinary withdrawal countdown ensured 100% compliance during dairy shipments. Never had an antibiotic residue issue since.',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    farm: 'Pine Creek Grain & Cattle, KS',
    text: 'Audit reports were ready for our agricultural bank lender in two clicks. Secured our operating credit line 3 weeks faster than last year.',
    rating: 5,
  },
]

const faqs = [
  {
    q: 'Does AgroTech require internet connection in the field?',
    a: 'No. AgroTech is built offline-first. You can record livestock treatments, scan stock QR codes, and log work orders in remote pastures. Everything synchronizes automatically once connection returns.',
  },
  {
    q: 'Is it suitable for family farms and mid-size operations?',
    a: 'Yes. The Starter plan covers operations up to 500 acres and 150 livestock head. As your acreage expands, your plan scales smoothly with you.',
  },
  {
    q: 'Can I import existing data from Excel or CSV files?',
    a: 'Yes. You can import cattle tag records, inventory item catalogs, and field coordinates via standard CSV files or use our bulk import assistant.',
  },
  {
    q: 'Is there a native mobile app or tablet support?',
    a: 'AgroTech is a responsive Progressive Web App that runs flawlessly on iOS, Android, tablets, and ruggedized field devices with full camera QR scanning capabilities.',
  },
  {
    q: 'What payment methods and gateways are supported?',
    a: 'We support Stripe, major credit cards, ACH bank transfers, and custom enterprise invoicing with flexible monthly or annual billing.',
  },
  {
    q: 'Can I cancel anytime without long-term contracts?',
    a: 'Yes. All plans are month-to-month with no lock-in. If you cancel within the first 14 days, you receive a full 100% refund.',
  },
]

const plans = [
  {
    name: 'Starter Farm',
    price: '$49',
    period: '/month',
    description: 'For family farms beginning to digitize field records and stock.',
    features: [
      'Up to 500 acres',
      'Up to 150 livestock head',
      'Core inventory with QR scanning',
      'Weather forecasts & CME futures',
      'Offline-first mobile mode',
      'Email & community support',
      '2 user seats',
    ],
    cta: 'Start 14-Day Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional Ag',
    price: '$129',
    period: '/month',
    description: 'For commercial farms and ranches requiring full operational automation.',
    features: [
      'Up to 2,500 acres',
      'Up to 1,000 livestock head',
      'Everything in Starter Farm',
      'Complete sanitary withdrawal tracking',
      'Precision GDD & planting density calculators',
      'Audit-ready lender reports',
      '5 user seats',
      'Priority agronomist support',
    ],
    cta: 'Start 14-Day Free Trial',
    highlighted: true,
  },
  {
    name: 'Commercial Enterprise',
    price: 'Custom',
    period: '',
    description: 'For multi-location agribusinesses, cooperatives, and large estates.',
    features: [
      'Unlimited acreage & herd size',
      'White-label branding & custom domain',
      'Everything in Professional Ag',
      'ERP & IoT telemetry API integrations',
      'Dedicated agricultural account manager',
      'Unlimited user seats',
      'On-site crew training',
      'Custom SLA guarantees',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const navigate = useNavigate()

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans">
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Sprout className="text-primary" size={28} />
              <span className="text-xl font-bold tracking-tight">
                AGRO<span className="text-stone-900">TECH</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
              <button onClick={() => scrollTo('benefits')} className="hover:text-primary transition-colors cursor-pointer">Features</button>
              <button onClick={() => scrollTo('how-it-works')} className="hover:text-primary transition-colors cursor-pointer">How It Works</button>
              <button onClick={() => scrollTo('pricing')} className="hover:text-primary transition-colors cursor-pointer">Pricing</button>
              <button onClick={() => scrollTo('faq')} className="hover:text-primary transition-colors cursor-pointer">FAQ</button>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 cursor-pointer"
              >
                Start Free Trial
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-stone-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-2">
                <button onClick={() => scrollTo('benefits')} className="p-3 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-xl text-left">Features</button>
                <button onClick={() => scrollTo('how-it-works')} className="p-3 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-xl text-left">How It Works</button>
                <button onClick={() => scrollTo('pricing')} className="p-3 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-xl text-left">Pricing</button>
                <button onClick={() => scrollTo('faq')} className="p-3 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-xl text-left">FAQ</button>
                <hr className="my-2 border-stone-100" />
                <button onClick={() => navigate('/login')} className="p-3 text-sm font-medium text-stone-600 hover:bg-stone-50 rounded-xl text-left">Sign In</button>
                <button
                  onClick={() => navigate('/login')}
                  className="p-3 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl text-center mt-2"
                >
                  Start Free Trial
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-light text-primary text-xs font-bold rounded-full mb-6">
              <Smartphone size={14} />
              Enterprise Edition 2026 — 14-Day Free Access
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-stone-900">
              Your farm under total command.{' '}
              <span className="text-primary">Not guesswork.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
              Eliminate lost paper logs, delayed weather alerts, and reactive livestock treatments.
              AgroTech brings CME commodity tickers, veterinary withholding, QR inventory, and field crew tasks into one unified offline-ready hub.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" id="hero-cta">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 text-base font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
              >
                Launch Live App
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => scrollTo('benefits')}
                className="px-8 py-4 text-base font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-2xl transition-colors w-full sm:w-auto justify-center flex items-center gap-2 cursor-pointer"
              >
                Explore Modules
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-400">
              <span className="flex items-center gap-1.5"><Shield size={14} /> No Lock-in Contract</span>
              <span className="flex items-center gap-1.5"><Wifi size={14} /> 100% Offline Capable</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> Ready in 20 Minutes</span>
            </div>
          </div>

          {/* Dashboard Preview Mockup */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-stone-50 border border-stone-200 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 bg-stone-100 border-b border-stone-200">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-stone-400 font-mono">portal.heartland-ag.com/dashboard</span>
              </div>
              <div className="p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-3"><BarChart3 size={14} /> Weather Radar</div>
                  <div className="text-2xl font-bold text-stone-900">78°F</div>
                  <div className="text-xs text-stone-400 mt-1">Humidity 62% · Wind 8 mph</div>
                  <div className="mt-3 h-2 w-full bg-amber-100 rounded-full"><div className="h-2 w-3/4 bg-amber-500 rounded-full" /></div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-3"><TrendingUp size={14} /> CME Live Cattle</div>
                  <div className="text-2xl font-bold text-green-600">$188.40/cwt</div>
                  <div className="text-xs text-green-500 mt-1">▲ +1.2% today</div>
                  <div className="mt-3 h-2 w-full bg-green-100 rounded-full"><div className="h-2 w-4/5 bg-green-500 rounded-full" /></div>
                </div>
                <div className="bg-white rounded-xl p-5 border border-stone-100 shadow-xs">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-3"><FlaskConical size={14} /> Veterinary Protocols</div>
                  <div className="text-2xl font-bold text-stone-900">3 Active Alerts</div>
                  <div className="text-xs text-amber-500 mt-1">2 withdrawal periods active</div>
                  <div className="mt-3 h-2 w-full bg-amber-100 rounded-full"><div className="h-2 w-1/4 bg-red-500 rounded-full" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / STATS */}
      <section className="py-12 border-y border-stone-100 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">850+</div>
              <div className="text-sm text-stone-500 mt-1">Commercial Farms Enrolled</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">42,000+</div>
              <div className="text-sm text-stone-500 mt-1">Livestock Head Monitored</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">180,000+</div>
              <div className="text-sm text-stone-500 mt-1">Acres Actively Managed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-primary">98.4%</div>
              <div className="text-sm text-stone-500 mt-1">Client Retention Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Everything Your Agricultural Enterprise Requires
            </h2>
            <p className="mt-4 text-lg text-stone-500">
              Six synchronized modules designed specifically for real-world farming and ranching operations.
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
                className="bg-white border border-stone-100 rounded-2xl p-6 hover:shadow-lg hover:border-stone-200 transition-all"
              >
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary mb-4">
                  <benefit.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{benefit.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 bg-stone-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Up and Running in Under 20 Minutes
            </h2>
            <p className="mt-4 text-lg text-stone-500">
              No protracted software implementation. No complex IT consulting. Built for direct field deployment.
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
                className="text-center"
              >
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto shadow-lg shadow-primary/20">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mt-6 mb-3">{step.title}</h3>
                <p className="text-stone-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-base font-bold text-white bg-primary hover:bg-primary-hover rounded-2xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-95 cursor-pointer"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Trusted by Leading Growers & Ranchers
            </h2>
            <p className="mt-4 text-lg text-stone-500">
              Real farm operators across the Heartland share their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white border border-stone-100 rounded-2xl p-6 shadow-xs"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-bold text-sm text-stone-900">{t.name}</div>
                  <div className="text-xs text-stone-400">{t.farm}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 sm:py-28 px-4 bg-stone-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Transparent Plans That Grow with Your Operation
            </h2>
            <p className="mt-4 text-lg text-stone-500">
              Predictable pricing from single family parcels to multi-state cattle operations.
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
                className={`rounded-2xl border-2 p-8 flex flex-col ${
                  plan.highlighted
                    ? 'border-primary bg-white shadow-xl shadow-primary/10 scale-105'
                    : 'border-stone-100 bg-white shadow-xs'
                }`}
              >
                {plan.highlighted && (
                  <div className="text-xs font-bold text-primary bg-primary-light px-3 py-1 rounded-full inline-block w-fit mb-4">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-stone-900">{plan.name}</h3>
                <p className="text-sm text-stone-500 mt-1">{plan.description}</p>

                <div className="mt-6 mb-8">
                  <span className="text-4xl font-extrabold text-stone-900">{plan.price}</span>
                  {plan.period && <span className="text-stone-400 text-sm ml-1">{plan.period}</span>}
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-stone-600">
                      <Check size={18} className="text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/login')}
                  className={`mt-8 w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer ${
                    plan.highlighted
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-stone-400 flex items-center justify-center gap-2">
              <Shield size={14} /> Full 14-day free access. No credit card required upfront. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-stone-500">
              Clear answers to technical, operational, and commercial questions.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-stone-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  {faq.q}
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
                      <p className="px-5 pb-5 text-sm text-stone-500 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 px-4 bg-stone-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your Farm Deserves Management Built for Modern Agriculture
          </h2>
          <p className="mt-4 text-lg text-stone-400">
            Join 850+ forward-thinking producers who traded paper notebooks for data-driven precision.
            Test the system free for 14 days.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-base font-bold text-stone-900 bg-white hover:bg-stone-100 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center cursor-pointer"
            >
              Start Your Free Trial
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-base font-semibold text-white border-2 border-stone-600 hover:border-stone-400 rounded-2xl transition-colors w-full sm:w-auto justify-center flex items-center gap-2 cursor-pointer"
            >
              Access Demo Workspace
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500">
            <span className="flex items-center gap-1.5"><Shield size={14} /> No Long-Term Commitment</span>
            <span className="flex items-center gap-1.5"><ScrollText size={14} /> Instant Access</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> Cancel Anytime in App</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 bg-stone-950 text-stone-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-white mb-4">
                <Sprout size={22} />
                <span className="text-lg font-bold tracking-tight">
                  AGRO<span className="text-stone-300">TECH</span>
                </span>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">
                Precision farm management, sanitary monitoring, and inventory tracking for commercial agricultural operators.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollTo('benefits')} className="hover:text-white transition-colors cursor-pointer">Features</button></li>
                <li><button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing</button></li>
                <li><button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors cursor-pointer">How It Works</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Agronomy Blog</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Contact & Support</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-4">Legal & Privacy</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Data Security</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-800 text-xs text-stone-600 text-center">
            &copy; {new Date().getFullYear()} AgroTech Management Systems. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
