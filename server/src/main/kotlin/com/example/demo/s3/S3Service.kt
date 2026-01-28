package com.example.demo.s3

import java.io.IOException
import java.time.Duration
import java.util.UUID
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.GetObjectRequest
import software.amazon.awssdk.services.s3.model.PutObjectRequest
import software.amazon.awssdk.services.s3.presigner.S3Presigner
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest

@Service
class S3Service(
    @Value("\${aws.bucket.name}") private val bucketName: String,
    private val s3Client: S3Client,
    private val s3Presigner: S3Presigner,
) {
    fun uploadFile(file: MultipartFile): String {
        if (file.isEmpty) throw IOException("File is empty")

        val uniqueFilename = "${UUID.randomUUID()}-${sanitizeFilename(file.originalFilename)}"
        try {
            s3Client.putObject(
                PutObjectRequest.builder().bucket(bucketName).key(uniqueFilename).contentType(file.contentType).build(),
                RequestBody.fromBytes(file.bytes),
            )
            return uniqueFilename
        } catch (e: Exception) {
            throw IOException("Failed to upload file", e)
        }
    }

    fun getPresignedUrl(imageName: String, minutesValid: Long = 60): String {
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

    private fun sanitizeFilename(filename: String?): String =
        filename?.replace(Regex("[^a-zA-Z0-9\\.\\-_]"), "_") ?: "file"
}
