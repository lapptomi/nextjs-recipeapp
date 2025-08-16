package com.example.demo.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.servers.Server
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.env.Environment

@Configuration
class OpenApiConfig(private val environment: Environment) {

    @Bean
    fun customOpenAPI(): OpenAPI {
        val serverUrl =
            if (environment.activeProfiles.contains("prod")) {
                "https://api.nextjs-recipeapp-prod.click"
            } else {
                "http://localhost:8080"
            }

        return OpenAPI()
            .info(
                Info()
                    .title("Recipe API")
                    .description("API for managing recipes, comments and ratings")
                    .version("v1")
            )
            .servers(listOf(Server().url(serverUrl).description("API Server")))
    }
}
