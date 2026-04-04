#!/data/data/com.termux/files/usr/bin/bash
# autoSetup.sh - Restore only play system safely

echo "🔄 Restoring safe play-only system..."

# Backend directory
BACKEND_DIR=~/sone-flex/backend

# 1️⃣ हटाओ गलती से बने upload route या file
echo "✅ Removing wrong upload route and upload page..."
sed -i '/uploadSongs.html/d' $BACKEND_DIR/server.js
sed -i '/app.get("\/upload",/d' $BACKEND_DIR/server.js
rm -f $BACKEND_DIR/views/uploadSongs.html 2>/dev/null

# 2️⃣ Ensure playSongs route exists
echo "✅ Ensuring playSongs route is active..."
if ! grep -q 'playSongs.html' $BACKEND_DIR/server.js; then
    echo 'app.get("/songs", (req, res) => { res.sendFile(__dirname + "/views/playSongs.html"); });' >> $BACKEND_DIR/server.js
fi

# 3️⃣ Check playSongs.html presence
if [ ! -f $BACKEND_DIR/views/playSongs.html ]; then
    echo "⚠️ playSongs.html not found! Please restore manually in $BACKEND_DIR/views/"
else
    echo "✅ playSongs.html is present."
fi

# 4️⃣ Restart server safely
echo "🔄 Restarting server..."
cd $BACKEND_DIR
pkill -f server.js 2>/dev/null
nohup node server.js > server.log 2>&1 &

echo "🎉 System restored safely! Only play system active now."
echo "Open http://localhost:5000/songs to listen."
