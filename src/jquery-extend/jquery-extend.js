(function ($) {
    $.fn.extend({
        visible: function () {
            return this.css("visibility", "visible");
        },
        invisible: function () {
            return this.css("visibility", "hidden");
        },
        toggleVisibility: function () {
            return this.css("visibility", function(index, visibility) {
                return (visibility == "visible") ? "hidden" : "visible";
            });
        },
        disable: function () {
            return this.prop("disabled", true);
        },
        enable: function () {
            return this.prop("disabled", false);
        }
    });
})(jQuery);