## jquery-chefextend

### jquery-model

- `$(...).model()`：萃取出物件
- `$(...).model({...})`：將物件資料回寫到 Element 上

加上 `data-prop` 屬性，並指定一個字串值，該字串值會成為輸出物件的屬性名稱，若要解析數字，則使用 `data-prop-number`。

![](https://i.imgur.com/NcLkMaU.png)

![](https://i.imgur.com/oMmiVyM.png)

`<input type="radio" />` 必須用 `name` 屬性，將相關的 radio 弄成一組，而 data-prop（data-prop-number）只要群組中一個成員有設定就行了。

![](https://i.imgur.com/emEYkQL.png)

`<input type="checkbox" />` 僅支援輸出／輸入 boolean 型別

![](https://i.imgur.com/CY5IIKp.png)

![](https://i.imgur.com/dNbSJvJ.png)