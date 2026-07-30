#!/bin/bash
# One-time setup for macOS. Run it once (see README), and afterwards a
# "Дневник" icon on the Desktop opens the diary with a normal double-click —
# no Terminal, no Gatekeeper "damaged" errors.
cd "$(dirname "$0")" || exit 1
DIR="$(pwd)"

echo "Настройка «Дневника самопрограммирования» для Mac..."
echo ""

# 1. Remove the download "quarantine" flag from the whole folder. This is what
#    Gatekeeper checks; clearing it also makes Запустить.command work on a
#    normal double-click as a backup.
xattr -cr "$DIR" 2>/dev/null

# 2. Make sure node/npm are reachable (Terminal usually has them, but be safe).
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

if ! command -v npm >/dev/null 2>&1; then
  echo "Не найден Node.js. Установите его с https://nodejs.org (вариант LTS) и запустите этот файл снова."
  read -n 1 -s -r -p "Нажмите любую клавишу, чтобы закрыть окно..."
  echo ""
  exit 1
fi

# 3. Install dependencies on first run.
if [ ! -d node_modules ]; then
  echo "Устанавливаю компоненты (нужен интернет, займёт пару минут)..."
  if ! npm install; then
    echo ""
    echo "Не удалось установить компоненты. Проверьте подключение к интернету и попробуйте снова."
    read -n 1 -s -r -p "Нажмите любую клавишу, чтобы закрыть окно..."
    echo ""
    exit 1
  fi
fi

# 4. Generate the local, double-clickable launcher on the Desktop.
bash "$DIR/mac/make-app.sh" "$DIR"

echo ""
echo "Готово! На рабочем столе появился значок «Дневник» — открывайте дневник"
echo "двойным кликом по нему. Терминал больше не понадобится."
echo ""
read -n 1 -s -r -p "Нажмите любую клавишу, чтобы закрыть это окно..."
echo ""
