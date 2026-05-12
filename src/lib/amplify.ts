import { Amplify } from 'aws-amplify';

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '';
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '';
const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '';
const region = process.env.NEXT_PUBLIC_COGNITO_REGION || 'us-east-1';

let configured = false;

function getRedirectUri(): string {
  if (typeof window !== 'undefined') return `${window.location.origin}/`;
  return process.env.NEXT_PUBLIC_REDIRECT_URI ? `${process.env.NEXT_PUBLIC_REDIRECT_URI}/` : 'http://localhost:3000/';
}

export function configureAmplify() {
  if (configured || !userPoolId || !userPoolClientId) return;

  const redirectUri = getRedirectUri();

  const config: any = {
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: { username: true, email: true, phone: false },
        signUpVerificationMethod: 'code',
        userAttributes: { email: { required: true } },
      },
    },
  };

  if (cognitoDomain) {
    config.Auth.Cognito.loginWith.oauth = {
      domain: cognitoDomain.replace('https://', ''),
      scopes: ['openid', 'email', 'profile'],
      redirectSignIn: [redirectUri],
      redirectSignOut: [redirectUri],
      responseType: 'code',
      providers: ['Google'],
    };
  }

  Amplify.configure(config);
  configured = true;
}
