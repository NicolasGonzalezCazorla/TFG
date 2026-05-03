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

    const { data: reserva, error: reservaError } = await supabaseAdmin
      .from('reservas_productos')
      .select('*')
      .eq('id', id)
      .single();

    if (reservaError || !reserva) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404, headers: corsHeaders }
      );
    }

    const { data: perfil } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    const esAdmin  = perfil?.rol === 'admin';
    const esDuenio = reserva.usuario_id === user.id;

    if (!esAdmin && !esDuenio) {
      return NextResponse.json(
        { error: 'No autorizado para cancelar esta reserva' },
        { status: 403, headers: corsHeaders }
      );
    }

    if (reserva.estado === 'recogida') {
      return NextResponse.json(
        { error: 'No puedes cancelar una reserva ya recogida' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { error } = await supabaseAdmin
      .from('reservas_productos')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { ok: true, mensaje: 'Reserva cancelada correctamente' },
      { status: 200, headers: corsHeaders }
    );

  } catch (e) {
    console.error('Error cancelar reserva:', e);
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}