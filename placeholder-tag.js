module.exports = function render(input, out) {
    var contentMap = input.content || out.getAttribute('layoutContent');
    var content = contentMap ? contentMap[input.name] : null;
    if (content) {
        if (content.value) {
            out.write(content.value);
        } else if (content.invokeBody) {
            content.invokeBody(out);
        }
    } else {
        if (input.invokeBody) {
            input.invokeBody(out);
        }
    }
};