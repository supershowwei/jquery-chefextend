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

function findKeyElement($element, keyPropertyName) {
    return $element.find("[c-model='" + keyPropertyName + "'],[c-model-number='" + keyPropertyName + "']");
}

function getContents(obj) {
    if (obj === undefined) return undefined;
    if (obj === null) return undefined;
    if (obj.constructor === Function) return obj();

    return obj;
}

(function ($) {
    $.expr[":"].attrStartsWith = $.expr.createPseudo(function (filterParam) {
        return function (element, context, isXml) {
            for (var i = element.attributes.length - 1; i >= 0; i--) {
                if (element.attributes[i].name.startsWith(filterParam)) {
                    return true;
                }
            }

            return false;
        };
    });

    $.expr[":"].attrEndsWith = $.expr.createPseudo(function (filterParam) {
        return function (element, context, isXml) {
            for (var i = element.attributes.length - 1; i >= 0; i--) {
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
                return isNaN(value) ? undefined : Number(value);
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
                    this.prop("checked", this.val() === value);
                } else {
                    this.prop("checked", value);
                }
            } else {
                this.val(value);
            }
        },
        model: function (setter, value, afterSet) {
            var elements = this.find(":attrStartsWith('c-model')").addBack(":attrStartsWith('c-model')");

            if (elements.length === 0) return undefined;

            if (!setter) {
                var obj = {};

                $.each(elements,
                    function (index, element) {
                        var $element = $(element);

                        if (!$element.is(":input")) return;

                        for (var i = element.attributes.length - 1; i >= 0; i--) {
                            var attr = element.attributes[i];

                            if (!attr.name.startsWith("c-model")) continue;

                            if (obj[attr.value] === undefined) {
                                var objValue = $element.getModelValue();

                                if (objValue !== undefined) {
                                    if (attr.name === "c-model-number") {
                                        obj[attr.value] = $.jqModel.toNumber(objValue);
                                    } else {
                                        obj[attr.value] = objValue;
                                    }
                                }
                            }

                            break;
                        }
                    });

                return obj;
            } else {
                if (setter.constructor === String) {
                    var o = {};

                    o[setter] = value;

                    setter = o;
                } else if (setter.constructor === Object) {
                    afterSet = value;
                }

                var beforeSet = undefined;

                if (afterSet && afterSet.constructor === Object) {
                    beforeSet = afterSet.beforeSet;
                    afterSet = afterSet.afterSet;
                }

                if (beforeSet && beforeSet.constructor === Function) beforeSet(this, setter);

                $.each(elements,
                    function (index, element) {
                        for (var i = element.attributes.length - 1; i >= 0; i--) {
                            var attr = element.attributes[i];

                            if (!attr.name.startsWith("c-model")) continue;

                            var $element = $(element);

                            if (attr.name === "c-model-dazzle") {
                                var regexp = /([^:,]+):([^:,]+)/g;
                                var match = undefined;
                                do {
                                    match = regexp.exec(attr.value);
                                    if (match) {
                                        var key = match[1];
                                        var prop = match[2];

                                        var contents = getContents(setter[prop]);

                                        if (contents !== undefined) {
                                            switch (key) {
                                                case "text":
                                                    $element.text(contents);
                                                    break;
                                                default:
                                                    $element.attr(key, contents);
                                                    break;
                                            }
                                        }
                                    }
                                } while (match);

                                break;
                            }

                            if (attr.name === "c-model-html") {
                                var contents = getContents(setter[prop]);

                                if (contents !== undefined) {
                                    $element.html(getContents(setter[attr.value]));                                    
                                }

                                break;
                            }

                            if (setter[attr.value] !== undefined && setter[attr.value] !== null) {
                                if ($element.is(":input")) {
                                    $element.setModelValue(setter[attr.value]);
                                } else {
                                    $element.text(getContents(setter[attr.value]));
                                }
                            }

                            break;
                        }
                    });

                if (afterSet && afterSet.constructor === Function) afterSet(this, setter);
            }

            return this;
        },
        models: function (setters, arg, afterSet) {
            var elements = this;

            if (elements.length === 0) return undefined;

            if (!setters) {
                var collection = [];

                $.each(elements,
                    function (index, element) {
                        collection.push($(element).model());
                    });

                return collection;
            } else if (setters.constructor === Object) {
                var keyName = arg;
                var keyValue = setters[keyName].toString();

                for (var i = 0; i < elements.length; i++) {
                    var $element = $(elements[i]);

                    var $keyElement = findKeyElement($element, keyName);

                    if ($keyElement.getModelValue() === keyValue) {
                        $element.model(setters, afterSet);
                        break;
                    }
                }
            } else if (setters.constructor === Array) {
                if (arg.constructor === String) {
                    var keyName = arg;

                    $.each(setters,
                        function (index, item) {
                            var keyValue = item[keyName].toString();

                            var i = 0;
                            for (; i < elements.length; i++) {
                                var $element = $(elements[i]);

                                var $keyElement = findKeyElement($element, keyName);

                                if ($keyElement.getModelValue() === keyValue) {
                                    $element.model(item, afterSet);
                                    break;
                                }
                            }

                            if (i < elements.length) elements.splice(i, 1);
                        });
                } else if (arg instanceof jQuery) {
                    var $container = $(elements);

                    $.each(setters,
                        function (index, item) {
                            arg.clone().model(item, afterSet).appendTo($container);
                        });
                }
            } else {
                var findKey = setters;
                var findValue = arg.toString();

                for (var i = 0; i < elements.length; i++) {
                    var $element = $(elements[i]);

                    var $keyElement = findKeyElement($element, findKey);

                    if ($keyElement.getModelValue() === findValue) return $element.model();
                }
            }

            return this;
        }
    });
})(jQuery);