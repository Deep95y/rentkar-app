// src/app/admin/settings/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type SystemSettings = {
  general: {
    appName: string;
    appVersion: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    maxUsers: number;
    sessionTimeout: number;
  };
  business: {
    currency: string;
    timezone: string;
    businessHours: {
      start: string;
      end: string;
    };
    deliveryRadius: number;
    cancellationPolicy: string;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    adminNotifications: boolean;
  };
  security: {
    passwordMinLength: number;
    requireEmailVerification: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  api: {
    rateLimitPerMinute: number;
    apiKeyExpiry: number;
    webhookUrl: string;
    externalIntegrations: boolean;
  };
};

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      appName: 'Rentkar',
      appVersion: '1.0.0',
      maintenanceMode: false,
      registrationEnabled: true,
      maxUsers: 10000,
      sessionTimeout: 24,
    },
    business: {
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      businessHours: {
        start: '09:00',
        end: '21:00',
      },
      deliveryRadius: 50,
      cancellationPolicy: '24 hours before booking',
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      adminNotifications: true,
    },
    security: {
      passwordMinLength: 8,
      requireEmailVerification: true,
      twoFactorAuth: false,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
    },
    api: {
      rateLimitPerMinute: 100,
      apiKeyExpiry: 30,
      webhookUrl: '',
      externalIntegrations: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'business' | 'notifications' | 'security' | 'api'>('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // This would be a real API call to get system settings
      // For now, we'll use the default settings
      setLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      // This would be a real API call to save settings
      console.log('Saving settings:', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: keyof SystemSettings, parentField: string, childField: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...(prev[section] as any)[parentField],
          [childField]: value
        }
      }
    }));
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        general: {
          appName: 'Rentkar',
          appVersion: '1.0.0',
          maintenanceMode: false,
          registrationEnabled: true,
          maxUsers: 10000,
          sessionTimeout: 24,
        },
        business: {
          currency: 'INR',
          timezone: 'Asia/Kolkata',
          businessHours: {
            start: '09:00',
            end: '21:00',
          },
          deliveryRadius: 50,
          cancellationPolicy: '24 hours before booking',
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: true,
          pushEnabled: true,
          adminNotifications: true,
        },
        security: {
          passwordMinLength: 8,
          requireEmailVerification: true,
          twoFactorAuth: false,
          sessionTimeout: 24,
          maxLoginAttempts: 5,
        },
        api: {
          rateLimitPerMinute: 100,
          apiKeyExpiry: 30,
          webhookUrl: '',
          externalIntegrations: false,
        },
      });
      alert('Settings reset to defaults!');
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'api', name: 'API', icon: '🔗' },
  ] as const;

  if (loading) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600">Configure system-wide settings and preferences</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  ← Back to Dashboard
                </Link>
                <button
                  onClick={resetToDefaults}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application Name
                        </label>
                        <input
                          type="text"
                          value={settings.general.appName}
                          onChange={(e) => handleInputChange('general', 'appName', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application Version
                        </label>
                        <input
                          type="text"
                          value={settings.general.appVersion}
                          onChange={(e) => handleInputChange('general', 'appVersion', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Users
                        </label>
                        <input
                          type="number"
                          value={settings.general.maxUsers}
                          onChange={(e) => handleInputChange('general', 'maxUsers', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (hours)
                        </label>
                        <input
                          type="number"
                          value={settings.general.sessionTimeout}
                          onChange={(e) => handleInputChange('general', 'sessionTimeout', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="maintenanceMode"
                          checked={settings.general.maintenanceMode}
                          onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                          Maintenance Mode
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="registrationEnabled"
                          checked={settings.general.registrationEnabled}
                          onChange={(e) => handleInputChange('general', 'registrationEnabled', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="registrationEnabled" className="ml-2 block text-sm text-gray-900">
                          Enable User Registration
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'business' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Business Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={settings.business.currency}
                          onChange={(e) => handleInputChange('business', 'currency', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.business.timezone}
                          onChange={(e) => handleInputChange('business', 'timezone', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Hours Start
                        </label>
                        <input
                          type="time"
                          value={settings.business.businessHours.start}
                          onChange={(e) => handleNestedInputChange('business', 'businessHours', 'start', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Hours End
                        </label>
                        <input
                          type="time"
                          value={settings.business.businessHours.end}
                          onChange={(e) => handleNestedInputChange('business', 'businessHours', 'end', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Radius (km)
                        </label>
                        <input
                          type="number"
                          value={settings.business.deliveryRadius}
                          onChange={(e) => handleInputChange('business', 'deliveryRadius', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cancellation Policy
                      </label>
                      <textarea
                        value={settings.business.cancellationPolicy}
                        onChange={(e) => handleInputChange('business', 'cancellationPolicy', e.target.value)}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        placeholder="Enter cancellation policy details"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="emailEnabled"
                          checked={settings.notifications.emailEnabled}
                          onChange={(e) => handleInputChange('notifications', 'emailEnabled', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="emailEnabled" className="ml-2 block text-sm text-gray-900">
                          Enable Email Notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="smsEnabled"
                          checked={settings.notifications.smsEnabled}
                          onChange={(e) => handleInputChange('notifications', 'smsEnabled', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="smsEnabled" className="ml-2 block text-sm text-gray-900">
                          Enable SMS Notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="pushEnabled"
                          checked={settings.notifications.pushEnabled}
                          onChange={(e) => handleInputChange('notifications', 'pushEnabled', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="pushEnabled" className="ml-2 block text-sm text-gray-900">
                          Enable Push Notifications
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="adminNotifications"
                          checked={settings.notifications.adminNotifications}
                          onChange={(e) => handleInputChange('notifications', 'adminNotifications', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="adminNotifications" className="ml-2 block text-sm text-gray-900">
                          Enable Admin Notifications
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Password Length
                        </label>
                        <input
                          type="number"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => handleInputChange('security', 'passwordMinLength', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (hours)
                        </label>
                        <input
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleInputChange('security', 'sessionTimeout', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Login Attempts
                        </label>
                        <input
                          type="number"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => handleInputChange('security', 'maxLoginAttempts', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="requireEmailVerification"
                          checked={settings.security.requireEmailVerification}
                          onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-900">
                          Require Email Verification
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="twoFactorAuth"
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-900">
                          Enable Two-Factor Authentication
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">API Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rate Limit (requests per minute)
                        </label>
                        <input
                          type="number"
                          value={settings.api.rateLimitPerMinute}
                          onChange={(e) => handleInputChange('api', 'rateLimitPerMinute', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Key Expiry (days)
                        </label>
                        <input
                          type="number"
                          value={settings.api.apiKeyExpiry}
                          onChange={(e) => handleInputChange('api', 'apiKeyExpiry', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          value={settings.api.webhookUrl}
                          onChange={(e) => handleInputChange('api', 'webhookUrl', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900"
                          placeholder="https://example.com/webhook"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="externalIntegrations"
                          checked={settings.api.externalIntegrations}
                          onChange={(e) => handleInputChange('api', 'externalIntegrations', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="externalIntegrations" className="ml-2 block text-sm text-gray-900">
                          Enable External Integrations
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
