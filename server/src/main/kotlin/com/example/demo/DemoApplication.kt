package com.example.demo

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info
import io.swagger.v3.oas.annotations.servers.Server
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
@OpenAPIDefinition(
    servers =
        [
            Server(
                url = "https://api.nextjs-recipeapp-prod.click",
                description = "Production Server",
            ),
            Server(url = "http://localhost:8080", description = "Local Development Server"),
        ],
    info =
        Info(
            title = "My API",
            version = "v1",
            description = "REST API using Spring Boot and Kotlin",
        ),
)
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
