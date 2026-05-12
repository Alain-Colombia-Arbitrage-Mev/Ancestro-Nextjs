import { NextResponse } from 'next/server';

// Public diagnostic: reports which Cognito env vars are present (booleans only — no values).
// Helpful when login loops silently because Amplify never got configured.
export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_COGNITO_USER_POOL_ID: !!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    NEXT_PUBLIC_COGNITO_CLIENT_ID: !!process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    NEXT_PUBLIC_COGNITO_DOMAIN: !!process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
    NEXT_PUBLIC_COGNITO_REGION: process.env.NEXT_PUBLIC_COGNITO_REGION || null,
    NEXT_PUBLIC_API_URL_set: !!process.env.NEXT_PUBLIC_API_URL,
  });
}
