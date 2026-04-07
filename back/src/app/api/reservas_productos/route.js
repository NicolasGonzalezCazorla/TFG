import { supabase } from "@/app/lib/supabase";

export async function GET() {

    const {data, error} = await supabase.from("servicios").select("*");
    if (error){
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
}