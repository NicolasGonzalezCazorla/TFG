import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { id } = await req.json();

    const { data: cita, error: citaError } = await supabaseAdmin
      .from('citas')
      .select('*')
      .eq('id', id)
      .single();

    if (citaError || !cita) {
      return NextResponse.json(
        { error: 'Cita no encontrada' },
        { status: 404, headers: corsHeaders }
      );
    }

    const { data: perfil } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    const esAdmin  = perfil?.rol === 'admin';
    const esDuenio = cita.usuario_id === user.id;

    if (!esAdmin && !esDuenio) {
      return NextResponse.json(
        { error: 'No autorizado para cancelar esta cita' },
        { status: 403, headers: corsHeaders }
      );
    }

    // Solo el cliente tiene restriccion de 24h
    if (!esAdmin) {
      const citaFechaHora = new Date(`${cita.fecha}T${cita.hora}`);
      const ahora         = new Date();
      const diffHoras     = (citaFechaHora - ahora) / (1000 * 60 * 60);

      if (diffHoras < 24) {
        return NextResponse.json(
          { error: 'No puedes cancelar una cita con menos de 24 horas de antelacion.' },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    // Marcar como cancelada en vez de eliminar
    const { error } = await supabaseAdmin
      .from('citas')
      .update({
        estado:        'cancelada',
        cancelado_por: user.id,
      })
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { ok: true, mensaje: 'Cita cancelada correctamente' },
      { status: 200, headers: corsHeaders }
    );

  } catch (e) {
    console.error('Error cancelar cita:', e);
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}