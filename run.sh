#!/bin/bash
set -e

echo "🔍 Checking for old process on port 9292..."
PID=$(lsof -ti :9292 || true)

if [ -n "$PID" ]; then
  echo "⚡ Killing process $PID using port 9292..."
  kill -9 $PID
else
  echo "✅ No process found on 9292"
fi

echo "🧹 Cleaning and building project..."
mvn clean package -q

echo "🚀 Starting app on port 9292..."
java -jar target/album-player-0.0.1-SNAPSHOT.jar --server.port=9292
