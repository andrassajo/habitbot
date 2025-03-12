-- Enable the UUID generation extension if it's not already enabled.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the conversations table using UUIDs for the id.
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255), -- Optional: store a conversation title or summary
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create the messages table using UUIDs for the id and conversation_id.
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversations(id)
    ON DELETE CASCADE
);
