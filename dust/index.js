var raptorDust = require('raptor-dust');

exports.registerHelpers = function(dust) {    
    raptorDust.registerHelpers({
        'layout-use': {
            buildInput: function(chunk, context, bodies, params, renderContext) {
                var args = params;
                var template = params.template;

                if (!template || typeof template.render !== 'function') {
                    throw new Error('Invalid template');
                }

                delete args.template;

                return {
                    invokeBody: function(_layout) {
                        var newContext = context.push(_layout);
                        renderContext.renderDustBody(bodies.block, newContext);
                    },
                    '*': args,
                    template: template
                };
            },
            renderer: require('../use-tag')
        },
        'layout-put': {
            buildInput: function(chunk, context, bodies, params, renderContext) {
                if (params.value == null) {
                    params.invokeBody = function(renderContext) {
                        renderContext.renderDustBody(bodies.block);
                    };    
                }
                
                return params;
            },
            renderer: require('../put-tag')
        },
        'layout-placeholder': {
            buildInput: function(chunk, context, bodies, params, renderContext) {
                params.invokeBody = function() {
                    renderContext.renderDustBody(bodies.block);
                };

                return params;
            },
            renderer: require('../placeholder-tag')
        }
    }, dust);
};