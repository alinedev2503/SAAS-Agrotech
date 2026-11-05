import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface TenantConfig {
  appName: string;
  appShortName: string;
  appTagline: string;
  logoUrl: string;
  theme: {
    primaryColor: string;
    primaryColorHover: string;
    primaryColorLight: string;
  };
  features: {
    marketIntelligence: boolean;
    sanitary: boolean;
    crops: boolean;
    stock: boolean;
    animals: boolean;
    team: boolean;
  };
}

const defaultTenant: TenantConfig = {
  appName: "AgroControl",
  appShortName: "AGRO",
  appTagline: "Smart Farm Operations & Intelligence",
  logoUrl: "",
  theme: {
    primaryColor: "#16a34a",
    primaryColorHover: "#15803d",
    primaryColorLight: "#16a34a20"
  },
  features: {
    marketIntelligence: true,
    sanitary: true,
    crops: true,
    stock: true,
    animals: true,
    team: true
  }
};

interface TenantContextType {
  config: TenantConfig;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType>({ config: defaultTenant, loading: true });

export function TenantProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<TenantConfig>(defaultTenant);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/tenant.config.json')
      .then(res => res.json())
      .then((data: TenantConfig) => {
        setConfig(data);
        
        // Aplicar as cores White-Label no Root CSS
        if (data.theme) {
          document.documentElement.style.setProperty('--primary', data.theme.primaryColor);
          document.documentElement.style.setProperty('--primary-hover', data.theme.primaryColorHover);
          document.documentElement.style.setProperty('--primary-light', data.theme.primaryColorLight);
        }
      })
      .catch(err => {
        console.error("Falha ao carregar configurações de Tenant, usando padrão.", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <TenantContext.Provider value={{ config, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  return useContext(TenantContext);
}
