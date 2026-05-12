import { Amplify } from 'aws-amplify';

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '';
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '';
const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '';
const region = process.env.NEXT_PUBLIC_COGNITO_REGION || 'us-east-1';

let configured = false;

export interface AmplifyStatus {
  configured: boolean;
  hasUserPoolId: boolean;
  hasClientId: boolean;
  hasDomain: boolean;
  region: string;
}

export function getAmplifyStatus(): AmplifyStatus {
  return {
    configured,
    hasUserPoolId: !!userPoolId,
    hasClientId: !!userPoolClientId,
    hasDomain: !!cognitoDomain,
    region,
  };
}

function getRedirectUri(): string {
  if (typeof window !== 'undefined') return `${window.location.origin}/`;
  return process.env.NEXT_PUBLIC_REDIRECT_URI ? `${process.env.NEXT_PUBLIC_REDIRECT_URI}/` : 'http://localhost:3000/';
}

export function configureAmplify() {
  if (configured) return;
  if (!userPoolId || !userPoolClientId) {
    if (typeof window !== 'undefined') {
      console.error('[Amplify] NOT configured. Missing env:', {
        NEXT_PUBLIC_COGNITO_USER_POOL_ID: !!userPoolId,
        NEXT_PUBLIC_COGNITO_CLIENT_ID: !!userPoolClientId,
      });
    }
    return;
  }

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
  if (typeof window !== 'undefined') {
    console.info('[Amplify] configured', { userPoolId: userPoolId.slice(0, 6) + '…', hasDomain: !!cognitoDomain });
  }
}
