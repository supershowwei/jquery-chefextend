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
                return (visibility === "hidden") ? "" : "visible";
            });
        },
        disable: function () {
            return this.prop("disabled", true);
        },
        enable: function () {
            return this.prop("disabled", false);
        },
        toggleActivity: function () {
            return this.prop("disabled", function (index, activity) {
                return activity ? false : true;
            });
        },
        selected: function () {
            return this.prop("selected", true);
        },
        unselected: function () {
            return this.prop("selected", false);
        },
        toggleSelectivity: function () {
            return this.prop("selected", function (index, selectivity) {
                return selectivity ? false : true;
            });
        }
    });
})(jQuery);