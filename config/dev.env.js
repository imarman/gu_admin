'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 后端接口地址
  BASE_API: '"http://localhost:9110"',
  // excel 模板下载位置
  OSS_PATH: '"https://arman-guli-edu.oss-cn-beijing.aliyuncs.com"'
})
