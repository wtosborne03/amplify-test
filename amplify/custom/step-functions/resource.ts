import { Stack } from 'aws-cdk-lib';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export function createStateMachine(
    scope: Construct,
    taskLambda: any,
    triggerLambda: any
) {
    const stack = Stack.of(scope);

    // Define the state machine tasks
    const validateTask = new tasks.LambdaInvoke(scope, 'ValidateTask', {
        lambdaFunction: taskLambda,
        payload: sfn.TaskInput.fromObject({
            action: 'validate',
            data: sfn.JsonPath.objectAt('$.data'),
        }),
        resultPath: '$.validateResult',
    });

    const processTask = new tasks.LambdaInvoke(scope, 'ProcessTask', {
        lambdaFunction: taskLambda,
        payload: sfn.TaskInput.fromObject({
            action: 'process',
            data: sfn.JsonPath.objectAt('$.data'),
        }),
        resultPath: '$.processResult',
    });

    const transformTask = new tasks.LambdaInvoke(scope, 'TransformTask', {
        lambdaFunction: taskLambda,
        payload: sfn.TaskInput.fromObject({
            action: 'transform',
            data: sfn.JsonPath.objectAt('$.processResult.Payload.data'),
        }),
        resultPath: '$.transformResult',
    });

    const successState = new sfn.Succeed(scope, 'Success');
    const failState = new sfn.Fail(scope, 'ValidationFailed', {
        error: 'ValidationError',
        cause: 'Data validation failed',
    });

    // Define the workflow
    const definition = validateTask
        .next(
            new sfn.Choice(scope, 'IsValid?')
                .when(
                    sfn.Condition.booleanEquals('$.validateResult.Payload.isValid', true),
                    processTask.next(transformTask).next(successState)
                )
                .otherwise(failState)
        );

    // Create the state machine
    const stateMachine = new sfn.StateMachine(scope, 'DemoStateMachine', {
        definitionBody: sfn.DefinitionBody.fromChainable(definition),
        stateMachineName: `${stack.stackName}-demo-state-machine`,
    });

    // Grant the trigger Lambda permission to start executions and describe them
    stateMachine.grantStartExecution(triggerLambda);
    stateMachine.grantRead(triggerLambda);

    return stateMachine;
}
