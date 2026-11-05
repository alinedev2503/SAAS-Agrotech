import React, { useState, useEffect } from 'react';
import { User, MapPin, Upload, Palette, Save, Building, Phone, Mail, ShieldCheck, Moon, Sun, Globe, Languages, Server, Link, Type, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: 'John Miller',
    role: 'General Operations Manager',
    email: 'john.miller@heartland-ag.com',
    phone: '(515) 555-0198',
    farmName: 'Heartland Agricultural Operations',
    farmSize: '3,200 acres',
    location: 'Ames, Story County, Iowa',
    primaryColor: '#ea580c', // orange-600
    secondaryColor: '#4f46e5', // indigo-600
    logo: null as string | null,
    favicon: null as string | null,
    loginBackground: null as string | null,
    customDomain: 'portal.heartland-ag.com',
    appTitle: 'Heartland AgroTech Management',
    supportEmail: 'support@heartland-ag.com',
    termsUrl: 'https://heartland-ag.com/terms',
    privacyUrl: 'https://heartland-ag.com/privacy',
    smtpHost: 'smtp.office365.com',
    smtpPort: '587',
    smtpUser: 'notifications@heartland-ag.com',
    smtpSenderName: 'Heartland AgroTech Notifications',
    smtpReplyTo: 'no-reply@heartland-ag.com',
    logoDark: null as string | null,
    footerText: '© 2026 Heartland Agricultural Operations. Powered by AgroTech Cloud.',
    domainStatus: 'verified' as 'verified' | 'pending' | 'error',
    // Payment Gateways
    stripeEnabled: true,
    stripePublicKey: 'pk_live_51M0demo...',
    stripeSecretKey: '••••••••••••••••••••••••',
    mercadoPagoEnabled: false,
    mercadoPagoPublicKey: '',
    mercadoPagoAccessToken: '',
    asaasEnabled: false,
    asaasApiKey: '',
    asaasWalletId: ''
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'es' | 'pt'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Check system preference or previous state
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    // Load saved primary color
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
      setFormData(prev => ({ ...prev, primaryColor: savedColor }));
    }

    // Load saved payment settings
    const savedPaymentSettings = localStorage.getItem('paymentSettings');
    if (savedPaymentSettings) {
      try {
        const parsedSettings = JSON.parse(savedPaymentSettings);
        setFormData(prev => ({ ...prev, ...parsedSettings }));
      } catch (e) {
        console.error('Error loading payment settings', e);
      }
    }
  }, []);

  const updatePrimaryColor = (color: string) => {
    setFormData({ ...formData, primaryColor: color });
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--primary-hover', color);
    document.documentElement.style.setProperty('--primary-light', color + '20');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('primaryColor', formData.primaryColor);
      
      // Save payment settings
      const paymentSettings = {
        stripeEnabled: formData.stripeEnabled,
        stripePublicKey: formData.stripePublicKey,
        stripeSecretKey: formData.stripeSecretKey,
        mercadoPagoEnabled: formData.mercadoPagoEnabled,
        mercadoPagoPublicKey: formData.mercadoPagoPublicKey,
        mercadoPagoAccessToken: formData.mercadoPagoAccessToken,
        asaasEnabled: formData.asaasEnabled,
        asaasApiKey: formData.asaasApiKey,
        asaasWalletId: formData.asaasWalletId
      };
      localStorage.setItem('paymentSettings', JSON.stringify(paymentSettings));

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }, 1000);
  };

  const handleFileUpload = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Organization & White-Label Settings</h2>
        <p className="text-stone-500 dark:text-stone-400">Manage administrator credentials, farm profile, custom branding, and billing gateways.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Personal & Farm Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Info Card */}
          <section className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xs border border-stone-200 dark:border-stone-800 transition-colors">
            <div className="flex items-center gap-3 mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg text-stone-600 dark:text-stone-300">
                <User size={24} />
              </div>
              <h3 className="font-bold text-xl text-stone-800 dark:text-white">Farm Administrator Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Operational Role</label>
                <div className="relative">
                  <ShieldCheck size={18} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full pl-10 p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Corporate Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Phone / Mobile</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Farm Info Card */}
          <section className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xs border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3 mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg text-stone-600 dark:text-stone-300">
                <Building size={24} />
              </div>
              <h3 className="font-bold text-xl text-stone-800 dark:text-white">Ranch & Acreage Overview</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Farm / Agribusiness Name</label>
                <input 
                  type="text" 
                  value={formData.farmName}
                  onChange={(e) => setFormData({...formData, farmName: e.target.value})}
                  className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Total Acreage</label>
                <input 
                  type="text" 
                  value={formData.farmSize}
                  onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
                  className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Headquarters Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-10 p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* White-Label Advanced Settings */}
          <section className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xs border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3 mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Server size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-stone-800 dark:text-white">White-Label Infrastructure</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Custom enterprise domain, branding endpoints, and transactional SMTP.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Custom Domain */}
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Custom Domain (CNAME Alias)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link size={18} className="absolute left-3 top-3 text-stone-400" />
                    <input 
                      type="text" 
                      value={formData.customDomain}
                      onChange={(e) => setFormData({...formData, customDomain: e.target.value})}
                      className="w-full pl-10 p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                    />
                  </div>
                  <div className={`flex items-center gap-2 px-4 rounded-xl border ${
                    formData.domainStatus === 'verified' 
                      ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                      : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  }`}>
                    {formData.domainStatus === 'verified' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span className="text-sm font-bold hidden sm:inline">
                      {formData.domainStatus === 'verified' ? 'Verified' : 'Pending DNS'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                  Point your DNS CNAME record to <code className="bg-stone-100 dark:bg-stone-800 px-1 py-0.5 rounded text-stone-700 dark:text-stone-300 font-mono">cname.agrotechcloud.io</code>
                </p>
              </div>

              {/* App Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Application Title</label>
                  <input 
                    type="text" 
                    value={formData.appTitle}
                    onChange={(e) => setFormData({...formData, appTitle: e.target.value})}
                    className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Support Email Desk</label>
                  <input 
                    type="email" 
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                    className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Legal URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Terms of Service URL</label>
                  <input 
                    type="url" 
                    value={formData.termsUrl}
                    onChange={(e) => setFormData({...formData, termsUrl: e.target.value})}
                    className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Privacy Policy URL</label>
                  <input 
                    type="url" 
                    value={formData.privacyUrl}
                    onChange={(e) => setFormData({...formData, privacyUrl: e.target.value})}
                    className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-xs"
                  />
                </div>
              </div>

              {/* SMTP Settings */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                <h4 className="font-bold text-stone-800 dark:text-white mb-3">SMTP Dispatch Server</h4>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Host Server</label>
                    <input 
                      type="text" 
                      value={formData.smtpHost}
                      onChange={(e) => setFormData({...formData, smtpHost: e.target.value})}
                      placeholder="smtp.example.com"
                      className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Port</label>
                    <input 
                      type="text" 
                      value={formData.smtpPort}
                      onChange={(e) => setFormData({...formData, smtpPort: e.target.value})}
                      placeholder="587"
                      className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                    />
                  </div>
                  <div className="md:col-span-12">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">SMTP Username</label>
                    <input 
                      type="text" 
                      value={formData.smtpUser}
                      onChange={(e) => setFormData({...formData, smtpUser: e.target.value})}
                      className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Sender Display Name</label>
                    <input 
                      type="text" 
                      value={formData.smtpSenderName}
                      onChange={(e) => setFormData({...formData, smtpSenderName: e.target.value})}
                      className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Reply-To Address</label>
                    <input 
                      type="email" 
                      value={formData.smtpReplyTo}
                      onChange={(e) => setFormData({...formData, smtpReplyTo: e.target.value})}
                      className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Footer Copyright Notice</label>
                <div className="relative">
                  <Type size={18} className="absolute left-3 top-3 text-stone-400" />
                  <input 
                    type="text" 
                    value={formData.footerText}
                    onChange={(e) => setFormData({...formData, footerText: e.target.value})}
                    className="w-full pl-10 p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Payment Settings */}
          <section className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xs border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3 mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                <CreditCard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-stone-800 dark:text-white">Commercial Payment Gateways</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Configure subscriber billing, harvest sales, and client invoicing.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Stripe */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-4 transition-all hover:border-green-300 dark:hover:border-green-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-lg text-stone-800 dark:text-white flex items-center gap-2">
                      <span className="text-[#635BFF] font-extrabold tracking-wide">stripe</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono">Credit Card / ACH Wire</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.stripeEnabled} 
                      onChange={(e) => setFormData({...formData, stripeEnabled: e.target.checked})} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
                {formData.stripeEnabled && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Stripe Publishable Key</label>
                      <input 
                        type="text" 
                        value={formData.stripePublicKey}
                        onChange={(e) => setFormData({...formData, stripePublicKey: e.target.value})}
                        className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                        placeholder="pk_live_..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Stripe Secret Key</label>
                      <input 
                        type="password" 
                        value={formData.stripeSecretKey}
                        onChange={(e) => setFormData({...formData, stripeSecretKey: e.target.value})}
                        className="w-full p-2.5 border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                        placeholder="sk_live_..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: White-Label Branding & Settings */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* System Preferences */}
          <section className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xs border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3 mb-6 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg text-stone-600 dark:text-stone-300">
                <Globe size={24} />
              </div>
              <h3 className="font-bold text-xl text-stone-800 dark:text-white">Display & Theme</h3>
            </div>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-orange-100 text-orange-600'}`}>
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 dark:text-white">Dark Theme</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{theme === 'dark' ? 'Active' : 'Disabled'}</p>
                  </div>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${theme === 'dark' ? 'bg-indigo-600' : 'bg-stone-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Language Selector */}
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
                  <Languages size={16} /> Regional Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'en', label: 'English', flag: '🇺🇸' },
                    { code: 'es', label: 'Español', flag: '🇲🇽' },
                    { code: 'pt', label: 'Português', flag: '🇧🇷' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        language === lang.code 
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' 
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="text-xs font-bold">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white p-6 rounded-2xl shadow-xs border border-stone-200 dark:border-stone-800 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6 border-b border-stone-200 dark:border-stone-700 pb-4">
              <div className="bg-stone-100 dark:bg-stone-800 p-2 rounded-lg text-orange-600 dark:text-orange-500">
                <Palette size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl">Visual Branding</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">White-Label Customization</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Logo Uploads */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Logo (Light Mode)</label>
                  <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-4 text-center hover:border-orange-500 transition-colors cursor-pointer relative group h-32 flex items-center justify-center">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload('logo')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo Light" className="h-16 mx-auto object-contain" />
                    ) : (
                      <div className="flex flex-col items-center text-stone-500 dark:text-stone-400 group-hover:text-orange-500 dark:group-hover:text-orange-400">
                        <Upload size={24} className="mb-2" />
                        <span className="text-xs">Upload Light Logo</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Logo (Dark Mode)</label>
                  <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-4 text-center hover:border-orange-500 transition-colors cursor-pointer relative group h-32 flex items-center justify-center bg-stone-900">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload('logoDark')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formData.logoDark ? (
                      <img src={formData.logoDark} alt="Logo Dark" className="h-16 mx-auto object-contain" />
                    ) : (
                      <div className="flex flex-col items-center text-stone-500 dark:text-stone-400 group-hover:text-orange-500 dark:group-hover:text-orange-400">
                        <Upload size={24} className="mb-2" />
                        <span className="text-xs">Upload Dark Logo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Favicon & Login Background */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Favicon Icon</label>
                  <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-4 text-center hover:border-orange-500 transition-colors cursor-pointer relative group h-32 flex items-center justify-center">
                    <input 
                      type="file" 
                      accept="image/x-icon,image/png"
                      onChange={handleFileUpload('favicon')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formData.favicon ? (
                      <img src={formData.favicon} alt="Favicon" className="h-8 w-8 object-contain" />
                    ) : (
                      <span className="text-xs text-stone-500">Upload .ICO or PNG</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Login Hero Wall</label>
                  <div className="border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-xl p-4 text-center hover:border-orange-500 transition-colors cursor-pointer relative group h-32 flex items-center justify-center overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload('loginBackground')}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {formData.loginBackground ? (
                      <img src={formData.loginBackground} alt="Login Bg" className="w-full h-full object-cover opacity-50" />
                    ) : (
                      <span className="text-xs text-stone-500">Upload Image</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Theme Palette</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-stone-500 mb-1">Primary Color</p>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={formData.primaryColor}
                        onChange={(e) => updatePrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-none p-0"
                      />
                      <span className="text-stone-600 dark:text-stone-400 font-mono text-sm">{formData.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 mb-1">Secondary Color</p>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                        className="w-10 h-10 rounded-lg cursor-pointer border-none p-0"
                      />
                      <span className="text-stone-600 dark:text-stone-400 font-mono text-sm">{formData.secondaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Button */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">Live UI Preview:</p>
                <div className="flex gap-2">
                  <button 
                    className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all"
                    style={{ backgroundColor: formData.primaryColor }}
                  >
                    Primary CTA
                  </button>
                  <button 
                    className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all"
                    style={{ backgroundColor: formData.secondaryColor }}
                  >
                    Secondary Action
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Save Actions */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xs border border-stone-200 dark:border-stone-800 sticky top-24 transition-colors duration-300">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 cursor-pointer"
            >
              {isSaving ? (
                <span className="animate-pulse">Saving Settings...</span>
              ) : (
                <>
                  <Save size={24} /> Save Changes
                </>
              )}
            </button>
            {saveSuccess && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm text-center font-medium animate-fadeIn">
                Configuration successfully saved!
              </div>
            )}
            <p className="text-xs text-center text-stone-400 dark:text-stone-500 mt-3">
              Last cloud sync: Today at 08:45 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
