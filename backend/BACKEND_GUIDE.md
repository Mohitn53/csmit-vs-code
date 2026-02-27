# Tech Intelligence Forecasting Platform - Backend

## 🏗 Architecture

This is a **modular monolith** with strict layer separation:

```
API Layer (routes + controllers)
     ↓
Application Layer (services)
     ↓
Domain Layer (business models)
     ↓
Infrastructure Layer (repositories + Supabase)
```

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/             # Configuration files
│   │   ├── supabaseClient.js
│   │   └── scoringConfig.js
│   ├── controllers/        # HTTP request handlers
│   │   ├── TopicController.js
│   │   └── CompareController.js
│   ├── routes/            # Express routes
│   │   ├── index.js
│   │   ├── topicRoutes.js
│   │   └── compareRoutes.js
│   ├── services/          # Business logic
│   │   ├── TopicService.js
│   │   ├── SimulationService.js
│   │   ├── ScoringService.js
│   │   └── ForecastService.js
│   ├── domain/            # Domain models
│   │   ├── Topic.js
│   │   ├── DailyMetric.js
│   │   └── Forecast.js
│   ├── repositories/      # Data access layer
│   │   ├── TopicRepository.js
│   │   ├── DailyMetricRepository.js
│   │   └── ForecastRepository.js
│   ├── middleware/        # Express middleware
│   │   ├── errorHandler.js
│   │   └── requestLogger.js
│   ├── utils/            # Utility functions
│   │   └── helpers.js
│   ├── jobs/             # Scheduled tasks
│   │   └── dailyUpdate.js
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── database/
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Sample data
├── scripts/
│   ├── seedTopics.js     # Seed database script
│   └── triggerUpdate.js  # Manual update trigger
├── package.json
├── .env.example
└── README.md
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3001
NODE_ENV=development
```

### 3. Set Up Database

Run the schema in Supabase SQL Editor:

```sql
-- Copy and paste contents of database/schema.sql
```

Or use the Supabase CLI:

```bash
supabase db push
```

### 4. Seed Initial Data

Run the seed script:

```bash
node scripts/seedTopics.js
```

This will populate the database with ~30 sample topics.

### 5. Generate Initial Metrics (Optional)

Trigger the daily update manually:

```bash
node scripts/triggerUpdate.js
```

This generates metrics and forecasts for all topics.

### 6. Start the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Health Check

```
GET /api/v1/health
```

### Topics

```
GET  /api/v1/topics              # List all topics
GET  /api/v1/topics/:id          # Get topic details
GET  /api/v1/topics/:id/metrics  # Get topic metrics
GET  /api/v1/topics/:id/forecast # Get topic forecast
GET  /api/v1/topics/categories   # Get all categories
GET  /api/v1/topics/rising       # Get top rising topics
```

### Compare

```
POST /api/v1/compare
Body: { "topic_ids": ["id1", "id2", "id3"] }
```

## 🔧 Key Services

### SimulationService

Generates simulated daily metrics for each topic based on:
- Category volatility
- Trend bias
- Historical patterns

### ScoringService

Calculates weighted scores using configurable weights:
- Developer: 30%
- Search: 25%
- Jobs: 30%
- Media: 15%

### ForecastService

Generates predictions using:
- Moving averages
- Trend analysis
- Volatility calculation

## ⏰ Scheduled Jobs

### Daily Update Job

Runs at **midnight (00:00)** every day:
- Generates metrics for all topics
- Calculates forecasts
- Updates database

Manual trigger:

```bash
node scripts/triggerUpdate.js
```

## 🗄 Database Schema

### topics

- `id` - UUID primary key
- `primary_name` - Technology name
- `category` - Category classification
- `synonyms` - JSONB array of alternative names
- `job_roles` - JSONB array of related roles

### daily_metrics

- `id` - UUID
- `topic_id` - Foreign key to topics
- `developer_score` - 0-120
- `search_score` - 0-120
- `job_score` - 0-120
- `media_score` - 0-120
- `weighted_score` - Calculated score
- `created_at` - Timestamp

### forecasts

- `id` - UUID
- `topic_id` - Foreign key to topics
- `predicted_7d` - 7-day prediction
- `predicted_30d` - 30-day prediction
- `confidence` - 0-100
- `risk` - low | medium | high
- `created_at` - Timestamp

## 🔐 Security

- Service role key used on backend only
- CORS configured for frontend origin
- Helmet.js security headers
- Input validation on all endpoints
- No raw database errors exposed

## 🧪 Testing

Test health endpoint:

```bash
curl http://localhost:3001/api/v1/health
```

Test topics endpoint:

```bash
curl http://localhost:3001/api/v1/topics
```

Test compare endpoint:

```bash
curl -X POST http://localhost:3001/api/v1/compare \
  -H "Content-Type: application/json" \
  -d '{"topic_ids": ["id1", "id2"]}'
```

## 📊 Data Flow

```
Cron Job → SimulationService → Generate Scores
              ↓
         ScoringService → Calculate Weighted Score
              ↓
      DailyMetricRepository → Save to Database
              ↓
         ForecastService → Generate Predictions
              ↓
       ForecastRepository → Save Forecast
```

## 🔄 Extensibility

The system is designed to support future:

- ✅ Real API integrations (GitHub, Google Trends, Adzuna)
- ✅ Python ML forecasting engine
- ✅ Multi-user authentication
- ✅ Real-time data streaming
- ✅ Additional metrics pillars

## 🐛 Troubleshooting

### "Missing Supabase credentials"

Ensure `.env` file exists with correct values.

### Database connection errors

Verify Supabase URL and service role key.

### Schema not found

Run `database/schema.sql` in Supabase SQL Editor.

### No topics returned

Run the seed script: `node scripts/seedTopics.js`

## 📝 Scripts Summary

```bash
npm start              # Start production server
npm run dev           # Start development server
node scripts/seedTopics.js      # Seed database
node scripts/triggerUpdate.js   # Generate metrics/forecasts
```

## 🎯 Next Steps

After backend is running:

1. ✅ Verify API endpoints work
2. ✅ Check database has topics
3. ✅ Test daily update job
4. → Build frontend
5. → Deploy to production

---

Built with Express.js, Supabase, and Node.js
