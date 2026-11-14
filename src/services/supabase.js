// Conexión con Supabase
// Las claves NO van aquí escritas, se leen de las variables de entorno (.env o Vercel)
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)
