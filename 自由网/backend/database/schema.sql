-- 自由网数据库结构（待实现，用于 Supabase）
-- 现在前端数据写死，未来迁移到这里

-- 酒店主表
CREATE TABLE hotels (
  id          TEXT PRIMARY KEY,          -- 'junji-weihai'
  name        TEXT NOT NULL,
  city        TEXT NOT NULL,
  province    TEXT NOT NULL,
  address     TEXT,
  stars       INT,
  rating      DECIMAL(2,1),
  review_count INT,
  price_from  INT,                       -- 自由网最低价
  price_ctrip INT,                       -- 携程对比价
  description TEXT,
  status      TEXT DEFAULT 'approved',   -- pending/approved/rejected
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 房型表
CREATE TABLE rooms (
  id          SERIAL PRIMARY KEY,
  hotel_id    TEXT REFERENCES hotels(id),
  name        TEXT NOT NULL,
  area_sqm    INT,
  bed_type    TEXT,
  floor_range TEXT,
  price       INT,
  price_ctrip INT,
  features    TEXT[],                    -- ['有窗','禁烟','WiFi免费']
  has_breakfast BOOLEAN DEFAULT false
);

-- 评价表
CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  hotel_id    TEXT REFERENCES hotels(id),
  author      TEXT,
  score       DECIMAL(2,1),
  content     TEXT,
  tags        TEXT[],
  source      TEXT DEFAULT 'ziyouwang',  -- 'ctrip'/'meituan'/'ziyouwang'
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 图片表
CREATE TABLE hotel_images (
  id          SERIAL PRIMARY KEY,
  hotel_id    TEXT REFERENCES hotels(id),
  url         TEXT NOT NULL,
  caption     TEXT,
  sort_order  INT DEFAULT 0,
  type        TEXT                       -- 'exterior'/'room'/'facility'
);

-- 酒店特色标签
CREATE TABLE hotel_features (
  id          SERIAL PRIMARY KEY,
  hotel_id    TEXT REFERENCES hotels(id),
  feature     TEXT NOT NULL,             -- '迷人海景'
  icon        TEXT,                      -- '🌊'
  category    TEXT                       -- 'facility'/'experience'
);
