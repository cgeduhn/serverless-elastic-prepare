'use strict';

class ElasticPrepare {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.hooks = {
      'aws:deploy:finalize:cleanup': this.initElastic.bind(this, false),
      'init:elastic': this.initElastic.bind(this, false),
      'before:offline:start': this.initElastic.bind(this, true),
      'before:offline:start:init': this.initElastic.bind(this, true)
    };
    this.commands = {
      "init:elastic": {
        usage: 'Create or update the indices',
        lifecycleEvents: [
          'create',
        ]
      },
    }
  }


  async initElastic(offline = false){
    const _host = this.serverless.service.custom.elastic.endpoint
    const { Client } = require('@elastic/elasticsearch')

    const offline_host = this.serverless.service.custom.elastic.offline_host || "http://localhost:9200"
    const host = offline ? offline_host : _host

    const client = new Client({ node: host })

    if (this.serverless.service.custom.elastic.indices) {
      await this.serverless.service.custom.elastic.indices.forEach(async element => {
        const {index, mapping} = element

        const exist = await client.indices.exists({index})

        if (!exist.body && exist.statusCode === 404) {
          await client.indices.create({index})
        } 
            
        await client.indices.putMapping({
          index,
          body: mapping
        })
        
      });
    };
  }



}

module.exports = ElasticPrepare;