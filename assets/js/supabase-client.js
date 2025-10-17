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
     * Get all tables
     */
    async getTables() {
        const { data, error } = await this.client
            .from('tables')
            .select('*')
            .eq('active', true)
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
     * Get menu items with category info
     */
    async getMenuItems() {
        const { data, error } = await this.client
            .from('menu_items')
            .select('*, categories(slug, display_order)')
            .eq('available', true)
            .order('category_id', { ascending: true });
        
        if (error) throw error;
        return data;
    }

    /**
     * Get all categories
     */
    async getCategories() {
        const { data, error } = await this.client
            .from('categories')
            .select('*')
            .eq('active', true)
            .order('display_order', { ascending: true });
        
        if (error) throw error;
        return data;
    }

    /**
     * Create category
     */
    async createCategory(categoryData) {
        const { data, error } = await this.client
            .from('categories')
            .insert([categoryData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Update category
     */
    async updateCategory(categoryId, categoryData) {
        const { data, error } = await this.client
            .from('categories')
            .update(categoryData)
            .eq('id', categoryId)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Delete category
     */
    async deleteCategory(categoryId) {
        const { error } = await this.client
            .from('categories')
            .delete()
            .eq('id', categoryId);
        
        if (error) throw error;
        return true;
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
            .select('*, tables(table_number)');
        
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        
        if (filters.payment_status) {
            query = query.eq('payment_status', filters.payment_status);
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
     * Update order payment status
     */
    async updatePaymentStatus(orderId, paymentStatus, paymentMethod = null) {
        const updateData = { 
            payment_status: paymentStatus, 
            updated_at: new Date().toISOString() 
        };
        
        if (paymentMethod) {
            updateData.payment_method = paymentMethod;
        }
        
        const { data, error } = await this.client
            .from('orders')
            .update(updateData)
            .eq('id', orderId)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Get all employees
     */
    async getEmployees() {
        const { data, error } = await this.client
            .from('employees')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) throw error;
        return data;
    }

    /**
     * Create employee
     */
    async createEmployee(employeeData) {
        const { data, error } = await this.client
            .from('employees')
            .insert([employeeData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Update employee
     */
    async updateEmployee(employeeId, employeeData) {
        const { data, error } = await this.client
            .from('employees')
            .update(employeeData)
            .eq('id', employeeId)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Delete employee
     */
    async deleteEmployee(employeeId) {
        const { error } = await this.client
            .from('employees')
            .delete()
            .eq('id', employeeId);
        
        if (error) throw error;
        return true;
    }

    /**
     * Subscribe to real-time order updates
     */
    subscribeToOrders(callback) {
        const channel = this.client
            .channel('orders-channel')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'orders' 
            }, (payload) => {
                // Transform payload to match expected format
                callback({
                    eventType: payload.eventType,
                    new: payload.new,
                    old: payload.old
                });
            })
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });
        
        return channel;
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

    /**
     * Get employee shifts with employee info
     */
    async getEmployeeShifts(filters = {}) {
        let query = this.client
            .from('employee_shifts')
            .select('*, employees(name, email, role)');
        
        if (filters.employeeId) {
            query = query.eq('employee_id', filters.employeeId);
        }
        
        if (filters.startDate) {
            query = query.gte('shift_date', filters.startDate);
        }
        
        if (filters.endDate) {
            query = query.lte('shift_date', filters.endDate);
        }
        
        query = query.order('shift_date', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    }

    /**
     * Create employee shift
     */
    async createEmployeeShift(shiftData) {
        const { data, error } = await this.client
            .from('employee_shifts')
            .insert([shiftData])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Update employee shift
     */
    async updateEmployeeShift(shiftId, shiftData) {
        const { data, error } = await this.client
            .from('employee_shifts')
            .update(shiftData)
            .eq('id', shiftId)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }

    /**
     * Delete employee shift
     */
    async deleteEmployeeShift(shiftId) {
        const { error } = await this.client
            .from('employee_shifts')
            .delete()
            .eq('id', shiftId);
        
        if (error) throw error;
        return true;
    }

    /**
     * Clock in employee (start shift)
     */
    async clockIn(employeeId) {
        const shiftData = {
            employee_id: employeeId,
            shift_date: new Date().toISOString().split('T')[0],
            start_time: new Date().toISOString()
        };
        
        return await this.createEmployeeShift(shiftData);
    }

    /**
     * Clock out employee (end shift)
     */
    async clockOut(shiftId) {
        const shiftData = {
            end_time: new Date().toISOString()
        };
        
        return await this.updateEmployeeShift(shiftId, shiftData);
    }

    /**
     * Get daily analytics
     */
    async getDailyAnalytics(filters = {}) {
        let query = this.client
            .from('daily_analytics')
            .select('*');
        
        if (filters.startDate) {
            query = query.gte('business_date', filters.startDate);
        }
        
        if (filters.endDate) {
            query = query.lte('business_date', filters.endDate);
        }
        
        query = query.order('business_date', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    }

    /**
     * Get analytics for a specific date with employee shifts
     */
    async getDateAnalytics(date) {
        // Get daily analytics
        const { data: analytics, error: analyticsError } = await this.client
            .from('daily_analytics')
            .select('*')
            .eq('business_date', date)
            .single();
        
        // Get employee shifts for that date
        const { data: shifts, error: shiftsError } = await this.client
            .from('employee_shifts')
            .select('*, employees(name, email, role)')
            .eq('shift_date', date)
            .order('start_time', { ascending: true });
        
        // Get orders for that date
        const { data: orders, error: ordersError } = await this.client
            .from('orders')
            .select('*')
            .gte('created_at', `${date}T00:00:00`)
            .lt('created_at', `${date}T23:59:59`)
            .order('created_at', { ascending: true });
        
        return {
            analytics: analytics || null,
            shifts: shifts || [],
            orders: orders || []
        };
    }
}

// Export singleton instance
export const supabaseClient = new SupabaseClient();
