import { createClient } from '@supabase/supabase-js';

const URL = "https://sjsndjpzzyuztmqfgpdj.supabase.co";

const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqc25kanB6enl1enRtcWZncGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwOTQ5ODYsImV4cCI6MjA3MTY3MDk4Nn0.zMYbLV0KcxyFDh8k95-T3k2afoZsyE4U_4MmnZ0tNkU";

export const supabase = createClient(URL, API_KEY);