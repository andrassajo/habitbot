import { hash } from "argon2";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Finds a user record in the database.
 *
 * @param client - The PostgreSQL client to use for the transaction.
 * @param title - The email of the user to be found.
 * @returns {Promise<string>} A promise that resolves the user ID found by the email.
 */
export async function findUserByEmail(client: any, email: string): Promise<{ id: string, password: string }> {
    const result = await client.query(
      'SELECT id, password FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0]
}

/**
 * Creates a user record in the database.
 *
 * @param client - The PostgreSQL client to use for the transaction.
 * @param email - The email of the user to be created.
 * @param name - The name of the user to be created.
 * @param hashedPassword - The hashed password of the user to be created.
 * @returns {Promise<string>} A promise that resolves to the newly created user ID.
 */
export async function createUser(client: any, email: string, name: string, password: string): Promise<string> {
    const hashedPassword = await hash(password);

    const result = await client.query(
        'INSERT INTO users(email, name, password) VALUES($1, $2, $3) RETURNING id',
        [email, name, hashedPassword]
    );

    return result.rows[0].id
}

export async function generateTokens(userId: string): Promise<{ accessToken: string, refreshToken: string }> {
    const payload = { user: userId };

    const accessToken = jwt.sign(payload, process.env["ACCESS_TOKEN_SECRET"] as string, {
      expiresIn: '15m'
    });

    const refreshToken = jwt.sign(payload, process.env["REFRESH_TOKEN_SECRET"] as string, {
      expiresIn:
        process.env.NODE_ENV === 'production' ? '7d' : '30d'
    });

    return { accessToken, refreshToken };
  }

export async function updateHashedRefreshToken(client: any, userId: string, refreshToken: string | null) {
    const hashedRT = await hash(refreshToken as string);

    await client.query(
        'UPDATE users SET hashed_refresh_token = $1 WHERE id = $2',
        [hashedRT, userId]
    );
}