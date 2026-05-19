-- ══════════════════════════════════════════
-- OviGrow Database Schema
-- Ministry of Lands, Agriculture, Fisheries,
-- Water and Rural Development — Zimbabwe
-- ══════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- for GPS coordinates

-- User profiles
CREATE TABLE profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'farmer'
                CHECK (role IN ('farmer','extension_officer','government','agribusiness','admin')),
  province      TEXT,
  district      TEXT,
  ward          TEXT,
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Farmer registry (core government-grade table)
CREATE TABLE farmers (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id           TEXT UNIQUE NOT NULL,              -- e.g. ZW-HAR-CHI-12345
  registered_by       UUID REFERENCES profiles(id),
  full_name           TEXT NOT NULL,
  national_id         TEXT UNIQUE,                       -- Zimbabwe NID
  date_of_birth       DATE,
  gender              TEXT CHECK (gender IN ('Male','Female','Other')),
  phone               TEXT,
  province            TEXT NOT NULL,
  district            TEXT NOT NULL,
  ward                TEXT,
  village_farm        TEXT,
  farming_sector      TEXT,
  natural_region      TEXT,
  farm_size_ha        DECIMAL(10,2),
  gps_lat             DECIMAL(10,7),
  gps_lon             DECIMAL(10,7),
  primary_crops       TEXT[],
  livestock           TEXT[],
  irrigation_access   BOOLEAN DEFAULT FALSE,
  market_access       TEXT CHECK (market_access IN ('Local','District','National','Export')),
  active              BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- AI interactions log
CREATE TABLE ai_outputs (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module        TEXT NOT NULL,
  title         TEXT,
  input_data    JSONB,
  output        TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Crop reports
CREATE TABLE crop_reports (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id     UUID REFERENCES farmers(id),
  user_id       UUID REFERENCES profiles(id),
  crop          TEXT NOT NULL,
  season        TEXT NOT NULL,
  area_ha       DECIMAL(10,2),
  yield_actual  DECIMAL(10,2),
  province      TEXT,
  district      TEXT,
  report_date   DATE DEFAULT CURRENT_DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Disease alerts
CREATE TABLE disease_alerts (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reported_by   UUID REFERENCES profiles(id),
  farmer_id     UUID REFERENCES farmers(id),
  crop          TEXT,
  disease_name  TEXT NOT NULL,
  severity      INTEGER CHECK (severity BETWEEN 1 AND 10),
  province      TEXT NOT NULL,
  district      TEXT NOT NULL,
  gps_lat       DECIMAL(10,7),
  gps_lon       DECIMAL(10,7),
  resolved      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Extension visits
CREATE TABLE extension_visits (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  officer_id    UUID REFERENCES profiles(id),
  farmer_id     UUID REFERENCES farmers(id) NOT NULL,
  visit_date    DATE NOT NULL,
  purpose       TEXT,
  advice_given  TEXT,
  follow_up     BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Input inventory
CREATE TABLE farm_inputs (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id       UUID REFERENCES profiles(id),
  farmer_id     UUID REFERENCES farmers(id),
  input_type    TEXT NOT NULL,  -- 'seed','fertilizer','chemical','equipment'
  product_name  TEXT NOT NULL,
  quantity      DECIMAL(10,2),
  unit          TEXT,
  purchase_date DATE,
  cost_usd      DECIMAL(10,2),
  supplier      TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ══════════════════════════════════════════

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_outputs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_alerts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE extension_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_inputs     ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);

-- Farmers: registered users can read all (extension officers need cross-province access)
-- Government/admin can see all; farmers see their own record
CREATE POLICY "farmers_read" ON farmers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "farmers_insert" ON farmers FOR INSERT WITH CHECK (auth.uid() = registered_by);
CREATE POLICY "farmers_update" ON farmers FOR UPDATE USING (auth.uid() = registered_by);

-- AI outputs: users see own
CREATE POLICY "own_ai_outputs" ON ai_outputs FOR ALL USING (auth.uid() = user_id);

-- Crop reports: users see own + public read for government dashboards
CREATE POLICY "crop_reports_read" ON crop_reports FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "crop_reports_write" ON crop_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Disease alerts: all authenticated users can read (for early warning)
CREATE POLICY "disease_alerts_read" ON disease_alerts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "disease_alerts_write" ON disease_alerts FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Extension visits: officers see own records
CREATE POLICY "extension_own" ON extension_visits FOR ALL USING (auth.uid() = officer_id);

-- Farm inputs: users see own
CREATE POLICY "inputs_own" ON farm_inputs FOR ALL USING (auth.uid() = user_id);

-- ══════════════════════════════════════════
-- INDEXES for performance
-- ══════════════════════════════════════════
CREATE INDEX idx_farmers_province  ON farmers(province);
CREATE INDEX idx_farmers_district  ON farmers(district);
CREATE INDEX idx_farmers_sector    ON farmers(farming_sector);
CREATE INDEX idx_disease_province  ON disease_alerts(province, created_at);
CREATE INDEX idx_ai_outputs_user   ON ai_outputs(user_id, created_at DESC);
