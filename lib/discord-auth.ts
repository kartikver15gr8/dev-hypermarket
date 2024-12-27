import { cookies } from "next/headers";

interface DiscordUser {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export async function initiateDiscordOAuth(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const redirectUri =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI
      : process.env.NEXT_PUBLIC_DISCORD_TEST_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("Missing Discord OAuth configuration");
  }
  const connectUri = process.env.NEXT_PUBLIC_DISCORD_CONNECT_URI;

  return `https://discord.com/oauth2/authorize?permissions=805727479&prompt=none&response_type=code&redirect_uri=https%3A%2F%2Fdev.sendit.markets%2Fseller%2Fproducts%2Fadd&client_id=1308052382373908491&scope=identify+guilds.members.read+email+bot&state=productID`;

  // return `https://discord.com/oauth2/authorize?permissions=805727479&prompt=none&response_type=code&redirect_uri=${encodeURIComponent(
  //   redirectUri
  // )}&client_id=${clientId}&scope=identify+guilds.members.read+email+bot&state=productID`;
}

export async function exchangeCodeForToken(
  code: string
): Promise<TokenResponse> {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing Discord OAuth configuration");
  }

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code: code.toString(),
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }
  console.log(response.json());

  return response.json();
}

export async function fetchDiscordUser(
  accessToken: string
): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Discord user");
  }

  return response.json();
}

export async function storeDiscordSession(user: DiscordUser): Promise<void> {
  localStorage.setItem("discordID", user.id);
  cookies().set("discord_user_id", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}
