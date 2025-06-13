import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Globe, 
  CreditCard,
  Percent,
  ArrowRight,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import AgentSlot from '../../components/AgentSlot';

const TransactionSimulator = () => {
  const [simulationData, setSimulationData] = useState({
    productPrice: '',
    productCategory: '',
    buyerCountry: '',
    paymentMethod: '',
    quantity: '1',
    customerType: 'new'
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const categories = [
    { value: 'software', label: 'Software & SaaS', rate: 0.15 },
    { value: 'electronics', label: 'Electronics', rate: 0.12 },
    { value: 'fashion', label: 'Fashion & Apparel', rate: 0.18 },
    { value: 'books', label: 'Books & Media', rate: 0.10 },
    { value: 'home', label: 'Home & Garden', rate: 0.14 },
    { value: 'health', label: 'Health & Beauty', rate: 0.16 },
    { value: 'sports', label: 'Sports & Outdoors', rate: 0.13 },
    { value: 'automotive', label: 'Automotive', rate: 0.11 }
  ];

  const countries = [
    { value: 'US', label: 'United States', taxRate: 0.08, processingFee: 0.029 },
    { value: 'UK', label: 'United Kingdom', taxRate: 0.20, processingFee: 0.032 },
    { value: 'CA', label: 'Canada', taxRate: 0.13, processingFee: 0.030 },
    { value: 'AU', label: 'Australia', taxRate: 0.10, processingFee: 0.031 },
    { value: 'DE', label: 'Germany', taxRate: 0.19, processingFee: 0.033 },
    { value: 'FR', label: 'France', taxRate: 0.20, processingFee: 0.033 },
    { value: 'JP', label: 'Japan', taxRate: 0.10, processingFee: 0.034 },
    { value: 'SG', label: 'Singapore', taxRate: 0.07, processingFee: 0.035 }
  ];

  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card', fee: 0.029 },
    { value: 'paypal', label: 'PayPal', fee: 0.034 },
    { value: 'bank', label: 'Bank Transfer', fee: 0.015 },
    { value: 'crypto', label: 'Cryptocurrency', fee: 0.025 },
    { value: 'apple', label: 'Apple Pay', fee: 0.030 },
    { value: 'google', label: 'Google Pay', fee: 0.030 }
  ];

  const handleInputChange = (field: string, value: string) => {
    setSimulationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const runSimulation = () => {
    if (!simulationData.productPrice || !simulationData.buyerCountry || !simulationData.paymentMethod) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const price = parseFloat(simulationData.productPrice);
      const quantity = parseInt(simulationData.quantity);
      const subtotal = price * quantity;

      const country = countries.find(c => c.value === simulationData.buyerCountry)!;
      const category = categories.find(c => c.value === simulationData.productCategory)!;
      const payment = paymentMethods.find(p => p.value === simulationData.paymentMethod)!;

      // Calculations
      const tax = subtotal * country.taxRate;
      const paymentProcessingFee = subtotal * payment.fee;
      const platformFee = subtotal * 0.025; // 2.5% platform fee
      const commissionRate = category ? category.rate : 0.15;
      const commission = subtotal * commissionRate;
      
      const total = subtotal + tax + paymentProcessingFee + platformFee;
      const netEarnings = commission - (commission * 0.1); // 10% team bonus
      const teamBonus = commission * 0.1;

      const calculatedResults = {
        subtotal,
        tax,
        paymentProcessingFee,
        platformFee,
        commission,
        teamBonus,
        netEarnings,
        total,
        breakdown: {
          subtotal: (subtotal / total) * 100,
          tax: (tax / total) * 100,
          fees: ((paymentProcessingFee + platformFee) / total) * 100,
          commission: (commission / total) * 100
        }
      };

      setResults(calculatedResults);
      setIsCalculating(false);
    }, 1500);
  };

  const resetSimulation = () => {
    setSimulationData({
      productPrice: '',
      productCategory: '',
      buyerCountry: '',
      paymentMethod: '',
      quantity: '1',
      customerType: 'new'
    });
    setResults(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Transaction Simulator</h1>
          <p className="text-gray-600">Calculate earnings, fees, and margins before launching campaigns</p>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Transaction Simulator AI"
            description="I analyze transaction scenarios and optimize pricing strategies for maximum profitability"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Calculator className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Simulation Parameters</h2>
            </div>

            <div className="space-y-6">
              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Product Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Price (USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        value={simulationData.productPrice}
                        onChange={(e) => handleInputChange('productPrice', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={simulationData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Category
                  </label>
                  <select
                    value={simulationData.productCategory}
                    onChange={(e) => handleInputChange('productCategory', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label} ({(category.rate * 100).toFixed(1)}% commission)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Customer Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buyer Country *
                  </label>
                  <select
                    value={simulationData.buyerCountry}
                    onChange={(e) => handleInputChange('buyerCountry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label} ({(country.taxRate * 100).toFixed(1)}% tax)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method *
                    </label>
                    <select
                      value={simulationData.paymentMethod}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select method</option>
                      {paymentMethods.map((method) => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer Type
                    </label>
                    <select
                      value={simulationData.customerType}
                      onChange={(e) => handleInputChange('customerType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="new">New Customer</option>
                      <option value="returning">Returning Customer</option>
                      <option value="vip">VIP Customer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={runSimulation}
                  disabled={isCalculating}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <Calculator size={16} />
                      <span>Run Simulation</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="text-green-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Simulation Results</h2>
            </div>

            {!results ? (
              <div className="text-center py-12">
                <PieChart className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">Run a simulation to see detailed results</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="text-green-600" size={16} />
                      <span className="text-sm font-medium text-green-800">Your Commission</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ${results.commission.toFixed(2)}
                    </p>
                    <p className="text-xs text-green-700">
                      {((results.commission / results.subtotal) * 100).toFixed(1)}% of subtotal
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="text-blue-600" size={16} />
                      <span className="text-sm font-medium text-blue-800">Net Earnings</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      ${results.netEarnings.toFixed(2)}
                    </p>
                    <p className="text-xs text-blue-700">After team bonus</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Percent className="text-purple-600" size={16} />
                      <span className="text-sm font-medium text-purple-800">Team Bonus</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      ${results.teamBonus.toFixed(2)}
                    </p>
                    <p className="text-xs text-purple-700">10% of commission</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="text-gray-600" size={16} />
                      <span className="text-sm font-medium text-gray-800">Customer Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-600">
                      ${results.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-700">Including all fees</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Transaction Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${results.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${results.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Payment Processing Fee</span>
                      <span className="font-medium">${results.paymentProcessingFee.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-medium">${results.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span>${results.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Visual Breakdown */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Visual Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="text-sm text-gray-600">Subtotal ({results.breakdown.subtotal.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${results.breakdown.subtotal}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center space-x-3 mt-3">
                      <div className="w-4 h-4 bg-red-600 rounded"></div>
                      <span className="text-sm text-gray-600">Tax ({results.breakdown.tax.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-600 h-3 rounded-full"
                        style={{ width: `${results.breakdown.tax}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center space-x-3 mt-3">
                      <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                      <span className="text-sm text-gray-600">Fees ({results.breakdown.fees.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-yellow-600 h-3 rounded-full"
                        style={{ width: `${results.breakdown.fees}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download size={16} />
                    <span>Export Report</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 size={16} />
                    <span>Share Results</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionSimulator;