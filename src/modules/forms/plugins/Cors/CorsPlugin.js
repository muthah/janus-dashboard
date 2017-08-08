import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import block from '../../../../helpers/bem-cn';

import Row from '../../../Layout/Row/Row';
import Label from '../../../labels/Label';
import Input from '../../../inputs/Input';
import Hint from '../../../labels/Hint/Hint';
import ControlBar from '../ControlBar/ControlBar';
import MultiSelect from '../../../selects/MultiSelect/MultiSelect';
import TagSelect from '../../../selects/TagSelect/TagSelect';

const propTypes = {
    className: PropTypes.string,
    name: PropTypes.string.isRequired,
    pluginName: PropTypes.string.isRequired,
    handlePluginExclude: PropTypes.func.isRequired,
};

const CorsPlugin = ({ className, name, handlePluginExclude, plugin, pluginName }) => {
    const b = block(className);
    const selectMethodOptions = plugin.config.methods.map(item => ({
        label: item,
        value: item,
    }));
    const selectTagsOptions = plugin.config.request_headers.map(item => ({
        label: item,
        value: item,
    }));

    return (
        <div className={b('section')()}>
            <Row fullwidth>
                <Row col>
                    <Label>Plugin Name</Label>
                    <Input input={{value: 'CORS'}} disabled />
                </Row>
                <ControlBar name={`${name}.enabled`} removePlugin={() => handlePluginExclude(pluginName)} />
            </Row>
            <Row className={b('row')()} fullwidth>
                <Row col>
                    <Label>Domains</Label>
                    <Field
                        name={`${name}.config.domains`}
                        type="text"
                        placeholder="Choose"
                        component={Input}
                    />
                    <Hint>A list of all domains from which the endpoint will accept requests</Hint>
                </Row>
                <Row col>
                    <Label>Methods</Label>
                    <Field
                        name={`${name}.config.methods`}
                        type="text"
                        placeholder="Choose one or more methods"
                        options={selectMethodOptions}
                        component={MultiSelect}
                    />
                    <Hint>HTTP methods that are supported for the endpoint.</Hint>
                </Row>
            </Row>
            <Row className={b('row')()} fullwidth>
                <Row col>
                    <Label>Request Headers</Label>
                    <Field
                        name={`${name}.config.request_headers`}
                        type="text"
                        placeholder="eg. Origin, Authorization, Content-Type"
                        options={selectTagsOptions}
                        component={TagSelect}
                    />
                    <Hint>Value(s) for the Access-Control-Allow-Headers header.</Hint>
                </Row>
                <Row col>
                    <Label>Exposed Headers</Label>
                    <Field
                        name={`${name}.config.exposed_headers`}
                        type="text"
                        component={Input}
                    />
                    <Hint>Value for the Access-Control-Expose-Headers header.</Hint>
                </Row>
            </Row>
        </div>
    );
};

CorsPlugin.propTypes = propTypes;

export default CorsPlugin;
