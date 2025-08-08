package com.example.demo.s3

import java.io.IOException
import java.time.Duration
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import software.amazon.awssdk.services.s3.presigner.S3Presigner
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest

@Service
class S3Service(
    @Value("\${aws.bucket.region}") private val region: String,
    @Value("\${aws.bucket.name}") private val bucketName: String,
    @Value("\${aws.access.key.id}") private val accessKey: String,
    @Value("\${aws.secret.access.key}") private val secretAccessKey: String,
) {
    private val credentials =
        StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretAccessKey))

    private val awsRegion = Region.of(region)

    private val s3: S3Client =
        S3Client.builder().region(awsRegion).credentialsProvider(credentials).build()

    private val s3Presigner: S3Presigner =
        S3Presigner.builder().region(awsRegion).credentialsProvider(credentials).build()

    fun uploadFile(file: MultipartFile): String {
        val originalFilename = file.originalFilename ?: throw IOException("File must have a name")
        val randomId = (1000..9999).random()
        val simpleFilename = "$randomId-$originalFilename"

        s3.putObject(
            PutObjectRequest.builder()
                .bucket(bucketName)
                .key(simpleFilename)
                .contentType(file.contentType) // helps browsers render correctly later
                .build(),
            RequestBody.fromBytes(file.bytes),
        )
        return simpleFilename
    }

    fun generatePresignedGetUrl(imageName: String, minutesValid: Long = 60): String {
        val getReq =
            GetObjectRequest.builder()
                .bucket(bucketName)
                .key(imageName)
                .responseContentDisposition("inline; filename=\"$imageName\"")
                .build()

        val presignReq =
            GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(minutesValid))
                .getObjectRequest(getReq)
                .build()

        return s3Presigner.presignGetObject(presignReq).url().toString()
    }
}
