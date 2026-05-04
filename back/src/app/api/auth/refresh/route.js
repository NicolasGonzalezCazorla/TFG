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
    const { refresh_token } = await req.json();

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'Falta refresh_token' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { error: 'Sesion expirada, inicia sesion de nuevo' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { data: perfil } = await supabaseAdmin
      .from('perfiles')
      .select('nombre, apellidos, rol')
      .eq('id', data.user.id)
      .single();

    return NextResponse.json(
      {
        session: data.session,
        user:    data.user,
        perfil,
      },
      { status: 200, headers: corsHeaders }
    );

  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}