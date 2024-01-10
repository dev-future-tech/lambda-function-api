import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, AssetCode } from 'aws-cdk-lib/aws-lambda';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class StandaloneLambdaStackStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bucket = s3.Bucket.fromBucketName(this, id, 'ikeda-test-deploy');

    const myFunction = new Function(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: AssetCode.fromAsset('src')
    });

    
    const booksIntegration = new HttpLambdaIntegration('BooksIntegration', myFunction);

    const httpApi = new cdk.aws_apigatewayv2.HttpApi(this, 'HttpApi');
    httpApi.addRoutes({
      path: '/books/{requestId}',
      methods: [ cdk.aws_apigatewayv2.HttpMethod.GET ],
      integration: booksIntegration,
    });
  }
}
