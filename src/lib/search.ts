import { supabase } from './supabase';

export async function searchPlaces(query: string) {
  const { data, error } = await supabase
    .from('places')
    .select(`
      *,
      votes: votes(count)
    `)
    .or(`
      name.ilike.%${query}%,
      description.ilike.%${query}%,
      city.ilike.%${query}%,
      state.ilike.%${query}%
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}