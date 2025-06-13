# DropPay Database Documentation

## Overview

This database schema supports the complete DropPay platform - an AI-powered fintech marketplace that connects suppliers, resellers, and clients in a comprehensive ecosystem.

## Key Features Supported

### 🏪 **Multi-Role Architecture**
- **Suppliers**: Create marketplaces, manage products, set commissions
- **Clients**: Shop products, track orders, manage preferences  
- **Resellers**: Earn commissions, build teams, access marketing tools
- **Admins**: Platform oversight and management

### 💰 **Commission & Earnings System**
- Flexible commission rates (product, category, or custom)
- Real-time commission tracking and calculations
- Team-based bonuses and milestone rewards
- Automated payout processing

### 🛒 **E-commerce Functionality**
- Complete shopping cart and checkout system
- Order management with status tracking
- Inventory management and low-stock alerts
- Product reviews and ratings

### 👥 **Team Collaboration**
- Reseller teams with hierarchical structure
- Shared resources and knowledge base
- Team milestones and collective rewards
- Collaborative marketing campaigns

### 📊 **Analytics & Tracking**
- Unique tracking links for each reseller
- Click and conversion tracking
- Performance analytics and reporting
- Daily metrics snapshots

### 🤖 **AI Integration**
- Multiple AI agents for different functions
- Configuration and usage tracking
- Performance monitoring

## Database Structure

### Core Tables

#### Users & Authentication
- `users` - Central user management
- `user_profiles` - Extended user information
- `suppliers` - Supplier-specific data
- `resellers` - Reseller-specific data

#### Product Management
- `categories` - Product categorization
- `products` - Main product catalog
- `product_variants` - Product variations (size, color, etc.)

#### Order Processing
- `orders` - Order header information
- `order_items` - Individual order line items
- `shopping_carts` - Active shopping carts
- `cart_items` - Items in shopping carts

#### Commission System
- `commissions` - Commission transactions
- `payouts` - Payout processing
- `wallet_transactions` - Financial transaction history

#### Marketing & Teams
- `reseller_teams` - Team management
- `team_memberships` - Team member relationships
- `campaigns` - Marketing campaigns
- `tracking_links` - Unique reseller tracking URLs
- `team_milestones` - Collective team goals

#### Communication
- `notifications` - System notifications
- `messages` - User-to-user messaging
- `product_reviews` - Product feedback

#### Analytics
- `daily_analytics` - Performance metrics
- `link_clicks` - Click tracking data

### Key Relationships

```
Users (1:1) → User Profiles
Users (1:1) → Suppliers
Users (1:1) → Resellers

Suppliers (1:many) → Products
Products (1:many) → Product Variants
Products (1:many) → Order Items

Resellers (1:many) → Tracking Links
Resellers (1:many) → Commissions
Resellers (many:many) → Teams

Orders (1:many) → Order Items
Order Items (1:1) → Commissions
```

## Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Suppliers see only their products and orders
- Resellers see only their commissions and team data
- Admins have full platform access

### Data Protection
- Password hashing with bcrypt
- Sensitive financial data encryption
- Audit trails for all transactions
- GDPR compliance ready

## Performance Optimizations

### Indexes
- Email and role-based user lookups
- Product search with full-text indexing
- Order and commission queries by user/date
- Tracking link performance

### Triggers
- Automatic timestamp updates
- Order number generation
- Commission calculations
- Analytics data aggregation

## Sample Data

The seed data includes:
- Demo users for all roles (password: `password`)
- Sample products from TechCorp Electronics
- Example orders and commissions
- Team structure with Alpha Sellers
- AI agent configurations
- Tracking links and analytics

## Usage Examples

### Get Reseller Performance
```sql
SELECT 
    u.name,
    r.total_sales,
    r.total_commission,
    r.performance_tier
FROM resellers r
JOIN users u ON r.user_id = u.id
WHERE r.status = 'active'
ORDER BY r.total_sales DESC;
```

### Track Product Performance
```sql
SELECT 
    p.name,
    COUNT(oi.id) as total_orders,
    SUM(oi.total_price) as total_revenue,
    SUM(oi.commission_amount) as total_commissions
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_revenue DESC;
```

### Team Milestone Progress
```sql
SELECT 
    tm.name,
    tm.target_amount,
    tm.current_amount,
    (tm.current_amount / tm.target_amount * 100) as progress_percent
FROM team_milestones tm
WHERE tm.status = 'active';
```

## Deployment Notes

1. **Environment Setup**: Configure connection strings for development, staging, and production
2. **Migrations**: Use the schema.sql for initial setup, then apply incremental migrations
3. **Backups**: Set up automated daily backups with point-in-time recovery
4. **Monitoring**: Monitor query performance and add indexes as needed
5. **Scaling**: Consider read replicas for analytics queries

## Future Enhancements

- **Internationalization**: Multi-language support
- **Advanced Analytics**: Machine learning insights
- **API Rate Limiting**: Request throttling tables
- **Audit Logging**: Comprehensive change tracking
- **Multi-Currency**: Enhanced currency support
- **Subscription Management**: Recurring payment handling

This database structure provides a solid foundation for the DropPay platform while maintaining flexibility for future growth and feature additions.