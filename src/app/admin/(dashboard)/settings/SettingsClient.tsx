'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { BusinessSettings, DEFAULT_SETTINGS } from '@/lib/settings-types';
import { AdminUserSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface SettingsClientProps {
  initialSettings: BusinessSettings;
  session: AdminUserSession;
}

export default function SettingsClient({ initialSettings, session }: SettingsClientProps) {
  const router = useRouter();

  // Business Settings State
  const [formData, setFormData] = useState<BusinessSettings>({
    BUSINESS_NAME: initialSettings.BUSINESS_NAME || DEFAULT_SETTINGS.BUSINESS_NAME,
    BUSINESS_SLOGAN: initialSettings.BUSINESS_SLOGAN || DEFAULT_SETTINGS.BUSINESS_SLOGAN,
    BUSINESS_ADDRESS: initialSettings.BUSINESS_ADDRESS || DEFAULT_SETTINGS.BUSINESS_ADDRESS,
    BUSINESS_PHONE_1: initialSettings.BUSINESS_PHONE_1 || DEFAULT_SETTINGS.BUSINESS_PHONE_1,
    BUSINESS_PHONE_2: initialSettings.BUSINESS_PHONE_2 || DEFAULT_SETTINGS.BUSINESS_PHONE_2,
    BUSINESS_WHATSAPP: initialSettings.BUSINESS_WHATSAPP || DEFAULT_SETTINGS.BUSINESS_WHATSAPP,
    BUSINESS_EMAIL: initialSettings.BUSINESS_EMAIL || DEFAULT_SETTINGS.BUSINESS_EMAIL,
    BANK_NAME: initialSettings.BANK_NAME || DEFAULT_SETTINGS.BANK_NAME,
    BANK_ACCOUNT_NUMBER: initialSettings.BANK_ACCOUNT_NUMBER || DEFAULT_SETTINGS.BANK_ACCOUNT_NUMBER,
    BANK_ACCOUNT_NAME: initialSettings.BANK_ACCOUNT_NAME || DEFAULT_SETTINGS.BANK_ACCOUNT_NAME,
    BUSINESS_FACEBOOK: initialSettings.BUSINESS_FACEBOOK || DEFAULT_SETTINGS.BUSINESS_FACEBOOK,
    BUSINESS_INSTAGRAM: initialSettings.BUSINESS_INSTAGRAM || DEFAULT_SETTINGS.BUSINESS_INSTAGRAM,
    DEFAULT_DEPOSIT_PERCENTAGE: initialSettings.DEFAULT_DEPOSIT_PERCENTAGE || DEFAULT_SETTINGS.DEFAULT_DEPOSIT_PERCENTAGE,
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  function handleInputChange(field: keyof BusinessSettings, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSettingsSuccess(false);
    setSettingsError('');
  }

  // Save Settings to Database
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    setSettingsError('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      setSettingsSuccess(true);
      toast.success('Settings saved successfully!');
      router.refresh();
      
      setTimeout(() => setSettingsSuccess(false), 4000);
    } catch (err: any) {
      setSettingsError(err.message || 'An error occurred while saving settings.');
      toast.error(err.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  }

  // Change Password
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordSuccess(false);
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      setChangingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      setChangingPassword(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully!');

      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#32113C] font-serif">Business Settings &amp; Security</h1>
        <p className="text-sm text-[#7E7781]">
          Manage company profile, public contact details, bank accounts, and owner security credentials
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {settingsError && (
          <div className="p-4 bg-[#FDEBEC] border border-[#B83B42] rounded-xl text-[#B83B42] text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{settingsError}</span>
          </div>
        )}

        {/* Company Profile Section */}
        <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E4E9]">
            <h2 className="font-semibold text-[#32113C] font-serif text-lg">Company Profile</h2>
            <span className="text-xs bg-[#F1E8F4] text-[#652278] font-medium px-2.5 py-1 rounded-full">
              Public Details
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Company Name</label>
              <input
                type="text"
                value={formData.BUSINESS_NAME}
                onChange={e => handleInputChange('BUSINESS_NAME', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Office Address</label>
              <input
                type="text"
                value={formData.BUSINESS_ADDRESS}
                onChange={e => handleInputChange('BUSINESS_ADDRESS', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Official Phone 1</label>
              <input
                type="text"
                value={formData.BUSINESS_PHONE_1}
                onChange={e => handleInputChange('BUSINESS_PHONE_1', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Official Phone 2</label>
              <input
                type="text"
                value={formData.BUSINESS_PHONE_2}
                onChange={e => handleInputChange('BUSINESS_PHONE_2', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={formData.BUSINESS_WHATSAPP}
                onChange={e => handleInputChange('BUSINESS_WHATSAPP', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Support Email</label>
              <input
                type="email"
                value={formData.BUSINESS_EMAIL}
                onChange={e => handleInputChange('BUSINESS_EMAIL', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.BUSINESS_FACEBOOK}
                onChange={e => handleInputChange('BUSINESS_FACEBOOK', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Instagram Handle</label>
              <input
                type="text"
                value={formData.BUSINESS_INSTAGRAM}
                onChange={e => handleInputChange('BUSINESS_INSTAGRAM', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
          </div>
        </div>

        {/* Bank Transfer Details Section */}
        <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E4E9]">
            <h2 className="font-semibold text-[#32113C] font-serif text-lg">Bank Transfer Account Details</h2>
            <span className="text-xs bg-[#E7F5EE] text-[#247A52] font-medium px-2.5 py-1 rounded-full">
              Invoices &amp; Quotations
            </span>
          </div>

          <p className="text-xs text-[#7E7781]">
            These bank transfer details will automatically populate on generated Quotation &amp; Receipt PDFs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.BANK_NAME}
                onChange={e => handleInputChange('BANK_NAME', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Account Number</label>
              <input
                type="text"
                value={formData.BANK_ACCOUNT_NUMBER}
                onChange={e => handleInputChange('BANK_ACCOUNT_NUMBER', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1">Account Name</label>
              <input
                type="text"
                value={formData.BANK_ACCOUNT_NAME}
                onChange={e => handleInputChange('BANK_ACCOUNT_NAME', e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#514B54] mb-1">Default Deposit Percentage (%)</label>
            <input
              type="number"
              min="10"
              max="100"
              value={formData.DEFAULT_DEPOSIT_PERCENTAGE}
              onChange={e => handleInputChange('DEFAULT_DEPOSIT_PERCENTAGE', e.target.value)}
              className="w-full sm:w-48 px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
            />
          </div>
        </div>

        {/* Save Settings Action Button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={savingSettings}
            className={`px-8 py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
              settingsSuccess
                ? 'bg-[#247A52] text-white'
                : 'bg-gradient-to-r from-[#652278] to-[#4A175B] hover:opacity-95 text-white'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {savingSettings ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : settingsSuccess ? (
              '✓ Settings saved successfully'
            ) : (
              'Save All Settings'
            )}
          </button>
        </div>
      </form>

      {/* Security & Password Management Section */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-6 space-y-6 pt-6 mt-8">
        <div className="flex items-center justify-between pb-2 border-b border-[#E8E4E9]">
          <div>
            <h2 className="font-semibold text-[#32113C] font-serif text-lg">Security &amp; Password</h2>
            <p className="text-xs text-[#7E7781]">Update your account credentials ({session.email})</p>
          </div>
          <span className="text-xs bg-[#FDEBEC] text-[#B83B42] font-medium px-2.5 py-1 rounded-full">
            Security Control
          </span>
        </div>

        {passwordError && (
          <div className="p-4 bg-[#FDEBEC] border border-[#B83B42] rounded-xl text-[#B83B42] text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-4 bg-[#E7F5EE] border border-[#247A52] rounded-xl text-[#247A52] text-sm flex items-center gap-2">
            <span>✓</span>
            <span>Password changed successfully. Your new password is active.</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-[#514B54] mb-1" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={e => {
                setCurrentPassword(e.target.value);
                setPasswordError('');
              }}
              required
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1" htmlFor="newPassword">
                New Password (min 8 chars)
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  setPasswordError('');
                }}
                required
                minLength={8}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#514B54] mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                required
                minLength={8}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-6 py-2.5 bg-[#32113C] hover:bg-[#4A175B] text-white rounded-xl font-semibold text-xs transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
            >
              {changingPassword ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Updating Password...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
