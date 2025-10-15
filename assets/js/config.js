/**
 * Configuration Module
 * Loads environment variables and provides configuration access
 */

class Config {
    constructor() {
        this.supabaseUrl = null;
        this.supabaseAnonKey = null;
        this.loaded = false;
    }

    /**
     * Load configuration from .env file
     */
    async load() {
        try {
            const response = await fetch('/.env');
            const text = await response.text();
            
            // Parse .env file
            const lines = text.split('\n');
            const config = {};
            
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
                    const [key, ...valueParts] = trimmed.split('=');
                    const value = valueParts.join('=').trim();
                    config[key.trim()] = value;
                }
            }
            
            this.supabaseUrl = config.SUPABASE_URL;
            this.supabaseAnonKey = config.SUPABASE_ANON_KEY;
            
            // Validate configuration
            if (!this.supabaseUrl || !this.supabaseAnonKey) {
                throw new Error('Missing required Supabase configuration');
            }
            
            if (this.supabaseUrl.includes('your-project') || this.supabaseAnonKey.includes('your-anon-key')) {
                throw new Error('Please update .env file with your actual Supabase credentials');
            }
            
            this.loaded = true;
            return true;
        } catch (error) {
            console.error('Failed to load configuration:', error);
            throw error;
        }
    }

    /**
     * Get Supabase configuration
     */
    getSupabaseConfig() {
        if (!this.loaded) {
            throw new Error('Configuration not loaded. Call load() first.');
        }
        return {
            url: this.supabaseUrl,
            anonKey: this.supabaseAnonKey
        };
    }
}

// Export singleton instance
export const config = new Config();
