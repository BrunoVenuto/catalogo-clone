import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ukkcgzazncwiolxikdzm.supabase.co'
const supabaseKey = 'sb_publishable_Fj--veVOlJYs5BzboIS0FQ_kvIkwXZT'

export const supabase = createClient(supabaseUrl, supabaseKey)
