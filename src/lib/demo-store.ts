export type DemoLeadType = "Quick Lead" | "Instant Estimation";

export type DemoLead = {
  id: string;
  type: DemoLeadType;
  mode: string;
  service: string;
  phone: string;
  name?: string;
  zipCode?: string;
  timeline?: string;
  squareFootage?: number;
  propertyType?: string;
  estimate?: number;
  createdAt: string;
};

export type DemoThemeSettings = {
  brandBlue: string;
  brandDark: string;
  brandSoft: string;
  brandAccent: string;
};

export type DemoAdminCredentials = {
  username: string;
  password: string;
};

const DEMO_LEADS_KEY = "lux-demo-leads";
const DEMO_THEME_KEY = "lux-demo-theme";
const DEMO_AUTH_KEY = "lux-demo-admin-auth";
const DEMO_AUTH_CREDENTIALS_KEY = "lux-demo-admin-credentials";
const DEMO_LOGO_KEY = "lux-demo-logo";
const DEMO_ASSETS_DB = "lux-demo-assets";
const DEMO_ASSETS_STORE = "assets";

export const defaultDemoTheme: DemoThemeSettings = {
  brandBlue: "#3348ff",
  brandDark: "#14162b",
  brandSoft: "#edf2f8",
  brandAccent: "#f0c62e",
};

export const defaultDemoAdminCredentials: DemoAdminCredentials = {
  username: "admin",
  password: "admin",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function openAssetsDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DEMO_ASSETS_DB, 1);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(DEMO_ASSETS_STORE)) {
        database.createObjectStore(DEMO_ASSETS_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readAsset(key: string): Promise<string | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await openAssetsDb();
      const transaction = database.transaction(DEMO_ASSETS_STORE, "readonly");
      const store = transaction.objectStore(DEMO_ASSETS_STORE);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(typeof request.result === "string" ? request.result : null);
      };
      request.onerror = () => reject(request.error);
    } catch (error) {
      reject(error);
    }
  });
}

function writeAsset(key: string, value: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const database = await openAssetsDb();
      const transaction = database.transaction(DEMO_ASSETS_STORE, "readwrite");
      const store = transaction.objectStore(DEMO_ASSETS_STORE);
      const request = store.put(value, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    } catch (error) {
      reject(error);
    }
  });
}

export function getDemoLeads(): DemoLead[] {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(DEMO_LEADS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as DemoLead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveDemoLead(input: Omit<DemoLead, "id" | "createdAt">) {
  if (!isBrowser()) {
    return null;
  }

  const nextLead: DemoLead = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const nextLeads = [nextLead, ...getDemoLeads()];
  window.localStorage.setItem(DEMO_LEADS_KEY, JSON.stringify(nextLeads));
  window.dispatchEvent(new CustomEvent("lux-demo-leads-updated"));

  return nextLead;
}

export function getDemoTheme() {
  if (!isBrowser()) {
    return defaultDemoTheme;
  }

  const raw = window.localStorage.getItem(DEMO_THEME_KEY);
  if (!raw) {
    return defaultDemoTheme;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DemoThemeSettings>;
    return {
      brandBlue: parsed.brandBlue ?? defaultDemoTheme.brandBlue,
      brandDark: parsed.brandDark ?? defaultDemoTheme.brandDark,
      brandSoft: parsed.brandSoft ?? defaultDemoTheme.brandSoft,
      brandAccent: parsed.brandAccent ?? defaultDemoTheme.brandAccent,
    };
  } catch {
    return defaultDemoTheme;
  }
}

export function saveDemoTheme(theme: DemoThemeSettings) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(DEMO_THEME_KEY, JSON.stringify(theme));
  applyThemeToDocument(theme);
  window.dispatchEvent(new CustomEvent("lux-demo-theme-updated"));
}

export function applyThemeToDocument(theme: DemoThemeSettings) {
  if (!isBrowser()) {
    return;
  }

  const root = document.documentElement;
  root.style.setProperty("--brand-blue", theme.brandBlue);
  root.style.setProperty("--brand-dark", theme.brandDark);
  root.style.setProperty("--brand-soft", theme.brandSoft);
  root.style.setProperty("--brand-accent", theme.brandAccent);
}

export function getDemoAdminAuth() {
  if (!isBrowser()) {
    return false;
  }

  return window.localStorage.getItem(DEMO_AUTH_KEY) === "true";
}

export function setDemoAdminAuth(isAuthed: boolean) {
  if (!isBrowser()) {
    return;
  }

  if (isAuthed) {
    window.localStorage.setItem(DEMO_AUTH_KEY, "true");
  } else {
    window.localStorage.removeItem(DEMO_AUTH_KEY);
  }
}

export function getDemoAdminCredentials() {
  if (!isBrowser()) {
    return defaultDemoAdminCredentials;
  }

  const raw = window.localStorage.getItem(DEMO_AUTH_CREDENTIALS_KEY);
  if (!raw) {
    return defaultDemoAdminCredentials;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DemoAdminCredentials>;

    return {
      username: parsed.username?.trim() || defaultDemoAdminCredentials.username,
      password: parsed.password?.trim() || defaultDemoAdminCredentials.password,
    };
  } catch {
    return defaultDemoAdminCredentials;
  }
}

export function saveDemoAdminPassword(password: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    DEMO_AUTH_CREDENTIALS_KEY,
    JSON.stringify({
      username: defaultDemoAdminCredentials.username,
      password,
    } satisfies DemoAdminCredentials),
  );
  window.dispatchEvent(new CustomEvent("lux-demo-admin-credentials-updated"));
}

export async function getDemoLogo() {
  if (!isBrowser()) {
    return null;
  }

  try {
    return await readAsset(DEMO_LOGO_KEY);
  } catch {
    return window.localStorage.getItem(DEMO_LOGO_KEY);
  }
}

export async function saveDemoLogo(logo: string) {
  if (!isBrowser()) {
    return;
  }

  try {
    await writeAsset(DEMO_LOGO_KEY, logo);
    window.localStorage.removeItem(DEMO_LOGO_KEY);
  } catch {
    window.localStorage.setItem(DEMO_LOGO_KEY, logo);
  }

  window.dispatchEvent(new CustomEvent("lux-demo-logo-updated"));
}
