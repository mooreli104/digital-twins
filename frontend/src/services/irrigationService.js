// Irrigation Service
// Purpose: Handle irrigation event tracking and persistence to Supabase

import { supabase } from './supabase';

/**
 * Save an irrigation event to Supabase
 * @param {Object} event - { water_amount, triggered_by, greenhouse_id }
 * @returns {Object} Created irrigation event with ID
 */
export async function saveIrrigationEvent(event) {
  try {
    const { data, error } = await supabase
      .from('irrigation_events')
      .insert([{
        greenhouse_id: event.greenhouse_id || null, // Will be set when you have greenhouses
        water_amount: event.amount || 0.5, // gallons
        triggered_by: event.triggered_by || 'automatic',
        timestamp: event.timestamp || new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error saving irrigation event:', error);
      throw error;
    }

    console.log('💧 Irrigation event saved to Supabase:', data.id);
    return data;
  } catch (error) {
    console.error('Error saving irrigation event:', error);
    throw error;
  }
}

/**
 * Get recent irrigation events from Supabase
 * @param {number} limit - Number of events to fetch
 * @returns {Array} List of irrigation events
 */
export async function getRecentIrrigationEvents(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('irrigation_events')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase error fetching irrigation events:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching irrigation events:', error);
    return [];
  }
}

/**
 * Get irrigation events for a specific time range
 * @param {Date} startDate - Start of time range
 * @param {Date} endDate - End of time range
 * @returns {Array} List of irrigation events in range
 */
export async function getIrrigationEventsByDateRange(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('irrigation_events')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lte('timestamp', endDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching irrigation events by date range:', error);
    return [];
  }
}
