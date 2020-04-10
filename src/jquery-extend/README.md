# jquery-extend

將一些常用到的操作簡化成擴充方法，少打一些字。

### visible

    $(...).visible();
    
    // 等同於 $(...).css("visibility", "");

### invisible

    $(...).invisible();
    
    // 等同於 $(...).css("visibility", "hidden");

### toggleVisibility

    $(...).toggleVisibility();

### disable

    $(...).disable();
    
    // 等同於 $(...).prop("disabled", true);

### enable

    $(...).enable();
    
    // 等同於 $(...).prop("disabled", false);

### toggleDisabled

    $(...).toggleDisabled();

### selected

    $(...).selected();
    
    // 等同於 $(...).prop("selected", true);

### unselected

    $(...).unselected();
    
    // 等同於 $(...).prop("selected", false);

### toggleSelected

    $(...).toggleSelected();

### CDN

https://cdn-softkitchen.azureedge.net/jquery-extend/lastest/jquery-extend.min.js
