import { config } from 'dotenv';
import { join } from 'path';

/**
 * Configures dotenv based on the current mode
 * @param mode - The current environment mode (e.g., 'production', 'development')
 * @param dirname - The directory path (__dirname) from where the function is called
 */
export function configureEnv(mode: string, dirname: string): void {
  config(mode === 'production' ? {} : { path: join(dirname, `.env.${mode}`) });
}
