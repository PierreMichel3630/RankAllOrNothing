import NodeCache from "node-cache";

const cache = new NodeCache();

export const getAuthorization = async () => {
  const previousToken: any = cache.get("token");
  if (
    !cache.has("token") ||
    (cache.has("token") && Date.now() > previousToken.expire_date)
  ) {
    const authorization = await fetch(`https://id.twitch.tv/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_secret: Deno.env.get("TWITCH_SECRET"),
        grant_type: "client_credentials",
        client_id: Deno.env.get("TWITCH_CLIENT_ID"),
      }),
    }).then((res) => res.json());
    cache.set(
      "token",
      {
        ...authorization,
        expire_date: Date.now() + authorization.expires_in * 1000,
      },
      authorization.expires_in - 3600
    );
  }
  return cache.get("token");
};
