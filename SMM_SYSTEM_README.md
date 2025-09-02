# SMM (Social Media Marketing) System

A comprehensive social media marketing platform built with React and Supabase, featuring user management, Instagram integration, staff panels, and admin controls.

## 🚀 Features

### User Flow
1. **Authentication** - Email/password and Google OAuth login
2. **Payment Processing** - Stripe integration for service subscriptions
3. **Instagram Connection** - OAuth-based Instagram account linking
4. **Requirements Form** - User preference and target audience setup
5. **Dashboard** - Real-time Instagram insights and growth metrics

### Role-Based Access Control
- **Users** - Access to personal dashboard and Instagram insights
- **Staff** - Manage assigned users with additional controls
- **Admins** - Full system control and user/staff management

### Key Components
- **Support Chat System** - Real-time messaging with email notifications
- **Instagram API Integration** - Live data from Instagram Insights
- **Payment Management** - Subscription and billing tracking
- **User Requirements** - Editable by staff, visible to users
- **Dashboard Analytics** - Growth metrics and performance tracking

## 🏗️ Architecture

### Frontend (React)
- **Authentication Context** - Supabase auth with role management
- **Protected Routes** - Role-based access control
- **Component Structure** - Modular, reusable components
- **State Management** - React hooks and context

### Backend (Supabase)
- **Database** - PostgreSQL with Row Level Security (RLS)
- **Authentication** - Supabase Auth with OAuth providers
- **Real-time** - Live updates for chat and notifications
- **Storage** - File uploads and media management

### Database Schema
```sql
-- Core Tables
profiles (id, full_name, role, created_at)
payments (id, user_id, amount, status, payment_method)
instagram_accounts (id, user_id, instagram_user_id, access_token)
user_requirements (id, user_id, niche, location, comments, dms, max_following, hashtags, account_targets)
dashboard_targets (id, user_id, target_type, value, created_by)
staff_assignments (id, user_id, staff_id, assigned_at)
support_chats (id, user_id, staff_id, message, sent_by, sent_at)
```

## 🔐 Security Features

### Row Level Security (RLS) Policies
- **User Isolation** - Users can only access their own data
- **Staff Access** - Staff can manage assigned users only
- **Admin Override** - Admins have full system access
- **Role Protection** - Users cannot change their own roles

### Authentication
- **Supabase Auth** - Secure user authentication
- **OAuth Integration** - Google and Instagram OAuth
- **Session Management** - Automatic token refresh
- **Password Security** - Secure password handling

## 📱 User Interface

### Design System
- **Modern UI** - Clean, professional design
- **Responsive** - Mobile-first approach
- **Accessibility** - WCAG compliant components
- **Dark/Light Mode** - Theme switching support

### Key Pages
- **Landing Page** - Marketing and service information
- **Authentication** - Login/register with OAuth
- **Payment** - Subscription plans and billing
- **Instagram Connect** - Account linking interface
- **Requirements Form** - User preference collection
- **Dashboard** - Analytics and insights
- **Staff Panel** - User management interface
- **Admin Panel** - System administration

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Supabase account and project
- Instagram Developer Account (for API access)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SMM-marketing
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

4. **Database Setup**
Run the SQL scripts in the `sql/` directory:
```bash
# Create tables
psql -f sql/tables.sql

# Apply RLS policies
psql -f sql/policies.sql
```

5. **Start Development Server**
```bash
npm run dev
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Enable authentication providers (Email, Google)
3. Set up database tables using provided SQL
4. Configure RLS policies
5. Set up real-time subscriptions

### Instagram API Setup
1. Create Instagram Business Account
2. Set up Facebook App
3. Configure Instagram Basic Display API
4. Add webhook endpoints
5. Test API connections

### Payment Integration
1. Set up Stripe account
2. Configure webhook endpoints
3. Add payment methods
4. Test payment flows

## 📊 User Flow

### New User Journey
1. **Registration** - Sign up with email or Google
2. **Payment** - Choose and pay for service plan
3. **Instagram Connect** - Link Instagram account
4. **Requirements** - Fill out preferences form
5. **Dashboard** - View insights and manage account

### Staff Workflow
1. **Login** - Access staff panel
2. **User Assignment** - View assigned users
3. **Dashboard Management** - Edit user requirements
4. **Support** - Handle user inquiries
5. **Target Management** - Set growth targets

### Admin Functions
1. **User Management** - Create and manage users
2. **Staff Management** - Create and assign staff
3. **System Overview** - Monitor system health
4. **Support Management** - Handle all support tickets

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── pages/              # Page components
├── lib/                # Utility libraries
├── assets/             # Static assets
└── data/               # Static data files
```

### Key Technologies
- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **Supabase** - Backend as a Service
- **React Router** - Client-side routing
- **CSS3** - Styling and animations

### Code Standards
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Component Structure** - Functional components with hooks
- **Error Handling** - Comprehensive error boundaries
- **Loading States** - User feedback for async operations

## 🔍 Testing

### Test Coverage
- **Unit Tests** - Component and utility testing
- **Integration Tests** - API and database testing
- **E2E Tests** - Full user flow testing
- **Security Tests** - RLS and authentication testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
# Production
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
```

### Deployment Platforms
- **Vercel** - Recommended for React apps
- **Netlify** - Alternative deployment option
- **AWS S3 + CloudFront** - Custom deployment

## 📈 Monitoring

### Analytics
- **User Engagement** - Dashboard usage metrics
- **Performance** - Page load times and errors
- **Business Metrics** - Conversion rates and revenue

### Logging
- **Error Tracking** - Sentry integration
- **User Actions** - Audit trail for admin actions
- **API Calls** - Request/response logging

## 🔒 Security Considerations

### Data Protection
- **Encryption** - Data encrypted in transit and at rest
- **Access Control** - Role-based permissions
- **Audit Logs** - Track all user actions
- **GDPR Compliance** - Data privacy regulations

### Best Practices
- **Input Validation** - Sanitize all user inputs
- **SQL Injection** - Parameterized queries
- **XSS Prevention** - Content Security Policy
- **CSRF Protection** - Token-based validation

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review process

### Code Style
- Follow existing patterns
- Add tests for new features
- Update documentation
- Ensure accessibility

## 📞 Support

### Documentation
- **API Docs** - Supabase and Instagram API
- **Component Library** - Storybook documentation
- **User Guides** - Step-by-step tutorials

### Contact
- **Technical Issues** - GitHub issues
- **Business Inquiries** - Contact form
- **Emergency Support** - 24/7 chat support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** - Backend infrastructure
- **React Team** - Frontend framework
- **Instagram** - API integration
- **Stripe** - Payment processing
- **Open Source Community** - Various libraries and tools
