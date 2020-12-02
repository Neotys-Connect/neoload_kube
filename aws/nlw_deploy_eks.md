# Deploying NeoLoad Web in EKS

This document describes how to pre-configure an AWS EKS cluster in preparation
to then install NeoLoad Web in that cluster.

## Why Use EKS instead of ECS ##

Aside from Kubernetes being a/the cloud-agnostic standard for managing multi-container
deployments, additional tooling such as Helm built atop Kubernetes further
simplifies installation and configuration of vendor cloud-ready software such as NeoLoad Web.

Without technologies such as Kubernetes and Helm, each cloud-specific container
platform using their own proprietary APIs and models would unecessarily burden vendors
with providing many different deployment approaches. EKS provides a simple way to
create a Kubernetes cluster and run standard "installers".

## Steps to create a NLW EKS cluster ##

0. [Install and configure prerequisites](prerequisites.md)

1. [Create a custom cluster config file](eks-nlw-example.yaml)

    NOTE: this example specifically uses a 172.16/12 CIDR that is [compatible with Mongo Atlas](https://docs.atlas.mongodb.com/security-vpc-peering/)

2. Run 'eksctl create cluster -f [your-config-file]' and monitor CLI output
    - NOTE: You will need appropriate AWS permissions to create clusters
    - NOTE: Certain overused regions like us-east-1 fail regularly, so just try another
    - NOTE: **This process takes a while**, but you can monitor details under CloudFormation console, or...

    If you'd like, you can monitor the cluster creation process in CloudFormation stacks via browser, or you can use a tool like [cfn-tail](https://github.com/taimos/cfn-tail) to tail in a separate console window.

3. Continue [setup with our NeoLoad Helm instructions](../helm/post_cluster_nlw.md)
