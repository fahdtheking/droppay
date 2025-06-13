import React, { useState } from 'react';
import { 
  Zap, 
  Wand2, 
  Video, 
  Mic, 
  Image, 
  Copy, 
  Download, 
  Share2, 
  Play, 
  Pause,
  Eye,
  Settings,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import AgentSlot from '../../components/AgentSlot';

const CampaignStudio = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({
    copy: '',
    image: '',
    video: '',
    voice: ''
  });

  const [campaignData, setCampaignData] = useState({
    productName: '',
    targetAudience: '',
    campaignGoal: '',
    tone: 'professional',
    channels: []
  });

  const steps = [
    { number: 1, title: 'Campaign Setup', description: 'Define your campaign basics' },
    { number: 2, title: 'Content Generation', description: 'AI-powered content creation' },
    { number: 3, title: 'Review & Export', description: 'Finalize and download' }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and trustworthy' },
    { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
    { value: 'exciting', label: 'Exciting', description: 'Energetic and dynamic' },
    { value: 'luxury', label: 'Luxury', description: 'Premium and exclusive' }
  ];

  const channelOptions = [
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'email', label: 'Email Marketing', icon: Copy },
    { id: 'web', label: 'Website Banner', icon: Image },
    { id: 'video', label: 'Video Ads', icon: Video }
  ];

  const aiTools = [
    {
      id: 'copy',
      name: 'Copy Generator AI',
      description: 'Generate compelling headlines and ad copy',
      icon: Copy,
      color: 'bg-blue-600',
      status: 'ready'
    },
    {
      id: 'image',
      name: 'Visual Generator AI',
      description: 'Create stunning visuals and graphics',
      icon: Image,
      color: 'bg-purple-600',
      status: 'ready'
    },
    {
      id: 'video',
      name: 'Video Creator AI (Kling)',
      description: 'Generate professional video content',
      icon: Video,
      color: 'bg-red-600',
      status: 'ready'
    },
    {
      id: 'voice',
      name: 'Voice Generator AI (Travus)',
      description: 'Create natural-sounding voiceovers',
      icon: Mic,
      color: 'bg-green-600',
      status: 'ready'
    }
  ];

  const handleInputChange = (field: string, value: any) => {
    setCampaignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChannelToggle = (channelId: string) => {
    setCampaignData(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(id => id !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  const generateContent = async (type: string) => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const content = {
        copy: "🚀 Transform Your Business Today!\n\nDiscover premium solutions that drive real results. Join thousands of satisfied customers who've already made the switch.\n\n✅ Proven Results\n✅ Expert Support\n✅ Money-Back Guarantee\n\nLimited Time: 30% Off + Free Consultation\n\n👉 Get Started Now",
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
        video: "Generated video content preview...",
        voice: "Generated voice narration preview..."
      };
      
      setGeneratedContent(prev => ({
        ...prev,
        [type]: content[type as keyof typeof content]
      }));
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Campaign Studio</h1>
          <p className="text-gray-600">Create professional marketing campaigns with AI-powered tools</p>
        </div>

        {/* AI Agent */}
        <div className="mb-8">
          <AgentSlot 
            agentName="Campaign Studio AI"
            description="I orchestrate all creative AI tools to produce cohesive, high-converting campaigns"
          />
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center space-x-3 ${
                activeStep === step.number ? 'text-blue-600' : 
                activeStep > step.number ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  activeStep === step.number ? 'border-blue-600 bg-blue-50' : 
                  activeStep > step.number ? 'border-green-600 bg-green-50' : 
                  'border-gray-300 bg-gray-50'
                }`}>
                  {activeStep > step.number ? (
                    <Sparkles size={20} />
                  ) : (
                    <span className="font-bold">{step.number}</span>
                  )}
                </div>
                <div className="hidden sm:block">
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="text-sm opacity-75">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-16 h-px bg-gray-300 mx-4"></div>
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Step 1: Campaign Setup */}
          {activeStep === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Campaign Setup</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product/Service Name *
                    </label>
                    <input
                      type="text"
                      value={campaignData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your product or service name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience *
                    </label>
                    <textarea
                      value={campaignData.targetAudience}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your ideal customer (age, interests, profession, etc.)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Goal *
                    </label>
                    <select
                      value={campaignData.campaignGoal}
                      onChange={(e) => handleInputChange('campaignGoal', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select campaign goal</option>
                      <option value="awareness">Brand Awareness</option>
                      <option value="leads">Lead Generation</option>
                      <option value="sales">Drive Sales</option>
                      <option value="engagement">Increase Engagement</option>
                      <option value="retention">Customer Retention</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Campaign Tone
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {toneOptions.map((tone) => (
                        <button
                          key={tone.value}
                          onClick={() => handleInputChange('tone', tone.value)}
                          className={`p-4 border-2 rounded-lg text-left transition-colors ${
                            campaignData.tone === tone.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <h3 className="font-medium text-gray-900">{tone.label}</h3>
                          <p className="text-sm text-gray-600">{tone.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Distribution Channels
                    </label>
                    <div className="space-y-2">
                      {channelOptions.map((channel) => {
                        const Icon = channel.icon;
                        return (
                          <button
                            key={channel.id}
                            onClick={() => handleChannelToggle(channel.id)}
                            className={`w-full flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                              campaignData.channels.includes(channel.id)
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon size={20} />
                            <span className="font-medium">{channel.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setActiveStep(2)}
                  disabled={!campaignData.productName || !campaignData.targetAudience || !campaignData.campaignGoal}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Continue to Content Generation
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Content Generation */}
          {activeStep === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">AI Content Generation</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* AI Tools */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Available AI Tools</h3>
                  <div className="space-y-4">
                    {aiTools.map((tool) => {
                      const Icon = tool.icon;
                      const hasContent = generatedContent[tool.id as keyof typeof generatedContent];
                      
                      return (
                        <div key={tool.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 ${tool.color} rounded-lg`}>
                                <Icon className="text-white" size={20} />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{tool.name}</h4>
                                <p className="text-sm text-gray-600">{tool.description}</p>
                              </div>
                            </div>
                            {hasContent && (
                              <div className="flex items-center space-x-1 text-green-600">
                                <Sparkles size={16} />
                                <span className="text-sm font-medium">Generated</span>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => generateContent(tool.id)}
                            disabled={isGenerating}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                              hasContent
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                          >
                            {isGenerating ? (
                              <div className="flex items-center justify-center space-x-2">
                                <RefreshCw size={16} className="animate-spin" />
                                <span>Generating...</span>
                              </div>
                            ) : hasContent ? (
                              <div className="flex items-center justify-center space-x-2">
                                <RefreshCw size={16} />
                                <span>Regenerate</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-2">
                                <Wand2 size={16} />
                                <span>Generate with AI</span>
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Preview</h3>
                  <div className="space-y-6">
                    {/* Copy Preview */}
                    {generatedContent.copy && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <Copy size={16} />
                          <span>Generated Copy</span>
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700">
                            {generatedContent.copy}
                          </pre>
                        </div>
                        <button className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                          <Copy size={14} />
                          <span>Copy to Clipboard</span>
                        </button>
                      </div>
                    )}

                    {/* Image Preview */}
                    {generatedContent.image && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <Image size={16} />
                          <span>Generated Visual</span>
                        </h4>
                        <img 
                          src={generatedContent.image} 
                          alt="Generated campaign visual"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
                          <Download size={14} />
                          <span>Download Image</span>
                        </button>
                      </div>
                    )}

                    {/* Video Preview */}
                    {generatedContent.video && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <Video size={16} />
                          <span>Generated Video</span>
                        </h4>
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                          <Video className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-600">Video content ready</p>
                          <button className="mt-2 flex items-center space-x-2 mx-auto text-blue-600 hover:text-blue-800 text-sm font-medium">
                            <Play size={14} />
                            <span>Preview Video</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Voice Preview */}
                    {generatedContent.voice && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                          <Mic size={16} />
                          <span>Generated Voice</span>
                        </h4>
                        <div className="bg-gray-100 rounded-lg p-6">
                          <div className="flex items-center justify-center space-x-4">
                            <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                              <Play size={16} />
                            </button>
                            <div className="flex-1 bg-green-200 h-2 rounded-full">
                              <div className="bg-green-600 h-2 rounded-full w-1/3"></div>
                            </div>
                            <span className="text-sm text-gray-600">0:12 / 0:35</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Setup
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  disabled={!Object.values(generatedContent).some(content => content)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Review & Export
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Export */}
          {activeStep === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Review & Export</h2>
              
              <div className="space-y-8">
                {/* Campaign Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Summary</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-gray-600">Product:</span>
                      <p className="font-medium">{campaignData.productName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Goal:</span>
                      <p className="font-medium">{campaignData.campaignGoal}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tone:</span>
                      <p className="font-medium">{campaignData.tone}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Channels:</span>
                      <p className="font-medium">{campaignData.channels.length} selected</p>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Package</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Download className="text-blue-600" size={20} />
                          <span className="font-medium">Complete Campaign Kit</span>
                        </div>
                        <span className="text-sm text-blue-600">ZIP</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Copy className="text-gray-600" size={20} />
                          <span className="font-medium">Copy Only</span>
                        </div>
                        <span className="text-sm text-gray-600">TXT</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Image className="text-gray-600" size={20} />
                          <span className="font-medium">Images Only</span>
                        </div>
                        <span className="text-sm text-gray-600">ZIP</span>
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Share & Collaborate</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Share2 className="text-green-600" size={20} />
                          <span className="font-medium">Share with Team</span>
                        </div>
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Eye className="text-gray-600" size={20} />
                          <span className="font-medium">Preview Link</span>
                        </div>
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Settings className="text-gray-600" size={20} />
                          <span className="font-medium">Save as Template</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back to Generation
                  </button>
                  <div className="space-x-3">
                    <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      Save Draft
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Export Campaign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignStudio;