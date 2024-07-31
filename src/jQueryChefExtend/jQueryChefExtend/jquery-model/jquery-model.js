(function ($) {
    const variableRegex = /^[^\|]+/;
    const propertyRegex = /[^\.\|]+\.[^\.\|]+/;
    const templateLiteralsRegex = /^`([^`]+)`$/;
    const stringInterpolationRegex = /\{([^\{\}]+)\}/;
    const filterRegex = /\|[^\|]+/;
    const valueRegex1 = /,(value|value-string):([^:,]+)/;
    const valueRegex2 = /^(value|value-string):([^:,]+)/;
    const dazzleRegex = /([^:,]+):(`[^`]+`|[^:,]+)/g;
    const filterFunctionRegex = /\|([^\s]+)$/;
    const filterFunctionWithArgumentsRegex = /\|([^\s]+) \? (.+)$/;
    const stringRegex = /^'([^']+)'$/;
    const commaNumberRegex = /\d{1},\d{3}$/;
    const filterMap = new Map();

    const escapeRegExp = function (str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const isNumber = function (value) {
        // use '==' for null
        if (value == undefined) return false;
        if (typeof value !== "string") return false;
        if (value === "") return false;
        if (value.trim().length < 1) return false;
        if (!commaNumberRegex.test(value) && isNaN(value)) return false;

        return true;
    }

    const toNumber = function (value) {
        return Number(value.replace(/,/g, ""));
    }

    const findKeyElement = function ($element, keyPropertyName) {
        const selectorPattern = "[c-model='" + keyPropertyName + "'],[c-model-string='" + keyPropertyName + "'],[c-model*='value:" + keyPropertyName + "'],[c-model*='value-string:" + keyPropertyName + "']";

        return $element.find(selectorPattern).addBack(selectorPattern);
    }

    const resolveModelFilter = function (filterExpr) {

        if (filterMap.has(filterExpr)) return filterMap.get(filterExpr);

        let filterFunctionMatch = undefined;

        if (filterFunctionMatch = filterFunctionRegex.exec(filterExpr)) {
            let method = filterFunctionMatch[1];

            if (method.includes("(") || method.includes(")")) return undefined;

            if (!method.startsWith(".")) {
                method = new Function(`return window.${method};`)();

                if (typeof method !== "function") return undefined;
            }

            const filter = { method, arguments: [] };

            filterMap.set(filterExpr, filter);

            return filter;
        }

        if (filterFunctionMatch = filterFunctionWithArgumentsRegex.exec(filterExpr)) {
            let method = filterFunctionMatch[1];

            if (method.includes("(") || method.includes(")")) return undefined;

            if (!method.startsWith(".")) {
                method = new Function(`return window.${method};`)();

                if (typeof method !== "function") return undefined;
            }

            const args = filterFunctionMatch[2].split(" & ").reduce((accu, next) => {
                let stringMatch = undefined;

                if (stringMatch = stringRegex.exec(next)) {
                    accu.push(stringMatch[1]);
                } else {
                    accu.push(Number(next));
                }
                return accu;
            }, []);

            const filter = { method, arguments: args };

            filterMap.set(filterExpr, filter);

            return filter;
        }

        return undefined;
    }

    const resolveModelFilters = function (property) {

        let filterMatch = undefined;

        do {
            if (filterMatch = filterRegex.exec(property.name)) {

                const filter = resolveModelFilter(filterMatch[0]);

                if (filter) {
                    property.filters.push(filter);
                }

                property.name = property.name.replace(filterMatch[0], "");
            }
        }
        while (filterMatch);
    }

    const filterModelByFilters = function (property) {
        if (!property.filters.length) return;

        property.value = property.filters.reduce((result, filter) => {
            if (typeof filter.method === "function") {

                return filter.method.call(null, result, ...filter.arguments);

            } else if (filter.method.startsWith(".")) {

                // use '==' for null
                if (result == undefined) return result;

                const method = filter.method.substring(1);

                if (result[method]) {
                    return result[method].apply(result, filter.arguments);
                }

            }

            return result;
        }, property.value);
    }

    const resolveModelValue = function (name, obj) {
        // use '==' for null
        if (obj == undefined) return undefined;

        const templateLiteralsMatch = templateLiteralsRegex.exec(name);

        if (templateLiteralsMatch) {
            let match = undefined;
            let objValue = templateLiteralsMatch[1];

            do {
                if (match = stringInterpolationRegex.exec(objValue)) {
                    const prop = { name: match[1], filters: [] };

                    resolveModelFilters(prop);

                    prop.value = resolveModelValue(prop.name, obj);

                    filterModelByFilters(prop);

                    // use '==' for null
                    if (prop.value == undefined) return undefined;

                    objValue = objValue.replace(new RegExp(escapeRegExp(match[0]), "g"), prop.value);
                }
            }
            while (match);

            return objValue;
        }

        if (propertyRegex.test(name)) {
            const dotIndex = name.indexOf(".");

            return resolveModelValue(name.substr(dotIndex + 1), obj[name.substr(0, dotIndex)]);
        }

        const prop = { name: name, filters: [] };

        resolveModelFilters(prop);

        prop.value = prop.name === "__THIS__" ? obj : obj[prop.name];

        filterModelByFilters(prop);

        return prop.value;
    }

    const buildModelValue = function (name, value, obj) {
        if (propertyRegex.test(name)) {
            const dotIndex = name.indexOf(".");
            const parentName = name.substr(0, dotIndex);

            // use '==' for null
            if (obj[parentName] == undefined) {
                obj[parentName] = {};
            }

            buildModelValue(name.substr(dotIndex + 1), value, obj[parentName]);
        } else {
            obj[name] = value;
        }
    }

    const getContents = function (obj) {
        // use '==' for null
        if (obj == undefined) return undefined;
        if (obj.constructor === Function) return obj();

        return obj;
    }

    $.expr[":"].attrStartsWith = $.expr.createPseudo(function (filterParam) {
        return function (element, context, isXml) {
            for (let i = element.attributes.length - 1; i >= 0; i--) {
                if (element.attributes[i].name.startsWith(filterParam)) return true;
            }

            return false;
        };
    });

    $.expr[":"].attrEndsWith = $.expr.createPseudo(function (filterParam) {
        return function (element, context, isXml) {
            for (let i = element.attributes.length - 1; i >= 0; i--) {
                if (element.attributes[i].name.endsWith(filterParam)) return true;
            }

            return false;
        };
    });

    $.fn.extend({
        getModelValue: function () {
            if (this.is(":radio")) return $("input[type='radio'][name='" + this.attr("name") + "']:checked").val();

            if (this.is(":checkbox")) {
                if (this.attr("value")) {
                    return this.prop("checked") ? this.val() : undefined;
                } else {
                    return this.prop("checked");
                }
            }

            if (this.is("[contenteditable]")) {
                return this.text();
            }

            return this.val();
        },
        setModelValue: function (value) {
            if (this.is(":radio")) {
                $("input[type='radio'][name='" + this.attr("name") + "']").prop("checked", false).filter("[value='" + value + "']").prop("checked", true);
            } else if (this.is(":checkbox")) {
                if (this.attr("value")) {
                    this.prop("checked", this.val() === value.toString());
                } else {
                    this.prop("checked", value);
                }
            } else {
                this.val(value);
            }
        },
        model: function (setter, value, afterSet, setterIndex) {
            const elements = this.find(":attrStartsWith('c-model')").addBack(":attrStartsWith('c-model')");

            if (!setter) {
                if (elements.length === 0) return undefined;

                const obj = {};

                $.each(elements,
                    function (index, element) {
                        const $element = $(element);

                        if (!$element.is(":input") && !$element.is("[contenteditable]")) return;

                        for (let i = element.attributes.length - 1; i >= 0; i--) {
                            const attr = element.attributes[i];

                            if (!attr.name.startsWith("c-model")) continue;

                            const match = valueRegex1.exec(attr.value) || valueRegex2.exec(attr.value);

                            if (match) {
                                const key = match[1];
                                const prop = match[2];

                                if (resolveModelValue(prop, obj) === undefined) {
                                    const objValue = $element.getModelValue();

                                    if (objValue !== undefined) {
                                        if (key !== "value-string" && isNumber(objValue)) {
                                            buildModelValue(prop, toNumber(objValue), obj)
                                        } else {
                                            buildModelValue(prop, objValue, obj)
                                        }
                                    }
                                }

                                break;
                            }

                            if (dazzleRegex.test(attr.value)) {
                                dazzleRegex.lastIndex = 0;
                                continue;
                            }

                            if (resolveModelValue(attr.value, obj) === undefined) {
                                const objValue = $element.getModelValue();
                                const prop = variableRegex.exec(attr.value)[0]

                                if (objValue !== undefined) {
                                    if (attr.name !== "c-model-string" && isNumber(objValue)) {
                                        buildModelValue(prop, toNumber(objValue), obj)
                                    } else {
                                        buildModelValue(prop, objValue, obj)
                                    }
                                }
                            }

                            break;
                        }
                    });

                return obj;
            } else {
                if (setter.constructor === String) {
                    const o = {};

                    o[setter] = value;

                    setter = o;
                } else if (setter.constructor === Object) {
                    afterSet = value;
                }

                let beforeSet = undefined;

                if (afterSet && afterSet.constructor === Object) {
                    beforeSet = afterSet.beforeSet;
                    afterSet = afterSet.afterSet;
                }

                if (beforeSet && beforeSet.constructor === Function) beforeSet(this, setter, setterIndex);

                $.each(elements,
                    function (index, element) {
                        for (let i = element.attributes.length - 1; i >= 0; i--) {
                            const attr = element.attributes[i];

                            if (!attr.name.startsWith("c-model")) continue;

                            const $element = $(element);

                            let match = templateLiteralsRegex.test(attr.value) ? undefined : dazzleRegex.exec(attr.value);

                            if (match) {
                                do {
                                    const key = match[1];
                                    const prop = match[2];

                                    const modelValue = resolveModelValue(prop, setter);

                                    if (modelValue === undefined) {
                                        switch (key) {
                                            case "show":
                                                $element.hide();
                                                break;
                                            case "seen":
                                                $element.css("visibility", "hidden");
                                                break;
                                            case "enable":
                                                $element.prop("disabled", true);
                                                break;
                                            case "disable":
                                                $element.prop("disabled", false);
                                                break;
                                            default:
                                                break;
                                        }
                                    } else {
                                        switch (key) {
                                            case "text":
                                                $element.text(getContents(modelValue));
                                                break;
                                            case "html":
                                                $element.html(getContents(modelValue));
                                                break;
                                            case "show":
                                                if (getContents(modelValue)) {
                                                    $element.show();
                                                } else {
                                                    $element.hide();
                                                }
                                                break;
                                            case "seen":
                                                if (getContents(modelValue)) {
                                                    $element.css("visibility", "visible");
                                                } else {
                                                    $element.css("visibility", "hidden");
                                                }
                                                break;
                                            case "enable":
                                                if (getContents(modelValue)) {
                                                    $element.prop("disabled", false);
                                                } else {
                                                    $element.prop("disabled", true);
                                                }
                                                break;
                                            case "disable":
                                                if (getContents(modelValue)) {
                                                    $element.prop("disabled", true);
                                                } else {
                                                    $element.prop("disabled", false);
                                                }
                                                break;
                                            case "value":
                                            case "value-string":
                                                if ($element.is(":input")) {
                                                    $element.setModelValue(modelValue);
                                                } else {
                                                    $element.attr("value", modelValue);
                                                }
                                                break;
                                            default:
                                                $element.attr(key, getContents(modelValue));
                                                break;
                                        }
                                    }
                                } while (match = dazzleRegex.exec(attr.value));

                                break;
                            }

                            if (attr.name === "c-model-html") {
                                const contents = getContents(resolveModelValue(attr.value, setter));

                                if (contents !== undefined) {
                                    $element.html(contents);
                                }

                                break;
                            }

                            if (attr.name === "c-model-show") {
                                const contents = getContents(resolveModelValue(attr.value, setter));

                                if (contents) {
                                    $element.show();
                                } else {
                                    $element.hide();
                                }

                                break;
                            }

                            if (attr.name === "c-model-seen") {
                                const contents = getContents(resolveModelValue(attr.value, setter));

                                if (contents) {
                                    $element.css("visibility", "visible");
                                } else {
                                    $element.css("visibility", "hidden");
                                }

                                break;
                            }

                            if (attr.name === "c-model-enable") {
                                const contents = getContents(resolveModelValue(attr.value, setter));

                                if (contents) {
                                    $element.prop("disabled", false);
                                } else {
                                    $element.prop("disabled", true);
                                }

                                break;
                            }

                            if (attr.name === "c-model-disable") {
                                const contents = getContents(resolveModelValue(attr.value, setter));

                                if (contents) {
                                    $element.prop("disabled", true);
                                } else {
                                    $element.prop("disabled", false);
                                }

                                break;
                            }

                            if ($element.is(":input")) {
                                const modelValue = resolveModelValue(attr.value, setter);

                                if (modelValue !== undefined) {
                                    $element.setModelValue(modelValue);
                                }
                            } else {
                                const contents = getContents(resolveModelValue(attr.value, setter));

                                if (contents !== undefined) {
                                    $element.text(contents);
                                }
                            }

                            break;
                        }
                    });

                if (afterSet && afterSet.constructor === Function) afterSet(this, setter, setterIndex);
            }

            return this;
        },
        models: function (setters, arg, afterSet) {
            const elements = this;

            if (elements.length === 0) return undefined;

            if (!setters) {
                const collection = [];

                $.each(elements,
                    function (index, element) {
                        collection.push($(element).model());
                    });

                return collection;
            } else if (setters.constructor === Object) {
                const keyName = arg;
                const keyValue = setters[keyName].toString();

                for (let i = 0; i < elements.length; i++) {
                    const $element = $(elements[i]);

                    const $keyElement = findKeyElement($element, keyName);

                    if ($keyElement.getModelValue() === keyValue) {
                        $element.model(setters, afterSet);
                        break;
                    }
                }
            } else if (setters.constructor === Array) {
                if (arg.constructor === String) {
                    const keyName = arg;

                    $.each(setters,
                        function (index, item) {
                            const keyValue = item[keyName].toString();

                            let i = 0;
                            for (; i < elements.length; i++) {
                                const $element = $(elements[i]);

                                const $keyElement = findKeyElement($element, keyName);

                                if ($keyElement.getModelValue() === keyValue) {
                                    $element.model(item, afterSet, undefined, index);
                                    break;
                                }
                            }

                            if (i < elements.length) elements.splice(i, 1);
                        });
                } else if (arg instanceof jQuery) {
                    const $container = $(elements);

                    $.each(setters, function (index, item) {
                        arg.clone().model(item, afterSet, undefined, index).appendTo($container);
                    });
                } else if (arg.constructor === Function) {
                    const $container = $(elements);

                    $.each(setters, function (index, item) {
                        arg(item, index).clone().model(item, afterSet, undefined, index).appendTo($container);
                    });
                }
            } else {
                const findKey = setters;
                const findValue = arg.toString();

                for (let i = 0; i < elements.length; i++) {
                    const $element = $(elements[i]);

                    const $keyElement = findKeyElement($element, findKey);

                    if ($keyElement.getModelValue() === findValue) return $element.model();
                }
            }

            return this;
        }
    });
})(jQuery);