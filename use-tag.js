module.exports = function render(input, context) {
    var content = {};
    
    input.invokeBody({
        handlePutTag: function (putTag) {
            content[putTag.into] = putTag;
        }
    });

    var viewModel = input['*'] || {};
    viewModel.layoutContent = content;
    input.template.render(viewModel, context);
};