const BASE_URL = 'https://apilss.dev.letslink.ai';
const DIRECT_BASE_URL = 'https://apilss.dev.letslink.ai';
const support_system_port = '';
const auth_port = '';

// const BASE_URL = 'https://apilss.aieze.in';
// const DIRECT_BASE_URL = 'https://apilss.aieze.in';
// const support_system_port = '';
// const auth_port = '';

// const BASE_URL = 'http://localhost';
// const DIRECT_BASE_URL = 'http://localhost';
// const support_system_port = `:5001`;
// const auth_port = `:5000`;

export const environment = {
  production: false,
  googleSignIn: {
    client_id:'223699493192-70c3vktqnhr9qq7m4rv1ghrikivj14gn.apps.googleusercontent.com',
    project_id: 'oll-support-system',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: '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',
    javascript_origins: ["https://support.188188.live","http://localhost:4200"],
  },

  support_system_prefix: `${BASE_URL}${support_system_port}/api/v1/supportSystem`,
  auth_prefix: `${BASE_URL}${auth_port}/api/v1/auth`,
  lss_websocket_url: `wss://apilss.dev.letslink.ai`,
  // lss_websocket_url: `ws://localhost:5003`,
  waiting_timer: 60,
  lss_web_url: `http://localhost:4200`,
  enable_no_support: false,
  client_id: 'OLL',
  session_inactive_time: 600000,
};
