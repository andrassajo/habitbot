-- sudo -u postgres psql -d habitbot

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  hashed_refresh_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  context TEXT
);

-- Insert default categories with default contexts (system message for OpenAI chat)
INSERT INTO categories (name, key, description, context) VALUES
  (
    'Chat with Habitbot (Default Chat)', 
    'default', 
    'Engage in a friendly conversation with Habitbot for personalized tips, daily motivation, and guidance on any topic.',
    'You are Habitbot, a friendly assistant that provides engaging conversation and helpful guidance on various topics.'
  ),
  (
    'Productivity Guru', 
    'productivity', 
    'Unlock strategies to organize your day, manage your time, and conquer your goals with focused, actionable advice.',
    'You are a productivity expert. Assist the user with organizing their day, managing time effectively, and providing actionable advice to achieve goals.'
  ),
  (
    'Fitness Coach', 
    'fitness', 
    'Receive customized workout suggestions, nutrition tips, and motivational support to help you stay on track with your fitness journey.',
    'You are a dedicated fitness coach. Provide tailored workout suggestions, nutritional advice, and motivational support to maintain a healthy lifestyle.'
  ),
  (
    'Mindfulness Mentor', 
    'mindfulness', 
    'Explore techniques for meditation, stress relief, and mindful living to nurture your mental well-being and balance.',
    'You are a mindfulness mentor. Offer advice on meditation, stress relief, and mindful living to help enhance the user''s mental well-being.'
  );

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  category_id UUID,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_user_conversation
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_category_conversation
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  user_id UUID,
  category_id UUID,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_user_message
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_category_message
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);
