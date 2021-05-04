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

(function ($) {
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

            return this.val();
        },
        setModelValue: function (value) {
            if (this.is(":radio")) {
                $("input[type='radio'][name='" + this.attr("name") + "'][value='" + value + "']").prop("checked", true);
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

            if (elements.length === 0) return undefined;

            if (!setter) {
                const obj = {};

                $.each(elements,
                    function (index, element) {
                        const $element = $(element);

                        if (!$element.is(":input")) return;

                        for (let i = element.attributes.length - 1; i >= 0; i--) {
                            const attr = element.attributes[i];

                            if (!attr.name.startsWith("c-model")) continue;

                            if (attr.name === "c-model-dazzle") {
                                const match = /,(value|value-number):([^:,]+)/.exec(attr.value) || /^(value|value-number):([^:,]+)/.exec(attr.value);
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
                                }

                                break;
                            }

                            if (resolveModelValue(attr.value, obj) === undefined) {
                                const objValue = $element.getModelValue();

                                if (objValue !== undefined) {
                                    if (attr.name === "c-model-number") {
                                        buildModelValue(attr.value, $.jqModel.toNumber(objValue), obj)
                                    } else {
                                        buildModelValue(attr.value, objValue, obj)
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

                            if (attr.name === "c-model-dazzle") {
                                const regexp = /([^:,]+):(`[^`]+`|[^:,]+)/g;
                                let match = undefined;
                                do {
                                    match = regexp.exec(attr.value);
                                    if (match) {
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
                                    }
                                } while (match);

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

function findKeyElement($element, keyPropertyName) {
    const selectorPattern = "[c-model='" + keyPropertyName + "'],[c-model-number='" + keyPropertyName + "'],[c-model-dazzle*='value:" + keyPropertyName + "'],[c-model-dazzle*='value-number:" + keyPropertyName + "']";

    return $element.find(selectorPattern).addBack(selectorPattern);
}

function resolveModelValue(name, obj) {
    if (obj === undefined || obj === null) return undefined;

    if (/`[^`]+`/.test(name)) {
        let match = undefined;
        let objValue = name.replace(/`/g, "");
        
        do {
            match = /\{([^\{\}]+)\}/.exec(objValue);
            if (match) {
                const prop = match[1];
                const replacer = new RegExp(match[0], "g");

                const propValue = resolveModelValue(prop, obj);

                if (propValue === undefined) return undefined;

                objValue = objValue.replace(replacer, propValue);
            }
        }
        while (match);

        return objValue;
    }

    if (/[^\.]\.[^\.]/.test(name)) {
        const dotIndex = name.indexOf(".");

        return resolveModelValue(name.substr(dotIndex + 1), obj[name.substr(0, dotIndex)]);
    }

    return obj[name];
}

function buildModelValue(name, value, obj) {
    if (/[^\.]\.[^\.]/.test(name)) {
        const dotIndex = name.indexOf(".");
        const parentName = name.substr(0, dotIndex);

        if (obj[parentName] === undefined || obj[parentName] === null) {
            obj[parentName] = {};
        }

        buildModelValue(name.substr(dotIndex + 1), value, obj[parentName]);
    } else {
        obj[name] = value;
    }
}

function getContents(obj) {
    if (obj === undefined || obj === null) return undefined;
    if (obj.constructor === Function) return obj();

    return obj;
}