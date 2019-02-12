(function ($) {
    $.fn.extend({
        disable: function () {
            this.attr("disabled", true);
        },
        enable: function () {
            this.attr("disabled", false);
        }
    });
})(jQuery);