(function ($) {
    var _script = {
        load: function (src) {
            var dfd = $.Deferred();

            var script = document.createElement("script");

            script.src = src;
            script.onload = dfd.resolve;

            document.body.appendChild(script);

            return dfd.promise();
        }
    };

    var _stylesheet = {
        load: function (src) {
            var dfd = $.Deferred();

            var link = document.createElement("link");

            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = src;
            link.onload = dfd.resolve;

            document.head.appendChild(link);

            return dfd.promise();
        }
    };

    $.extend({ script: _script });
    $.extend({ stylesheet: _stylesheet });

    $.fn.extend({
        visible: function () {
            return this.css("visibility", "");
        },
        invisible: function () {
            return this.css("visibility", "hidden");
        },
        disable: function () {
            return this.prop("disabled", true);
        },
        enable: function (active) {
            return active === false ? this.prop("disabled", true) : this.prop("disabled", false);
        }
    });
})(jQuery);