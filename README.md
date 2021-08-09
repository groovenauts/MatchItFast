# MatchIt Fast

MatchIt Fast is the demonstration application with [Vertex AI Matching Engine](https://cloud.google.com/vertex-ai/docs/matching-engine/overview).

## Architecture

![Architecture](doc/images/MatchItFastArchitecture.png)

## Preparation

### Google Cloud Platform Project

You need to have a Google Cloud Platform project with enabled billing account.

## Run Demo Application

Running on the Google App Engine.

### 1. Configurations

Change the following setting values in app.yaml.

```
(TBD)
```

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
