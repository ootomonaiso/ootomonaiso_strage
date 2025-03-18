import { supabase } from "../../lib/supabase";

export async function POST(req: Request) {
  const { title, slug, content, tags, series, thumbnail } = await req.json();

  const { data, error } = await supabase.from("posts").insert([
    { title, slug, content, tags, series, thumbnail },
  ]);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ data }), { status: 201 });
}

export async function GET(req: Request) {
  const { data, error } = await supabase.from("posts").select("*");

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ data }), { status: 200 });
}
