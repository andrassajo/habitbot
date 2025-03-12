import OpenAI from 'openai';
import dotenv from 'dotenv';
import { ChatCompletionMessageParam } from 'openai/resources';
import { pool } from '../db';
import openaiClient from './client';
dotenv.config();

/**
 * Retrieves the conversation context (all messages) for a given conversation ID.
 *
 * This function queries the PostgreSQL database for messages associated with
 * the specified conversation and orders them by creation time.
 *
 * @param {string} conversationId - The unique identifier of the conversation.
 * @returns {Promise<{ rows: Array<ChatCompletionMessageParam> }>} 
 *          A promise that resolves to an object containing an array of message rows.
 */
async function getConversationContext(conversationId: string): Promise<{ rows: Array<ChatCompletionMessageParam> }> {
  const result = await pool.query(
    `SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
    [conversationId]
  );
  return result;
}

/**
 * Generates an AI response based on the conversation context and a new user message.
 *
 * This function retrieves previous messages for the given conversation,
 * appends the new user message, and sends the combined conversation to the OpenAI API.
 *
 * @param {string} conversationId - The unique identifier of the conversation.
 * @param {string} newUserMessage - The new message from the user.
 * @returns {Promise<string>} A promise that resolves to the AI's response message content.
 */
export async function getResponse(conversationId: string, newUserMessage: string): Promise<string> {
  
  // Retrieve previous conversation history from the database.
  const { rows: previousMessages } = await getConversationContext(conversationId);
  
  // Combine previous messages with the new user message.
  const messages = [
    ...previousMessages,
    { role: "user", content: newUserMessage }
  ] as ChatCompletionMessageParam[];

  
  // Call the OpenAI API to generate the response.
  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o",
    messages
  });

  if (!response.choices[0].message.content) {
    console.error('No response received from OpenAI API.');
    throw new Error('No response from OpenAI API');
  }
  
  // Return the content of the assistant's response.
  return response.choices[0].message.content;
}

/**
 * Generates a concise title based on the user's initial question.
 *
 * @param {string} question - The first question of the conversation.
 * @returns {Promise<string>} A promise that resolves to the generated title.
 */
export async function generateTitle(question: string): Promise<string> {
    const prompt = `Generate a concise, descriptive title for the following conversation question:\n\n"${question}"\n\nTitle:`;
    
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates conversation titles." },
        { role: "user", content: prompt }
      ]
    });
  
    if (!response.choices[0].message.content) {
      throw new Error("Failed to generate title");
    }
  
    const title = response.choices[0].message.content.trim();
    return title;
  }