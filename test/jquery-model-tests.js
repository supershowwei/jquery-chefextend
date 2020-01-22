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

        expect($container.find("a[c-model-dazzle]").attr("href")).toBe("https://dotblogs.com.tw/supershowwei");
        expect($container.find("a[c-model-dazzle]").text()).toBe("軟體主廚的程式料理廚房");
        expect(model.url).toBeUndefined();
        expect(model.text).toBeUndefined();
    });

    it("Test_Dazzle_Syntax_can_Set_Single_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ url: "https://dotblogs.com.tw/supershowwei" });

        var model = $container.model();

        expect($container.find("a[c-model-dazzle]").attr("href")).toBe("https://dotblogs.com.tw/supershowwei");
        expect(model.url).toBeUndefined();
    });

    it("Test_Dazzle_Syntax_can_Set_and_Get_Text_and_Number_value", function () {
        var $container = $("#" + jasmine.currentTest.description);

        $container.model({ id: 1, name: "Johnny", style: "font-size: 20pt;" });

        var model = $container.model();

        expect(model.id).toBe(1);
        expect(model.name).toBe("Johnny");
        expect($container.find("input[c-model-dazzle*='style']").attr("style")).toBe("font-size: 20pt;");
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
        expect($container.find("input[c-model-dazzle*='nameStyle']").attr("style"), "font-size: 20pt;");
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
});