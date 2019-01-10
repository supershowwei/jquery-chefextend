# jquery-model

任何 jQuery Element 都可以透過下列步驟進行`輸出 JSON 物件`、`回寫 JSON 物件到 HTML 元件上`。

- `$(...).model()`：輸出 JSON 物件
- `$(...).model({...})`：將 JSON 物件回寫到 HTML 元件上
- `$(...).model("property", value)`：將單一 property 及其值回寫到 HTML 元件上

## 使用說明

首先在 HTML 元件上添加 `c-model` attribute，attribute 的值則指定 JSON 物件的 property 名稱，如果 property 的型態是數值則使用 `c-model-number`，這邊有幾點注意事項：

1. `radio` 群必須指定 `name` attribute
2. radio 群僅需要在其中一個元件上添加 `c-model` 或 `c-model-number` attribute
3. `checkbox` 僅支援 `boolean` 型態的 property
4. 非 `:input` 元件無法輸出 JSON 資料，但是可以賦值。
5. 儘量將 c-model 或 c-model-number 放在最後面
6. 在想要輸出 JSON 物件的 HTML 元件範圍內，不要重覆 property 名稱。

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

以上述 HTML 內容為例，想要輸出 JSON 物件的程式碼就這樣寫：

```
$("#formDiv").model();
```

而想要將 JSON 物件回寫到 HTML 元件上，程式碼就這樣寫：

```
$("#formDiv").model({ abcText: "aaa111" });

--or--

$("#formDiv").model("abcText", "aaa111");
```
