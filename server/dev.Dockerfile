FROM openjdk:17-jdk-slim AS build

WORKDIR /app

COPY . .

EXPOSE 8080

RUN chmod +x start.sh && ./gradlew dependencies

CMD ["sh", "start.sh"]