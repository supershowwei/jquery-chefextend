# jquery-chefextend

### jquery-model

- `$(...).model()`：萃取出物件
- `$(...).model({...})`：將物件資料回寫到 Element 上
- `$(...).model("property", value)`：將單一屬性資料回寫到 Element 上

#### `c-model`、`c-model-number`

c-model 的值會成為輸出物件的屬性名稱，該元件的 val() 會成為屬性值，若 val() 為數字，則使用 c-model-number。

![](https://i.imgur.com/dVBVWLr.png)

![](https://i.imgur.com/YrFErA2.png)

radio 元件必須用 name 屬性，將相關的 radio 元件弄成一組，而 c-model（c-model-number）只要群組中一個成員有設定就行了。

![](https://i.imgur.com/Md1piJY.png)

![](https://i.imgur.com/5uE2HND.png)

checkbox 元件僅支援 boolean 屬性

![](https://i.imgur.com/rL7jecb.png)

![](https://i.imgur.com/dY3R5MV.png)