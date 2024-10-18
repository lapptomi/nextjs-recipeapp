import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { Recipe } from 'src/recipes/entities/recipe.entity';

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadImage(
    image: Express.Multer.File,
    fileName: string,
  ): Promise<PutObjectCommandOutput> {
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: image.buffer,
      ContentType: image.mimetype,
    });

    const uploadedFile = await this.s3Client.send(uploadCommand);
    return uploadedFile;
  }

  async getSignedURL(fileName: string): Promise<string> {
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(this.s3Client, getObjectCommand, {
      expiresIn: 3600, // 1 hour
    });

    return signedUrl;
  }

  async recipeWithSignedUrl(recipe: Recipe): Promise<Recipe> {
    // Add signed URL to recipe image if image is not null
    return {
      ...recipe,
      image: recipe.image ? await this.getSignedURL(recipe.image) : null,
    };
  }

  async withImages(recipes: Recipe[]): Promise<Recipe[]> {
    // Map over recipes and add signed URL to each recipe image
    const recipesWithImages = await Promise.all(
      recipes.map(async (recipe) => this.recipeWithSignedUrl(recipe)),
    );
    return recipesWithImages;
  }
}
