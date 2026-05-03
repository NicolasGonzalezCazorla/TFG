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

export async function GET(req) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { data: perfil } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    let query = supabaseAdmin
  .from('citas')
  .select(`
    *,
    servicios(nombre, precio),
    perfiles(nombre, apellidos),
    cancelador:cancelado_por(nombre, apellidos)
  `);

    if (perfil?.rol !== 'admin') {
      query = query.eq('usuario_id', user.id);
    }

    const { data, error } = await query.order('fecha', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { citas: data },
      { status: 200, headers: corsHeaders }
    );

  } catch (e) {
    console.error('Error GET citas:', e);
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
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

    const body = await req.json();
    const { servicio_id, fecha, hora, aclaracion, estado } = body;

    console.log('Creando cita:', body);

    const { data: citaExistente } = await supabaseAdmin
      .from('citas')
      .select('id')
      .eq('fecha', fecha)
      .eq('hora', hora)
      .neq('estado', 'cancelada')
      .maybeSingle();

    if (citaExistente) {
      return NextResponse.json(
        { error: 'Ya existe una cita en esa fecha y hora. Por favor elige otro horario.' },
        { status: 409, headers: corsHeaders }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('citas')
      .insert({ servicio_id, fecha, hora, aclaracion, estado, usuario_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error Supabase cita:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { cita: data },
      { status: 201, headers: corsHeaders }
    );

  } catch (e) {
    console.error('Error POST citas:', e);
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(req) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { data: perfil } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    if (perfil?.rol !== 'admin') {
      return NextResponse.json(
        { error: 'Solo admin' },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { id, ...rest } = body;

    const { data, error } = await supabaseAdmin
      .from('citas')
      .update(rest)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { cita: data },
      { status: 200, headers: corsHeaders }
    );

  } catch (e) {
    console.error('Error PUT citas:', e);
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(req) {
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

    // Busca la cita sin filtrar por usuario_id
    // para que el admin también pueda cancelar
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

    // Verificar que es el dueño o admin
    const { data: perfilUsuario } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    const esAdmin = perfilUsuario?.rol === 'admin';
    const esDuenio = cita.usuario_id === user.id;

    if (!esAdmin && !esDuenio) {
      return NextResponse.json(
        { error: 'No autorizado para cancelar esta cita' },
        { status: 403, headers: corsHeaders }
      );
    }

    // Solo el cliente tiene restriccion de 24h, el admin puede cancelar siempre
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

    const { error } = await supabaseAdmin
      .from('citas')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { ok: true, mensaje: 'Cita eliminada correctamente' },
      { status: 200, headers: corsHeaders }
    );

  } catch (e) {
    console.error('Error DELETE citas:', e);
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}