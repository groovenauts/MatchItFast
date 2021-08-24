# MatchIt Fast

MatchIt Fast is the demonstration application with [Vertex Matching Engine](https://cloud.google.com/vertex-ai/docs/matching-engine/overview).

MatchIt Fast demonstrates the blazingly fast similarity search among several million images/articles using the [Vertex Matching Engine](https://cloud.google.com/vertex-ai/docs/matching-engine/overview).

https://matchit.magellanic-clouds.com/

## Architecture

![Architecture](doc/images/MatchItFastArchitecture.png)

## How it works

See ![How it works](doc/HOW_IT_WORKS.md)

## Preparation

### Google Cloud Platform Project

You need to have a Google Cloud Platform project with enabled billing account.

### VPC Network

Currently Vertex Matcing Engine index endpoints can be access via only Private Service Access.
You need to create a VPC Network to be configured several VPC service components.
See [the documentation of VPC networks](https://cloud.google.com/vpc/docs/using-vpc) for how to create a VPC network in your Google Cloud Platform Project.

### Configure Matching Engine

To create Indexes and deploy them to the Index Endpoints, see [the documentation](https://cloud.google.com/vertex-ai/docs/matching-engine/using-matching-engine).

MatchIt Fast app requires the two indexes of images and articles deployed to index endpoints and accessible via [Private Service Access](https://cloud.google.com/vpc/docs/private-services-access).
The Private Service Access should be configured on the VPC network you created above.

### Serverless VPC Access

To access Matching Engine Index Endpoints via Private Service Access from App Engine, you need to create [Serverless VPC Access](https://cloud.google.com/vpc/docs/configure-serverless-vpc-access).
The connector of Serverless VPC Access should be created on the VPC network you created above.

### GCE instance with container

To retrieve document embedding using the [Universal Sentence Encoder](https://tfhub.dev/google/universal-sentence-encoder/4), you need to deploy the container on the GCE instance.
Be careful to create the instance in the VPC network you created for the demo app.

The container image could be build with Cloud Build. The configuration for Cloud Built trigger is [utilities/containers/gsg-encoder/cloudbuild.yaml](utilities/containers/gsg-encoder/cloudbuild.yaml).

The [GCE instance with container](https://cloud.google.com/compute/docs/containers/deploying-containers) is handfull way to deploy container.

```
gcloud --project=MY-PROJECT-ID compute instances create-with-container INSTANCE-NAME \
    --subnet=MY-VPC-NAME \
    --zone=us-central1-a --machine-type=e2-medium \
    --image-family=cos-dev --image-project=cos-cloud --boot-disk-size=50GB \
    --container-image=gcr.io/MY-PROJECT-ID/universal-sentence-encoder-app:latest
```

## Run Demo Application

Running on the Google App Engine.

### 1. Configurations

Change the following setting values in app.yaml.

#### `env_variables`

| environment variable | description |
|----------------------|-------------|
| `MATCHING_ENGINE_DEPLOYED_INDEX_ID` | The deployed index ID for image search |
| `MATCHING_ENGINE_ENDPOINT_IP` | The IP address of deployed index for image search |
| `GDELT_GSG_DEPLOYED_INDEX_ID` | The deployed index ID for news search |
| `GDELT_GSG_ENDPOINT_IP` | The IP address of deployed index for news search |
| `GDELT_GSG_APP_ENDPOINT` | 'http://{IP-ADDR}' IP-ADDR should be replaced with the internal IP address of the GCE instance you created. |

#### `vpc_access_connector`

Specify Serverless VPC Access connector name.

### 2. Deploy

Perform the following gcloud command to deploy App Engine application in your GCP project.

```
gcloud --project YOUR-PROJECT-ID app deploy
```

### 3. Browse your application

After you deployed to App Engine, you can run the following command to launch your browser and view the app at https://[YOUR-PROJECT-ID].appspot.com:

```
gcloud app browse
```
