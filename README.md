# Wristband

Wristband is a tool for internal development teams to deploy their micro-services and web applications into any of HMRC's Multichannel Digital Tax Platform (MDTP) environments.

This repository is used to develop and build the frontend Javascript interface (built using ReactJS and Webpack).

The backend is a thin Python Flask layer in a separate repository.

Wristband itself will be deployed as 2 microservices into the same platform as the services it deploys.

## Features

* [ ] Role based user logins (backend authentication with LDAP)
* [ ] Selection of source environment to pick a service artifact 
* [ ] Target environment implied by selected source environment (eg. selecting dev implies deployment to qa, selecting stage implies deployment to prod etc)
* [ ] Search for services built in source environment
* [ ] Select artifact revision number to deploy
* [ ] Visual timeline indicating what versions of selected application were deployed and where/when 
* [ ] Interface with Jenkins to deploy to specific environment

## License

This code is open source software licensed under the [Apache 2.0 License]("http://www.apache.org/licenses/LICENSE-2.0.html").