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

var linq = (function () {

    var max = function(array){
        return array.reduce(function (current, next) {
            if (!current || next > current) return next;
            return current;
        });
    };

    var min = function(array){
        return array.reduce(function (current, next) {
            if (!current || next < current) return next;
            return current;
        });
    };

    return {
        max: max,
        min: min
    }
}());

var Reflection = function(item){
    var properties = [];

    for(var key in item)
        if (item.hasOwnProperty(key))
            properties.push({
                key: key, 
                value: item[key]
            });

    return properties;
}

Array.prototype.max = function() {
    return linq.max(this);
}; 

Array.prototype.min = function() {
    return linq.min(this);
}; 
