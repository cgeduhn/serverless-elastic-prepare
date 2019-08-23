## serverless-elastic-prepare

Serverless plugin for automatically preparing Elasticsearch Indices and corresponding mappings on deployment.

## How to use
   

####Installation 
Install it to dev dependencies  

``
npm i serverless-elastic-prepare 
``

and add it to your plugins in serverless.yml 

```yaml
plugins:
  - serverless-elastic-prepare
```

####Setup

In your serverless.yml you can add following properties:

######Example
```yaml
custom:
  elastic: 
    index: ${self:service.name}
    endpoint: ${ssm:elasticsearch-endpoint}
    offline_host: "http://localhost:9200"
    indices: 
      - index: ${self:service.name}
        mapping: ${file(es-mappings/oidc-iam-models.json)}
```

Works with serverless-offline.
So if you start "serverlesss-offline" this plugin tries to create the indices and attach the mappings for the corresponding index on start of serverless offline

```
sls deploy --aws-profile yourProfile
```

Done!

#### Deleting

If you removing your serverless project it does NOT! delete the indices and the mappings. 


