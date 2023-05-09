NS=micropets-dev
#PETS_SERVICE="http://micropets-gateway.tap5.eu.aks.mytanzu.xyz/dev/pets"
#PETS_SERVICE="http://pets-golang.micropets-dev/pets" without Spring Cloud Gateway
PETS_SERVICE="https://micropets-gateway.micropets-dev/api/public/pets"
kubectl apply -f config/gui_config.yaml --namespace $NS
tanzu apps workload apply -f config/workload.yaml -e "PETS_SERVICE=${PETS_SERVICE}" --live-update --local-path . --source-image akseutap5registry.azurecr.io/gui  --yes  --update-strategy merge --namespace $NS
