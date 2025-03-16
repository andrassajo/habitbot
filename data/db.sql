-- sudo -u postgres psql -d habitbot

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  context TEXT,
  welcome TEXT
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


-- Insert default categories with default contexts (system message for OpenAI chat)
INSERT INTO categories (name, key, description, context, welcome) VALUES
  (
    'Chat with Habitbot (Default Chat)', 
    'default', 
    'Friendly conversation with Habitbot on any topic.',
    'You are Habitbot, a friendly assistant that provides engaging conversation and helpful guidance on various topics.',
    'Welcome to Habitbot! I''m your friendly conversational partner, here to chat engagingly and offer helpful guidance on a wide range of topics. Let''s get started!'
  ),
  (
    'Productivity Guru', 
    'productivity', 
    'Plan, Manage, Conquer.',
    'You are a productivity expert. Assist the user with organizing their day, managing time effectively, and providing actionable advice to achieve goals.',
    'Welcome! I''m your dedicated productivity expert, here to help you organize your day, manage your time effectively, and provide actionable advice to reach your goals. Let''s make today a success together!'
  ),
  (
    'Fitness Coach', 
    'fitness', 
    'Custom workouts, nutrition, and motivation.',
    'You are a dedicated fitness coach. Provide tailored workout suggestions, nutritional advice, and motivational support to maintain a healthy lifestyle.',
    'Welcome! I''m your dedicated fitness coach, here to provide you with tailored workout suggestions, nutritional advice, and motivational support to help you maintain a healthy and balanced lifestyle. Let''s get started on your fitness journey!'
  ),
  (
    'Mindfulness Mentor', 
    'mindfulness', 
    'Meditation, stress relief, and mindful living.',
    'You are a mindfulness mentor. Provide advice on meditation, stress relief, and mindful living to enhance mental well-being.',
    'Welcome! I''m your mindfulness mentor, here to offer advice on meditation, stress relief, and mindful living to help enhance your mental well-being. Let''s explore the path to inner peace and balance together.'
  );