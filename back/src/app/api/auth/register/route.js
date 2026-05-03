import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

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
    const { email, password, nombre, apellidos } = await req.json();
    console.log('Registrando usuario:', email);

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { nombre, apellidos },
      email_confirm: true,
    });

    if (error) {
      console.error('Error Supabase:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { user: data.user },
      { status: 201, headers: corsHeaders }
    );

  } catch (e) {
    console.error('Error servidor:', e);
    return NextResponse.json(
      { error: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}