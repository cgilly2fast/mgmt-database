require("dotenv").config();
const credentials = {
  web: {
    client_id: process.env.GOOGlE_CLIENT_ID,
    project_id: process.env.GOOGLE_PROJECT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: process.env.GOOGLE_REDIRECT_URIS.split(" "),
    javascript_origins: process.env.GOOGLE_JAVASCRIPT_ORIGINS.split(" "),
  },
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  service_account: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    client_email: process.env.GOOGlE_CLIENT_EMAIL,
    client_id: process.env.GOOGlE_CLIENT_ID2,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT,
  },
  api_key: process.env.XERO_API_KEY,
  xero_client_id: process.env.XERO_CLIENT_ID,
  xero_client_secret: process.env.XERO_CLIENT_SECRET,
  xero_redirect_uri: process.env.XERO_REDIRECT_URI,
  xero_tennat_id: process.env.XERO_TENNAT_ID,
};

exports.credentials = credentials;
