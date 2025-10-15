/**
 * Supabase Client Module
 * Manages database connections and operations
 */

// Supabase Configuration
const SUPABASE_URL = 'https://bxlhpczyvfukteutuhwl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4bGhwY3p5dmZ1a3RldXR1aHdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NzgwMTMsImV4cCI6MjA3NjA1NDAxM30.UYcN4iy2NjmEYbIQnXqFJROe3ynnwTMa3mtJvuCuf18';

class SupabaseClient {
    constructor() {
        this.client = null;
        this.initialized = false;
    }

    /**
     * Initialize Supabase client
     */
    async init() {
        try {
            // Initialize Supabase client using CDN
            const { createClient } = supabase;
            this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            
            this.initialized = true;
            console.log('✅ Supabase client initialized');
            return true;
        } catch (error) {
            console.error('Failed to initialize Supabase client:', error);
            throw error;
        }
    }

    /**
     * Get the Supabase client instance
     */
    getClient() {
        if (!this.initialized) {
            throw new Error('Supabase client not initialized. Call init() first.');
        }
        return this.client;
    }

    /**
     * Get all tables for a specific language
     */
    async getTables(language = 'en') {
        const { data, error } = await this.client
            .from('tables')
            .select('*')
            .eq('language', language)
            .order('table_number', { ascending: true });
        
        if (error) throw error;
        return data;
    }

    /**
     * Get a specific table by ID
     */
    async getTable(tableId) {
        const { data, error } = await this.client
            .from('tables')
            .select('*')
            .eq('id', tableId)
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Get menu items for a specific language
     */
    async getMenuItems(language = 'en') {
        const { data, error } = await this.client
            .from('menu_items')
            .select('*')
            .eq('language', language)
            .eq('available', true)
            .order('category', { ascending: true })
            .order('name', { ascending: true });
        
        if (error) throw error;
        return data;
    }

    /**
     * Create a new order
     */
    async createOrder(orderData) {
        const { data, error } = await this.client
            .from('orders')
            .insert([orderData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Get orders (for staff/admin)
     */
    async getOrders(filters = {}) {
        let query = this.client
            .from('orders')
            .select('*, tables(table_number, language)');
        
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        
        if (filters.tableId) {
            query = query.eq('table_id', filters.tableId);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    }

    /**
     * Update order status
     */
    async updateOrderStatus(orderId, status) {
        const { data, error } = await this.client
            .from('orders')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', orderId)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Subscribe to real-time order updates
     */
    subscribeToOrders(callback) {
        return this.client
            .channel('orders')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'orders' 
            }, callback)
            .subscribe();
    }

    /**
     * Create a new table
     */
    async createTable(tableData) {
        const { data, error } = await this.client
            .from('tables')
            .insert([tableData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Update table
     */
    async updateTable(tableId, tableData) {
        const { data, error } = await this.client
            .from('tables')
            .update(tableData)
            .eq('id', tableId)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Delete table
     */
    async deleteTable(tableId) {
        const { error } = await this.client
            .from('tables')
            .delete()
            .eq('id', tableId);
        
        if (error) throw error;
        return true;
    }

    /**
     * Create menu item
     */
    async createMenuItem(itemData) {
        const { data, error } = await this.client
            .from('menu_items')
            .insert([itemData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Update menu item
     */
    async updateMenuItem(itemId, itemData) {
        const { data, error } = await this.client
            .from('menu_items')
            .update(itemData)
            .eq('id', itemId)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Delete menu item
     */
    async deleteMenuItem(itemId) {
        const { error } = await this.client
            .from('menu_items')
            .delete()
            .eq('id', itemId);
        
        if (error) throw error;
        return true;
    }
}

// Export singleton instance
export const supabaseClient = new SupabaseClient();
