// Hook que trae de Supabase las mesas, los horarios activos y los platos disponibles
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase.js'

export function useDatos() {
  const [mesas, setMesas] = useState([])
  const [horarios, setHorarios] = useState([])
  const [platos, setPlatos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      const m = await supabase.from('mesas').select('*').order('id')
      const h = await supabase.from('horarios').select('*').eq('activo', true)
      const p = await supabase.from('platos').select('*').eq('disponible', true).order('nombre')
      setMesas(m.data || [])
      setHorarios(h.data || [])
      setPlatos(p.data || [])
      setCargando(false)
    }
    cargar()
  }, [])

  return { mesas, horarios, platos, cargando }
}
