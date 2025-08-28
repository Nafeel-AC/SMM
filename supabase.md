# Supabase Database Schema

This document outlines the database schema design for the SMM-Cloning application using Supabase.

## Tables Structure

### users (Auth.users - Managed by Supabase Auth)

This table is automatically managed by Supabase Auth and contains the user authentication information.

| Column             | Type      | Description                                  |
| ------------------ | --------- | -------------------------------------------- |
| id                 | uuid      | Primary key, unique identifier for each user |
| email              | text      | User's email address                         |
| phone              | text      | User's phone number (optional)               |
| created_at         | timestamp | Timestamp when the user was created          |
| last_sign_in_at    | timestamp | Timestamp of the user's last sign-in         |
| raw_user_meta_data | jsonb     | Additional user metadata                     |

### profiles

Extended user information that isn't managed by Supabase Auth.

| Column         | Type      | Description                                 |
| -------------- | --------- | ------------------------------------------- |
| id             | uuid      | Primary key, references auth.users.id       |
| first_name     | text      | User's first name                           |
| last_name      | text      | User's last name                            |
| avatar_url     | text      | URL to the user's profile image             |
| role           | text      | User role (admin, staff, user)              |
| account_status | text      | Status of the account (active, suspended)   |
| created_at     | timestamp | Timestamp when the profile was created      |
| updated_at     | timestamp | Timestamp when the profile was last updated |

#### RLS Policies:

- Users can read their own profile
- Users can update their own profile
- Admins can read and update all profiles

### wallets

User wallet information for storing balance and managing transactions.

| Column     | Type      | Description                                |
| ---------- | --------- | ------------------------------------------ |
| id         | uuid      | Primary key                                |
| user_id    | uuid      | References auth.users.id                   |
| balance    | decimal   | Current wallet balance                     |
| currency   | text      | Currency code (default: USD)               |
| created_at | timestamp | Timestamp when the wallet was created      |
| updated_at | timestamp | Timestamp when the wallet was last updated |

#### RLS Policies:

- Users can read their own wallet
- Admins can read all wallets
- Only system functions can update wallet balances

### transactions

Record of all financial transactions in the system.

| Column       | Type      | Description                                                      |
| ------------ | --------- | ---------------------------------------------------------------- |
| id           | uuid      | Primary key                                                      |
| user_id      | uuid      | References auth.users.id                                         |
| amount       | decimal   | Transaction amount                                               |
| type         | text      | Type of transaction (deposit, withdrawal, transaction, received) |
| status       | text      | Status (completed, pending, failed)                              |
| description  | text      | Description of the transaction                                   |
| reference_id | text      | External reference ID if applicable                              |
| receiver_id  | uuid      | References auth.users.id for transfers                           |
| created_at   | timestamp | Timestamp when the transaction was created                       |
| updated_at   | timestamp | Timestamp when the transaction was updated                       |

#### RLS Policies:

- Users can read their own transactions
- Admins can read all transactions
- Only system functions can create or update transactions

### orders

Orders placed by users for services.

| Column     | Type      | Description                            |
| ---------- | --------- | -------------------------------------- |
| id         | uuid      | Primary key                            |
| user_id    | uuid      | References auth.users.id               |
| service_id | uuid      | References services.id                 |
| quantity   | integer   | Quantity ordered                       |
| amount     | decimal   | Total order amount                     |
| status     | text      | Status (pending, completed, cancelled) |
| target_url | text      | Target URL for the service             |
| notes      | text      | Additional notes for the order         |
| created_at | timestamp | Timestamp when the order was created   |
| updated_at | timestamp | Timestamp when the order was updated   |

#### RLS Policies:

- Users can read their own orders
- Users can create new orders
- Admins can read and update all orders

### services

Available services that users can purchase.

| Column       | Type      | Description                            |
| ------------ | --------- | -------------------------------------- |
| id           | uuid      | Primary key                            |
| name         | text      | Service name                           |
| description  | text      | Service description                    |
| category_id  | uuid      | References service_categories.id       |
| price        | decimal   | Price per unit                         |
| min_quantity | integer   | Minimum order quantity                 |
| max_quantity | integer   | Maximum order quantity                 |
| active       | boolean   | Whether the service is active          |
| created_at   | timestamp | Timestamp when the service was created |
| updated_at   | timestamp | Timestamp when the service was updated |

#### RLS Policies:

- Anyone can read active services
- Only admins can create, update, or delete services

### service_categories

Categories for organizing services.

| Column      | Type      | Description                             |
| ----------- | --------- | --------------------------------------- |
| id          | uuid      | Primary key                             |
| name        | text      | Category name                           |
| description | text      | Category description                    |
| active      | boolean   | Whether the category is active          |
| created_at  | timestamp | Timestamp when the category was created |
| updated_at  | timestamp | Timestamp when the category was updated |

#### RLS Policies:

- Anyone can read active categories
- Only admins can create, update, or delete categories

### support_tickets

User support tickets.

| Column     | Type      | Description                                  |
| ---------- | --------- | -------------------------------------------- |
| id         | uuid      | Primary key                                  |
| user_id    | uuid      | References auth.users.id                     |
| subject    | text      | Ticket subject                               |
| message    | text      | Ticket message content                       |
| status     | text      | Status (open, in_progress, resolved, closed) |
| priority   | text      | Priority (low, medium, high, urgent)         |
| created_at | timestamp | Timestamp when the ticket was created        |
| updated_at | timestamp | Timestamp when the ticket was updated        |

#### RLS Policies:

- Users can read and create their own tickets
- Admins can read and update all tickets

### ticket_responses

Responses to support tickets.

| Column     | Type      | Description                              |
| ---------- | --------- | ---------------------------------------- |
| id         | uuid      | Primary key                              |
| ticket_id  | uuid      | References support_tickets.id            |
| user_id    | uuid      | References auth.users.id (who responded) |
| message    | text      | Response message                         |
| created_at | timestamp | Timestamp when the response was created  |

#### RLS Policies:

- Users can read responses to their own tickets
- Users can create responses to their own tickets
- Admins can read and create responses to any ticket

## Database Triggers and Functions

### Create Profile After Signup

This trigger automatically creates a profile record when a new user signs up.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, role, account_status)
  VALUES (
    NEW.id,
    '',
    '',
    '',
    'user',
    'active'
  );

  INSERT INTO public.wallets (user_id, balance, currency)
  VALUES (
    NEW.id,
    0.00,
    'USD'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Update Transaction Status Function

This function updates the transaction status and updates the user's wallet balance when a transaction is completed.

```sql
CREATE OR REPLACE FUNCTION public.handle_transaction_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only handle transitions to 'completed' status
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Handle different transaction types
    IF NEW.type = 'deposit' THEN
      -- Add to user's wallet for deposits
      UPDATE public.wallets
      SET balance = balance + NEW.amount
      WHERE user_id = NEW.user_id;
    ELSIF NEW.type = 'withdrawal' THEN
      -- Subtract from user's wallet for withdrawals
      UPDATE public.wallets
      SET balance = balance - NEW.amount
      WHERE user_id = NEW.user_id;
    ELSIF NEW.type = 'transaction' AND NEW.receiver_id IS NOT NULL THEN
      -- Subtract from sender's wallet
      UPDATE public.wallets
      SET balance = balance - NEW.amount
      WHERE user_id = NEW.user_id;

      -- Add to receiver's wallet
      UPDATE public.wallets
      SET balance = balance + NEW.amount
      WHERE user_id = NEW.receiver_id;

      -- Create a 'received' transaction for the receiver
      INSERT INTO public.transactions (
        user_id, amount, type, status, description, reference_id, receiver_id
      )
      VALUES (
        NEW.receiver_id,
        NEW.amount,
        'received',
        'completed',
        'Received from user',
        NEW.id::text,
        NEW.user_id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_transaction_status_change
  AFTER UPDATE ON public.transactions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_transaction_status_change();
```

## Row Level Security (RLS) Implementation

For each table, we'll implement RLS policies to ensure data security:

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for each table (examples)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## API and Data Access Patterns

### User Dashboard

The user dashboard will access the following data:

1. User profile information
2. Wallet balance
3. Recent transactions (last 10)
4. Transaction statistics grouped by month and type
5. Order statistics (completed, pending, cancelled)
6. Support ticket status counts

### Admin Dashboard

The admin dashboard will include additional data:

1. All user profiles with filtering and search
2. Transaction management with status updates
3. Order management and fulfillment
4. Service and category management
5. Support ticket management

## Database Indexes

To optimize query performance, we'll add the following indexes:

```sql
-- Optimize user queries
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_account_status ON public.profiles(account_status);

-- Optimize transaction queries
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);

-- Optimize order queries
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_service_id ON public.orders(service_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- Optimize support ticket queries
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON public.support_tickets(priority);
```
