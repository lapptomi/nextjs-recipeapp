(./gradlew -t :bootJar) &
SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun  -PskipDownload=true