## After Kube cluster setup, install NeoLoad Web ##

- [Install NeoLoad Web via Helm Chart](#install-neoLoad-web-via-helm-chart)
- [Securing your NeoLoad Web installation with SSL/TLS Certificates](#securing-your-neoLoad-web-installation-with-SSL-TLS-certificates)
- [Changing the default Files Upload size](#changing-the-default-files-upload-size)

### Install NeoLoad Web via Helm Chart ###

1. NeoLoad Web requires Mongo as a data store, so you will have to provision a Mongo
   cluster first. Since you are ultimately responsible for creating, backup, monitoring,
   upgrading, and all other management activities related to this cluster, we recommend
   going with a supported, SaaS-based solution such as Mongo Atlas Enterprise if possible.

   NOTE: You will need to set up [VPC peering](https://docs.atlas.mongodb.com/security-vpc-peering/) between the VPC where your Mongo
   cluster exists and the VPC of the EKS cluster where NeoLoad Web runs. Especially in the
   case of Mongo Atlas, VPC peering simplifies DNS resolution between Mongo in one
   VPC and NeoLoad Web in another. See [VPC peering connections](https://docs.aws.amazon.com/vpc/latest/peering/create-vpc-peering-connection.html#accept-vpc-peering-connection) for more detail.

   NOTE: You will also need to whitelist your cluster's external egress IP address

2. Configure the cluster for NeoLoad use using [our Helm instructions](https://github.com/Neotys-Labs/helm-neoload-web)
    EXAMPLE:
    ```
    helm repo add neotys https://helm.prod.neotys.com/stable/
    helm install neoloadweb neotys/nlweb -f ./values-custom.yaml
    ```
  NOTE: in our experience, the NGINX Ingress controller option is more stable than
  the ALB option due to changes and lack of backwards-compatibility in AWS helm charts.

3. Install the the appropriate Ingress controller

   This component sits inside your cluster and watches for deployments (such as NeoLoad Web)
   that are annotated in such a way to indicate that we need an AWS load balancer to
   provide an entry point for accessing NeoLoad Web via your browser. When it senses
   these annotations, it will create the appropriate AWS load balancer automatically.

   NOTE: Using [NGINX](https://aws.amazon.com/blogs/opensource/network-load-balancer-nginx-ingress-controller-eks/), it would look something like this:
   ```
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.32.0/deploy/static/provider/aws/deploy.yaml
   ```

4. Update your DNS records (such as Route53) to point to your new AWS load balancer for
   the web/api/files hostnames mentioned in 'values-custom.yaml'.


### Securing your NeoLoad Web installation with SSL/TLS Certificates ###

Whether externally or internally facing, it never hurts to secure the traffic to your apps and APIs
 and NeoLoad Web is no different. Specifically in AWS, ACM (AWS Certificates Manager) is often the
 preferred source for certificates. However, some organizations often to use certificates generated
 from another source.

#### Using your own certificate (incl. public and private keys) ####

This situation is accounted for in the NeoLoad Web Helm values-custom.yaml file under the TLS section.

#### Using a Certificate from ACM ####

Generally speaking, we will be following the [AWS directions here](https://aws.amazon.com/premiumsupport/knowledge-center/terminate-https-traffic-eks-acm/), specific to ACM usage for EKS clusters.

1. Generate the certificate in ACM using a wildcard '*.' prefix to the domain or subdomain that parents
 the three hostnames (neoload-web / neoload-api / neoload-files) so that you only need to deal with one certificate
 for all three subdomains. For instance, a certificate for '*.neoload.yourdomain.org' will cover 'web.neoload.yourdomain.org', 'api.neoload.yourdomain.org, and 'files.neoload.yourdomain.org'.

 NOTE: copy the ARN of your certificate for later use

2. Using the recommended ingress option (NGINX) above, you will then need to properly configure the NGINX
 ingress controller to use this certificate. [See instructions here](https://kubernetes.github.io/ingress-nginx/deploy/#aws) for NLB 'deploy-tls-termination.yaml' custom
 patch file. Make sure you use the CIDR of the VPC used by your cluster, not necessarily the CIDR specified
 on the cluster overview in EKS console.

3. Once the above update has been applied, you will need to confirm that the AWS NLW routing traffic to
 your cluster has received the appropriate configuration by looking at Listeners under the specific NLB record
 through the EC2 Load Balancers console section. If it doesn't, you may have to manually apply the certificate
 to an HTTPS/443 listener.

### Changing the default Files Upload size ###

When uploading projects to NeoLoad Web, the backend files service defaults to a max size of 250mb. However
 when using NGINX, there is no annotation to allow this size (default 1m) on the NGINX ingress controller.
 To control this value, you will need to change it both in the environment variables of the deployed backend pod
 and in the NGINX annotations as follows:

**In values-custom.yaml:**
```
...
ingress:
  ...
  annotations:
    ...
    nginx.ingress.kubernetes.io/proxy-body-size: 300m
...
[and]
...
neoload:
  configuration:
    backend:
      others:
      - name: FILE_PROJECT_MAX_SIZE_IN_BYTES
        value: "300000000"
```

NOTE: a full list of NGINX ingress annotations is available [here](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/)
