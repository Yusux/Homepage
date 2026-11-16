theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
function themeChange() {
    theme = theme == 'dark' ? 'light' : 'dark';
    if (theme == 'dark') {
        $("body").removeClass("text-black bg-light");
        $("body").addClass("text-white bg-dark");
        $("a").css("color", "#fff");
        $("#modetext").html("&#xe60f;");
    } else {
        $("body").removeClass("text-white bg-dark");
        $("body").addClass("text-black bg-light");
        $("a").css("color", "#000");
        $("#modetext").html("&#xe6c0;");
    }
}
themeChange();

$("a").hover(
    function () {
        $(this).css("color", "#F0C9CF");
    },
    function () {
        if (theme == 'dark') {
            $(this).css("color", "#fff");
        } else {
            $(this).css("color", "#000");
        }
    }
);

// Click a heading to copy the link to that section
function legacyCopy(text) {
    var $tmp = $("<textarea>").val(text).css({ position: "fixed", opacity: 0 }).appendTo("body");
    $tmp[0].select();
    var ok = document.execCommand("copy");
    $tmp.remove();
    return ok ? Promise.resolve() : Promise.reject();
}

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
}

$(".anchor").on("click", function (e) {
    e.preventDefault();
    var hash = $(this).attr("href");
    var $title = $(this).parent();
    history.replaceState(null, "", hash);
    copyText(location.origin + location.pathname + hash).then(function () {
        $title.addClass("copied");
        setTimeout(function () { $title.removeClass("copied"); }, 1500);
    }, function () {});
});

// Collapsible lists: show the first N items of .fold, toggle the rest
$(".fold").each(function () {
    var $fold = $(this);
    var shown = parseInt($fold.data("fold-show"), 10) || 2;
    var $extra = $fold.children().slice(shown);
    if (!$extra.length) return;
    var more = "+ " + $extra.length + " more";
    var less = "- show less";
    $extra.addClass("fold-hidden");
    var $toggle = $('<a class="fold-toggle" href="javascript:;"></a>').text(more);
    $toggle.css("color", theme == "dark" ? "#fff" : "#000");
    $toggle.hover(
        function () { $(this).css("color", "#F0C9CF"); },
        function () { $(this).css("color", theme == "dark" ? "#fff" : "#000"); }
    );
    $toggle.on("click", function () {
        var open = $extra.first().hasClass("fold-hidden");
        $extra.toggleClass("fold-hidden", !open);
        $toggle.text(open ? less : more);
    });
    $('<div class="fold-toggle-row"></div>').append($toggle).insertAfter($fold);
});
