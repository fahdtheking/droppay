import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
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
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navigation /><LandingPage /></>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/supplier" element={<SupplierRegistration />} />
            <Route path="/register/client" element={<ClientRegistration />} />
            <Route path="/register/reseller" element={<ResellerOnboarding />} />

            {/* Protected Routes - Supplier Only */}
            <Route path="/dashboard/supplier" element={
              <ProtectedRoute allowedRoles={['supplier']}>
                <Navigation />
                <SupplierDashboard />
              </ProtectedRoute>
            } />
            <Route path="/supplier/portal" element={
              <ProtectedRoute allowedRoles={['supplier']}>
                <Navigation />
                <SupplierPortal />
              </ProtectedRoute>
            } />

            {/* Protected Routes - Client Only */}
            <Route path="/dashboard/client" element={
              <ProtectedRoute allowedRoles={['client']}>
                <Navigation />
                <ClientDashboard />
              </ProtectedRoute>
            } />

            {/* Protected Routes - Reseller Only */}
            <Route path="/dashboard/reseller" element={
              <ProtectedRoute allowedRoles={['reseller']}>
                <Navigation />
                <ResellerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/team" element={
              <ProtectedRoute allowedRoles={['reseller']}>
                <Navigation />
                <TeamManagement />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/collaboration" element={
              <ProtectedRoute allowedRoles={['reseller']}>
                <Navigation />
                <TeamCollaboration />
              </ProtectedRoute>
            } />
            <Route path="/tools/campaign-studio" element={
              <ProtectedRoute allowedRoles={['reseller']}>
                <Navigation />
                <CampaignStudio />
              </ProtectedRoute>
            } />
            <Route path="/tools/simulator" element={
              <ProtectedRoute allowedRoles={['reseller', 'supplier']}>
                <Navigation />
                <TransactionSimulator />
              </ProtectedRoute>
            } />

            {/* Protected Routes - Admin Only */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Navigation />
                <AdminControlCenter />
              </ProtectedRoute>
            } />

            {/* Protected Routes - Multiple Roles */}
            <Route path="/dashboard/wallet" element={
              <ProtectedRoute allowedRoles={['supplier', 'client', 'reseller', 'admin']}>
                <Navigation />
                <WalletPage />
              </ProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <ProtectedRoute allowedRoles={['client', 'reseller', 'admin']}>
                <Navigation />
                <ResellersMarketplace />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;