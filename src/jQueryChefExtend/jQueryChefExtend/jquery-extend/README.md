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

### run

    // 縮減 jQuery Selector，少打點字、提升效能。
    $(...).run($el => {
        // ...
    });
