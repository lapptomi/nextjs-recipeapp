package com.example.demo

import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication


@SpringBootApplication
@OpenAPIDefinition(
    info = Info(
        title = "My API",
        version = "v1",
        description = "REST API using Spring Boot and Kotlin"
    )
)
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}