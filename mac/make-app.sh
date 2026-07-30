#!/bin/bash
# Generates a local, non-quarantined macOS launcher app for the diary.
# Because this .app is CREATED on the Mac (not downloaded), it has no
# com.apple.quarantine attribute, so Gatekeeper lets it open on a normal
# double-click — unlike a .command/.app that arrived via Telegram/browser.
#
# Usage: bash mac/make-app.sh /absolute/path/to/project

set -e

PROJECT_DIR="$1"
if [ -z "$PROJECT_DIR" ]; then
  echo "make-app.sh: project directory argument is required" >&2
  exit 1
fi

APP_DIR="$HOME/Desktop/Дневник.app"

rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/Contents/MacOS"

cat > "$APP_DIR/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleName</key>
	<string>Дневник</string>
	<key>CFBundleDisplayName</key>
	<string>Дневник самопрограммирования</string>
	<key>CFBundleIdentifier</key>
	<string>local.diary.selfprogramming</string>
	<key>CFBundleVersion</key>
	<string>1.0</string>
	<key>CFBundleShortVersionString</key>
	<string>1.0</string>
	<key>CFBundlePackageType</key>
	<string>APPL</string>
	<key>CFBundleExecutable</key>
	<string>run</string>
	<key>LSUIElement</key>
	<true/>
</dict>
</plist>
PLIST

# The launcher itself. PROJECT_DIR is baked in at generation time.
cat > "$APP_DIR/Contents/MacOS/run" <<RUN
#!/bin/bash
PROJECT_DIR="$PROJECT_DIR"

# Apps launched from Finder get a minimal PATH — make sure node/npm (from the
# official installer in /usr/local/bin or Homebrew in /opt/homebrew/bin) are found.
export PATH="/usr/local/bin:/opt/homebrew/bin:\$PATH"
[ -s "\$HOME/.zprofile" ] && source "\$HOME/.zprofile" 2>/dev/null
[ -s "\$HOME/.zshrc" ] && source "\$HOME/.zshrc" 2>/dev/null

cd "\$PROJECT_DIR" || exit 1

# If npm still isn't available, fall back to the Terminal-based launcher.
if ! command -v npm >/dev/null 2>&1; then
  open -a Terminal "\$PROJECT_DIR/Запустить.command"
  exit 0
fi

# Start the dev server only if it isn't already serving.
if ! curl -sf http://localhost:5173 >/dev/null 2>&1; then
  npm run dev >/tmp/diary-dev.log 2>&1 &
fi

# Wait until the server responds (up to ~20s), then open the browser.
for i in \$(seq 1 40); do
  if curl -sf http://localhost:5173 >/dev/null 2>&1; then
    break
  fi
  sleep 0.5
done

open http://localhost:5173
RUN

chmod +x "$APP_DIR/Contents/MacOS/run"

echo "Создан ярлык: $APP_DIR"
