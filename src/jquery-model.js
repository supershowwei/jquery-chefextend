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
            getValue: function (element) {
                var $element = $(element);

                if ($element.is(":radio")) return $("input[type='radio'][name='" + element.name + "']:checked").val();

                if ($element.is(":checkbox")) return $element.prop("checked");

                return $element.val();
            },
            setValue: function (element, value) {
                var $element = $(element);

                if ($element.is(":radio")) {
                    $("input[type='radio'][name='" + element.name + "'][value='" + value + "']").prop("checked", true);
                } else if ($element.is(":checkbox")) {
                    $element.prop("checked", value);
                } else {
                    $element.val(value);
                }
            },
            setText: function (element, text) {
                $(element).text(text);
            },
            toNumber: function (value) {
                return isNaN(value) ? undefined : Number(value);
            }
        }
    });

    $.fn.extend({
        model: function (setter, value) {
            var elements = this.find(":attrStartsWith('c-model')");

            if (elements.length === 0) return undefined;

            if (!setter) {
                var obj = {};

                $.each(elements,
                    function (index, element) {
                        for (var i = element.attributes.length - 1; i >= 0; i--) {
                            if (element.value === undefined) break;

                            var attrName = element.attributes[i].name;

                            if (!attrName.startsWith("c-model")) continue;

                            var propName = element.attributes[i].value;

                            if (attrName === "c-model") {
                                obj[propName] = $.jqModel.getValue(element);
                            } else if (attrName === "c-model-number") {
                                obj[propName] = $.jqModel.toNumber($.jqModel.getValue(element));
                            }

                            break;
                        }
                    });

                return obj;
            } else {
                if (value !== undefined) {
                    var o = {};

                    o[setter] = value;

                    setter = o;
                }

                $.each(elements,
                    function (index, element) {
                        for (var i = element.attributes.length - 1; i >= 0; i--) {
                            var attrName = element.attributes[i].name;

                            if (!attrName.startsWith("c-model")) continue;

                            var propName = element.attributes[i].value;

                            if (setter[propName] === undefined) break;

                            if (element.value === undefined) {
                                $.jqModel.setText(element, setter[propName]);
                            } else {
                                $.jqModel.setValue(element, setter[propName]);
                            }

                            break;
                        }
                    });
            }
        }
    });
})(jQuery);