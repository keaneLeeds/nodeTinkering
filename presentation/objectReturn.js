function foo() {
    var heratio = "i am a dead jester";

    function bar(input) {
        console.log(input);
    }

    return {
        print : function(input) {
            bar(input);
        },
        iKnewHim : function() {
            bar(heratio);
        }
    }
};

var baz = foo();
baz.print("An infinite number of monkeys parsing the digits of PI will somewhere find an complete encoding of the works of Shakesphere.");
baz.iKnewHim();
baz.bar("Stack Trace");
