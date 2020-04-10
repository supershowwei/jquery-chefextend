(function ($) {
    $.fn.extend({
        visible: function () {
            return this.css("visibility", "");
        },
        invisible: function () {
            return this.css("visibility", "hidden");
        },
        toggleVisibility: function () {
            return this.css("visibility", function(index, visibility) {
                return (visibility === "hidden") ? "" : "hidden";
            });
        },
        disable: function () {
            return this.prop("disabled", true);
        },
        enable: function () {
            return this.prop("disabled", false);
        },
        toggleDisabled: function () {
            return this.prop("disabled", function (index, disabled) {
                return disabled ? false : true;
            });
        },
        selected: function () {
            return this.prop("selected", true);
        },
        unselected: function () {
            return this.prop("selected", false);
        },
        toggleSelected: function () {
            return this.prop("selected", function (index, selected) {
                return selected ? false : true;
            });
        }
    });
})(jQuery);