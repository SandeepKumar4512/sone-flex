#!/data/data/com.termux/files/usr/bin/bash
# runCheckSongs.sh - Auto check all songs

echo "🔐 MongoDB password डालो:"
read -s PASSWORD   # -s से input hidden रहेगा
node checkAllSongsFullAuto.js $PASSWORD
