import * as path from 'path';
import { Construct } from '@aws-cdk/core';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';

export interface MyTestProps {
  readonly environment?: Record<string, string>;
}

export class MyTest extends Construct {
  constructor(scope: Construct, id: string, props: MyTestProps = {}) {
    super(scope, id);

    new Function(this, 'DemoFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(path.join(__dirname, 'lambdas', 'demo')),
      environment: props.environment,
    });
  }
}