#!/bin/bash

API_URL="http://localhost:5000/api"

echo "🚀 STARTING TRUTH SYSTEM SIMULATION"

# 1. Register a Worker
echo "👤 Registering Worker: Rahul..."
WORKER_TOKEN=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@site.com", "password":"password123", "name":"Rahul Worker"}' | grep -oP '(?<="token":")[^"]*')

# 2. Register an Admin
echo "🔑 Registering Admin..."
ADMIN_TOKEN=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@contractor.com", "password":"adminpassword", "name":"Contractor Boss", "role":"ADMIN"}' | grep -oP '(?<="token":")[^"]*')

# 3. Create a Site & Zone
echo "🏗️ Creating Site: Bridge Project Alpha..."
SITE_ID=$(curl -s -X POST $API_URL/sites \
  -H "x-auth-token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bridge Project Alpha", "lat":19.076, "lng":72.877, "radius":500}' | grep -oP '(?<="id":)[^,]*')

echo "📍 Creating Intelligence Zone: Pillar A..."
ZONE_ID=$(curl -s -X POST $API_URL/zones \
  -H "x-auth-token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"siteId\":$SITE_ID, \"name\":\"Pillar A\", \"lat\":19.076, \"lng\":72.877, \"radius\":50}" | grep -oP '(?<="id":)[^,]*')

# 4. Assign a Task with Expectations
echo "📝 Assigning Task: Curing Pillar A (Expected 120 mins)..."
TASK_ID=$(curl -s -X POST $API_URL/tasks \
  -H "x-auth-token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Curing Pillar A\", \"zoneId\":$ZONE_ID, \"expectedDuration\":120, \"workerIds\":[1]}" | grep -oP '(?<="id":)[^,]*')

# 5. Simulate Worker: Start Task
echo "⏱️ Rahul starts working..."
curl -s -X PATCH $API_URL/tasks/$TASK_ID/status \
  -H "x-auth-token: $WORKER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}' > /dev/null

# 6. Simulate Worker: Finish Task (Triggering Violations)
# Note: We simulate a location far away (19.100) and finish instantly
echo "⚠️ Rahul finishes task instantly from WRONG LOCATION..."
curl -s -X PATCH $API_URL/tasks/$TASK_ID/status \
  -H "x-auth-token: $WORKER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"COMPLETED\", \"lat\":19.200, \"lng\":72.900, \"fileUrl\":\"http://cloudinary.com/proof.jpg\"}"

echo -e "\n\n✅ SIMULATION COMPLETE"
echo "👉 Check Admin Dashboard for 'GEOFENCE_BREACH' and 'LOW_DURATION' alerts!"
