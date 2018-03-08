fa = (function () {
    var icon = function (className) {
        return "<i class='fas fa-" + className + "'></i>";
    }

    var $icon = function (className) {
        return $(icon(className));
    }

    return {
        new: icon,
        $new: $icon
    }
}());

var linq = (function () {

    var max = function (array) {
        return array.reduce(function (current, next) {
            if (!current || next > current) return next;
            return current;
        });
    };

    var min = function (array) {
        return array.reduce(function (current, next) {
            if (!current || next < current) return next;
            return current;
        });
    };

    var selectMany = function (array, selectFunction) {
        var list = [];
        array.forEach(function (item) {
            selectFunction(item).forEach(function (innerItem) {
                list.push(innerItem);
            });
        });
        return list;
    }

    var mode = function (array) {
        var items = {};
        var modeItem = array[0];
        var max = 1;
        array.forEach(function (item) {
            if (items[item] == null)
                items[item] = 1;
            else
                items[item]++;

            if (items[item] > max) {
                modeItem = item;
                max = items[item];
            }
        });

        return {
            item: modeItem,
            count: array.length,
            occurances: max
        };
    }

    return {
        max: max,
        min: min,
        selectMany: selectMany,
        mode: mode
    }
}());

Array.prototype.max = function () {
    return linq.max(this);
};

Array.prototype.min = function () {
    return linq.min(this);
};

Array.prototype.mode = function () {
    return linq.mode(this);
};

Array.prototype.selectMany = function (selectFunction) {
    return linq.selectMany(this, selectFunction);
}; 
