# Tech Intelligence Forecasting Platform - Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

3. Run the SQL schema in your Supabase SQL Editor (see `/database/schema.sql`)

4. Seed the topics data (see `/database/seed.sql`)

5. Start the server:
   ```bash
   npm run dev
   ```

## Architecture

This is a modular monolith with strict layer separation:

- **API Layer**: routes + controllers
- **Application Layer**: services
- **Domain Layer**: business logic models
- **Infrastructure Layer**: repositories + Supabase + cron

## API Endpoints

- `GET /api/v1/topics` - List all topics
- `GET /api/v1/topics/:id` - Get topic by ID
- `GET /api/v1/topics/:id/metrics` - Get topic metrics
- `GET /api/v1/topics/:id/forecast` - Get topic forecast
- `POST /api/v1/compare` - Compare multiple topics
