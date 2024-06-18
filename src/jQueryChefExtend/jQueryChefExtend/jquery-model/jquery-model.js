if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
        return this.substring(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

if (!Array.prototype.contains) {
    Array.prototype.contains = function (func, thisArg) {
        const self = this;
        const len = self.length;
        let i = -1;

        if (thisArg === undefined) {
            while (++i !== len) {
                if (i in self) {
                    if (func(self[i], i, self)) {
                        return true;
                    }
                }
            }
        } else {
            while (++i !== len) {
                if (i in self) {
                    if (func.call(thisArg, self[i], i, self)) {
                        return true;
                    }
                }
            }
        }

        return false;
    };
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

(function ($) {
    const variableRegex = /^[^\|]+/;
    const propertyRegex = /[^\.\|]+\.[^\.\|]+/;
    const templateLiteralsRegex = /^`([^`]+)`$/;
    const stringInterpolationRegex = /\{([^\{\}]+)\}/;
    const filterRegex = /\|[^\|]+/;
    const valueRegex1 = /,(value|value-number):([^:,]+)/;
    const valueRegex2 = /^(value|value-number):([^:,]+)/;
    const dazzleRegex = /([^:,]+):(`[^`]+`|[^:,]+)/g;
    const filterFunctionRegex = /\|([^\s]+)$/;
    const filterFunctionWithArgumentsRegex = /\|([^\s]+) \? (.+)$/;
    const stringRegex = /^'([^']+)'$/;
    const filterMap = new Map();

    const findKeyElement = function ($element, keyPropertyName) {
        const selectorPattern = "[c-model='" + keyPropertyName + "'],[c-model-number='" + keyPropertyName + "'],[c-model*='value:" + keyPropertyName + "'],[c-model*='value-number:" + keyPropertyName + "']";

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
                if (element.attributes[i].name.startsWith(filterParam)) {
                    return true;
                }
            }

            return false;
        };
    });

    $.expr[":"].attrEndsWith = $.expr.createPseudo(function (filterParam) {
        return function (element, context, isXml) {
            for (let i = element.attributes.length - 1; i >= 0; i--) {
                if (element.attributes[i].name.endsWith(filterParam)) {
                    return true;
                }
            }

            return false;
        };
    });

    $.extend({
        jqModel: {
            toNumber: function (value) {
                if (!(value)) return undefined;

                value = value.replace(/,/g, "");

                if (value === "") return undefined;
                if (value.trim().length < 1) return undefined;
                if (isNaN(value)) return undefined;

                return Number(value);
            }
        }
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
                                        if (key === "value-number") {
                                            buildModelValue(prop, $.jqModel.toNumber(objValue), obj)
                                        } else {
                                            buildModelValue(prop, objValue, obj)
                                        }
                                    }
                                }

                                break;
                            }

                            if (resolveModelValue(attr.value, obj) === undefined) {
                                const objValue = $element.getModelValue();
                                const prop = variableRegex.exec(attr.value)[0]

                                if (objValue !== undefined) {
                                    if (attr.name === "c-model-number") {
                                        buildModelValue(prop, $.jqModel.toNumber(objValue), obj)
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

                                    if (modelValue !== undefined) {
                                        switch (key) {
                                            case "text":
                                                $element.text(getContents(modelValue));
                                                break;
                                            case "html":
                                                $element.html(getContents(modelValue));
                                                break;
                                            case "value":
                                            case "value-number":
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