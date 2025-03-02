(./gradlew -t :bootJar --no-daemon) &
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun --no-daemon -PskipDownload=true