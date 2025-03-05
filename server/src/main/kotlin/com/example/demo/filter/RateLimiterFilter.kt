package com.example.demo.filter

import io.github.bucket4j.Bucket
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.time.Duration
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class RateLimiterFilter : OncePerRequestFilter() {
    private val bucket: Bucket =
        Bucket.builder()
            .addLimit { it.capacity(50).refillIntervally(10, Duration.ofMinutes(1)) }
            .build()

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response)
        } else {
            // Return 429 status code if the rate limit is exceeded
            response.sendError(HttpStatus.TOO_MANY_REQUESTS.value(), "Too many requests")
        }
    }
}
