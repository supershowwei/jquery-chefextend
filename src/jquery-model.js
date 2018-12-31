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

                if ($element.is(":radio")) {
                    return $("input[type='radio'][name='" + element.name + "']:checked").val();
                } else {
                    return $element.val();
                }
            },
            setValue: function (element, value) {
                var $element = $(element);

                if ($element.is(":radio")) {
                    $("input[type='radio'][name='" + element.name + "'][value='" + value + "']").prop("checked", true);
                } else if ($element.is(":checkbox")) {
                    $element.prop("checked", value);
                } else {
                    element.value === undefined ? $element.text(value) : $element.val(value);
                }
            },
            getText: function (element) {
                return $(element).text();
            },
            setText: function (element, text) {
                $(element).text(text);
            },
            getChecked: function (element) {
                return $(element).prop("checked");
            },
            setChecked: function (element, checked) {
                $(element).prop("checked", checked);
            },
            toNumber: function (value) {
                return isNaN(value) ? undefined : Number(value);
            }
        }
    });

    $.fn.extend({
        model: function (setter, value) {
            var elements = this.find(":attrStartsWith('c-')");

            if (elements.length === 0) return undefined;

            if (!setter) {
                var obj = {};

                $.each(elements,
                    function (index, element) {
                        for (var i = 0; i < element.attributes.length; i++) {
                            var attrName = element.attributes[i].name;

                            if (!attrName.startsWith("c-")) continue;

                            var propName = element.attributes[i].value;

                            if (attrName === "c-value") {
                                obj[propName] = $.jqModel.getValue(element);
                            } else if (attrName === "c-value-number") {
                                obj[propName] = $.jqModel.toNumber($.jqModel.getValue(element));
                            } else if (attrName === "c-text") {
                                obj[propName] = $.jqModel.getText(element);
                            } else if (attrName === "c-text-number") {
                                obj[propName] = $.jqModel.toNumber($.jqModel.getText(element));
                            } else if (attrName === "c-checked") {
                                obj[propName] = $.jqModel.getChecked(element);
                            }
                        }
                    });

                return obj;
            } else {
                if (value !== undefined) setter = { [setter]: value };

                $.each(elements,
                    function (index, element) {
                        for (var i = 0; i < element.attributes.length; i++) {
                            var attrName = element.attributes[i].name;

                            if (!attrName.startsWith("c-")) continue;

                            var propName = element.attributes[i].value;

                            if (setter[propName] === undefined) continue;

                            if (attrName === "c-value" || attrName === "c-value-number") {
                                $.jqModel.setValue(element, setter[propName]);
                            } else if (attrName === "c-text" || attrName === "c-text-number") {
                                $.jqModel.setText(element, setter[propName])
                            } else if (attrName === "c-checked") {
                                $.jqModel.setChecked(element, setter[propName]);
                            }
                        }
                    });
            }
        }
    });
})(jQuery);