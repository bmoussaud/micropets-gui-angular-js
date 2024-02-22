set -x
NS=micropets-dev
PETS_SERVICE="https://micropets-gateway.micropets-dev/micropets/pets"
tanzu apps workload apply --file config/workload.yaml -e "PETS_SERVICE=${PETS_SERVICE}" --namespace ${NS} --debug --yes --local-path . --live-update --tail --update-strategy replace
