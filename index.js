'use strict';
const { Client } = require('@elastic/elasticsearch')

class ElasticPrepare {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.hooks = {
      'after:deploy:deploy': () => this.serverless.pluginManager.run(['initElastic']),
      'initElastic:setup': this.initElastic.bind(this, false),
      'before:offline:start': this.initElastic.bind(this, true),
      'before:offline:start:init': this.initElastic.bind(this, true)
    };
    this.commands = {
      "initElastic": {
        usage: 'Create or update the indices',
        lifecycleEvents: [
          'setup',
        ]
      },
    }
  }


  async initElastic(offline = false){
    this.serverless.cli.log('Prepare Elastic Indices...');

    const _host = this.serverless.service.custom.elastic.endpoint
    

    const offline_host = this.serverless.service.custom.elastic.offline_host || "http://localhost:9200"
    const host = offline ? offline_host : _host

    const client = new Client({ node: host })

    if (this.serverless.service.custom.elastic.indices) {
      await Promise.all(this.serverless.service.custom.elastic.indices.map(async element => {
        const {index, mapping} = element

        this.serverless.cli.log(`Current Index: ${index}`);

        const exist = await client.indices.exists({index})

        if (!exist.body && exist.statusCode === 404) {
          await client.indices.create({index})
        } 
            
        await client.indices.putMapping({
          index,
          body: mapping
        })
        
      }));
    };
  }



}

module.exports = ElasticPrepare;
