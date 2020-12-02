# AWS (EKS + Fargate) examples

This document describes how to set up AWS and NeoLoad Web to use elastic compute resources for on-demand load testing.

## What are we doing here? ##

Who wants to have to think about spinning up machines (or containers) before running a test, really? But what's the alternative?

Well...

NeoLoad Web can be configured to use a Kubernetes cluster to spin up and down load controller and load generator containers. Since AWS EKS can schedule new pods/containers on Fargate, their elastic container-native platform, *you can then have all your load generating resources spin up and down dynamically...without having to pre-provision these compute resources!*

Cluster setup is a one-time thing. The Kubernetes system can either also run on Fargate containers or on a static node/group separate from where the load resources are provisioned. The 'fp-neoload' profile in the YAML uses a 'selector' namespace value which should match the Helm release name in order to schedule load pods/containers on Fargate.

## Why are we using eksctl instead of Fargate or CloudFormation in the AWS web GUI? ##

The answer is simple. Command lines are easier than the AWS GUI, since it changes all the time :)

Seriously though, eksctl actually creates a CloudFormation stack in the background to set up your Kubernetes cluster. And though some advanced organizations prefer to use CloudFormation (often to specify IAM policies and certificates), many of these things are dramatically simplified with eksctl.

## Steps for NeoLoad/Fargate setup ##

0. [Install and configure prerequisites](prerequisites.md)

1. [Create a custom cluster config file](fargate-cluster-config.yaml) that has a second non-default profile with a proper namespace (and no additional selection filters/labels)
NOTE: More details on eksctl usage with fargate can be found [here](https://eksctl.io/usage/fargate/)

2. Run 'eksctl create cluster -f [your-config-file]' and monitor CLI output
    - NOTE: You will need appropriate AWS permissions to create clusters
    - NOTE: You will need to launch your cluster in a VPC that has line-of-sight to the systems you intend on load testing; examples of YAML specialization are [here](https://eksctl.io/usage/vpc-networking/)
    - NOTE: Certain overused regions like us-east-1 fail regularly, so just try another
    - NOTE: **This process takes a while**, but you can monitor details under CloudFormation console, or...

    If you'd like, you can monitor the cluster creation process in CloudFormation stacks via browser, or you can use a tool like [cfn-tail](https://github.com/taimos/cfn-tail) to tail in a separate console window.

3. Continue [setup with our NeoLoad Helm instructions](../helm/post_cluster_infra.md)
