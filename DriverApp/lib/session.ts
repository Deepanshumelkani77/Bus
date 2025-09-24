// Simple in-memory session for current driver. Not secure; for MVP only.
export type CurrentDriver = {
  _id: string;
  name: string;
  email: string;
  city: string;
  activeBus?: string;
};

let currentDriver: CurrentDriver | null = null;

export function setCurrentDriver(driver: CurrentDriver | null) {
  currentDriver = driver;
  try {
    if (typeof window !== 'undefined' && window?.localStorage) {
      if (driver) {
        window.localStorage.setItem('busapp.currentDriver', JSON.stringify(driver));
      } else {
        window.localStorage.removeItem('busapp.currentDriver');
      }
    }
  } catch {}
}

export function getCurrentDriver(): CurrentDriver | null {
  if (currentDriver) return currentDriver;
  try {
    if (typeof window !== 'undefined' && window?.localStorage) {
      const raw = window.localStorage.getItem('busapp.currentDriver');
      if (raw) {
        currentDriver = JSON.parse(raw);
      }
    }
  } catch {}
  return currentDriver;
}

export function clearSession() {
  setCurrentDriver(null);
}
