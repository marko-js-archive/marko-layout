require('raptor-polyfill/string/startsWith');

var raptorDust = require('raptor-dust');

var viewEngine = 'view-engine';

try {
    viewEngine = require.resolve(viewEngine);
} catch(e) {
    viewEngine = null;
}

if (viewEngine) {
    viewEngine = require(viewEngine);
}

var path = require('path');

exports.registerHelpers = function(dust) {

    var templateCache = {};

    raptorDust.registerHelpers({
        'layout-use': {
            buildInput: function(chunk, context, bodies, params, renderContext) {
                var args = params;
                var template = params.template;

                if (!template) {
                    throw new Error('"template" attribute is required');
                }

                if (typeof template === 'string') {
                    if (template.startsWith('.')) {
                        template = path.join(path.dirname(context.templateName), template);
                    }

                    template = templateCache[template] || (templateCache[template] = viewEngine.load(template));
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