# AWS examples

- [Fargate eksctl config YAML](fargate-cluster-config.yaml)

*Simple steps for NeoLoad/Fargate setup*

1. [Install and configure AWS 'eksctl'](https://eksctl.io/introduction/installation/)
NOTE: Before you use eksctl, you will need to configure your aws CLI to use your own account and API token.

2. [Create a custom cluster config file](fargate-cluster-config.yaml) that has a second non-default profile with a proper namespace (and no additional selection filters/labels)
NOTE: More details on eksctl usage with fargate can be found [here](https://eksctl.io/usage/fargate/)

3. Configure the cluster for NeoLoad use using [our Helm instructions](https://www.neotys.com/documents/doc/nlweb/latest/en/html/#39459.htm#o39461)
    NOTE!!! Use the same namespace for the 'helm install...' command as in the non-default fargate profile selector, something like 'neoload'

4. Follow the instructions from Helm output to obtain your cluster endpoint and credentials for use NeoLoad Web Infrastructure Provider configuration. Use same namespace.
5. See below command to monitor cluster events before you...
5. Run a test using the NeoLoad Web Zone connected to your Fargate infrastructure

When you run your first test, you may find that default configurations limit the node resources available to launch pods. To monitor cluster events, use:

```kubectl get events --watch -n your-namespace```

By using eksctl to create a new cluster, your aws credentials are used. Also, this adds context information to kubectl contexts. Because of this, here are a few useful commands:

```
kubectl config get-contexts
kubectl config use-context [some-new-context]
kubectl config view
kubectl kubectl config set-context [some-context] --namespace [your-namespace]
kubectl get nodes
kubectl get pods
kubectl describe [pod-or-node-name]
kubectl logs [pod-name]
```

More kubectl commands can be found in the [kubectl cheat sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
