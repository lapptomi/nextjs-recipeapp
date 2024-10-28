# Build stage
FROM openjdk:17-jdk-slim AS build

WORKDIR /usr/src/app

COPY . .

RUN ./gradlew bootJar


# Production stage
FROM openjdk:17-jdk-slim

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build/libs/*.jar app.jar

# Run as non-root user
RUN addgroup --system spring && adduser --system spring --ingroup spring

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]