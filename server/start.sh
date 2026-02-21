#!/bin/sh

(
  while inotifywait -r -e modify,create,delete,move /app/src/main; do
    echo "Source changed, recompiling..."
    ./gradlew classes -PskipDownload=true
  done
) &

SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun -PskipDownload=true
