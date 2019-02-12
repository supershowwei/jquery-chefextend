(function ($) {
    $.fn.extend({
        disable: function () {
            this.prop("disabled", true);
        },
        enable: function () {
            this.prop("disabled", false);
        }
    });
})(jQuery);