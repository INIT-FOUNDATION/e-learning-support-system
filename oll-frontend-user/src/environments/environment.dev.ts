const BASE_URL = 'https://apilss.dev.orrizonte.in';
const DIRECT_BASE_URL = 'https://apilss.dev.orrizonte.in';

export const environment = {
  production: false,
  googleSignIn: {
    client_id:
      '666507426681-i34nsr39unsqcs5vrq1b3aagkl9d67bv.apps.googleusercontent.com',
    project_id: 'elegant-circle-413806',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: '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',
    javascript_origins: [
      'http://localhost:4200',
      'https://apilss.dev.orrizonte.in',
    ],
  },

  support_system_prefix: `${BASE_URL}/api/v1/supportSystem`,
  auth_prefix: `${BASE_URL}/api/v1/auth`,
  lss_websocket_url: `wss://apilss.dev.orrizonte.in`,
  waiting_timer: 60,
  lss_web_url: `https://oll.dev.letslink.in`,
  enable_no_support: false,
  client_id: 'OLL',
  inspection_bot: 'Inspection Bot'
};
