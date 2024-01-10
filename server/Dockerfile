# Build stage
FROM --platform=linux/amd64 openjdk:17-jdk-alpine AS build

WORKDIR /usr/src/app

COPY . .

RUN ./gradlew bootJar


# Production stage
FROM --platform=linux/amd64 openjdk:17-jdk-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build/libs/*.jar app.jar

# Run as non-root user
RUN addgroup --system spring && adduser --system spring --ingroup spring

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]