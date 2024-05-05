const BASE_URL = 'https://apilss.letslink.ai';
const DIRECT_BASE_URL = 'https://apilss.letslink.ai';

export const environment = {
  production: true,
  googleSignIn: {
    client_id:'223699493192-70c3vktqnhr9qq7m4rv1ghrikivj14gn.apps.googleusercontent.com',
    project_id: 'oll-support-system',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: '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',
    javascript_origins: ["https://support.188188.live","http://localhost:4200"],
  },

  support_system_prefix: `${BASE_URL}/api/v1/supportSystem`,
  auth_prefix: `${BASE_URL}/api/v1/auth`,
  lss_websocket_url: `wss://apilss.letslink.ai`,
  waiting_timer: 120,
  lss_web_url: `https://support.188188.live`,
  enable_no_support: false,
  client_id: 'OLL',
  session_inactive_time: 600000,
};
