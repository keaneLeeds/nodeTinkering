var top = {};
top.middle = {};
top.middle.bottom = {};
var whole = top.middle.bottom;

whole.action = function() {
    console.dir(top);
}

whole.action();
