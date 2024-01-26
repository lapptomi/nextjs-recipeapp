package com.example.demo.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RateLimiterConfig {

    @Bean
    public Bucket createBucket() {
        Bandwidth limit = Bandwidth.simple(2, java.time.Duration.ofSeconds(20));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
