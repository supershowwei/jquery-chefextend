if (!Number.prototype.toThousandth) {
    Number.prototype.toThousandth = function (decimals) {
        if (decimals === undefined) decimals = 0;

        return this.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
}

if (!Number.prototype.toPercent) {
    Number.prototype.toPercent = function (decimals) {
        return this.toLocaleString("en-US", { style: "percent", minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
}

if (!Array.prototype.contains) {
    Array.prototype.contains = function (func, thisArg) {
        const self = this;
        const len = self.length;
        let i = -1;

        if (thisArg === undefined) {
            while (++i !== len) {
                if (i in self) {
                    if (func(self[i], i, self)) {
                        return true;
                    }
                }
            }
        } else {
            while (++i !== len) {
                if (i in self) {
                    if (func.call(thisArg, self[i], i, self)) {
                        return true;
                    }
                }
            }
        }

        return false;
    };
}

window.append_prefix = function (body, arg1, arg2) {

    if (!arg1) return body;
    if (!arg2) return arg1 + body;

    return arg2 + arg1 + body;

}

window.append_suffix = function (body, arg1, arg2) {

    if (!arg1) return body;
    if (!arg2) return body + arg1;

    return body + arg1 + arg2;

}

window.default = function (self, value) {
    // use '==' for null
    return self == undefined ? value : self;
}

$("#formDiv").model({ abcText: "abc", abcNumber: 0.123456789, defNumber: 0.123456789, ghiHtml: "<h1>ghi</h1>" });

window.add = function () {
    const args = [...arguments];

    return args[0] + args.slice(1).reduce((sum, num) => sum + num);
}

window.add1 = function (value) {
    return value + 1;
}

window.fixedSuffix = function (value) {
    return value + "/abctest";
}

window.suffix = function (value, tail) {
    return value + tail;
}

window.upDnSign = function (value) {
    return value > 0 ? "▲" : value < 0 ? "▼" : "";
}

window.getId = function (value) {
    return value.id;
}

jasmine.getEnv().addReporter({
    specStarted: function (result) {
        jasmine.currentTest = result;
    }
});

describe("jquery-model test cases", function () {
    it("Test_TextInput_can_Set_and_Get_Text_and_Number_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1, name: "Johnny" });

        var model = $container.model();

        expect(model.id).toBe(1);
        expect(model.name).toBe("Johnny");
    });

    it("Test_TextInput_can_Get_Text_and_Number_value_with_Comma", function () {
        var $container = $("#" + jasmine.currentTest.description);

        var model = $container.model();

        expect(model.id).toBe(1000);
        expect(model.name).toBe("Johnny");
    });

    it("Test_Contenteditable_can_Set_and_Get_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1, name: "Johnny" });

        var model = $container.model();

        expect(model.id).toBe(1);
        expect(model.name).toBe("Johnny");
    });

    it("Test_Contenteditable_can_Get_value_with_Comma", function () {
        var $container = $("#" + jasmine.currentTest.description);

        var model = $container.model();

        expect(model.id).toBe(1000);
        expect(model.name).toBe("Johnny");
    });

    it("Test_Contenteditable_can_Set_and_Get_value_with_Filter", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1, name: "Johnny" });

        var model = $container.model();

        expect(model.id).toBe(1);
        expect(model.name).toBe("Johnny");
    });

    it("Test_Contenteditable_can_Set_and_Get_value_with_Filter_and_Comma", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1000, name: "Johnny" });

        var model = $container.model();

        expect(model.id).toBe(1000);
        expect(model.name).toBe("Johnny");
    });

    it("Test_Contenteditable_can_Set_and_Get_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 2, name: "Mary", age: 23 });

        var model = $container.model();

        expect(model.id).toBe(2);
        expect(model.name).toBe("name=Mary");
        expect(model.age).toBe("age=23");
    });

    it("Test_Set_Model_Values_use_KeyValue", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model("id", 1);
        $container.model("name", "Johnny");

        var model = $container.model();

        expect(model.id).toBe(1);
        expect(model.name).toBe("Johnny");
    });

    it("Test_Radio_can_Set_and_Get_Text_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ timePeriod: "noon" });

        var model = $container.model();

        expect(model.timePeriod).toBe("noon");
    });

    it("Test_Radio_can_Set_and_Get_Number_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ amount: 3 });

        var model = $container.model();

        expect(model.amount).toBe(3);
    });

    it("Test_Radio_can_Set_empty_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ timePeriod: "noon" });

        var model = $container.model();

        expect(model.timePeriod).toBe("noon");

        $container.model({ timePeriod: "" });

        model = $container.model();

        expect(model.timePeriod).toBe(undefined);
    });

    it("Test_Checkbox_can_Set_and_Get_without_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ creamer: false, sugar: true, cinnamonPowder: true });

        var model = $container.model();

        expect(model.creamer).toBeFalse();
        expect(model.sugar).toBeTrue();
        expect(model.cinnamonPowder).toBeTrue();
    });

    it("Test_Checkbox_can_Set_and_Get_Number_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ answer1: 1, answer2: 2 });

        var model = $container.model();

        expect(model.answer1).toBe(1);
        expect(model.answer2).toBe(2);
        expect(model.answer3).toBeUndefined();
    });

    it("Test_Checkbox_can_Set_and_Get_Text_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ answer2: "B", answer3: "C" });

        var model = $container.model();

        expect(model.answer1).toBeUndefined();
        expect(model.answer2).toBe("B");
        expect(model.answer3).toBe("C");
    });

    it("Test_Select_can_Set_and_Get_Text_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ drink: "coffee" });

        var model = $container.model();

        expect(model.drink).toBe("coffee");
    });

    it("Test_Select_can_Set_and_Get_Number_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ answer: 2 });

        var model = $container.model();

        expect(model.answer).toBe(2);
    });

    it("Test_Textarea_can_Set_and_Get_Text_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ content: "An argyle (occasionally argyll) pattern is made of diamonds or lozenges." });

        var model = $container.model();

        expect(model.content).toBe("An argyle (occasionally argyll) pattern is made of diamonds or lozenges.");
    });

    it("Test_NonInput_can_Set_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1, name: "Johnny" });

        var model = $container.model();

        expect($container.find("span[c-model-number='id']").text()).toBe("1");
        expect($container.find("span[c-model='name']").text()).toBe("Johnny");
        expect(model.id).toBeUndefined();
        expect(model.name).toBeUndefined();
    });

    it("Test_NonInput_can_Set_HtmlContent", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ html: "<span>test</span>" });

        var model = $container.model();

        expect($container.find("div[c-model='html']").text()).toBe("<span>test</span>");
        expect($container.find("div[c-model-html='html']").text()).toBe("test");
        expect(model.id).toBeUndefined();
        expect(model.name).toBeUndefined();
    });

    it("Test_NonInput_can_Set_value_use_Getter_Function", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({
            id: 1,
            firstName: "Johnny",
            lastName: "Chuang",
            get fullName() {
                return this.firstName + ", " + this.lastName;
            }
        });

        var model = $container.model();

        expect($container.find("span[c-model='firstName']").text()).toBe("Johnny");
        expect($container.find("span[c-model='lastName']").text()).toBe("Chuang");
        expect($container.find("span[c-model='fullName']").text()).toBe("Johnny, Chuang");
        expect(model.id).toBeUndefined();
        expect(model.firstName).toBeUndefined();
        expect(model.lastName).toBeUndefined();
        expect(model.fullName).toBeUndefined();
    });

    it("Test_Dazzle_Syntax_can_Set_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ url: "https://dotblogs.com.tw/supershowwei", text: "軟體主廚的程式料理廚房" });

        var model = $container.model();

        expect($container.find("a[c-model]").attr("href")).toBe("https://dotblogs.com.tw/supershowwei");
        expect($container.find("a[c-model]").text()).toBe("軟體主廚的程式料理廚房");
        expect(model.url).toBeUndefined();
        expect(model.text).toBeUndefined();
    });

    it("Test_Dazzle_Syntax_can_Set_Single_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ url: "https://dotblogs.com.tw/supershowwei" });

        var model = $container.model();

        expect($container.find("a[c-model]").attr("href")).toBe("https://dotblogs.com.tw/supershowwei");
        expect(model.url).toBeUndefined();
    });

    it("Test_Dazzle_Syntax_can_Set_and_Get_Text_and_Number_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1, name: "Johnny", style: "font-size: 20pt;" });

        var model = $container.model();

        expect(model.id).toBe(1);
        expect(model.name).toBe("Johnny");
        expect($container.find("input[c-model*='style']").attr("style")).toBe("font-size: 20pt;");
    });

    it("Test_TextInput_can_Set_and_Get_NestedObject_Text_and_Number_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ member: { id: 1, name: "Johnny", address: { value: "my address" } } });

        var model = $container.model();

        expect(model.member.id).toBe(1);
        expect(model.member.name).toBe("Johnny");
        expect(model.member.address.value).toBe("my address");
    });

    it("Test_TextInput_can_Set_and_Get_NestedObject_Text_and_Number_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ member: { id: 1, name: "Johnny", nameStyle: "font-size: 20pt;", address: { value: "my address" } } });

        var model = $container.model();

        expect(model.member.id).toBe(1);
        expect(model.member.name).toBe("Johnny");
        expect(model.member.address.value).toBe("my address");
        expect($container.find("input[c-model*='nameStyle']").attr("style"), "font-size: 20pt;");
    });

    it("Test_Radio_can_Set_and_Get_Text_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ timePeriod: "noon" });

        var model = $container.model();

        expect(model.timePeriod).toBe("noon");
    });

    it("Test_Radio_can_Set_and_Get_Number_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ amount: 3 });

        var model = $container.model();

        expect(model.amount).toBe(3);
    });

    it("Test_Checkbox_can_Set_and_Get_without_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ creamer: false, sugar: true, cinnamonPowder: true });

        var model = $container.model();

        expect(model.creamer).toBeFalse();
        expect(model.sugar).toBeTrue();
        expect(model.cinnamonPowder).toBeTrue();
    });

    it("Test_Checkbox_can_Set_and_Get_Number_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ answer1: 1, answer2: 2 });

        var model = $container.model();

        expect(model.answer1).toBe(1);
        expect(model.answer2).toBe(2);
        expect(model.answer3).toBeUndefined();
    });

    it("Test_Checkbox_can_Set_and_Get_Text_values_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ answer2: "B", answer3: "C" });

        var model = $container.model();

        expect(model.answer1).toBeUndefined();
        expect(model.answer2).toBe("B");
        expect(model.answer3).toBe("C");
    });

    it("Test_Select_can_Set_and_Get_Text_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ drink: "coffee" });

        var model = $container.model();

        expect(model.drink).toBe("coffee");
    });

    it("Test_Select_can_Set_and_Get_Number_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ answer: 2 });

        var model = $container.model();

        expect(model.answer).toBe(2);
    });

    it("Test_can_Set_Models_to_Select_Options_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.find("select").models([{ no: 1, drink: "Coffee" }, { no: 2, drink: "Tea" }, { no: 3, drink: "Me" }], $container.find("select").children().first().remove().show());
        $container.model({ drinkNo: 2 });

        $container.find("select").children().each(function (index, optionElement) {
            $option = $(optionElement);

            expect(["1", "2", "3"]).toContain($option.attr("value"));
            expect(["Coffee", "Tea", "Me"]).toContain($option.text());
        });

        var model = $container.model();

        expect(model.drinkNo).toBe(2);
    });

    it("Test_Textarea_can_Set_and_Get_Text_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ content: "An argyle (occasionally argyll) pattern is made of diamonds or lozenges." });

        var model = $container.model();

        expect(model.content).toBe("An argyle (occasionally argyll) pattern is made of diamonds or lozenges.");
    });

    it("Test_AfterSet_should_works", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1, name: "Johnny" }, function ($self, setter) {
            $self.append($("<p>").text("after set"));
        });

        expect($container.find("p").text()).toBe("after set");
    });

    it("Test_AfterSet_and_BeforeSet_should_work", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1, name: "Johnny" }, {
            beforeSet: function ($self, setter) {
                $self.append($("<p id=\"before\">").text("before set"));
            }, afterSet: function ($self, setter) {
                $self.append($("<p id=\"after\">").text("after set"));
            }
        });

        expect($container.find("#before").text()).toBe("before set");
        expect($container.find("#after").text()).toBe("after set");
    });

    it("Test_Create_Elements_by_Models", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.find(".container").models([{ id: 1, name: "Johnny" }, { id: 2, name: "Tom" }], $container.find(".container > div").first().remove().show());

        expect($container.find(".container > div").length).toBe(2);
    });

    it("Test_Create_Elements_by_Models_using_Template_Function", function () {
        var $container = $("#" + jasmine.currentTest.description);

        var $template = $container.find(".container > div").first().remove().show();

        $container.find(".container").models([{ id: 1, name: "Johnny" }, { id: 2, name: "Tom" }], function (element) { return $template; });

        expect($container.find(".container > div").length).toBe(2);
    });

    it("Test_Set_and_Get_Models_value_with_AfterSet", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.find(".container").models([{ id: 1, name: "Johnny" }, { id: 2, name: "Tom" }], $container.find(".container > div").first().remove(), function ($self, setter) {
            $self.show();
        });

        $container.find(".container > div").models([{ id: 1, name: "Johnny1" }, { id: 2, name: "Tom2" }], "id");

        var models = $container.find(".container > div").models();

        expect($container.find(".container > div").length).toBe(2);
        expect($container.find(".container > div:visible").length).toBe(2);
        expect(models[0].id).toBe(1);
        expect(models[0].name).toBe("Johnny1");
        expect(models[1].id).toBe(2);
        expect(models[1].name).toBe("Tom2");
    });

    it("Test_Set_and_Get_Models_value_with_AfterSet_and_BeforeSet", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.find(".container").models([{ id: 1, name: "Johnny" }, { id: 2, name: "Tom" }], $container.find(".container > div").first().remove(), {
            beforeSet: function ($self, setter) {
                $self.append($("<p class=\"before\">").text("before set"));
            },
            afterSet: function ($self, setter) {
                $self.show();
            }
        });

        $container.find(".container > div").models([{ id: 1, name: "Johnny1" }, { id: 2, name: "Tom2" }], "id");

        var models = $container.find(".container > div").models();

        expect($container.find(".before").length).toBe(2);
        expect($container.find(".container > div").length).toBe(2);
        expect($container.find(".container > div:visible").length).toBe(2);
        expect(models[0].id).toBe(1);
        expect(models[0].name).toBe("Johnny1");
        expect(models[1].id).toBe(2);
        expect(models[1].name).toBe("Tom2");
    });

    it("Test_Upsert_Models_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.find(".container").models([{ id: 1, name: "Johnny" }, { id: 2, name: "Tom" }], $container.find(".container > div").first().remove().show());

        var data = [{ id: 1, name: "Johnny1" }, { id: 2, name: "Tom2" }, { id: 3, name: "Pentel" }];

        $container.find(".container > div").models(data, "id");

        $container.find(".container").models(data.filter(function (dataItem) {
            return !$container.find(".container > div").models().contains(function (modelItem) {
                return modelItem.id === dataItem.id;
            })
        }), $container.find(".container > div").first());

        var models = $container.find(".container > div").models();

        expect($container.find(".container > div").length).toBe(3);
        expect($container.find(".container > div:visible").length).toBe(3);
        expect(models[0].id).toBe(1);
        expect(models[0].name).toBe("Johnny1");
        expect(models[1].id).toBe(2);
        expect(models[1].name).toBe("Tom2");
        expect(models[2].id).toBe(3);
        expect(models[2].name).toBe("Pentel");
    });

    it("Test_Create_Elements_by_Models_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.find(".container").models([{ id: 1, name: "Johnny" }, { id: 2, name: "Tom" }], $container.find(".container > div").first().remove().show());

        expect($container.find(".container > div").length).toBe(2);
    });

    it("Test_Set_and_Get_Models_value_with_AfterSet_and_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.find(".container").models([{ id: 1, name: "Johnny" }, { id: 2, name: "Tom" }], $container.find(".container > div").first().remove(), function ($self, setter) {
            $self.show();
        });

        $container.find(".container > div").models([{ id: 1, name: "Johnny1" }, { id: 2, name: "Tom2" }], "id");

        var models = $container.find(".container > div").models();

        expect($container.find(".container > div").length).toBe(2);
        expect($container.find(".container > div:visible").length).toBe(2);
        expect(models[0].id).toBe(1);
        expect(models[0].name).toBe("Johnny1");
        expect(models[1].id).toBe(2);
        expect(models[1].name).toBe("Tom2");
    });

    it("Test_Set_and_Get_Models_value_with_AfterSet_and_BeforeSet_and_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.find(".container").models([{ id: 1, name: "Johnny" }, { id: 2, name: "Tom" }], $container.find(".container > div").first().remove(), {
            beforeSet: function ($self, setter) {
                $self.append($("<p class=\"before\">").text("before set"));
            },
            afterSet: function ($self, setter) {
                $self.show();
            }
        });

        $container.find(".container > div").models([{ id: 1, name: "Johnny1" }, { id: 2, name: "Tom2" }], "id");

        var models = $container.find(".container > div").models();

        expect($container.find(".before").length).toBe(2);
        expect($container.find(".container > div").length).toBe(2);
        expect($container.find(".container > div:visible").length).toBe(2);
        expect(models[0].id).toBe(1);
        expect(models[0].name).toBe("Johnny1");
        expect(models[1].id).toBe(2);
        expect(models[1].name).toBe("Tom2");
    });

    it("Test_Root_Tag_Set_and_Get_Text_value_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1, name: "Johnny", style: "background-color: green;" });

        expect($container.attr("style")).toBe("background-color: green;");
    });

    it("Test_can_Set_Html_Content_use_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ description: "<span>test</span>" });

        expect($container.find("div").first().html()).toBe("<span>test</span>");
    });

    it("Test_Button_can_be_Container", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1 });

        var model = $container.model();

        expect(model.id).toBe(1);
        expect($container.find("i").first().text()).toBe("1");
    });

    it("Test_can_Create_Buttons", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.models([{ id: 1, name: 111 }, { id: 2, name: 222 }, { id: 3, name: 333 }], $container.find("button").remove());

        var models = $container.find("button").models();

        expect(models[0].id).toBe(1);
        expect(models[1].id).toBe(2);
        expect(models[2].id).toBe(3);
        expect($container.find("button:nth-child(1)").text()).toBe("111");
        expect($container.find("button:nth-child(2)").text()).toBe("222");
        expect($container.find("button:nth-child(3)").text()).toBe("333");
    });

    it("Test_can_Update_Models_when_KeyElement_in_Root", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.models([{ id: 1, name: 111 }, { id: 2, name: 222 }, { id: 3, name: 333 }], $container.find("button").remove());
        $container.find("button").models([{ id: 1, name: 1111 }, { id: 2, name: 2222 }, { id: 3, name: 3333 }], "id");

        var models = $container.find("button").models();

        expect(models[0].id).toBe(1);
        expect(models[1].id).toBe(2);
        expect(models[2].id).toBe(3);
        expect($container.find("button:nth-child(1)").text()).toBe("1111");
        expect($container.find("button:nth-child(2)").text()).toBe("2222");
        expect($container.find("button:nth-child(3)").text()).toBe("3333");
    });

    it("Test_can_Create_Buttons_with_i_Tag", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.models([
            { id: 1, name: 111, count: 11, get formattedCount() { return "(" + this.count + ")"; } },
            { id: 2, name: 222, count: 22, get formattedCount() { return "(" + this.count + ")"; } },
            { id: 3, name: 333, count: 33, get formattedCount() { return "(" + this.count + ")"; } }
        ], $container.find("button").remove());

        var models = $container.find("button").models();

        expect(models[0].id).toBe(1);
        expect(models[1].id).toBe(2);
        expect(models[2].id).toBe(3);
        expect($container.find("button:nth-child(1) span").first().text()).toBe("111");
        expect($container.find("button:nth-child(2) span").first().text()).toBe("222");
        expect($container.find("button:nth-child(3) span").first().text()).toBe("333");
        expect($container.find("button:nth-child(1) i").first().text()).toBe("(11)");
        expect($container.find("button:nth-child(2) i").first().text()).toBe("(22)");
        expect($container.find("button:nth-child(3) i").first().text()).toBe("(33)");
    });

    it("Test_can_not_be_Resolved_Value_without_Value_or_ValueNumber_using_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ value: 1, min: 1, max: 60, step: 1 });

        var model = $container.model();

        expect(model.value).toBe(1);
        expect(model.min).toBe(1);
        expect(model.max).toBe(60);
        expect(model.step).toBe(1);
    });

    it("Test_can_use_Literal_Template", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ path: "2020/01/20/083500" });

        expect($container.find("span").text()).toBe("https://dotblogs.com.tw/supershowwei/2020/01/20/083500");
    });

    it("Test_can_use_Literal_Template_with_Multiple_Properties_in_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ path: "2020/01/20/083500", title: "軟體主廚的程式料理廚房" });

        expect($container.find("span").text()).toBe("https://dotblogs.com.tw/supershowwei/2020/01/20/083500");
        expect($container.find("span").attr("title")).toBe("Good軟體主廚的程式料理廚房");
    });

    it("Test_can_use_Literal_Template_in_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ path: "2020/01/20/083500", title: "[創意料理] 單純對資料表簡單的 CRUD 讓 Chef.Extensions.DbAccess.SqlServer 來協助我們" });

        expect($container.find("a").attr("href")).toBe("https://dotblogs.com.tw/supershowwei/2020/01/20/083500");
        expect($container.find("a").attr("title")).toBe("[創意料理] 單純對資料表簡單的 CRUD 讓 Chef.Extensions.DbAccess.SqlServer 來協助我們");
    });

    it("Test_can_use_Literal_Template_with_Multiple_Terms_in_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ path: "2020/01/20/083500", title: "[創意料理] 單純對資料表簡單的 CRUD 讓 Chef.Extensions.DbAccess.SqlServer 來協助我們" });

        expect($container.find("a").attr("href")).toBe("https://dotblogs.com.tw/supershowwei/2020/01/20/083500/2020/01/20/083500");
        expect($container.find("a").attr("title")).toBe("[創意料理] 單純對資料表簡單的 CRUD 讓 Chef.Extensions.DbAccess.SqlServer 來協助我們");
    });

    it("Test_can_use_Literal_Template_with_Multiple_Terms_in_One_Property", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: "2330", name: "台積電" });

        expect($container.find("a").attr("href")).toBe("/stock/2330/news");
        expect($container.find("a").attr("title")).toBe("台積電(2330)最新消息");
    });

    it("Test_will_be_not_Set_Value_when_Undefined_of_Multiple_Terms", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({});

        expect($container.find("a").attr("href")).toBe(undefined);
    });

    it("Test_can_Set_Models_to_Select_Options_with_Dazzle", function () {
        var $container = $("#" + jasmine.currentTest.description);

        var sum = 0;
        var data = [
            { no: 1, drink: "Coffee" },
            { no: 2, drink: "Tea" },
            { no: 3, drink: "Me" }
        ];

        $container.find("select").models(
            data,
            $container.find("select").children().first().remove().show(),
            {
                beforeSet: function ($self, setter, index) {
                    sum += index;
                },
                afterSet: function ($self, setter, index) {
                    sum += index;
                }
            });

        expect(sum).toBe(6);
    });

    it("Test_Dazzle_Syntax_with_Literal_Template_and_Filters", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ url: "https://dotblogs.com.tw/supershowwei", no: 0.1 });

        expect($container.find("a[c-model]").attr("href")).toBe("https://dotblogs.com.tw/supershowwei");
        expect($container.find("a[c-model]").text()).toBe("軟體主廚的程式料理廚房的 110%");
    });

    it("Test_Dazzle_Syntax_with_Literal_Template_and_Filters_with_Arguments", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ url: "https://dotblogs.com.tw/supershowwei", no: 0.1 });

        expect($container.find("a[c-model]").attr("href")).toBe("https://dotblogs.com.tw/supershowwei");
        expect($container.find("a[c-model]").text()).toBe("軟體主廚的程式料理廚房的 610%");
    });

    it("Test_Dazzle_Syntax_with_Literal_Template_and_Filters_with_String_Arguments", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ obj: { url: "https://dotblogs.com.tw/supershowwei" }, no: 0.1 });

        expect($container.find("a[c-model]").attr("href")).toBe("https://dotblogs.com.tw/supershowwei/abctest");
        expect($container.find("a[c-model]").text()).toBe("軟體主廚的程式料理廚房的 610%");
    });

    it("Test_can_use_Filters", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ path: "2020/01/20/083500" });

        expect($container.find("span").text()).toBe("2020/01/20/083500/abctestabctest");
    });

    it("Test_can_Set_Property_with_Filters", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ obj: { path: "2020/01/20/083500" } });

        expect($container.find("span").text()).toBe("2020/01/20/083500/abctestabctest");
    });

    it("Test_can_use_Literal_Template_and_Filters", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ path: "2020/01/20/083500" });

        expect($container.find("span").text()).toBe("https://dotblogs.com.tw/supershowwei/2020/01/20/083500/abctestabctest");
    });

    it("Test_can_use_Prototype_Filter", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ no: 0.1 });

        expect($container.find("span").text()).toBe("10%");
    });

    it("Test_can_Set_Property_with_Prototype_Filter", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ obj: { no: 0.1 } });

        expect($container.find("span").text()).toBe("10%");
    });

    it("Test_can_use_Repeate_Value_with_Filter", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ change: 0.1 });

        expect($container.find("span").text()).toBe("▲0.1");
    });

    it("Test_can_use_Set_Undefined_Value_with_Filter", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({});

        expect($container.find("span").text()).toBe("No Change");
    });

    it("Test_can_use_Set_Value_with_Default_Filter", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ change: 0.1 });

        expect($container.find("span").text()).toBe("10%");
    });

    it("Test_There_Is_No_C_Model_Attribute", function () {
        var $container = $("#" + jasmine.currentTest.description);

        var model = $container.model();

        $container.model({ id: 1 }, function ($self, setter) {
            $self.find("span").text(setter.id);
        });

        expect(model).toBe(undefined);
        expect($container.find("span").text()).toBe("1");
    });

    it("Test_use_Whole_Object", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1 });

        expect($container.find("span").text()).toBe("1");
        expect($container.find("div").text()).toBe("1");
    });

    it("Test_show", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ abcText: "abc" });

        expect($container.find("span").text()).toBe("abc");
        expect($container.find("p").text()).toBe("abc");
        expect($container.find("span").css("display")).toBe("inline");
        expect($container.find("div").css("display")).toBe("block");
    });

    it("Test_hide", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ abcText: undefined });

        expect($container.find("span").text()).toBe("");
        expect($container.find("p").text()).toBe("");
        expect($container.find("span").css("display")).toBe("none");
        expect($container.find("div").css("display")).toBe("none");
    });

    it("Test_seen", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ abcText: "abc" });

        expect($container.find("span").text()).toBe("abc");
        expect($container.find("p").text()).toBe("abc");
        expect($container.find("span").css("visibility")).toBe("visible");
        expect($container.find("div").css("visibility")).toBe("visible");
    });

    it("Test_unseen", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ abcText: "" });

        expect($container.find("span").text()).toBe("");
        expect($container.find("p").text()).toBe("");
        expect($container.find("span").css("visibility")).toBe("hidden");
        expect($container.find("div").css("visibility")).toBe("hidden");
    });

    it("Test_enable_and_disable", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ abcText: "abc", defText: "def" });

        expect($container.find("button[abc]").prop("disabled")).toBe(false);
        expect($container.find("button[def]").prop("disabled")).toBe(true);
        expect($container.find("button[abc1]").prop("disabled")).toBe(false);
        expect($container.find("button[def1]").prop("disabled")).toBe(true);
        expect($container.find("button[abc2]").prop("disabled")).toBe(true);
        expect($container.find("button[def2]").prop("disabled")).toBe(false);
    });
});