FROM eclipse-temurin:21-jdk-alpine

RUN apk add --no-cache inotify-tools

WORKDIR /app

COPY . .

EXPOSE 8080

RUN ./gradlew dependencies

COPY start.sh .
RUN chmod +x start.sh

CMD ["sh", "start.sh"]
