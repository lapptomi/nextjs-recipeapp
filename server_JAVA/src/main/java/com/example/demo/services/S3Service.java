package com.example.demo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;

@Service
public class S3Service {

    @Value("${AWS_BUCKET_REGION}")
    private String region;

    @Value("${AWS_BUCKET_NAME}")
    private String bucketName;

    @Value("${AWS_ACCESS_KEY_ID}")
    private String accessKey;

    @Value("${AWS_SECRET_ACCESS_KEY}")
    private String secretAccessKey;

    public String uploadFile(MultipartFile file) throws IOException {
        try {
            String fileName = file.getOriginalFilename();

            S3Client s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretAccessKey)))
                .build();

            s3Client.putObject(PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build(),
                RequestBody.fromBytes(file.getBytes()));

            return fileName;
        } catch (IOException error) {
            throw new IOException("Error while uploading file to S3", error);
        }
    }

    public String createPresignedGetUrl(String imageName) {
        try {
            S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretAccessKey)))
                .build();

            GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(imageName)
                .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(60))
                .getObjectRequest(objectRequest)
                .build();

            PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);

            return presignedRequest.url().toString();
        } catch (Exception error) {
            throw new RuntimeException("Error while creating presigned URL", error);
        }
    }
}