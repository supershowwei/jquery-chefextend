(function ($) {
    $.fn.extend({
        model: function (setter) {
            var numberType = "data-prop-number";

            var props = this.find("[data-prop],[" + numberType + "]");

            if (props.length === 0) return undefined;

            if (!setter) {
                var obj = {};

                $.each(props,
                    function (index, prop) {
                        if (prop.dataset.propNumber) {
                            obj[prop.dataset.propNumber] = Number($(prop).val());
                        } else {
                            obj[prop.dataset.prop] = $(prop).val();
                        }
                    });

                return obj;
            } else {
                $.each(Object.keys(setter),
                    function (index, key) {
                        var i;

                        for (i = 0; i < props.length; i++) {
                            if (props[i].dataset.propNumber === key) {
                                $(props[i]).val(Number(setter[key]));
                                break;
                            } else if (props[i].dataset.prop === key) {
                                $(props[i]).val(setter[key]);
                                break;
                            }
                        }

                        if (i < props.length) props.splice(i, 1);
                    });
            }
        }
    });
})(jQuery);