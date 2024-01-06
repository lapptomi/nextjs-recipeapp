# Use an official OpenJDK 17 image as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY build.gradle settings.gradle gradlew /app/
COPY gradle /app/gradle

# Download and cache the specified Gradle version
RUN ./gradlew --version --no-daemon

# Copy the application source code
COPY . .

# Build the application
RUN ./gradlew clean build --no-daemon

# Expose the default Spring Boot port
EXPOSE 8080

# Define the entry point
CMD ["java", "-jar", "build/libs/demo-0.0.1-SNAPSHOT.jar"]