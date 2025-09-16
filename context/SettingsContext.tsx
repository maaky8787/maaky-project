import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { StoreSettings } from '../types';

const STORAGE_KEY = 'storeSettings';

const DEFAULT_SETTINGS: StoreSettings = {
    storeName: 'أناقة رجل',
    contactEmail: 'contact@example.com',
    currency: 'جنيه',
};

interface SettingsContextType {
    settings: StoreSettings;
    saveSettings: (newSettings: StoreSettings) => void;
    loading: boolean;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedSettings = localStorage.getItem(STORAGE_KEY);
            if (storedSettings) {
                setSettings(JSON.parse(storedSettings));
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveSettings = (newSettings: StoreSettings) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, saveSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};
