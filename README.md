# jquery-chefextend

### jquery-model

- `$(...).model()`：萃取出物件
- `$(...).model({...})`：將物件資料回寫到 Element 上

#### 支援的屬性

##### `c-value`、`c-value-number`

c-value 的值會成為輸出物件的屬性名稱，該元件的 val() 會成為屬性值，若 val() 為數字，則使用 c-value-number。

![](https://i.imgur.com/7GMYAUl.png)

![](https://i.imgur.com/PRKhNBy.png)

radio 元件必須用 name 屬性，將相關的 radio 元件弄成一組，而 c-value（c-value-number）只要群組中一個成員有設定就行了。

![](https://i.imgur.com/Xi9f2OG.png)

![](https://i.imgur.com/KNghZ9v.png)

##### `c-text`、`c-text-number`

與 c-value 及 c-value-number 相同，但對應的是該元件的 text()，不支援 radio 元件。

##### `c-checked`

c-checked 的值會成為輸出物件的屬性名稱，該元件的 checked 會成為屬性值，僅支援 checkbox 元件。