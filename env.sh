#!/bin/sh
if [ -n "$VITE_BACKEND_URL" ]; then
  echo "Injecting VITE_BACKEND_URL: $VITE_BACKEND_URL"
  find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_BACKEND_URL_PLACEHOLDER__|${VITE_BACKEND_URL}|g" {} +
fi
