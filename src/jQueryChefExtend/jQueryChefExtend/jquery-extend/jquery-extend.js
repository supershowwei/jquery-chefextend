(function ($) {
    var _script = {
        load: function (src) {
            var dfd = $.Deferred();

            $.ajax({
                url: src,
                dataType: "script",
                cache: true,
                success: dfd.resolve
            });

            return dfd.promise();
        }
    };

    var _stylesheet = {
        load: function (src) {
            var dfd = $.Deferred();

            $("<link>")
                .attr({ rel: "stylesheet", type: "text/css", href: src })
                .one("load", dfd.resolve)
                .appendTo("head");

            return dfd.promise();
        }
    };

    $.extend({ script: _script });
    $.extend({ stylesheet: _stylesheet });

    $.fn.extend({
        display: function (show) {
            return show === false ? this.hide() : this.show();
        },
        visible: function (show) {
            return show === false ? this.css("visibility", "hidden") : this.css("visibility", "");
        },
        invisible: function () {
            return this.css("visibility", "hidden");
        },
        toggleVisibility: function () {
            return this.css("visibility", function (index, visibility) {
                return (visibility === "hidden") ? "" : "hidden";
            });
        },
        disable: function () {
            return this.prop("disabled", true);
        },
        enable: function (active) {
            return active === false ? this.prop("disabled", true) : this.prop("disabled", false);
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
        },
        template: function (selector) {
            const $template = $(this.html());

            if (selector) {
                const $filtered = $template.filter(selector);

                if ($filtered.length) return $filtered;

                return $template.find(selector);
            }

            return $template;
        }
    });
})(jQuery);