FROM openjdk:17-jdk-slim AS build

WORKDIR /app

COPY ./ /app

EXPOSE 8080

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

USER nonroot

RUN chmod +x start.sh && ./gradlew dependencies

CMD ["sh", "start.sh"]