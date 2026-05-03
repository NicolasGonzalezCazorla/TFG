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
    const { searchParams } = new URL(req.url);
    const mes  = searchParams.get('mes');
    const anio = searchParams.get('anio');

    if (!mes || !anio) {
      return NextResponse.json(
        { error: 'Faltan parametros mes y anio' },
        { status: 400, headers: corsHeaders }
      );
    }

    const fechaInicio = `${anio}-${String(mes).padStart(2, '0')}-01`;
    const fechaFin    = `${anio}-${String(mes).padStart(2, '0')}-31`;

    const { data, error } = await supabaseAdmin
      .from('citas')
      .select('fecha, hora')
      .gte('fecha', fechaInicio)
      .lte('fecha', fechaFin)
      .neq('estado', 'cancelada');

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    const ocupados = {};
    data.forEach((cita) => {
      const dia = cita.fecha.split('-')[2];
      if (!ocupados[dia]) ocupados[dia] = [];
      // Recorta HH:MM:SS a HH:MM
      ocupados[dia].push(cita.hora.substring(0, 5));
    });

    return NextResponse.json(
      { ocupados },
      { status: 200, headers: corsHeaders }
    );

  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}