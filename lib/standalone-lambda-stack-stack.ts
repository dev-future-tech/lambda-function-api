import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, AssetCode } from 'aws-cdk-lib/aws-lambda';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';

export class StandaloneLambdaStackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucket = s3.Bucket.fromBucketName(this, id, 'ikeda-test-deploy');

    const myFunction = new Function(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: AssetCode.fromAsset('src')
    });

    const restApi = new RestApi(this, 'Books', {
      description: 'Book API',
      deployOptions: {
        stageName: 'dev'
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key'
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST'],
        allowCredentials: false,
        allowOrigins: ['http://localhost:4200']
      }
    });

    const books = restApi.root.addResource('books');
    const bookResource = books.addResource('{resourceId}')
    bookResource.addMethod(
      'GET',
      new LambdaIntegration(myFunction, { proxy: true })
    );

    new cdk.CfnOutput(this, 'apiUrl', {value: restApi.url});

  }
}
