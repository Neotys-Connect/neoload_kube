## Prerequisites ##

- [Install Python 3.7+](https://www.python.org/downloads/), required for AWS CLI v2
- [Install and configure the AWS CLI **v2**](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
    - Verify you are using the right version: ```aws --version```
        -   should produce something like ```aws-cli/2.0.59 ...```
    - Log in to your AWS account via: ```aws configure``` if not already done
    - Make sure that you can run ```aws eks list-clusters``` without errors
- [Install and configure AWS 'eksctl'](https://eksctl.io/introduction/#installation)
    - Make sure that you can run ```eksctl get cluster``` without errors
