(function ($) {
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
                            obj[element.dataset.propNumber] = Number($(element).val());
                        } else {
                            obj[element.dataset.prop] = $(element).val();
                        }
                    });

                return obj;
            } else {
                $.each(Object.keys(setter),
                    function (index, key) {
                        var i;

                        for (i = 0; i < elements.length; i++) {
                            if (elements[i].dataset.propNumber === key) {
                                $(elements[i]).val(Number(setter[key]));
                                break;
                            } else if (elements[i].dataset.prop === key) {
                                $(elements[i]).val(setter[key]);
                                break;
                            }
                        }

                        if (i < elements.length) elements.splice(i, 1);
                    });
            }
        }
    });
})(jQuery);