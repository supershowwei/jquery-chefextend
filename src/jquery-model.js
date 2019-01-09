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
            getValue: function ($element) {
                if ($element.is(":radio")) return $("input[type='radio'][name='" + $element.attr("name") + "']:checked").val();

                if ($element.is(":checkbox")) return $element.prop("checked");

                return $element.val();
            },
            setValue: function ($element, value) {
                if ($element.is(":radio")) {
                    $("input[type='radio'][name='" + $element.attr("name") + "'][value='" + value + "']").prop("checked", true);
                } else if ($element.is(":checkbox")) {
                    $element.prop("checked", value);
                } else {
                    $element.val(value);
                }
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
                        var $element = $(element);

                        if (!$element.is(":input")) return;

                        for (var i = element.attributes.length - 1; i >= 0; i--) {
                            var attr = element.attributes[i];

                            if (!attr.name.startsWith("c-model")) continue;

                            if (attr.name === "c-model") {
                                obj[attr.value] = $.jqModel.getValue($element);
                            } else if (attr.name === "c-model-number") {
                                obj[attr.value] = $.jqModel.toNumber($.jqModel.getValue($element));
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
                            var attr = element.attributes[i];

                            if (!attr.name.startsWith("c-model")) continue;

                            if (setter[attr.value] === undefined) break;

                            var $element = $(element);

                            if ($element.is(":input")) {
                                $.jqModel.setValue($element, setter[attr.value]);
                            } else {
                                $element.text(setter[attr.value]);
                            }

                            break;
                        }
                    });
            }
        }
    });
})(jQuery);