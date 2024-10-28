FROM openjdk:17-jdk-slim AS build

WORKDIR /app

COPY gradle /app/gradle

COPY gradlew /app/gradlew

COPY build.gradle.kts /app/build.gradle.kts

COPY settings.gradle.kts /app/settings.gradle.kts

COPY src /app/src

RUN chmod +x ./gradlew && ./gradlew build --no-daemon


FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
