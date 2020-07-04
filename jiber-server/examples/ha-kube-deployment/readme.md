Note: you will need to update kube/cert-issuer with your email address

I ran the following steps on my cluster to install nginx-ingress and cert-manager

```
helm repo add stable https://kubernetes-charts.storage.googleapis.com/
helm install nginx-ingress stable/nginx-ingress --set controller.publishService.enabled=true

helm repo add jetstack https://charts.jetstack.io
helm repo update

kubectl create namespace cert-manager

helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --version v0.15.1 \
  --set installCRDs=true
```