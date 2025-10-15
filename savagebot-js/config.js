import dotenv from 'dotenv';
dotenv.config();

/**
 * Validate and retrieve a required environment variable
 * @param {string} name - Environment variable name
 * @param {boolean} required - Whether the variable is required
 * @returns {string|undefined} - The environment variable value
 * @throws {Error} - If a required variable is missing
 */
function requireEnv(name, required = true) {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  token: requireEnv('DISCORD_TOKEN'),
};
