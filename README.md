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

***上述的屬性都可以支援取值與賦值，下述的屬性僅支援賦值。***

##### `c-style`、`c-style-*`

c-style 的值為輸入物件的屬性名稱，屬性值會直接對該元件的 style 賦值，而 c-style-* 則是單一 css 樣式賦值。

![](https://i.imgur.com/2VBmITy.png)

![](https://i.imgur.com/4srjRtg.png)

##### `c-class`、`c-class-*`

c-class 的值為輸入物件的屬性名稱，屬性值會直接對該元件的 class 賦值，而 c-class-* 則是單一 class 名稱的增加或移除，c-class-* 僅支援 boolean 值。

![](https://i.imgur.com/kP8g48F.png)

![](https://i.imgur.com/jKfWPQr.png)
