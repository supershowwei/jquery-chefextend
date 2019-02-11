# jquery-http

簡化呼叫 $.ajax 的程式碼，至少可以少打 20 個英文字母。

### get

    $.http.get("url");

### post

    $.http.post("url", data);

### postForm

    var formData = new FormData();
    // ...
    $.http.postForm("url", formData);

### put

    $.http.put("url", data);

### patch

    $.http.patch("url", data);

### delete

    $.http.delete("url");

### beforeSend

類似 $.ajax 的 beforeSend，必須是最先呼叫。

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
            // do something always.
        });

### CDN

https://cdn-softkitchen.azureedge.net/jquery-http/0.0.2/jquery-http.min.js
