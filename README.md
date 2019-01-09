## jquery-model

- `$(...).model()`：萃取出物件
- `$(...).model({...})`：將物件資料回寫到 Element 上
- `$(...).model("property", value)`：將單一屬性資料回寫到 Element 上

#### 為 HTML 元素添加 `c-model`、`c-model-number` 屬性

```html
<div id="formDiv">
    <h1>formDiv</h1>
    <div><input type="text" c-model="abcText"></div>
    <div><input type="text" c-model-number="abcNumber"></div>
    <div>
        <select c-model="bbb">
            <option value="2">2</option>
            <option value="b">b</option>
            <option value="b2">b2</option>
        </select>
        <select c-model-number="ccc">
            <option value="3">3</option>
            <option value="33">33</option>
            <option value="333">333</option>
        </select>
    </div>
    <div>
        <input type="radio" name="kkk" value="1" c-model="k3" />1
        <input type="radio" name="kkk" value="a" />a
        <input type="radio" name="kkk" value="a1" />a1
    </div>
    <div>
        <input type="radio" name="lll" value="4" c-model-number="l3" />4
        <input type="radio" name="lll" value="44" />44
        <input type="radio" name="lll" value="444" />444
    </div>
    <div>
        <input type="checkbox" c-model="e5" />e5
        <input type="checkbox" c-model="f5" />f5
    </div>
    <div><textarea c-model="lastText"></textarea></div>
    <div c-model="lastText"></div>
    <div c-model="abcText"></div>
</div>
```

#### 輸出 JSON 物件：

```
$("#formDiv").model();
```

#### 為 HTML 元素賦值：

```
$("#formDiv").model({ abcText: "aaa111" });
--or--
$("#formDiv").model("abcText", "aaa111");
```

#### 注意事項

1. checkbox 元素僅支援 boolean 型態
2. 非 :input 元素無法輸出 JSON 資料，但是可以賦值。
