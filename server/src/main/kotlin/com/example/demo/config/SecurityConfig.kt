package com.example.demo.config

import com.example.demo.auth.service.JwtService
import com.example.demo.filter.RateLimiterFilter
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableWebSecurity
class SecurityConfig(private val rateLimiterFilter: RateLimiterFilter, private val jwtService: JwtService) {
    @Bean fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry
                    .addMapping("/**") // Allow all paths
                    .allowedOrigins("https://api.nextjs-recipeapp-prod.click", "http://localhost:8080")
                    .allowedMethods("*")
                    .allowedHeaders("*")
                    .allowCredentials(true)
            }
        }
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests { requests ->
                requests
                    // Public endpoints
                    .requestMatchers("/api/auth/**")
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/recipes/**")
                    .permitAll()
                    .requestMatchers("/api/users/**")
                    .permitAll()
                    // All other requests require authentication
                    .anyRequest()
                    .authenticated()
            }
            .addFilterBefore(rateLimiterFilter, UsernamePasswordAuthenticationFilter::class.java)
            .oauth2ResourceServer {
                // Add JWT Bearer token automatically to the security context
                // This will allow us to use @AuthenticationPrincipal to get the authenticated user in controllers
                // Or SecurityContextHolder.getContext().authentication in the services
                it.jwt { it.decoder(jwtDecoder()) }

                // If JWT authentication fails, return a 401 Unauthorized response with a JSON error message
                it.authenticationEntryPoint { request, response, exception ->
                    response.status = HttpServletResponse.SC_UNAUTHORIZED
                    response.contentType = "application/json"
                    response.writer.write("""{"error": "Unauthorized", "message": "Invalid or expired token"}""")
                    response.writer.flush()
                }
            }
            .headers { it.frameOptions(Customizer.withDefaults()).disable() }
            .formLogin { it.disable() }
            .csrf { it.disable() }

        return http.build()
    }

    @Bean
    fun jwtDecoder(): JwtDecoder =
        NimbusJwtDecoder.withSecretKey(jwtService.getSecretKey()).macAlgorithm(MacAlgorithm.HS512).build()
}
