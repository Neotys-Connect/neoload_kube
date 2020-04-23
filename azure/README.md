# Azure (AKS + ECI) examples

1. Create an Azure Kubernetes Cluster, selecting 'Virtual Nodes' to back the control plane with ECI
https://docs.microsoft.com/en-us/azure/aks/virtual-nodes-portal

2. Install and configure your local kubectl to use Azure
https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest

3. Login via the Azure CLI
```
az login
```

4. Register the container instances provider (ACI) on your subscription
```
az provider list --query "[?namespace == 'Microsoft.ContainerInstance'].registrationState"
```
...should say "Registered". If not, do this:
```
az provider register --namespace Microsoft.ContainerInstance
```

5. Grant AKS rights to use ACI

https://dev.to/azure/azure-tip-how-to-get-your-kubernetes-cluster-service-principal-and-use-it-to-access-other-azure-services-2735

https://docs.microsoft.com/en-us/azure/aks/kubernetes-service-principal

https://louisshih.gitbooks.io/kubernetes/autoscale-using-virtual-kubelet-within-azure-aci.html

https://github.com/virtual-kubelet/azure-aci#create-an-aks-cluster-with-vnet

5. Connect kubectl to your new Azure Cluster
```
az aks get-credentials --resource-group [myResourceGroup] --name [myAKSCluster]
```

NOTE: use the resource group and cluster names you provided when creating the cluster in Azure

6. Continue [setup with our NeoLoad Helm instructions](../helm/README.md)

7. Remove the default taint

On Azure AKS, the virtual node is Tainted by default, preventing new deployments from NeoLoad Web
 to be scheduled on pods in ACI.

```
kind: Node
...
spec:
  taints:
  - effect: NoSchedule
    key: virtual-kubelet.io/provider
    value: azure
```

To remove this taint:

```
kubectl taint nodes virtual-node-aci-linux "virtual-kubelet.io/provider":NoSchedule-
```
