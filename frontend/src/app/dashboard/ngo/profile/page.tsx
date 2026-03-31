'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getMyNGO, createNGO, updateNGO } from '@/services/api';
import { NGO } from '@/types';
import toast from 'react-hot-toast';
import { MainLayout } from '@/components/layout';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { getErrorMessage } from '@/utils/errorHandler';

export default function NGOProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [ngo, setNgo] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNGO = useCallback(async () => {
    try {
      const response = await getMyNGO();
      setNgo(response.data);
      setFormData({
        name: response.data.name,
        description: response.data.description,
        address: response.data.address,
        contactEmail: response.data.contactEmail,
        contactPhone: response.data.contactPhone || '',
      });
    } catch {
      setNgo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'NGO') {
      router.push('/');
      return;
    }
    fetchNGO();
  }, [mounted, isAuthenticated, user, router, fetchNGO]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'NGO name is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.contactEmail.trim())
      newErrors.contactEmail = 'Contact email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.contactEmail))
      newErrors.contactEmail = 'Enter a valid email';
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaving(true);
    try {
      if (ngo) {
        await updateNGO(ngo._id, formData);
        toast.success('Profile updated successfully');
      } else {
        await createNGO(formData);
        toast.success('NGO profile created — pending admin verification');
      }
      router.push('/dashboard/ngo');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to save profile'));
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/dashboard/ngo"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {ngo ? 'Edit NGO Profile' : 'Create NGO Profile'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {ngo
              ? 'Update your organization details'
              : 'Set up your organization profile to start posting events'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">
              Organization Details
            </h2>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Organization Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Green Earth Foundation"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.name
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell volunteers about your organization and mission..."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none ${
                  errors.description
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, Mumbai, Maharashtra"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.address
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
            <h2 className="text-base font-semibold text-gray-900">
              Contact Information
            </h2>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="contact@yourorg.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                  errors.contactEmail
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactEmail}
                </p>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contact Phone{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard/ngo"
              className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {ngo ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}