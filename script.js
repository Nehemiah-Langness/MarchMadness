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

    var mode = function (array, order) {
        var items = {};
        var modeItem = array[0];
        var max = 0;
        array.forEach(function (item) {
            if (!items[item])
                items[item] = 1;
            else
                items[item]++;

            if (items[item] > max) {
                modeItem = item;
                max = items[item];
            }
        });

        if (order && order !== 0){
            var keys = Object.keys(items)
            var item = keys.map(function (prop){ return { item: prop, count: items[prop] }}).sort(function(pair){return pair.count}).reverse()[Math.min(keys.length - 1, order)];

            return {
                item: item.item,
                count: array.length,
                occurances: item.count
            };
        }

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

Array.prototype.mode = function (order) {
    return linq.mode(this, order);
};

Array.prototype.selectMany = function (selectFunction) {
    return linq.selectMany(this, selectFunction);
}; 
