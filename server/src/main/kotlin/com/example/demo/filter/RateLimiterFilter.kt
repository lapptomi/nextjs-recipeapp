package com.example.demo.filter

import io.github.bucket4j.Bucket
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.time.Duration

@Component
class RateLimiterFilter: OncePerRequestFilter() {

    // Rate limit of initial amount of 50 requests that refills 10 requests every minute.
    // The rate limit is applied to every request.
    private val bucket: Bucket = Bucket
        .builder()
        .addLimit { limit -> limit.capacity(5).refillIntervally(10, Duration.ofMinutes(1)) }
        .build()

    override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response)
        } else {
            // Return 429 status code if the rate limit is exceeded
            response.sendError(HttpStatus.TOO_MANY_REQUESTS.value(), "Too many requests")
        }
    }
}