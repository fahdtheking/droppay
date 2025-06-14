import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, CreditCard, FileText, Check, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AgentSlot from '../../components/AgentSlot';

const ResellerOnboarding = () => {
  const [selectedRole, setSelectedRole] = useState<'solo' | 'team_leader' | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    currency: 'USD',
    timezone: '',
    language: 'en',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    paypalEmail: '',
    agreementSigned: false
  });

  const countries = [
    { code: 'US', name: 'United States', currency: 'USD', timezone: 'America/New_York' },
    { code: 'UK', name: 'United Kingdom', currency: 'GBP', timezone: 'Europe/London' },
    { code: 'CA', name: 'Canada', currency: 'CAD', timezone: 'America/Toronto' },
    { code: 'AU', name: 'Australia', currency: 'AUD', timezone: 'Australia/Sydney' },
    { code: 'DE', name: 'Germany', currency: 'EUR', timezone: 'Europe/Berlin' },
    { code: 'FR', name: 'France', currency: 'EUR', timezone: 'Europe/Paris' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Auto-set currency and timezone when country changes
    if (name === 'country') {
      const selectedCountry = countries.find(c => c.code === value);
      if (selectedCountry) {
        setFormData({
          ...formData,
          [name]: value,
          currency: selectedCountry.currency,
          timezone: selectedCountry.timezone
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      });
    }
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreementSigned) {
      setError('Please agree to the reseller agreement');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Map form data to match database schema
      const registrationData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        country: formData.country,
        currency: formData.currency,
        timezone: formData.timezone,
        language: formData.language,
        resellerType: selectedRole,
        payoutInfo: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber,
          paypalEmail: formData.paypalEmail
        },
        preferences: {
          notifications: {
            email: true,
            sms: false
          },
          marketing: {
            email: true,
            sms: false
          }
        }
      };

      await register(registrationData, 'reseller');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailAlreadyRegisteredError = error.includes('This email is already registered') || error.includes('User already registered');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DP</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DropPay
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/register"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to Options</span>
              </Link>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Reseller Onboarding</h1>
            <p className="text-gray-600">Start earning with our powerful reseller program</p>
          </div>

          {/* AI Agent */}
          <div className="mb-8">
            <AgentSlot 
              agentName="Reseller Success AI"
              description="I'll guide you through the setup and help optimize your earning potential"
            />
          </div>

          {/* Role Selection */}
          {!selectedRole && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Your Role</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div 
                  onClick={() => setSelectedRole('solo')}
                  className="cursor-pointer group border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <User className="text-blue-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Solo Reseller</h3>
                    <p className="text-gray-600 mb-4">Perfect for individuals looking to earn extra income</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• 10-15% commission on sales</li>
                      <li>• Personal dashboard</li>
                      <li>• Marketing materials provided</li>
                      <li>• Weekly payouts</li>
                    </ul>
                  </div>
                </div>

                <div 
                  onClick={() => setSelectedRole('team_leader')}
                  className="cursor-pointer group border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                      <Users className="text-purple-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Team Leader</h3>
                    <p className="text-gray-600 mb-4">Build and manage your own reseller network</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• 15-25% commission on sales</li>
                      <li>• 5% bonus from team sales</li>
                      <li>• Team management tools</li>
                      <li>• Advanced analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onboarding Form */}
          {selectedRole && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedRole === 'solo' ? 'Solo Reseller' : 'Team Leader'} Setup
                </h2>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Change Role
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-800 text-sm">{error}</p>
                    {isEmailAlreadyRegisteredError && (
                      <div className="mt-2">
                        <Link
                          to="/login"
                          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Go to Login Page →
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Account Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select your country</option>
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <input
                        type="text"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        placeholder="Auto-filled based on country"
                        readOnly
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payout Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Payout Information</h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your bank name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Account number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Routing Number *
                      </label>
                      <input
                        type="text"
                        name="routingNumber"
                        value={formData.routingNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Routing number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PayPal Email (Optional)
                      </label>
                      <input
                        type="email"
                        name="paypalEmail"
                        value={formData.paypalEmail}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="paypal@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Legal Agreement */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Legal Agreement</h3>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 max-h-48 overflow-y-auto">
                    <h4 className="font-semibold mb-2">Reseller Agreement Summary</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      By joining as a reseller, you agree to:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Promote DropPay products ethically and accurately</li>
                      <li>• Maintain customer confidentiality and data protection</li>
                      <li>• Follow all marketing guidelines and brand standards</li>
                      <li>• Report sales activities accurately and transparently</li>
                      <li>• Comply with all applicable laws and regulations</li>
                    </ul>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="agreementSigned"
                      checked={formData.agreementSigned}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-600">
                      I have read and agree to the{' '}
                      <a href="#" className="text-blue-600 hover:underline">Reseller Agreement</a>
                      {' '}and{' '}
                      <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!formData.agreementSigned || isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Complete Onboarding'
                  )}
                </button>
              </form>

              {/* Next Steps */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Account verification (24-48 hours)</li>
                  <li>• Access to reseller dashboard and materials</li>
                  <li>• Welcome training session scheduled</li>
                  <li>• First commission tracking begins</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResellerOnboarding;