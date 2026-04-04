#!/bin/bash
# -------------------------------
# Sone Flex OTP Login & API Test
# -------------------------------

# 1️⃣ Send OTP to your number
echo "➡️ Sending OTP to 9560972069..."
curl -s -X POST http://localhost:5000/api/auth/send-otp \
-H "Content-Type: application/json" \
-d '{"phone":"9560972069"}'
echo -e "\n✅ OTP sent! Check your SMS on your phone."

# 2️⃣ Prompt user to enter OTP
read -p "Enter the OTP received on 9560972069: " OTP

# 3️⃣ Verify OTP and get JWT token
echo "➡️ Verifying OTP..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/verify-otp \
-H "Content-Type: application/json" \
-d "{\"phone\":\"9560972069\", \"otp\":\"$OTP\"}")

# Extract token using jq
TOKEN=$(echo $RESPONSE | jq -r '.token')

if [ "$TOKEN" != "null" ]; then
    echo "✅ OTP Verified! JWT Token received."
    echo "Token: $TOKEN"

    # 4️⃣ Use token to access protected /songs API
    echo "➡️ Fetching songs list..."
    curl -s -X GET http://localhost:5000/api/songs \
    -H "Authorization: Bearer $TOKEN" | jq
else
    echo "❌ OTP verification failed. Response:"
    echo $RESPONSE | jq
fi
