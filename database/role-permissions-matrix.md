# DropPay Role-Based Access Control (RBAC) Matrix

## Overview

This document defines the comprehensive permission matrix for DropPay's role-based access control system. The platform supports multiple user roles with specific permissions designed to ensure security, data integrity, and optimal user experience.

## User Roles

### 🔑 **Core Roles**
- **Admin**: Platform administrators with full system access
- **Supplier**: Companies that create marketplaces and sell products
- **Reseller**: Individuals who promote and sell supplier products for commission
- **Client**: End customers who purchase products

### 🛡️ **Extended Roles**
- **Moderator**: Content and user moderation capabilities
- **Analyst**: Read-only access to analytics and reporting data
- **Support**: Customer support with limited administrative access

## Permission Matrix

### 👤 User Management

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **Users Table** |
| Read all users | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Read own data | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update own data | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update other users | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Delete users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **User Profiles** |
| Read own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Read other profiles | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

### 🏪 Supplier Management

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **Suppliers Table** |
| Read all suppliers | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Read own data | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Update own data | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Approve suppliers | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Suspend suppliers | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Store Management** |
| Manage own store | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View store analytics | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Moderate stores | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |

### 📦 Product Management

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **Products Table** |
| Read all products | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Read own products | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create products | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update own products | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete own products | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Moderate products | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Product Categories** |
| Read categories | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage categories | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Product Variants** |
| Manage variants | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View variants | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 👥 Reseller Management

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **Resellers Table** |
| Read all resellers | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Read own data | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Update own data | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve resellers | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Team Management** |
| Create teams | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage own team | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Join teams | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View team analytics | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |

### 🛒 Order Management

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **Orders Table** |
| Read all orders | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Read own orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create orders | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Update order status | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cancel orders | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Process refunds | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Order Items** |
| View order items | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Modify order items | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 💰 Financial Management

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **Commissions** |
| View all commissions | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View own commissions | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Process commissions | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Payouts** |
| View all payouts | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View own payouts | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Process payouts | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Wallet Transactions** |
| View own transactions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View all transactions | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

### 📊 Analytics & Reporting

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **Daily Analytics** |
| View platform analytics | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| View own analytics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Export analytics | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Performance Metrics** |
| View performance data | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Generate reports | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |

### 🔗 Marketing & Campaigns

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **Campaigns** |
| Create campaigns | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage own campaigns | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View campaign analytics | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Tracking Links** |
| Create tracking links | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View link analytics | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |

### 🔔 Communication

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **Notifications** |
| Send system notifications | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| View own notifications | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Messages** |
| Send messages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View own messages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Moderate messages | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

### ⚙️ System Administration

| Resource | Admin | Supplier | Reseller | Client | Moderator | Analyst | Support |
|----------|-------|----------|----------|--------|-----------|---------|---------|
| **System Settings** |
| View public settings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AI Agents** |
| Configure AI agents | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View AI usage stats | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Audit Logs** |
| View audit logs | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Export audit logs | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |

## Implementation Guidelines

### 1. RLS Policy Implementation
```sql
-- Example: Users can only view their own data
CREATE POLICY "users_own_data" ON users
    FOR ALL USING (auth.uid() = id);

-- Example: Suppliers can view their products
CREATE POLICY "suppliers_own_products" ON products
    FOR ALL USING (
        supplier_id IN (
            SELECT id FROM suppliers WHERE user_id = auth.uid()
        )
    );
```

### 2. Role-Based Function Access
```sql
-- Function to check user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
    SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
    SELECT role = 'admin' FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;
```

### 3. Dynamic Permission Checking
```sql
-- Function to check specific permissions
CREATE OR REPLACE FUNCTION auth.has_permission(
    resource TEXT,
    action TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM users WHERE id = auth.uid();
    
    -- Implement permission logic based on the matrix above
    CASE 
        WHEN user_role = 'admin' THEN RETURN TRUE;
        WHEN resource = 'products' AND action = 'read' THEN RETURN TRUE;
        -- Add more cases based on the permission matrix
        ELSE RETURN FALSE;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. Middleware Integration
For application-level enforcement, implement middleware that checks permissions before executing operations:

```typescript
// Example middleware function
export const checkPermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { data: hasPermission } = await supabase
      .rpc('has_permission', { resource, action });
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

## Security Considerations

### 1. Principle of Least Privilege
- Users receive only the minimum permissions necessary for their role
- Permissions are explicitly granted rather than implicitly allowed
- Regular permission audits should be conducted

### 2. Defense in Depth
- Database-level RLS policies as the primary security layer
- Application-level permission checks as secondary validation
- API-level rate limiting and input validation

### 3. Audit and Monitoring
- All permission changes should be logged
- Failed permission attempts should be monitored
- Regular security reviews of the permission matrix

### 4. Role Transitions
- Clear procedures for role changes (e.g., client becoming reseller)
- Temporary permission elevation for support scenarios
- Automatic permission cleanup for deactivated accounts

This comprehensive RBAC matrix ensures secure, scalable, and maintainable access control across the entire DropPay platform.