FROM openjdk:17-jdk-alpine3.13

WORKDIR /usr/src/app

CMD ["./gradlew", "clean", "bootJar"]

COPY build/libs/*.jar application.jar

ENTRYPOINT ["java", "-jar", "application.jar"]
