package com.example.demo.config

import com.example.demo.filter.JwtAuthenticationFilter
import com.example.demo.filter.RateLimiterFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthenticationFilter: JwtAuthenticationFilter,
    private val rateLimiterFilter: RateLimiterFilter,
) {
    @Bean fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry
                    .addMapping("/**") // Allow all paths
                    .allowedOrigins(
                        "https://api.nextjs-recipeapp-prod.click",
                        "http://localhost:8080",
                    )
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
                    .requestMatchers(HttpMethod.POST, "/api/recipes")
                    .authenticated()
                    .requestMatchers(HttpMethod.POST, "/api/recipes/**")
                    .authenticated()
                    .requestMatchers(HttpMethod.PUT, "/api/recipes")
                    .authenticated()
                    .requestMatchers(HttpMethod.PUT, "/api/recipes/**")
                    .authenticated()
                    .anyRequest()
                    .permitAll()
            }
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter::class.java,
            )
            .addFilterBefore(rateLimiterFilter, JwtAuthenticationFilter::class.java)
            .headers { it.frameOptions(Customizer.withDefaults()).disable() }
            .formLogin { it.disable() }
            .csrf { it.disable() }

        return http.build()
    }
}
