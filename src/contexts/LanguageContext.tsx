import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'es' | 'en' | 'pt';

export interface Translations {
  // Navigation
  nav_overview: string;
  nav_market: string;
  nav_sanitary: string;
  nav_crops: string;
  nav_stock: string;
  nav_animals: string;
  nav_team: string;
  sign_out: string;
  sign_in: string;
  loading: string;
  status_online: string;
  status_offline: string;
  status_sync: string;

  // Header / Language selector
  language_label: string;

  // Dashboard
  dash_title: string;
  dash_subtitle: string;
  dash_voice_btn: string;
  dash_listening: string;
  dash_frost_alert_title: string;
  dash_frost_alert_desc: string;
  dash_active_herd: string;
  dash_head_count: string;
  dash_healthy: string;
  dash_in_treatment: string;
  dash_planted_area: string;
  dash_soy_corn: string;
  dash_gdd_accum: string;
  dash_optimal_growth: string;
  dash_active_alerts: string;
  dash_withholding_actions: string;
  dash_immediate_action: string;
  dash_stock_value: string;
  dash_restock_needed: string;
  dash_cme_cattle: string;
  dash_cbot_soybeans: string;
  dash_cbot_corn: string;
  dash_feedlot_rate: string;
  dash_feedlot_sub: string;
  dash_feedlot_stat: string;
  dash_avg_gain: string;
  dash_gain_sub: string;
  dash_gain_stat: string;
  dash_gdd_title: string;
  dash_gdd_sub: string;
  dash_gdd_stat: string;
  dash_growth_pace: string;
  dash_urgent_actions: string;
  dash_view_all: string;
  dash_mark_done: string;

  // Profile / Settings
  prof_title: string;
  prof_subtitle: string;
  prof_admin_details: string;
  prof_fullname: string;
  prof_role: string;
  prof_email: string;
  prof_phone: string;
  prof_property_data: string;
  prof_farm_name: string;
  prof_total_area: string;
  prof_location: string;
  prof_white_label: string;
  prof_white_label_sub: string;
  prof_custom_domain: string;
  prof_domain_verified: string;
  prof_domain_pending: string;
  prof_domain_dns_hint: string;
  prof_app_title: string;
  prof_support_email: string;
  prof_terms_url: string;
  prof_privacy_url: string;
  prof_smtp_config: string;
  prof_smtp_host: string;
  prof_port: string;
  prof_smtp_user: string;
  prof_sender_name: string;
  prof_reply_to: string;
  prof_footer_text: string;
  prof_payment_gateways: string;
  prof_payment_sub: string;
  prof_stripe_public: string;
  prof_stripe_secret: string;
  prof_preferences: string;
  prof_dark_mode: string;
  prof_dark_active: string;
  prof_dark_disabled: string;
  prof_regional_lang: string;
  prof_branding: string;
  prof_branding_sub: string;
  prof_logo_light: string;
  prof_logo_dark: string;
  prof_favicon: string;
  prof_login_hero: string;
  prof_colors: string;
  prof_primary_color: string;
  prof_secondary_color: string;
  prof_preview: string;
  prof_cta_primary: string;
  prof_cta_secondary: string;
  prof_save_btn: string;
  prof_saving: string;
  prof_save_success: string;
  prof_last_sync: string;

  // Animals / Livestock
  anim_title: string;
  anim_subtitle: string;
  anim_new_animal: string;
  anim_new_lot: string;
  anim_total_herd: string;
  anim_active_lots: string;
  anim_in_quarantine: string;
  anim_daily_gain: string;
  anim_filter_all: string;
  anim_filter_cattle: string;
  anim_filter_swine: string;
  anim_filter_sheep: string;
  anim_filter_goats: string;
  anim_filter_equine: string;
  anim_search_placeholder: string;
  anim_th_eartag: string;
  anim_th_breed: string;
  anim_th_lot: string;
  anim_th_weight: string;
  anim_th_gender: string;
  anim_th_status: string;
  anim_th_actions: string;
  anim_status_healthy: string;
  anim_status_treatment: string;
  anim_status_quarantine: string;
  anim_register_title: string;
  anim_ear_tag: string;
  anim_species: string;
  anim_breed: string;
  anim_weight: string;
  anim_gender: string;
  anim_birth_date: string;
  anim_cancel: string;
  anim_save: string;

  // Crops
  crops_title: string;
  crops_subtitle: string;
  crops_new_plot: string;
  crops_calc_harvest: string;
  crops_calc_density: string;
  crops_active_fields: string;
  crops_avg_yield: string;
  crops_current_stage: string;
  crops_gdd_index: string;
  crops_gdd_calc_title: string;
  crops_gdd_desc: string;
  crops_planting_date: string;
  crops_base_temp: string;
  crops_calculate: string;
  crops_result_harvest: string;

  // Stock
  stock_title: string;
  stock_subtitle: string;
  stock_scan_qr: string;
  stock_new_item: string;
  stock_ai_advisor: string;
  stock_total_value: string;
  stock_low_stock_items: string;
  stock_in_withholding: string;
  stock_active_skus: string;
  stock_search_placeholder: string;
  stock_category_all: string;
  stock_th_item: string;
  stock_th_category: string;
  stock_th_quantity: string;
  stock_th_status: string;
  stock_th_qr: string;
  stock_th_actions: string;
  stock_check_in: string;
  stock_check_out: string;
  stock_status_adequate: string;
  stock_status_low: string;
  stock_status_critical: string;
  stock_movement_history: string;

  // Sanitary
  san_title: string;
  san_subtitle: string;
  san_voice_btn: string;
  san_scan_eartag: string;
  san_new_vaccine: string;
  san_schedule: string;
  san_withholding: string;
  san_rate_title: string;
  san_vaccinated: string;
  san_pending: string;
  san_disease_title: string;
  san_mortality_title: string;
  san_mortality_sub: string;
  san_withdrawal_title: string;
  san_updated_today: string;
  san_status_blocked: string;
  san_status_cleared: string;
  san_clearance_date: string;
  san_upcoming_protocol: string;

  // Market & Weather
  mkt_title: string;
  mkt_subtitle: string;
  mkt_radar_title: string;
  mkt_radar_sources: string;
  mkt_weather_ai: string;
  mkt_humidity: string;
  mkt_wind: string;
  mkt_rain: string;

  // Team
  team_title: string;
  team_subtitle: string;
  team_new_work_order: string;
  team_active_crew: string;
  team_tasks_title: string;
  team_mark_done: string;
  team_create_modal_title: string;
  team_task_title: string;
  team_assign_crew: string;
  team_instructions: string;
  team_cancel: string;
  team_dispatch: string;

  // Login
  login_welcome: string;
  login_credentials_desc: string;
  login_demo_btn: string;
  login_email: string;
  login_password: string;
  login_remember: string;
  login_forgot: string;
  login_submit: string;
  login_offline_notice: string;
}

const translations: Record<Language, Translations> = {
  es: {
    // Navigation
    nav_overview: 'Visión General',
    nav_market: 'Mercado y Clima',
    nav_sanitary: 'Manejo Sanitario',
    nav_crops: 'Agricultura y Lotes',
    nav_stock: 'Inventario y Stock',
    nav_animals: 'Ganadería y Rodeo',
    nav_team: 'Equipo y Personal',
    sign_out: 'Cerrar Sesión',
    sign_in: 'Iniciar Sesión',
    loading: 'Cargando...',
    status_online: 'CONECTADO',
    status_offline: 'DESCONECTADO',
    status_sync: 'SINCRONIZANDO',

    // Header / Language selector
    language_label: 'Idioma',

    // Dashboard
    dash_title: 'Panel Operativo Agropecuario',
    dash_subtitle: 'Supervisión integral de rodeo, cultivos, clima en tiempo real y cotizaciones de futuros.',
    dash_voice_btn: 'Comando de Voz',
    dash_listening: 'Escuchando...',
    dash_frost_alert_title: 'Alerta Agroclimática: Riesgo de Helada Temprana',
    dash_frost_alert_desc: 'Temperaturas nocturnas cercanas a -1°C previstas en el Lote 4. Se recomienda calibrar riego antihelada y proteger brotes.',
    dash_active_herd: 'Rodeo Activo',
    dash_head_count: 'cabezas',
    dash_healthy: 'sanos',
    dash_in_treatment: 'en tratamiento',
    dash_planted_area: 'Área Sembrada',
    dash_soy_corn: 'Soja / Maíz',
    dash_gdd_accum: 'GDD Acumulados',
    dash_optimal_growth: 'crecimiento óptimo',
    dash_active_alerts: 'Alertas Sanitarias',
    dash_withholding_actions: 'períodos de carencia',
    dash_immediate_action: 'atención inmediata',
    dash_stock_value: 'Valor en Insumos',
    dash_restock_needed: 'ítems por reponer',
    dash_cme_cattle: 'Novillo en Pie (CME)',
    dash_cbot_soybeans: 'Soja (CBOT)',
    dash_cbot_corn: 'Maíz (CBOT)',
    dash_feedlot_rate: 'Ocupación de Corrales',
    dash_feedlot_sub: 'Lotes de Engorde Intensivo',
    dash_feedlot_stat: 'Capacidad operativa 82%',
    dash_avg_gain: 'Ganancia Diaria Media',
    dash_gain_sub: 'Kg por cabeza / día',
    dash_gain_stat: '+0.15 kg vs mes anterior',
    dash_gdd_title: 'Unidades Térmicas (GDD)',
    dash_gdd_sub: 'Lote Norte - Maíz Híbrido',
    dash_gdd_stat: 'Floración estimada en 12 días',
    dash_urgent_actions: 'Órdenes de Trabajo Prioritarias',
    dash_view_all: 'Ver todas las tareas',
    dash_mark_done: 'Marcar completada',

    // Profile / Settings
    prof_title: 'Perfil y Configuración White-Label',
    prof_subtitle: 'Administre credenciales, datos de la explotación, marca blanca y pasarelas de cobro.',
    prof_admin_details: 'Datos del Administrador General',
    prof_fullname: 'Nombre Completo',
    prof_role: 'Cargo / Función Operativa',
    prof_email: 'Correo Electrónico Corporativo',
    prof_phone: 'Teléfono / Móvil',
    prof_property_data: 'Datos de la Explotación Agropecuaria',
    prof_farm_name: 'Nombre del Establecimiento / Empresa',
    prof_total_area: 'Superficie Total (Hectáreas / Acres)',
    prof_location: 'Ubicación de la Sede',
    prof_white_label: 'Infraestructura White-Label',
    prof_white_label_sub: 'Dominio personalizado, identidad y despacho de correo transaccional.',
    prof_custom_domain: 'Dominio Personalizado (Alias CNAME)',
    prof_domain_verified: 'Verificado',
    prof_domain_pending: 'DNS Pendiente',
    prof_domain_dns_hint: 'Apunte su registro DNS CNAME hacia',
    prof_app_title: 'Título de la Aplicación',
    prof_support_email: 'Mesa de Soporte',
    prof_terms_url: 'URL de Términos de Servicio',
    prof_privacy_url: 'URL de Política de Privacidad',
    prof_smtp_config: 'Servidor de Correo SMTP',
    prof_smtp_host: 'Servidor Host',
    prof_port: 'Puerto',
    prof_smtp_user: 'Usuario SMTP',
    prof_sender_name: 'Nombre del Remitente',
    prof_reply_to: 'Correo de Respuesta (Reply-To)',
    prof_footer_text: 'Aviso de Copyright en Pie de Página',
    prof_payment_gateways: 'Pasarelas de Pago Comerciales',
    prof_payment_sub: 'Facturación de suscripciones, venta de granos y cobros a clientes.',
    prof_stripe_public: 'Clave Pública de Stripe',
    prof_stripe_secret: 'Clave Secreta de Stripe',
    prof_preferences: 'Preferencias de Visualización',
    prof_dark_mode: 'Modo Oscuro',
    prof_dark_active: 'Activado',
    prof_dark_disabled: 'Desactivado',
    prof_regional_lang: 'Idioma Regional',
    prof_branding: 'Identidad Visual',
    prof_branding_sub: 'Personalización de Marca Blanca',
    prof_logo_light: 'Logotipo (Modo Claro)',
    prof_logo_dark: 'Logotipo (Modo Oscuro)',
    prof_favicon: 'Icono Favicon',
    prof_login_hero: 'Fondo de Pantalla de Acceso',
    prof_colors: 'Paleta de Colores',
    prof_primary_color: 'Color Primario',
    prof_secondary_color: 'Color Secundario',
    prof_preview: 'Vista Previa en Vivo',
    prof_cta_primary: 'Botón Principal',
    prof_cta_secondary: 'Acción Secundaria',
    prof_save_btn: 'Guardar Configuración',
    prof_saving: 'Guardando Cambios...',
    prof_save_success: '¡Configuración guardada exitosamente!',
    prof_last_sync: 'Última sincronización con la nube: Hoy a las 08:45 AM',

    // Animals / Livestock
    anim_title: 'Control Ganadero y Manejo de Rodeo',
    anim_subtitle: 'Trazabilidad individual por caravana, lotes de engorde y sanidad.',
    anim_new_animal: 'Registrar Animal',
    anim_new_lot: 'Crear Lote',
    anim_total_herd: 'Total de Rodeo',
    anim_active_lots: 'Lotes Activos',
    anim_in_quarantine: 'En Cuarentena',
    anim_daily_gain: 'Ganancia Diaria',
    anim_filter_all: 'Todos',
    anim_filter_cattle: 'Bovinos',
    anim_filter_swine: 'Porcinos',
    anim_filter_sheep: 'Ovinos',
    anim_filter_goats: 'Caprinos',
    anim_filter_equine: 'Equinos',
    anim_search_placeholder: 'Buscar por caravana, raza o lote...',
    anim_th_eartag: 'Caravana / ID',
    anim_th_breed: 'Especie / Raza',
    anim_th_lot: 'Lote / Corral',
    anim_th_weight: 'Peso Actual',
    anim_th_gender: 'Sexo',
    anim_th_status: 'Estado Sanitario',
    anim_th_actions: 'Acciones',
    anim_status_healthy: 'Saludable',
    anim_status_treatment: 'En Tratamiento',
    anim_status_quarantine: 'Cuarentena',
    anim_register_title: 'Alta de Nuevo Animal',
    anim_ear_tag: 'Código de Caravana',
    anim_species: 'Especie',
    anim_breed: 'Raza',
    anim_weight: 'Peso Inicial (kg)',
    anim_gender: 'Sexo',
    anim_birth_date: 'Fecha de Nacimiento',
    anim_cancel: 'Cancelar',
    anim_save: 'Guardar Registro',

    // Crops
    crops_title: 'Agricultura de Precisión y Lotes',
    crops_subtitle: 'Cálculo de Grados Día (GDD), densidad de siembra y estadios fenológicos.',
    crops_new_plot: 'Nuevo Lote',
    crops_calc_harvest: 'Calculadora de Cosecha (GDD)',
    crops_calc_density: 'Calculadora de Densidad',
    crops_active_fields: 'Lotes en Producción',
    crops_avg_yield: 'Rendimiento Promedio',
    crops_current_stage: 'Estadio Predominante',
    crops_gdd_index: 'Índice Térmico Acumulado',
    crops_gdd_calc_title: 'Estimación de Cosecha por GDD',
    crops_gdd_desc: 'Calcule la fecha estimada de madurez fisiológica según temperatura base.',
    crops_planting_date: 'Fecha de Siembra',
    crops_base_temp: 'Temperatura Base (°C)',
    crops_calculate: 'Calcular Fecha',
    crops_result_harvest: 'Fecha estimada de cosecha',

    // Stock
    stock_title: 'Inventario y Almacén con Lector QR',
    stock_subtitle: 'Control de insumos, semillas, agroquímicos y movimientos por código QR.',
    stock_scan_qr: 'Escanear QR con Cámara',
    stock_new_item: 'Nuevo Insumo',
    stock_ai_advisor: 'Asesor de Reposición IA',
    stock_total_value: 'Valor Total en Stock',
    stock_low_stock_items: 'Insumos en Mínimo',
    stock_in_withholding: 'En Período de Carencia',
    stock_active_skus: 'Artículos Activos',
    stock_search_placeholder: 'Buscar insumo por nombre o código QR...',
    stock_category_all: 'Todas las Categorías',
    stock_th_item: 'Artículo / Insumo',
    stock_th_category: 'Categoría',
    stock_th_quantity: 'Stock Disponible',
    stock_th_status: 'Estado',
    stock_th_qr: 'Código QR',
    stock_th_actions: 'Acciones',
    stock_check_in: 'Entrada (+)',
    stock_check_out: 'Salida (-)',
    stock_status_adequate: 'Abastecido',
    stock_status_low: 'Stock Bajo',
    stock_status_critical: 'Crítico',
    stock_movement_history: 'Registro Histórico de Movimientos',

    // Sanitary
    san_title: 'Manejo Sanitario y Veterinario',
    san_subtitle: 'Control de vacunación, períodos de retiro (carencia) y tratamientos clínicos.',
    san_voice_btn: 'Comando de Voz',
    san_scan_eartag: 'Leer Caravana',
    san_new_vaccine: 'Nueva Vacuna',
    san_schedule: 'Calendario',
    san_withholding: 'Carencia',
    san_rate_title: 'Tasa de Vacunación del Rodeo',
    san_vaccinated: 'Vacunados',
    san_pending: 'Pendientes',
    san_disease_title: 'Incidencia de Enfermedades (Mes)',
    san_mortality_title: 'Tasa de Mortalidad Acumulada',
    san_mortality_sub: 'Seguimiento anual continuo',
    san_withdrawal_title: 'Control de Períodos de Carencia (Carne y Leche)',
    san_updated_today: 'Actualizado: Hoy',
    san_status_blocked: 'Bloqueado por Carencia',
    san_status_cleared: 'Apto para Venta',
    san_clearance_date: 'Fecha de Liberación',
    san_upcoming_protocol: 'Próximas Vacunaciones Programadas',

    // Market & Weather
    mkt_title: 'Inteligencia de Mercado y Clima',
    mkt_subtitle: 'Cotizaciones de futuros agropecuarios, noticias del sector y clima predictivo.',
    mkt_radar_title: 'Radar Logístico y Geopolítico',
    mkt_radar_sources: 'Fuentes: USDA / CME / Farm Progress',
    mkt_weather_ai: 'Clima Predictivo con IA',
    mkt_humidity: 'Humedad',
    mkt_wind: 'Viento',
    mkt_rain: 'Precipitaciones',

    // Team
    team_title: 'Equipo y Operaciones de Campo',
    team_subtitle: 'Asignación de cuadrillas, órdenes de trabajo y productividad rural.',
    team_new_work_order: 'Nueva Orden de Trabajo',
    team_active_crew: 'Personal Activo',
    team_tasks_title: 'Órdenes de Trabajo en Curso',
    team_mark_done: 'Completar Tarea',
    team_create_modal_title: 'Crear Orden de Trabajo',
    team_task_title: 'Título de la Tarea',
    team_assign_crew: 'Asignar a Colaborador',
    team_instructions: 'Instrucciones Detalladas',
    team_cancel: 'Cancelar',
    team_dispatch: 'Asignar y Notificar',

    // Login
    login_welcome: 'Bienvenido a AgroTech',
    login_credentials_desc: 'Ingrese con sus credenciales de administrador de campo.',
    login_demo_btn: 'Acceso Rápido Modo Demostración',
    login_email: 'Correo Electrónico',
    login_password: 'Contraseña',
    login_remember: 'Recordar sesión',
    login_forgot: '¿Olvidó su contraseña?',
    login_submit: 'Ingresar al Sistema',
    login_offline_notice: 'Modo sin conexión habilitado. Los datos locales se sincronizarán al conectar.',
  },

  en: {
    // Navigation
    nav_overview: 'Overview',
    nav_market: 'Market & Weather',
    nav_sanitary: 'Health & Sanitary',
    nav_crops: 'Crops & Fields',
    nav_stock: 'Inventory & Stock',
    nav_animals: 'Livestock & Herd',
    nav_team: 'Team & Staff',
    sign_out: 'Sign Out',
    sign_in: 'Sign In',
    loading: 'Loading...',
    status_online: 'ONLINE',
    status_offline: 'OFFLINE',
    status_sync: 'SYNC',

    // Header / Language selector
    language_label: 'Language',

    // Dashboard
    dash_title: 'Farm Operations Command Center',
    dash_subtitle: 'Holistic real-time tracking for herd health, crop progress, weather radar, and commodity markets.',
    dash_voice_btn: 'Voice Command',
    dash_listening: 'Listening...',
    dash_frost_alert_title: 'Agronomic Alert: Sub-Zero Frost Warning',
    dash_frost_alert_desc: 'Forecast dawn ground temperatures dropping to 30°F (-1°C) in Field 04. Calibrate overhead center-pivot irrigation to safeguard shoots.',
    dash_active_herd: 'Active Livestock Herd',
    dash_head_count: 'head',
    dash_healthy: 'healthy',
    dash_in_treatment: 'under treatment',
    dash_planted_area: 'Cultivated Acreage',
    dash_soy_corn: 'Soy / Corn',
    dash_gdd_accum: 'Accumulated GDD',
    dash_optimal_growth: 'optimal vegetative pace',
    dash_active_alerts: 'Sanitary Alerts',
    dash_withholding_actions: 'withdrawal periods',
    dash_immediate_action: 'require action',
    dash_stock_value: 'Inventory Valuation',
    dash_restock_needed: 'items low stock',
    dash_cme_cattle: 'Live Cattle (CME)',
    dash_cbot_soybeans: 'Soybeans (CBOT)',
    dash_cbot_corn: 'Corn (CBOT)',
    dash_feedlot_rate: 'Feedlot Occupancy',
    dash_feedlot_sub: 'Feedlot Pens A & B',
    dash_feedlot_stat: 'Current capacity 82%',
    dash_avg_gain: 'Average Daily Gain (ADG)',
    dash_gain_sub: 'Pounds / Head / Day',
    dash_gain_stat: '+0.33 lbs vs last month',
    dash_gdd_title: 'Growing Degree Days (GDD)',
    dash_gdd_sub: 'North Plot - Hybrid Corn',
    dash_gdd_stat: 'Tasseling estimated in 12 days',
    dash_urgent_actions: 'Priority Work Orders',
    dash_view_all: 'View all tasks',
    dash_mark_done: 'Mark as done',

    // Profile / Settings
    prof_title: 'Organization & White-Label Settings',
    prof_subtitle: 'Manage administrator credentials, farm profile, custom branding, and billing gateways.',
    prof_admin_details: 'Farm Administrator Details',
    prof_fullname: 'Full Legal Name',
    prof_role: 'Operational Role',
    prof_email: 'Corporate Email Address',
    prof_phone: 'Phone / Mobile',
    prof_property_data: 'Ranch & Acreage Overview',
    prof_farm_name: 'Farm / Agribusiness Name',
    prof_total_area: 'Total Acreage',
    prof_location: 'Headquarters Location',
    prof_white_label: 'White-Label Infrastructure',
    prof_white_label_sub: 'Custom enterprise domain, branding endpoints, and transactional SMTP.',
    prof_custom_domain: 'Custom Domain (CNAME Alias)',
    prof_domain_verified: 'Verified',
    prof_domain_pending: 'Pending DNS',
    prof_domain_dns_hint: 'Point your DNS CNAME record to',
    prof_app_title: 'Application Title',
    prof_support_email: 'Support Email Desk',
    prof_terms_url: 'Terms of Service URL',
    prof_privacy_url: 'Privacy Policy URL',
    prof_smtp_config: 'SMTP Dispatch Server',
    prof_smtp_host: 'Host Server',
    prof_port: 'Port',
    prof_smtp_user: 'SMTP Username',
    prof_sender_name: 'Sender Display Name',
    prof_reply_to: 'Reply-To Address',
    prof_footer_text: 'Footer Copyright Notice',
    prof_payment_gateways: 'Commercial Payment Gateways',
    prof_payment_sub: 'Configure subscriber billing, harvest sales, and client invoicing.',
    prof_stripe_public: 'Stripe Publishable Key',
    prof_stripe_secret: 'Stripe Secret Key',
    prof_preferences: 'Display & Theme',
    prof_dark_mode: 'Dark Theme',
    prof_dark_active: 'Active',
    prof_dark_disabled: 'Disabled',
    prof_regional_lang: 'Regional Language',
    prof_branding: 'Visual Branding',
    prof_branding_sub: 'White-Label Customization',
    prof_logo_light: 'Logo (Light Mode)',
    prof_logo_dark: 'Logo (Dark Mode)',
    prof_favicon: 'Favicon Icon',
    prof_login_hero: 'Login Hero Wall',
    prof_colors: 'Theme Palette',
    prof_primary_color: 'Primary Color',
    prof_secondary_color: 'Secondary Color',
    prof_preview: 'Live UI Preview',
    prof_cta_primary: 'Primary CTA',
    prof_cta_secondary: 'Secondary Action',
    prof_save_btn: 'Save Changes',
    prof_saving: 'Saving Settings...',
    prof_save_success: 'Configuration successfully saved!',
    prof_last_sync: 'Last cloud sync: Today at 08:45 AM',

    // Animals / Livestock
    anim_title: 'Livestock & Herd Management',
    anim_subtitle: 'Cattle herd tracking, weight evolution, lot assignment, and sanitary status.',
    anim_new_animal: 'Register Animal',
    anim_new_lot: 'New Herd Lot',
    anim_total_herd: 'Total Herd Count',
    anim_active_lots: 'Active Lots',
    anim_in_quarantine: 'In Quarantine',
    anim_daily_gain: 'Avg Daily Gain',
    anim_filter_all: 'All',
    anim_filter_cattle: 'Cattle',
    anim_filter_swine: 'Swine',
    anim_filter_sheep: 'Sheep',
    anim_filter_goats: 'Goats',
    anim_filter_equine: 'Equine',
    anim_search_placeholder: 'Search by ear tag, breed, or lot...',
    anim_th_eartag: 'Ear Tag / ID',
    anim_th_breed: 'Species / Breed',
    anim_th_lot: 'Lot / Pen',
    anim_th_weight: 'Current Weight',
    anim_th_gender: 'Gender',
    anim_th_status: 'Sanitary Status',
    anim_th_actions: 'Actions',
    anim_status_healthy: 'Healthy',
    anim_status_treatment: 'In Treatment',
    anim_status_quarantine: 'Quarantine',
    anim_register_title: 'Register Livestock Head',
    anim_ear_tag: 'Ear Tag Code',
    anim_species: 'Species',
    anim_breed: 'Breed',
    anim_weight: 'Weight (lbs)',
    anim_gender: 'Gender',
    anim_birth_date: 'Birth Date',
    anim_cancel: 'Cancel',
    anim_save: 'Save Animal Record',

    // Crops
    crops_title: 'Crops & Field Management',
    crops_subtitle: 'Precision crop monitoring, GDD calculation, planting density, and growth stages.',
    crops_new_plot: 'New Field Plot',
    crops_calc_harvest: 'Harvest Calculator (GDD)',
    crops_calc_density: 'Planting Density Tool',
    crops_active_fields: 'Active Plots',
    crops_avg_yield: 'Projected Yield',
    crops_current_stage: 'Dominant Stage',
    crops_gdd_index: 'Thermal Units Index',
    crops_gdd_calc_title: 'GDD Harvest Forecaster',
    crops_gdd_desc: 'Calculate estimated physiological maturity date based on daily thermal accumulation.',
    crops_planting_date: 'Planting Date',
    crops_base_temp: 'Base Temp (°F / °C)',
    crops_calculate: 'Forecast Maturity',
    crops_result_harvest: 'Estimated Harvest Date',

    // Stock
    stock_title: 'Inventory & Stock with QR Scanner',
    stock_subtitle: 'Manage agricultural supplies, chemical withholding dates, and fast QR camera check-ins.',
    stock_scan_qr: 'Scan QR with Camera',
    stock_new_item: 'New Supply Item',
    stock_ai_advisor: 'AI Restock Advice',
    stock_total_value: 'Total Inventory Value',
    stock_low_stock_items: 'Low Stock Alerts',
    stock_in_withholding: 'Active Drug Withholding',
    stock_active_skus: 'Active SKUs',
    stock_search_placeholder: 'Search inventory by name, category, or QR...',
    stock_category_all: 'All Categories',
    stock_th_item: 'Supply Item',
    stock_th_category: 'Category',
    stock_th_quantity: 'Quantity in Stock',
    stock_th_status: 'Status',
    stock_th_qr: 'QR Code',
    stock_th_actions: 'Actions',
    stock_check_in: 'Check-In (+)',
    stock_check_out: 'Check-Out (-)',
    stock_status_adequate: 'Adequate',
    stock_status_low: 'Low Stock',
    stock_status_critical: 'Critical',
    stock_movement_history: 'Recent Stock Movement Ledger',

    // Sanitary
    san_title: 'Health & Sanitary Management',
    san_subtitle: 'Vaccine tracking, drug withdrawal periods, and veterinary protocols.',
    san_voice_btn: 'Voice Command',
    san_scan_eartag: 'Scan Ear Tag',
    san_new_vaccine: 'New Vaccine',
    san_schedule: 'Schedule',
    san_withholding: 'Withholding',
    san_rate_title: 'Herd Vaccination Rate',
    san_vaccinated: 'Vaccinated',
    san_pending: 'Pending',
    san_disease_title: 'Disease Incidence (This Month)',
    san_mortality_title: 'Herd Mortality Rate',
    san_mortality_sub: 'Cumulative year-to-date tracking',
    san_withdrawal_title: 'Withdrawal Period Tracking (Meat & Milk Withholding)',
    san_updated_today: 'Updated: Today',
    san_status_blocked: 'Withholding Active',
    san_status_cleared: 'Cleared',
    san_clearance_date: 'Clearance Date',
    san_upcoming_protocol: 'Upcoming Vaccination Protocol',

    // Market & Weather
    mkt_title: 'Market & Weather Intelligence',
    mkt_subtitle: 'Commodity futures, agricultural trade news, and predictive weather for strategic decisions.',
    mkt_radar_title: 'Geopolitical & Logistics Radar',
    mkt_radar_sources: 'Sources: USDA / CME / Farm Progress',
    mkt_weather_ai: 'Predictive Weather (AI)',
    mkt_humidity: 'Humidity',
    mkt_wind: 'Wind',
    mkt_rain: 'Rain',

    // Team
    team_title: 'Team & Field Operations',
    team_subtitle: 'Labor allocation, operational work orders, and field productivity.',
    team_new_work_order: 'New Work Order',
    team_active_crew: 'Active Crew',
    team_tasks_title: 'Field Work Orders & Tasks',
    team_mark_done: 'Mark as Done',
    team_create_modal_title: 'Create Work Order',
    team_task_title: 'Task Title',
    team_assign_crew: 'Assign To Crew Member',
    team_instructions: 'Detailed Instructions',
    team_cancel: 'Cancel',
    team_dispatch: 'Dispatch Task',

    // Login
    login_welcome: 'Welcome to AgroTech',
    login_credentials_desc: 'Sign in with your farm manager or administrator credentials.',
    login_demo_btn: 'Quick Demo Access',
    login_email: 'Email address',
    login_password: 'Password',
    login_remember: 'Remember me',
    login_forgot: 'Forgot password?',
    login_submit: 'Sign In to Workspace',
    login_offline_notice: 'Offline-ready workspace. Changes queue locally and sync automatically.',
  },

  pt: {
    // Navigation
    nav_overview: 'Visão Geral',
    nav_market: 'Mercado & Clima',
    nav_sanitary: 'Manejo Sanitário',
    nav_crops: 'Agricultura & Lotes',
    nav_stock: 'Estoque & Insumos',
    nav_animals: 'Pecuária & Rebanho',
    nav_team: 'Equipe & Tarefas',
    sign_out: 'Sair',
    sign_in: 'Entrar',
    loading: 'Carregando...',
    status_online: 'ONLINE',
    status_offline: 'OFFLINE',
    status_sync: 'SINCRONIZANDO',

    // Header / Language selector
    language_label: 'Idioma',

    // Dashboard
    dash_title: 'Painel Geral da Fazenda',
    dash_subtitle: 'Controle integrado de rebanho, lavoura, clima e cotações em tempo real.',
    dash_voice_btn: 'Comando de Voz',
    dash_listening: 'Ouvindo...',
    dash_frost_alert_title: 'Alerta Agroclimático: Risco de Geada',
    dash_frost_alert_desc: 'Temperaturas próximas a 0°C previstas no Talhão 4. Prepare irrigação anti-geada.',
    dash_active_herd: 'Rebanho Ativo',
    dash_head_count: 'cabeças',
    dash_healthy: 'saudáveis',
    dash_in_treatment: 'em tratamento',
    dash_planted_area: 'Área Plantada',
    dash_soy_corn: 'Soja / Milho',
    dash_gdd_accum: 'GDD Acumulado',
    dash_optimal_growth: 'crescimento ideal',
    dash_active_alerts: 'Alertas Sanitários',
    dash_withholding_actions: 'períodos de carência',
    dash_immediate_action: 'atenção imediata',
    dash_stock_value: 'Valor em Estoque',
    dash_restock_needed: 'itens para repor',
    dash_cme_cattle: 'Boi Gordo (B3 / CME)',
    dash_cbot_soybeans: 'Soja (CBOT)',
    dash_cbot_corn: 'Milho (CBOT)',
    dash_feedlot_rate: 'Ocupação do Confinamento',
    dash_feedlot_sub: 'Currais A e B',
    dash_feedlot_stat: 'Capacidade atual 82%',
    dash_avg_gain: 'Ganho Médio Diário',
    dash_gain_sub: 'Kg / Cabeça / Dia',
    dash_gain_stat: '+0,15 kg vs mês anterior',
    dash_gdd_title: 'Graus-Dia Acumulados',
    dash_gdd_sub: 'Talhão Norte - Milho Híbrido',
    dash_gdd_stat: 'Florescimento previsto em 12 dias',
    dash_urgent_actions: 'Tarefas Prioritárias',
    dash_view_all: 'Ver todas',
    dash_mark_done: 'Concluir tarefa',

    // Profile / Settings
    prof_title: 'Perfil & Configurações White-Label',
    prof_subtitle: 'Gerencie credenciais, dados da fazenda, marca própria e faturamento.',
    prof_admin_details: 'Dados do Administrador',
    prof_fullname: 'Nome Completo',
    prof_role: 'Função Operacional',
    prof_email: 'Email Corporativo',
    prof_phone: 'Telefone / WhatsApp',
    prof_property_data: 'Dados da Fazenda',
    prof_farm_name: 'Nome da Fazenda / Empresa',
    prof_total_area: 'Área Total (Hectares)',
    prof_location: 'Localização da Sede',
    prof_white_label: 'Infraestrutura White-Label',
    prof_white_label_sub: 'Domínio personalizado, marca e servidor SMTP.',
    prof_custom_domain: 'Domínio Personalizado (CNAME)',
    prof_domain_verified: 'Verificado',
    prof_domain_pending: 'DNS Pendente',
    prof_domain_dns_hint: 'Aponte o CNAME do seu domínio para',
    prof_app_title: 'Título da Aplicação',
    prof_support_email: 'Email de Suporte',
    prof_terms_url: 'URL Termos de Uso',
    prof_privacy_url: 'URL Política de Privacidade',
    prof_smtp_config: 'Servidor SMTP',
    prof_smtp_host: 'Host do Servidor',
    prof_port: 'Porta',
    prof_smtp_user: 'Usuário SMTP',
    prof_sender_name: 'Nome do Remetente',
    prof_reply_to: 'Email de Resposta',
    prof_footer_text: 'Texto de Rodapé',
    prof_payment_gateways: 'Gateways de Pagamento',
    prof_payment_sub: 'Cobranças, vendas de safra e faturamento.',
    prof_stripe_public: 'Chave Pública Stripe',
    prof_stripe_secret: 'Chave Secreta Stripe',
    prof_preferences: 'Preferências de Exibição',
    prof_dark_mode: 'Modo Escuro',
    prof_dark_active: 'Ativado',
    prof_dark_disabled: 'Desativado',
    prof_regional_lang: 'Idioma Regional',
    prof_branding: 'Identidade Visual',
    prof_branding_sub: 'Configuração White-Label',
    prof_logo_light: 'Logo (Modo Claro)',
    prof_logo_dark: 'Logo (Modo Escuro)',
    prof_favicon: 'Ícone Favicon',
    prof_login_hero: 'Imagem de Fundo do Login',
    prof_colors: 'Paleta de Cores',
    prof_primary_color: 'Cor Primária',
    prof_secondary_color: 'Cor Secundária',
    prof_preview: 'Pré-visualização ao Vivo',
    prof_cta_primary: 'Botão Principal',
    prof_cta_secondary: 'Ação Secundária',
    prof_save_btn: 'Salvar Configurações',
    prof_saving: 'Salvando...',
    prof_save_success: 'Configurações salvas com sucesso!',
    prof_last_sync: 'Última sincronização: Hoje às 08:45',

    // Animals / Livestock
    anim_title: 'Pecuária & Gestão de Rebanho',
    anim_subtitle: 'Acompanhamento do gado, pesagem, lotes e controle sanitário.',
    anim_new_animal: 'Cadastrar Animal',
    anim_new_lot: 'Novo Lote',
    anim_total_herd: 'Total do Rebanho',
    anim_active_lots: 'Lotes Ativos',
    anim_in_quarantine: 'Em Quarentena',
    anim_daily_gain: 'Ganho Diário Médio',
    anim_filter_all: 'Todos',
    anim_filter_cattle: 'Bovinos',
    anim_filter_swine: 'Suínos',
    anim_filter_sheep: 'Ovinos',
    anim_filter_goats: 'Caprinos',
    anim_filter_equine: 'Equinos',
    anim_search_placeholder: 'Buscar por brinco, raça ou lote...',
    anim_th_eartag: 'Brinco / ID',
    anim_th_breed: 'Espécie / Raça',
    anim_th_lot: 'Lote / Piquete',
    anim_th_weight: 'Peso Atual',
    anim_th_gender: 'Sexo',
    anim_th_status: 'Status Sanitário',
    anim_th_actions: 'Ações',
    anim_status_healthy: 'Saudável',
    anim_status_treatment: 'Em Tratamento',
    anim_status_quarantine: 'Quarentena',
    anim_register_title: 'Cadastrar Novo Animal',
    anim_ear_tag: 'Número do Brinco',
    anim_species: 'Espécie',
    anim_breed: 'Raça',
    anim_weight: 'Peso Inicial (kg)',
    anim_gender: 'Sexo',
    anim_birth_date: 'Data de Nascimento',
    anim_cancel: 'Cancelar',
    anim_save: 'Salvar Animal',

    // Crops
    crops_title: 'Agricultura & Manejo de Talhões',
    crops_subtitle: 'Cálculo de Graus-Dia (GDD), densidade de semeadura e fases da safra.',
    crops_new_plot: 'Novo Talhão',
    crops_calc_harvest: 'Calculadora de Colheita (GDD)',
    crops_calc_density: 'Calculadora de Densidade',
    crops_active_fields: 'Talhões Ativos',
    crops_avg_yield: 'Produtividade Média',
    crops_current_stage: 'Estágio Atual',
    crops_gdd_index: 'Índice Térmico Acumulado',
    crops_gdd_calc_title: 'Previsão de Colheita por GDD',
    crops_gdd_desc: 'Calcule a data estimada de maturação fisiológica pela soma térmica.',
    crops_planting_date: 'Data do Plantio',
    crops_base_temp: 'Temperatura Base (°C)',
    crops_calculate: 'Calcular Colheita',
    crops_result_harvest: 'Data estimada da colheita',

    // Stock
    stock_title: 'Estoque de Insumos & Leitor QR',
    stock_subtitle: 'Controle de defensivos, sementes e movimentações rápidas via câmera QR.',
    stock_scan_qr: 'Escanear QR com Câmera',
    stock_new_item: 'Novo Insumo',
    stock_ai_advisor: 'Recomendações IA',
    stock_total_value: 'Valor Total em Estoque',
    stock_low_stock_items: 'Alertas de Estoque Baixo',
    stock_in_withholding: 'Em Período de Carência',
    stock_active_skus: 'Itens Cadastrados',
    stock_search_placeholder: 'Buscar insumo por nome ou código QR...',
    stock_category_all: 'Todas as Categorias',
    stock_th_item: 'Insumo / Produto',
    stock_th_category: 'Categoria',
    stock_th_quantity: 'Quantidade',
    stock_th_status: 'Status',
    stock_th_qr: 'Código QR',
    stock_th_actions: 'Ações',
    stock_check_in: 'Entrada (+)',
    stock_check_out: 'Saída (-)',
    stock_status_adequate: 'Adequado',
    stock_status_low: 'Estoque Baixo',
    stock_status_critical: 'Crítico',
    stock_movement_history: 'Histórico de Movimentações',

    // Sanitary
    san_title: 'Manejo Sanitário & Veterinário',
    san_subtitle: 'Vacinas, controle de períodos de carência e tratamentos.',
    san_voice_btn: 'Comando de Voz',
    san_scan_eartag: 'Ler Brinco',
    san_new_vaccine: 'Nova Vacina',
    san_schedule: 'Calendário',
    san_withholding: 'Carência',
    san_rate_title: 'Taxa de Vacinação do Rebanho',
    san_vaccinated: 'Vacinados',
    san_pending: 'Pendentes',
    san_disease_title: 'Incidência de Doenças no Mês',
    san_mortality_title: 'Taxa de Mortalidade',
    san_mortality_sub: 'Acumulado no ano',
    san_withdrawal_title: 'Controle de Carência (Abate e Leite)',
    san_updated_today: 'Atualizado: Hoje',
    san_status_blocked: 'Bloqueado por Carência',
    san_status_cleared: 'Liberado',
    san_clearance_date: 'Data de Liberação',
    san_upcoming_protocol: 'Próximas Vacinações',

    // Market & Weather
    mkt_title: 'Inteligência de Mercado & Clima',
    mkt_subtitle: 'Cotações de commodities, notícias do agro e previsão climática com IA.',
    mkt_radar_title: 'Radar Logístico e Geopolítico',
    mkt_radar_sources: 'Fontes: Notícias Agrícolas / B3 / USDA',
    mkt_weather_ai: 'Previsão Climática (IA)',
    mkt_humidity: 'Umidade',
    mkt_wind: 'Vento',
    mkt_rain: 'Chuva',

    // Team
    team_title: 'Equipe & Tarefas de Campo',
    team_subtitle: 'Distribuição de ordens de serviço, maquinário e produtividade.',
    team_new_work_order: 'Nova Ordem de Serviço',
    team_active_crew: 'Equipe no Campo',
    team_tasks_title: 'Tarefas em Andamento',
    team_mark_done: 'Concluir',
    team_create_modal_title: 'Criar Ordem de Serviço',
    team_task_title: 'Título da Tarefa',
    team_assign_crew: 'Responsável',
    team_instructions: 'Instruções',
    team_cancel: 'Cancelar',
    team_dispatch: 'Atribuir Tarefa',

    // Login
    login_welcome: 'Bem-vindo ao AgroTech',
    login_credentials_desc: 'Entre com suas credenciais de gestor ou administrador.',
    login_demo_btn: 'Acesso Rápido Modo Demonstração',
    login_email: 'Email de acesso',
    login_password: 'Senha',
    login_remember: 'Lembrar de mim',
    login_forgot: 'Esqueceu a senha?',
    login_submit: 'Entrar no Sistema',
    login_offline_notice: 'Sistema com suporte offline. Os dados sincronizarão automaticamente.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to 'es' as requested by user ("agora faça a tradução para o espanhol")
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agrotech_language') as Language;
    return saved === 'es' || saved === 'en' || saved === 'pt' ? saved : 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agrotech_language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language] || translations.es,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
