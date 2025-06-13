import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import SupplierRegistration from './pages/register/SupplierRegistration';
import ClientRegistration from './pages/register/ClientRegistration';
import ResellerOnboarding from './pages/register/ResellerOnboarding';
import ResellerDashboard from './pages/dashboard/ResellerDashboard';
import SupplierDashboard from './pages/dashboard/SupplierDashboard';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import AdminControlCenter from './pages/dashboard/AdminControlCenter';
import WalletPage from './pages/dashboard/WalletPage';
import TeamManagement from './pages/dashboard/TeamManagement';
import TeamCollaboration from './pages/dashboard/TeamCollaboration';
import CampaignStudio from './pages/tools/CampaignStudio';
import TransactionSimulator from './pages/tools/TransactionSimulator';
import SupplierPortal from './pages/SupplierPortal';
import ResellersMarketplace from './pages/ResellersMarketplace';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register/supplier" element={<SupplierRegistration />} />
          <Route path="/register/client" element={<ClientRegistration />} />
          <Route path="/register/reseller" element={<ResellerOnboarding />} />
          <Route path="/dashboard/reseller" element={<ResellerDashboard />} />
          <Route path="/dashboard/supplier" element={<SupplierDashboard />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/dashboard/admin" element={<AdminControlCenter />} />
          <Route path="/dashboard/wallet" element={<WalletPage />} />
          <Route path="/dashboard/team" element={<TeamManagement />} />
          <Route path="/dashboard/collaboration" element={<TeamCollaboration />} />
          <Route path="/tools/campaign-studio" element={<CampaignStudio />} />
          <Route path="/tools/simulator" element={<TransactionSimulator />} />
          <Route path="/supplier/portal" element={<SupplierPortal />} />
          <Route path="/marketplace" element={<ResellersMarketplace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;