//components/Lab/customization/ReportCustomization.tsx
'use client';

import { useReport } from '@/app/context/ReportContext';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

export const ReportCustomization = () => {
  const { customization, updateCustomization, saveCustomization, loading } =
    useReport();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const signatureFileInputs = useRef<Record<number, HTMLInputElement | null>>(
    {}
  );

  // Initialize signatories if not exists
  const signatories = customization.signatories || [];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB');
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

  const handleSignatureUpload = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error('Signature image must be less than 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedSignatories = [...signatories];
        updatedSignatories[index] = {
          ...updatedSignatories[index],
          signatureImage: e.target?.result as string,
        };
        updateCustomization({ signatories: updatedSignatories });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSignature = (index: number) => {
    const updatedSignatories = [...signatories];
    updatedSignatories[index] = {
      ...updatedSignatories[index],
      signatureImage: '',
    };
    updateCustomization({ signatories: updatedSignatories });

    const input = signatureFileInputs.current[index];
    if (input) {
      input.value = '';
    }
  };

  const addSignatory = () => {
    const newSignatory = {
      name: '',
      designation: '',
      qualification: '',
      licenseNumber: '',
      signatureImage: '',
    };
    const updatedSignatories = [...signatories, newSignatory];
    updateCustomization({ signatories: updatedSignatories });
  };

  const removeSignatory = (index: number) => {
    const updatedSignatories = signatories.filter((_, i) => i !== index);
    updateCustomization({ signatories: updatedSignatories });
  };

  const updateSignatory = (index: number, field: string, value: string) => {
    const updatedSignatories = [...signatories];
    updatedSignatories[index] = {
      ...updatedSignatories[index],
      [field]: value,
    };
    updateCustomization({ signatories: updatedSignatories });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      const result = await saveCustomization();
      if (result.success) {
        toast.success(result.message || 'Customization saved successfully!');
      } else {
        toast.error(result.message || 'Error saving customization');
      }
      setSaveMessage({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Error saving customization';
      toast.error(errorMessage);
      setSaveMessage({
        type: 'error',
        message: errorMessage,
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
      signatories: [
        {
          name: 'Dr. John Smith',
          designation: 'Laboratory Director',
          qualification: 'MD, Pathologist',
          licenseNumber: 'MED-12345',
          signatureImage: '',
        },
      ],
    });
    toast.success('Reset to default settings');
  };

  const colorPresets = {
    header: ['#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B'],
    accent: ['#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F59E0B'],
  };

  // Skeleton Loader Component
  const SkeletonField = ({ className = '' }: { className?: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}></div>
  );

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <SkeletonField className="h-8 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column Skeleton */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <SkeletonField className="h-6 w-48 mb-4" />
              <SkeletonField className="h-12 w-full" />
              <div className="flex items-center space-x-4">
                <SkeletonField className="h-16 w-16 rounded-lg" />
                <SkeletonField className="h-10 flex-1" />
              </div>
              <SkeletonField className="h-20 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <SkeletonField className="h-12" />
                <SkeletonField className="h-12" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <SkeletonField className="h-6 w-40 mb-4" />
              <div className="flex items-center space-x-3">
                <SkeletonField className="h-12 w-12 rounded-lg" />
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonField key={i} className="w-8 h-8 rounded" />
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <SkeletonField className="h-12 w-12 rounded-lg" />
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonField key={i} className="w-8 h-8 rounded" />
                  ))}
                </div>
              </div>
              <SkeletonField className="h-12 w-full" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <SkeletonField className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <SkeletonField className="h-12" />
                <SkeletonField className="h-12" />
              </div>
              <SkeletonField className="h-12 w-full" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <SkeletonField className="w-4 h-4 rounded" />
                    <SkeletonField className="h-4 flex-1" />
                  </div>
                ))}
              </div>
              <SkeletonField className="h-16 w-full" />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <SkeletonField className="h-6 w-40 mb-4" />
              <div className="bg-white p-4 border rounded-lg shadow-sm space-y-3">
                <SkeletonField className="h-16 w-full rounded-t-lg" />
                <SkeletonField className="h-8 w-full" />
                <SkeletonField className="h-12 w-full" />
                <SkeletonField className="h-6 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <SkeletonField className="h-10 w-32" />
          <div className="flex space-x-3">
            <SkeletonField className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Report Customization
        </h2>
      </div>

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

          {/* Signatories Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Signatories
              </h3>
              <button
                onClick={addSignatory}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer text-sm"
              >
                <Plus size={16} />
                Add Signatory
              </button>
            </div>

            <div className="space-y-4">
              {signatories.map((signatory: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-700">
                      Signatory #{index + 1}
                    </h4>
                    <button
                      onClick={() => removeSignatory(index)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={signatory.name}
                          onChange={(e) =>
                            updateSignatory(index, 'name', e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="Dr. John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Designation *
                        </label>
                        <input
                          type="text"
                          value={signatory.designation}
                          onChange={(e) =>
                            updateSignatory(
                              index,
                              'designation',
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="Laboratory Director"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Qualification
                        </label>
                        <input
                          type="text"
                          value={signatory.qualification}
                          onChange={(e) =>
                            updateSignatory(
                              index,
                              'qualification',
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="MD, Pathologist"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          License Number
                        </label>
                        <input
                          type="text"
                          value={signatory.licenseNumber}
                          onChange={(e) =>
                            updateSignatory(
                              index,
                              'licenseNumber',
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          placeholder="MED-12345"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Signature Image
                      </label>
                      <div className="flex items-center space-x-3">
                        {signatory.signatureImage ? (
                          <div className="relative">
                            <img
                              src={signatory.signatureImage}
                              alt={`${signatory.name}'s signature`}
                              className="h-12 object-contain border rounded"
                            />
                            <button
                              onClick={() => handleRemoveSignature(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div className="h-12 w-32 border border-dashed border-gray-300 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              No signature
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            ref={(el) => {
                              signatureFileInputs.current[index] = el;
                            }}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSignatureUpload(index, e)}
                            className="w-full p-1 border border-gray-300 rounded text-xs"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload signature image (transparent PNG recommended)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {signatories.length === 0 && (
                <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-sm">
                    No signatories added yet.
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Click "Add Signatory" to add authorized signatories to your
                    reports.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Design Settings, Layout Options, Live Preview */}
        <div className="space-y-6">
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

          {/* Layout Options */}
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

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Live Preview
            </h3>
            <div className="bg-white p-4 border rounded-lg shadow-sm">
              <div
                className="p-4 text-white rounded-t-lg"
                style={{ backgroundColor: customization.headerColor }}
              >
                <div className="flex items-center justify-between">
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
                        {customization.labName || 'Your Lab Name'}
                      </h4>
                      <p className="text-white/80 text-sm">
                        {customization.labAddress || 'Lab Address Here'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/90 text-sm">
                      {customization.labPhone || '+1 234 567 890'}
                    </p>
                    <p className="text-white/80 text-sm">
                      {customization.labEmail || 'contact@lab.com'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Patient: John Doe • Report ID: RPT-12345
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Collection Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-xs">
                      Generated: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-700 text-sm mb-2">
                    Test Results Preview
                  </h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Complete Blood Count
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: customization.accentColor }}
                      >
                        Completed
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lipid Profile</span>
                      <span
                        className="font-medium"
                        style={{ color: customization.accentColor }}
                      >
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  This is a preview of how your report will look with current
                  settings.
                </p>
              </div>
              <div className="p-4 bg-gray-50 border-t">
                {/* Footer Preview with Inline Signatures */}
                <div className="mb-3">
                  <div className="flex flex-row items-start justify-between gap-4">
                    {customization.signatories &&
                    customization.signatories.length > 0 ? (
                      customization.signatories.slice(0, 3).map((sig, idx) => (
                        <div key={idx} className="flex-1 text-center">
                          <div className="h-8 mb-1 flex items-center justify-center">
                            {sig.signatureImage ? (
                              <img
                                src={sig.signatureImage}
                                alt="Signature"
                                className="h-8 mx-auto object-contain"
                              />
                            ) : (
                              <div className="w-16 h-px bg-gray-300"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 font-medium truncate">
                            {sig.name || 'Dr. John Smith'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {sig.designation || 'Laboratory Director'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 text-center">
                        <div className="h-8 mb-1 flex items-center justify-center">
                          <div className="w-16 h-px bg-gray-300"></div>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">
                          Authorized Signatory
                        </p>
                        <p className="text-xs text-gray-500">
                          Laboratory Director
                        </p>
                      </div>
                    )}
                    {customization.includeQRCode && (
                      <div className="text-center">
                        <div className="w-10 h-10 bg-white border rounded flex items-center justify-center mx-auto mb-1">
                          <div className="text-center">
                            <div className="text-[6px] text-gray-400">QR</div>
                          </div>
                        </div>
                        <p className="text-[8px] text-gray-500">
                          Scan to Verify
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center pt-3 border-t">
                  <p className="text-xs text-gray-500 truncate">
                    {customization.footerText ||
                      'This report is generated electronically and valid without signature'}
                  </p>
                  {customization.showWatermark && (
                    <p className="text-xs text-gray-400 mt-1">
                      Powered by LabSphere • www.labsphere.com
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          Reset to Default
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[#007a7a] text-white rounded-lg hover:bg-[#006a6a] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
