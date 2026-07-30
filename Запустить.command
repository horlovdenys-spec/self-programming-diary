#!/bin/bash
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "First run: installing required components, please wait a couple of minutes..."
  echo "This needs an internet connection just this once."
  npm install
  if [ $? -ne 0 ]; then
    echo ""
    echo "Installation failed. Check your internet connection and try again."
    read -n 1 -s -r -p "Press any key to close this window..."
    echo ""
    exit 1
  fi
fi

echo "Starting the diary..."
(sleep 4 && open http://localhost:5173) &
npm run dev

echo ""
echo "Server stopped. Press any key to close this window."
read -n 1 -s -r
echo ""
