import React, { Component } from 'react'
import PropTypes from 'prop-types'

import block from '../../../helpers/bem-cn'

import SelectPlugin from '../../selects/SelectPlugin/SelectPlugin'
import Row from '../../Layout/Row/Row'
import Button from '../../../components/Button/Button'

import CorsPlugin from './Cors/CorsPlugin'
import RateLimitPlugin from './RateLimit/RateLimitPlugin'
import AuthPlugin from './oAuth/AuthPlugin'
import CompressionPlugin from './Compression/CompressionPlugin'
import RequestTransformerPlugin from './RequestTransformer/RequestTransformerPlugin'
import RetryPlugin from './RetryPlugin/RetryPlugin'

const propTypes = {
  className: PropTypes.string,
  apiSchema: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  initialValues: PropTypes.object,
  plugins: PropTypes.arrayOf(PropTypes.object.isRequired),
  handlePluginExclude: PropTypes.func,
  handlePluginInclude: PropTypes.func.isRequired,
  selectedPlugins: PropTypes.arrayOf(PropTypes.string).isRequired,
  previewPage: PropTypes.bool
}

class RenderPlugin extends Component {
    state = {
      visiblePlugins: false
    }

    showPlugins = () => {
      this.setState({ visiblePlugins: true })
    }

    getPluginIndex = (plugins, pluginName) => {
      const pluginIndex = plugins.findIndex(plugin => {
        return plugin.name === pluginName
      })

      return pluginIndex
    }

    render () {
      const {
        className,
        /**
             * @FIXME: something wrong with receiving apiSchema
             * as a prop
             */
        apiSchema,
        edit,
        plugins,
        response,
        selectedPlugins,
        handlePluginExclude,
        handlePluginInclude,
        initialValues,
        previewPage
      } = this.props
      const b = block(className)
      const names = apiSchema.plugins.map(plugin => ({
        label: plugin.label,
        value: plugin.name
      }))

      return (
        <div>
          {
            selectedPlugins.map(pluginName => {
              const opts = {
                className: b(),
                key: pluginName,
                name: `plugins[${this.getPluginIndex(plugins, pluginName)}]`,
                handlePluginExclude,
                plugin: initialValues.plugins[this.getPluginIndex(plugins, pluginName)],
                pluginFromValues: plugins[this.getPluginIndex(plugins, pluginName)],
                pluginName,
                apiSchema,
                edit,
                response,
                previewPage
              }

              switch (pluginName) {
                case 'cors':
                  return (
                    <CorsPlugin
                      {...opts}
                    />
                  )
                case 'rate_limit':
                  return (
                    <RateLimitPlugin
                      {...opts}
                    />
                  )
                case 'oauth2':
                  return (
                    <AuthPlugin
                      {...opts}
                    />
                  )
                case 'compression':
                  return (
                    <CompressionPlugin
                      {...opts}
                    />
                  )
                case 'request_transformer':
                  return (
                    <RequestTransformerPlugin
                      {...opts}
                    />
                  )
                case 'retry':
                  return (
                    <RetryPlugin
                      {...opts}
                    />
                  )
                default:
                  return null
              }
            })
          }

          {
            this.state.visiblePlugins &&
            <Row className={b('row')()}>
              <SelectPlugin
                name='form-field-name'
                options={names}
                onChange={handlePluginInclude}
              />
            </Row>
          }

          {
            !previewPage &&
            <Row className={b('row')()}>
              <Button
                type='button'
                mod='primary'
                onClick={this.showPlugins}
              >
                + Add Plugin
              </Button>
            </Row>
          }
        </div>
      )
    };
};

RenderPlugin.propTypes = propTypes

export default RenderPlugin
