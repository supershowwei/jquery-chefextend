# jquery-http

簡化呼叫 $.ajax 的程式碼，至少可以少打 20 個英文字母，然後每個方法都有多載一個 `settings` 參數，可以額外傳入其他 $.ajax 可接受的設定。

### get

    $.http.get("url" [, settings]);

### post

    $.http.post("url", data [, settings]);

### post（Form）

    var formData = new FormData();
    
    // append values ...
    
    $.http.post("url", formData [, settings]);

### put

    $.http.put("url", data [, settings]);

### patch

    $.http.patch("url", data [, settings]);

### delete

    $.http.delete("url" [, settings]);

### beforeSend

類似 $.ajax 的 beforeSend，必須串接在第一個呼叫。

    $.http.beforeSend(function () {
        // do something before send.
    })...;

### done、fail、always

$.http 的 HTTP 方法回傳的是 jqXHR 物件，因此可以直接串 done、fail、always 方法。

    $.http
        .get("url")
        .done(function (data, textStatus, jqXHR) {
            // do something when done.
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // do something when fail.
        })
        .always(function (data|jqXHR, textStatus, jqXHR|errorThrown) {
            // always do something.
        });

### CDN

https://cdn-softkitchen.azureedge.net/jquery-http/lastest/jquery-http.min.js
