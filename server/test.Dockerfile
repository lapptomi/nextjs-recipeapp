FROM openjdk:17

WORKDIR /app

CMD ["./gradlew", "clean", "bootJar"]

COPY build/libs/demo-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]