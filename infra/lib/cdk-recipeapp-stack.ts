import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as apprunner from "aws-cdk-lib/aws-apprunner";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecr_assets from "aws-cdk-lib/aws-ecr-assets";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export class CdkRecipeAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Build and push Docker image to ECR
    const dockerImageAsset = new ecr_assets.DockerImageAsset(
      this,
      "RecipeAppServerImage",
      {
        directory: "../server",
        platform: ecr_assets.Platform.LINUX_AMD64,
      }
    );

    // Create S3 bucket
    const bucket = new s3.Bucket(this, "CdkRecipeAppBucket", {
      bucketName: `cdk-recipeapp-bucket-${this.account}`,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Access role for pulling image from ECR (correct principal + policy)
    const ecrAccessRole = new iam.Role(this, "AppRunnerEcrAccessRole", {
      assumedBy: new iam.ServicePrincipal("build.apprunner.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSAppRunnerServicePolicyForECRAccess"
        ),
      ],
    });

    // Instance role for the App Runner service
    const instanceRole = new iam.Role(this, "AppRunnerInstanceRole", {
      assumedBy: new iam.ServicePrincipal("tasks.apprunner.amazonaws.com"),
    });

    // Get the secret from Secrets Manager
    const recipeappCredentials = secretsmanager.Secret.fromSecretNameV2(
      this,
      "RecipeappCredentials",
      "Recipeapp_Prod_Credentials" // your secret name in Secrets Manager
    );
    const awsCredsSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "AppRunnerAwsCreds",
      "Recipeapp_CDK_IAM_Creds"
    );
    awsCredsSecret.grantRead(instanceRole);
    recipeappCredentials.grantRead(instanceRole);

    // Auto scaling configuration for the App Runner service
    const autoScalingConfiguration = new apprunner.CfnAutoScalingConfiguration(
      this,
      "CdkRecipeAppAppRunnerAutoScaling",
      {
        minSize: 1,
        maxSize: 1,
        maxConcurrency: 1,
        autoScalingConfigurationName: "CdkRecipeAppAppRunnerAutoScaling",
      }
    );

    // Create the App Runner service
    const appRunnerService = new apprunner.CfnService(
      this,
      "CdkRecipeAppAppRunnerService",
      {
        sourceConfiguration: {
          authenticationConfiguration: {
            accessRoleArn: ecrAccessRole.roleArn,
          },
          autoDeploymentsEnabled: true,
          imageRepository: {
            imageRepositoryType: "ECR",
            imageIdentifier: dockerImageAsset.imageUri,
            imageConfiguration: {
              port: "8080",
              runtimeEnvironmentVariables: [
                {
                  name: "PORT",
                  value: "8080",
                },

                {
                  name: "SPRING_PROFILES_ACTIVE",
                  value: "prod",
                },
                {
                  name: "AWS_BUCKET_REGION",
                  value: this.region,
                },
                {
                  name: "AWS_BUCKET_NAME",
                  value: bucket.bucketName,
                },
              ],
              runtimeEnvironmentSecrets: [
                {
                  name: "DATABASE_URL",
                  value: `${recipeappCredentials.secretArn}:DATABASE_URL::`,
                },
                {
                  name: "DATABASE_USERNAME",
                  value: `${recipeappCredentials.secretArn}:DATABASE_USERNAME::`,
                },
                {
                  name: "DATABASE_PASSWORD",
                  value: `${recipeappCredentials.secretArn}:DATABASE_PASSWORD::`,
                },
                {
                  name: "AWS_ACCESS_KEY_ID",
                  value: `${awsCredsSecret.secretArn}:AWS_ACCESS_KEY_ID::`,
                },
                {
                  name: "AWS_SECRET_ACCESS_KEY",
                  value: `${awsCredsSecret.secretArn}:AWS_SECRET_ACCESS_KEY::`,
                },
              ],
            },
          },
        },
        instanceConfiguration: {
          cpu: "256",
          memory: "512",
          instanceRoleArn: instanceRole.roleArn,
        },
        autoScalingConfigurationArn:
          autoScalingConfiguration.attrAutoScalingConfigurationArn,
      }
    );

    new cdk.CfnOutput(this, "DockerImageUri", {
      value: dockerImageAsset.imageUri,
    });

    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
    });

    new cdk.CfnOutput(this, "AppRunnerServiceUrl", {
      value: appRunnerService.attrServiceUrl,
    });

    new cdk.CfnOutput(this, "AppRunnerServiceArn", {
      value: appRunnerService.attrServiceArn,
    });

    new cdk.CfnOutput(this, "AutoScalingConfigurationArn", {
      value: autoScalingConfiguration.attrAutoScalingConfigurationArn,
    });
  }
}
