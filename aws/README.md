# AWS (EKS + Fargate) examples

## Prerequisites ##

- [Install Python 3.7+](https://www.python.org/downloads/), required for AWS CLI v2
- [Install and configure the AWS CLI **v2**](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
    - Verify you are using the right version: ```aws --version```
        -   should produce something like ```aws-cli/2.0.59 ...```
    - Log in to your AWS account via: ```aws configure``` if not already done
    - Make sure that you can run ```aws eks list-clusters``` without errors
- [Install and configure AWS 'eksctl'](https://eksctl.io/introduction/#installation)
    - Make sure that you can run ```eksctl get cluster``` without errors

## What are we doing here? ##

Who wants to have to think about spinning up machines (or containers) before running a test, really? But what's the alternative?

Well...

NeoLoad Web can be configured to use a Kubernetes cluster to spin up and down load controller and load generator containers. Since AWS EKS can schedule new pods/containers on Fargate, their elastic container-native platform, *you can then have all your load generating resources spin up and down dynamically...without having to pre-provision these compute resources!*

Cluster setup is a one-time thing. The Kubernetes system can either also run on Fargate containers or on a static node/group separate from where the load resources are provisioned. The 'fp-neoload' profile in the YAML uses a 'selector' namespace value which should match the Helm release name in order to schedule load pods/containers on Fargate.

## Why are we using eksctl instead of Fargate or CloudFormation in the AWS web GUI? ##

The answer is simple. Command lines are easier than the AWS GUI, since it changes all the time :)

Seriously though, eksctl actually creates a CloudFormation stack in the background to set up your Kubernetes cluster. And though some advanced organizations prefer to use CloudFormation (often to specify IAM policies and certificates), many of these things are dramatically simplified with eksctl.

## Simple steps for NeoLoad/Fargate setup ##

1. [Create a custom cluster config file](fargate-cluster-config.yaml) that has a second non-default profile with a proper namespace (and no additional selection filters/labels)
NOTE: More details on eksctl usage with fargate can be found [here](https://eksctl.io/usage/fargate/)

2. Run 'eksctl create cluster -f [your-config-file]' and monitor CLI output
    - NOTE: You will need appropriate AWS permissions to create clusters
    - NOTE: You will need to launch your cluster in a VPC that has line-of-sight to the systems you intend on load testing; examples of YAML specialization are [here](https://eksctl.io/usage/vpc-networking/)
    - NOTE: Certain overused regions like us-east-1 fail regularly, so just try another
    - NOTE: **This process takes a while**, but you can monitor details under CloudFormation console, or...

    If you'd like, you can monitor the cluster creation process in CloudFormation stacks via browser, or you can use a tool like [cfn-tail](https://github.com/taimos/cfn-tail) to tail in a separate console window.

3. Continue [setup with our NeoLoad Helm instructions](../helm/README.md)

If you have any issues, DM the author [@paulsbruce](https://twitter.com/paulsbruce)
