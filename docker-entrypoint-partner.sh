#!/bin/sh

# Generate env-config.js from environment variables for Partner
cat > /usr/share/nginx/html/env-config.js << EOF
window._env_ = {
  VITE_BASE_API_URL: '${VITE_BASE_API_URL:-http://localhost:8080}',
  VITE_BASE_SIGNLINK_URL: '${VITE_BASE_SIGNLINK_URL:-http://localhost:8080}',
  VITE_GOOGLE_CLIENT_ID: '${VITE_GOOGLE_CLIENT_ID:-}',
  VITE_PARTNER_SITE_OIDC_CLIENT_ID: '${VITE_PARTNER_SITE_OIDC_CLIENT_ID:-}',
  VITE_PARTNER_SITE_OIDC_CLIENT_SECRET: '${VITE_PARTNER_SITE_OIDC_CLIENT_SECRET:-}',
  VITE_FIREBASE_CONFIG_OBJECT: '${VITE_FIREBASE_CONFIG_OBJECT:-}',
  VITE_FIREBASE_VAPID_KEY: '${VITE_FIREBASE_VAPID_KEY:-}',
  VITE_STORAGE_KEY_PREFIX: '${VITE_STORAGE_KEY_PREFIX:-hvn_}',
  NODE_ENV: '${NODE_ENV:-production}'
};
EOF

echo "Generated env-config.js for Partner app with environment variables"

# Start nginx
exec nginx -g "daemon off;" 