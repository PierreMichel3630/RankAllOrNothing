import { corsHeaders } from "../_shared/cors.ts";
import { getAuthorization } from "../utils/twitchUtils.ts";

const LIMIT = 20;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { search, page } = await req.json();
    const token: any = await getAuthorization();
    const offset = page * LIMIT - LIMIT;
    const body = `${
      search !== "" ? `search "${search}";` : ""
    } fields *, cover.*, genres.*, release_dates.*, platforms.*; limit ${LIMIT}; offset ${offset};`;
    const options = {
      method: "POST",
      headers: {
        "Client-ID": Deno.env.get("TWITCH_CLIENT_ID"),
        "Content-Type": "text/plain",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: body,
    };
    const countdata = await fetch(
      `https://api.igdb.com/v4/games/count`,
      options
    ).then((res) => res.json());
    const data = await fetch(`https://api.igdb.com/v4/games/`, options).then(
      (res) => res.json()
    );
    const result = {
      page: page,
      results: data,
      total_pages: Math.ceil(countdata.count / LIMIT),
      total_results: countdata.count,
    };
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
