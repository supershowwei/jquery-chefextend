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
        model: function (setter, value) {
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

                                if (objValue === undefined) continue;

                                if (attr.name === "c-model-number") {
                                    obj[attr.value] = $.jqModel.toNumber(objValue);
                                } else {
                                    obj[attr.value] = objValue;
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
                }

                $.each(elements,
                    function (index, element) {
                        for (var i = element.attributes.length - 1; i >= 0; i--) {
                            var attr = element.attributes[i];

                            if (!attr.name.startsWith("c-model")) continue;

                            if (setter[attr.value] !== undefined) {
                                var $element = $(element);

                                if ($element.is(":input")) {
                                    $element.setModelValue(setter[attr.value]);
                                } else {
                                    if (setter[attr.value].constructor === Function) {
                                        $element.text(setter[attr.value]());
                                    } else {
                                        $element.text(setter[attr.value]);
                                    }
                                }
                            }

                            break;
                        }
                    });
            }
        },
        models: function (setters, arg) {
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
                        $element.model(setters);
                        break;
                    }
                }
            } else if (setters.constructor === Array) {
                var keyName = arg;

                $.each(setters,
                    function (index, item) {
                        var keyValue = item[keyName].toString();

                        var i = 0;
                        for (; i < elements.length; i++) {
                            var $element = $(elements[i]);

                            var $keyElement = findKeyElement($element, keyName);

                            if ($keyElement.getModelValue() === keyValue) {
                                $element.model(item);
                                break;
                            }
                        }

                        if (i < elements.length) elements.splice(i, 1);
                    });
            } else {
                var findKey = setters;
                var findValue = arg.toString();

                for (var i = 0; i < elements.length; i++) {
                    var $element = $(elements[i]);

                    var $keyElement = findKeyElement($element, findKey);

                    if ($keyElement.getModelValue() === findValue) return $element.model();
                }
            }
        }
    });
})(jQuery);