export interface BusinessSettings {
  BUSINESS_NAME: string;
  BUSINESS_SLOGAN: string;
  BUSINESS_ADDRESS: string;
  BUSINESS_PHONE_1: string;
  BUSINESS_PHONE_2: string;
  BUSINESS_WHATSAPP: string;
  BUSINESS_EMAIL: string;
  BANK_NAME: string;
  BANK_ACCOUNT_NUMBER: string;
  BANK_ACCOUNT_NAME: string;
  BUSINESS_FACEBOOK: string;
  BUSINESS_INSTAGRAM: string;
  DEFAULT_DEPOSIT_PERCENTAGE: string;
}

export const DEFAULT_SETTINGS: BusinessSettings = {
  BUSINESS_NAME: 'Alaga Alayo Events & Rentals',
  BUSINESS_SLOGAN: 'Your Event. My Passion.',
  BUSINESS_ADDRESS: 'Lagos, Nigeria (Servicing Nationwide)',
  BUSINESS_PHONE_1: '0807 302 1840',
  BUSINESS_PHONE_2: '0806 099 8745',
  BUSINESS_WHATSAPP: '0807 302 1840',
  BUSINESS_EMAIL: 'alagaalayo@gmail.com',
  BANK_NAME: 'Guaranty Trust Bank (GTBank)',
  BANK_ACCOUNT_NUMBER: '0123456789',
  BANK_ACCOUNT_NAME: 'Alaga Alayo Events Limited',
  BUSINESS_FACEBOOK: 'https://www.facebook.com/meseko.omolayo',
  BUSINESS_INSTAGRAM: '@alaga_alayo',
  DEFAULT_DEPOSIT_PERCENTAGE: '50',
};
