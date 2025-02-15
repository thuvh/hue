/**
 * Licensed to Cloudera, Inc. under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  Cloudera, Inc. licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const DIST_DIR = path.join(__dirname, 'npm_dist');
const JS_ROOT = path.join(__dirname, '/desktop/core/src/desktop/js');
const WRAPPER_DIR = `${__dirname}/tools/vue3-webcomponent-wrapper`;

const defaultConfig = Object.assign({}, require('./webpack.config'), {
  mode: 'production',
  optimization: {
    minimize: true
  },
  plugins: []
});

const executorLibConfig = Object.assign({}, defaultConfig, {
  entry: {
    executor: [`${JS_ROOT}/apps/editor/execution/executor.ts`]
  },
  output: {
    path: `${DIST_DIR}/lib/execution`,
    library: '[name]',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`
  },
  plugins: [
    new CleanWebpackPlugin([DIST_DIR]),
    new CopyWebpackPlugin({
      patterns: [
        { from: './package.json', to: `${DIST_DIR}/package.json` },
        { from: './NPM-README.md', to: `${DIST_DIR}/README.md` },
        { from: JS_ROOT, to: `${DIST_DIR}/src` },
        {
          from: `${JS_ROOT}/apps/editor/execution/executor.d.ts`,
          to: `${DIST_DIR}/lib/execution`
        }
      ]
    })
  ]
});

const hueConfigLibConfig = Object.assign({}, defaultConfig, {
  entry: {
    hueConfig: [`${JS_ROOT}/config/hueConfig.ts`]
  },
  output: {
    path: `${DIST_DIR}/lib/config`,
    library: '[name]',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${JS_ROOT}/config/hueConfig.d.ts`,
          to: `${DIST_DIR}/lib/config`
        }
      ]
    })
  ]
});

const webComponentsConfig = Object.assign({}, defaultConfig, {
  entry: {
    ErDiagram: [`${JS_ROOT}/components/er-diagram/webcomp.ts`],
    QueryEditorWebComponents: [`${JS_ROOT}/apps/editor/components/QueryEditorWebComponents.ts`]
  },
  output: {
    path: `${DIST_DIR}/lib/components`,
    library: '[name]',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${JS_ROOT}/apps/editor/components/QueryEditorWebComponents.d.ts`,
          to: `${DIST_DIR}/lib/components`
        }
      ]
    })
  ]
});

const parserConfig = Object.assign({}, defaultConfig, {
  entry: {
    calciteAutocompleteParser: [`${JS_ROOT}/parse/sql/calcite/calciteAutocompleteParser.js`],
    calciteSyntaxParser: [`${JS_ROOT}/parse/sql/calcite/calciteSyntaxParser.js`],

    druidAutocompleteParser: [`${JS_ROOT}/parse/sql/druid/druidAutocompleteParser.js`],
    druidSyntaxParser: [`${JS_ROOT}/parse/sql/druid/druidSyntaxParser.js`],

    elasticsearchAutocompleteParser: [
      `${JS_ROOT}/parse/sql/elasticsearch/elasticsearchAutocompleteParser.js`
    ],
    elasticsearchSyntaxParser: [`${JS_ROOT}/parse/sql/elasticsearch/elasticsearchSyntaxParser.js`],

    flinkAutocompleteParser: [`${JS_ROOT}/parse/sql/flink/flinkAutocompleteParser.js`],
    flinkSyntaxParser: [`${JS_ROOT}/parse/sql/flink/flinkSyntaxParser.js`],

    genericAutocompleteParser: [`${JS_ROOT}/parse/sql/generic/genericAutocompleteParser.js`],
    genericSyntaxParser: [`${JS_ROOT}/parse/sql/generic/genericSyntaxParser.js`],

    hiveAutocompleteParser: [`${JS_ROOT}/parse/sql/hive/hiveAutocompleteParser.js`],
    hiveSyntaxParser: [`${JS_ROOT}/parse/sql/hive/hiveSyntaxParser.js`],

    impalaAutocompleteParser: [`${JS_ROOT}/parse/sql/impala/impalaAutocompleteParser.js`],
    impalaSyntaxParser: [`${JS_ROOT}/parse/sql/impala/impalaSyntaxParser.js`],

    ksqlAutocompleteParser: [`${JS_ROOT}/parse/sql/ksql/ksqlAutocompleteParser.js`],
    ksqlSyntaxParser: [`${JS_ROOT}/parse/sql/ksql/ksqlSyntaxParser.js`],

    phoenixAutocompleteParser: [`${JS_ROOT}/parse/sql/phoenix/phoenixAutocompleteParser.js`],
    phoenixSyntaxParser: [`${JS_ROOT}/parse/sql/phoenix/phoenixSyntaxParser.js`],

    prestoAutocompleteParser: [`${JS_ROOT}/parse/sql/presto/prestoAutocompleteParser.js`],
    prestoSyntaxParser: [`${JS_ROOT}/parse/sql/presto/prestoSyntaxParser.js`],

    dasksqlAutocompleteParser: [`${JS_ROOT}/parse/sql/dasksql/dasksqlAutocompleteParser.js`],
    dasksqlSyntaxParser: [`${JS_ROOT}/parse/sql/dasksql/dasksqlSyntaxParser.js`]
  },
  performance: {
    hints: false,
    maxEntrypointSize: 1500000,
    maxAssetSize: 1500000
  },
  output: {
    path: `${DIST_DIR}/lib/parsers`,
    library: '[name]',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`
  }
});

const vue3WebCompWrapperConfig = Object.assign({}, defaultConfig, {
  entry: {
    index: [`${JS_ROOT}/vue/wrapper/index.ts`]
  },
  output: {
    path: `${WRAPPER_DIR}/dist`,
    library: '[name]',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`
  },
  plugins: [
    new CleanWebpackPlugin([`${WRAPPER_DIR}/src`, `${WRAPPER_DIR}/dist`]),
    new CopyWebpackPlugin({
      patterns: [{ from: `${JS_ROOT}/vue/wrapper/`, to: `${WRAPPER_DIR}/src` }]
    })
  ]
});

module.exports = [
  executorLibConfig,
  hueConfigLibConfig,
  webComponentsConfig,
  parserConfig,
  vue3WebCompWrapperConfig
];
