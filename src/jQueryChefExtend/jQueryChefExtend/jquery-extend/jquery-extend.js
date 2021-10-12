(function ($) {
    var _script = {
        load: function (src, place) {
            var dfd = $.Deferred();
            var scriptElement = document.createElement("script");

            scriptElement.type = "text/javascript";
            scriptElement.src = src;
            scriptElement.onload = function () {
                dfd.resolve();
            }

            $(place).append(scriptElement);

            return dfd.promise();
        }
    };

    $.extend({ script: _script });

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