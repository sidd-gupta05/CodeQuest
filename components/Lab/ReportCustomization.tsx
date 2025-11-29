// components/Lab/ReportCustomization.tsx
'use client';

import { useReport } from '@/app/context/ReportContext';
import { useState, useRef } from 'react';

export const ReportCustomization = () => {
  const {
    customization,
    updateCustomization,
    saveCustomization,
    previewMode,
    setPreviewMode,
  } = useReport();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSaveMessage({
          type: 'error',
          message: 'Logo must be less than 2MB',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        updateCustomization({ labLogo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    updateCustomization({ labLogo: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      const result = await saveCustomization();
      setSaveMessage({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
    } catch (error: any) {
      setSaveMessage({
        type: 'error',
        message: error.message || 'Error saving customization',
      });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleReset = () => {
    updateCustomization({
      labName: 'Your Lab Name',
      labLogo: '',
      labAddress: 'Lab Address Here',
      labPhone: '+1 234 567 890',
      labEmail: 'contact@lab.com',
      headerColor: '#3B82F6',
      accentColor: '#10B981',
      showWatermark: true,
      includeQRCode: true,
      template: 'standard',
      footerText:
        'This report is generated electronically and valid without signature',
      includeInterpretation: true,
      includeComments: true,
      pageSize: 'a4',
      fontSize: 'medium',
      printMargins: 'normal',
    });
  };

  const colorPresets = {
    header: ['#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B'],
    accent: ['#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F59E0B'],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Report Customization
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`mb-4 p-3 rounded-md ${
            saveMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveMessage.message}
        </div>
      )}

      {!previewMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lab Information */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Lab Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lab Name *
                  </label>
                  <input
                    type="text"
                    value={customization.labName}
                    onChange={(e) =>
                      updateCustomization({ labName: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter lab name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lab Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    {customization.labLogo && (
                      <div className="relative">
                        <img
                          src={customization.labLogo}
                          alt="Lab Logo"
                          className="h-16 w-16 object-contain border rounded-lg"
                        />
                        <button
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: 200x200px, PNG or JPG
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lab Address
                  </label>
                  <textarea
                    value={customization.labAddress}
                    onChange={(e) =>
                      updateCustomization({ labAddress: e.target.value })
                    }
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter lab address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={customization.labPhone}
                      onChange={(e) =>
                        updateCustomization({ labPhone: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={customization.labEmail}
                      onChange={(e) =>
                        updateCustomization({ labEmail: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="contact@lab.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Design Settings */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Design Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={customization.headerColor}
                      onChange={(e) =>
                        updateCustomization({ headerColor: e.target.value })
                      }
                      className="w-12 h-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <div className="flex space-x-2">
                      {colorPresets.header.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            updateCustomization({ headerColor: color })
                          }
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={customization.accentColor}
                      onChange={(e) =>
                        updateCustomization({ accentColor: e.target.value })
                      }
                      className="w-12 h-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <div className="flex space-x-2">
                      {colorPresets.accent.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            updateCustomization({ accentColor: color })
                          }
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Template
                  </label>
                  <select
                    value={customization.template}
                    onChange={(e) =>
                      updateCustomization({ template: e.target.value as any })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard Template</option>
                    <option value="premium">Premium Template</option>
                    <option value="minimal">Minimal Template</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Options */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Layout Options
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Page Size
                    </label>
                    <select
                      value={customization.pageSize}
                      onChange={(e) =>
                        updateCustomization({ pageSize: e.target.value as any })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="a4">A4</option>
                      <option value="letter">Letter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      value={customization.fontSize}
                      onChange={(e) =>
                        updateCustomization({ fontSize: e.target.value as any })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Print Margins
                  </label>
                  <select
                    value={customization.printMargins}
                    onChange={(e) =>
                      updateCustomization({
                        printMargins: e.target.value as any,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="narrow">Narrow</option>
                    <option value="normal">Normal</option>
                    <option value="wide">Wide</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={customization.showWatermark}
                      onChange={(e) =>
                        updateCustomization({ showWatermark: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Show LabSphere Watermark
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={customization.includeQRCode}
                      onChange={(e) =>
                        updateCustomization({ includeQRCode: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Include QR Code for Verification
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={customization.includeInterpretation}
                      onChange={(e) =>
                        updateCustomization({
                          includeInterpretation: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Include Interpretation Section
                    </span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={customization.includeComments}
                      onChange={(e) =>
                        updateCustomization({
                          includeComments: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Include Comments Section
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Text
                  </label>
                  <textarea
                    value={customization.footerText}
                    onChange={(e) =>
                      updateCustomization({ footerText: e.target.value })
                    }
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter footer text"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Live Preview
              </h3>
              <div className="bg-white p-4 border rounded-lg shadow-sm">
                <div
                  className="p-4 text-white rounded-t-lg"
                  style={{ backgroundColor: customization.headerColor }}
                >
                  <div className="flex items-center space-x-3">
                    {customization.labLogo && (
                      <img
                        src={customization.labLogo}
                        alt="Lab Logo"
                        className="h-12 w-12 object-contain bg-white rounded p-1"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-lg">
                        {customization.labName}
                      </h4>
                      <p className="text-white/80 text-sm">
                        {customization.labAddress}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <p className="text-gray-600 text-sm">
                    Patient: John Doe • Report ID: RPT-12345
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500">
                    Preview of your report header with current customization
                  </p>
                </div>
                {customization.showWatermark && (
                  <div className="p-2 bg-gray-50 border-t text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-xs text-gray-500">
                        Powered by LabSphere
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Preview Mode
            </h3>
            <p className="text-gray-600 mb-6">
              Your changes are being previewed. Switch back to edit mode to make
              changes.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Remember to save your changes before exiting!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <button
          onClick={handleReset}
          disabled={previewMode}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Reset to Default
        </button>

        <div className="flex space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {previewMode ? 'Edit Customization' : 'Preview Changes'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || previewMode}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
