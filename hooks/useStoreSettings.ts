import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export const useStoreSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useStoreSettings must be used within a SettingsProvider');
  }
  return context;
};
