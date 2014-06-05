module.exports = function render(input, context) {
    var contentMap = input.content || context.getAttribute('layoutContent');
    var content = contentMap ? contentMap[input.name] : null;
    if (content) {
        if (content.value) {
            context.write(content.value);
        } else if (content.invokeBody) {
            content.invokeBody(context);
        }
    } else {
        if (input.invokeBody) {
            input.invokeBody();
        }
    }
};