import { IDatabaseService } from '../../../domain/interfaces/IDatabaseService';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;
if (import.meta.env.VITE_BAAS_PROVIDER === 'supabase' && supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export class SupabaseDatabaseAdapter implements IDatabaseService {
  
  private checkDb() {
    if (!supabase) throw new Error('Supabase não inicializado');
  }

  async get<T>(collectionName: string, id: string): Promise<T | null> {
    this.checkDb();
    const { data, error } = await supabase!
      .from(collectionName)
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
       console.error(error);
       return null;
    }
    return data as T;
  }

  async list<T>(collectionName: string, filters?: any): Promise<T[]> {
    this.checkDb();
    let query = supabase!.from(collectionName).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  }

  async create<T>(collectionName: string, data: Partial<T>): Promise<T> {
    this.checkDb();
    const { data: insertedData, error } = await supabase!
      .from(collectionName)
      .insert(data as any)
      .select()
      .single();
      
    if (error) throw error;
    return insertedData as T;
  }

  async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<T> {
    this.checkDb();
    const { data: updatedData, error } = await supabase!
      .from(collectionName)
      .update(data as any)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return updatedData as T;
  }

  async delete(collectionName: string, id: string): Promise<void> {
    this.checkDb();
    const { error } = await supabase!
      .from(collectionName)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }

  subscribe<T>(collectionName: string, callback: (data: T[]) => void, filters?: any): () => void {
    if (!supabase) return () => {};
    
    // Initial fetch
    this.list<T>(collectionName, filters).then(callback).catch(console.error);

    // Setup realtime subscription
    const channel = supabase
      .channel(`public:${collectionName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: collectionName }, () => {
        // Simple approach: re-fetch the list when anything changes to ensure filters apply correctly
        this.list<T>(collectionName, filters).then(callback).catch(console.error);
      })
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }
}
