NS=micropets-int
kubectl apply -f config/gui_config.yaml --namespace $NS
tanzu apps workload apply -f config/workload.yaml -e "PETS_SERVICE=http://pets-golang.micropets-dev/pets" --live-update --local-path . --source-image akseutap5registry.azurecr.io/gui  --yes  --update-strategy merge --namespace $NS
