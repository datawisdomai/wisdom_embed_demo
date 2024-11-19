import { NextResponse } from "next/server";
import DescopeClient from "@descope/node-sdk";

export async function GET() {
  const descopeClient = DescopeClient({
    projectId: process.env.DESCOPE_PROJECT_ID!,
  });

  try {
    const authInfo = await descopeClient.exchangeAccessKey(
      process.env.DESCOPE_ACCESS_KEY!
    );
    console.log(`Exchanged access key for JWT: ${authInfo.jwt}`);

    return NextResponse.json({ token: authInfo.jwt });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
