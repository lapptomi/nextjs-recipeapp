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

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY --from=build /app/build/libs/*.jar app.jar

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]