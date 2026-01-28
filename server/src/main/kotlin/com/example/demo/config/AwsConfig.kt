package com.example.demo.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.presigner.S3Presigner

@Configuration
class AwsConfig(
    @Value("\${aws.bucket.region}") private val region: String,
    @Value("\${aws.access.key.id}") private val accessKey: String,
    @Value("\${aws.secret.access.key}") private val secretAccessKey: String,
) {
    @Bean
    fun s3Client(): S3Client =
        S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(
                StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretAccessKey))
            )
            .build()

    @Bean
    fun s3Presigner(): S3Presigner =
        S3Presigner.builder()
            .region(Region.of(region))
            .credentialsProvider(
                StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretAccessKey))
            )
            .build()
}
