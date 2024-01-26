FROM openjdk:17-jdk-slim

WORKDIR /usr/src/app

COPY . .

EXPOSE 8080

CMD ["./gradlew", "bootRun"]