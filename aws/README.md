# NeoLoad in AWS

There are two parts of the NeoLoad Platform that can benefit from Kubernetes:

1. [Centralized Hub: Deploy *NeoLoad Web* on an EKS cluster](nlw_deploy_eks.md)
2. [Load Infrastructure: Using an EKS (+Fargate) cluster for dynamic controllers and generators](dynamic_infra.md)

NOTE: Though you can use whatever you want to back either of these use cases (EKS node group or
Fargate profile), it is recommended that you use pre-provisioned nodes (i.e. a node
group) for high-availability scenarios such as NeoLoad Web. Fargate is fine for
on-demand testing if you don't mind waiting a few minutes per test for the containers
to spin up. You may also want to pre-provision node groups in a cluster used for
load infrastructure that is used frequently (many times a day) so that Fargate spin-up times
are not incurred every time a test is run.

NOTE: Generally, NeoLoad Web should be deployed on different cluster than clusters hosting load
infrastructure unless you are very familiar with how to use node affinity rules to
ensure that NeoLoad Web front/back end containers are on a different physical node
than nodes used to host load generator and controller pods.

## Prerequisites ##

There are a few tools you'll need before you get started.

0. [Install and configure prerequisites](prerequisites.md)

If you have any issues, DM the author [@paulsbruce](https://twitter.com/paulsbruce)
