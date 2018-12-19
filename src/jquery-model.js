(function ($) {
    $.extend({
        jqModel: {
            getValue: function (element) {
                var $element = $(element);

                if ($element.is(":radio")) {
                    return $("input[type='radio'][name='" + element.name + "']:checked").val();
                } else if ($element.is(":checkbox")) {
                    return $element.prop("checked");
                } else {
                    return element.value === undefined ? $element.text() : $element.val();
                }
            },
            setValue: function (element, value) {
                var $element = $(element);

                if($element.is(":radio")) {
                    $("input[type='radio'][name='" + element.name + "'][value='" + value + "']").prop("checked", true);
                } else if ($element.is(":checkbox")) {
                    $element.prop("checked", value);
                } else {
                    element.value === undefined ? $element.text(value) : $element.val(value);
                }
            },
            toNumber: function (value) {
                return isNaN(value) ? undefined : Number(value);
            }
        }
    });

    $.fn.extend({
        model: function (setter) {
            var numberType = "data-prop-number";

            var elements = this.find("[data-prop],[" + numberType + "]");

            if (elements.length === 0) return undefined;

            if (!setter) {
                var obj = {};

                $.each(elements,
                    function (index, element) {
                        if (element.dataset.propNumber) {
                            if (!obj.hasOwnProperty(element.dataset.propNumber)) {
                                obj[element.dataset.propNumber] = $.jqModel.toNumber($.jqModel.getValue(element));
                            }
                        } else {
                            if (!obj.hasOwnProperty(element.dataset.prop)) {
                                obj[element.dataset.prop] = $.jqModel.getValue(element);
                            }
                        }
                    });

                return obj;
            } else {
                $.each(Object.keys(setter),
                    function (index, key) {
                        var i;

                        for (i = 0; i < elements.length; i++) {
                            if (elements[i].dataset.propNumber === key) {
                                $.jqModel.setValue(elements[i], Number(setter[key]));
                                break;
                            } else if (elements[i].dataset.prop === key) {
                                $.jqModel.setValue(elements[i], setter[key]);
                                break;
                            }
                        }

                        if (i < elements.length) elements.splice(i, 1);
                    });
            }
        }
    });
})(jQuery);