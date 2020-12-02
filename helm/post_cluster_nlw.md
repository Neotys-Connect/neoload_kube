## After Kube cluster setup, install NeoLoad Web ##

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

NOTE: For deployments requiring SSL/TLS connections, these instructions will be updated shortly.
