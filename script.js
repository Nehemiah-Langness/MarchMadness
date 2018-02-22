fa = (function () {
    var icon = function(className) {
        return "<i class='fas fa-" + className +"'></i>";
    }

    var $icon = function(className) {
        return $(icon(className));
    }

    return {
        new: icon,
        $new: $icon
    }
}());
