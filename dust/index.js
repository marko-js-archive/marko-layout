require('raptor-polyfill/string/startsWith');

var raptorDust = require('raptor-dust');
var path = require('path');

exports.registerHelpers = function(dust, viewEngine) {
    viewEngine = viewEngine || require('view-engine');

    var templateCache = {};

    raptorDust.registerHelpers({
        'layout-use': {
            buildInput: function(chunk, context, bodies, params, out) {
                var args = params;
                var template = params.template;

                if (!template) {
                    throw new Error('"template" param is required');
                }

                if (typeof template === 'string') {
                    if (template.startsWith('.')) {
                        template = path.join(path.dirname(context.templateName), template);
                    }

                    template = templateCache[template] || (templateCache[template] = viewEngine.load(template));
                }

                delete args.template;

                var result = {
                    '*': args,
                    template: template
                };

                if (bodies.block) {
                    result.getContent = function(_layout) {
                        var newContext = context.push(_layout);
                        out.renderDustBody(bodies.block, newContext);
                    };
                }

                return result;
            },
            renderer: require('../use-tag')
        },
        'layout-put': {
            buildInput: function(chunk, context, bodies, params, out) {
                if (params.value == null && bodies.block) {
                    params.renderBody = function(out) {
                        out.renderDustBody(bodies.block);
                    };
                }

                return params;
            },
            renderer: require('../put-tag')
        },
        'layout-placeholder': {
            buildInput: function(chunk, context, bodies, params, out) {
                if (bodies.block) {
                    params.renderBody = function(out) {
                        out.renderDustBody(bodies.block);
                    };
                }

                return params;
            },
            renderer: require('../placeholder-tag')
        }
    }, dust);
};