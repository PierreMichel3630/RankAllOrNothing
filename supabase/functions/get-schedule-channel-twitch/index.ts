import { corsHeaders } from "../_shared/cors.ts";
import { getAuthorization } from "../utils/twitchUtils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const { id } = await req.json();
    const token: any = await getAuthorization();

    const options = {
      method: "GET",
      headers: {
        "Client-ID": Deno.env.get("TWITCH_CLIENT_ID"),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
    };
    let url = `https://api.twitch.tv/helix/schedule?broadcaster_id=${id}`;
    const data = await fetch(url, options).then((res) => res.json());
    return new Response(JSON.stringify(data), {
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
