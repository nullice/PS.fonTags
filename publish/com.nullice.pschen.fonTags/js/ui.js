/**
 * Created by 语冰 on 2015/11/8.
 */

//----------------

$(document).on('click', ".spead_buttom", function ()
{

    if ($(this).hasClass("bool_t"))
    {
        $(".group_inp").each(function ()
        {
            $(this)[0].checked = true;
        })
        $(this).removeClass("bool_t");
    }
    else
    {
        $(".group_inp").each(function ()
        {
            $(this)[0].checked = false;
        })
        $(this).addClass("bool_t");
    }

});

//----------------

$(document).on('click', ".bar_switch", function ()
{
    setTimeout(function ()
    {
        $('.fontlist').height($(window).height() - $('.fontlist').offset().top - $('.foot').height());
    }, 100);

});


$(document).on('click', ".filter_buttom", function ()
{

    $(".chosebar_box").toggleClass("hide");
    $(".fontlist_box").toggleClass("top7");

    setTimeout(function ()
    {
        $('.fontlist').height($(window).height() - $('.fontlist').offset().top - $('.foot').height());
    }, 50);

});


$(window).resize(function ()
{
    $('.fontlist').height($(window).height() - $('.fontlist').offset().top - $('.foot').height());
});

$('.sizeranger').on('mouseup', function ()
{
    $(".srang").text($(".sizeranger>input").val());
    $(".fontitem").css("font-size", +$(".sizeranger>input").val());
    g_fsize = +$(".sizeranger>input").val();
});


$('.sizeranger').on('change', function ()
{
    $(".srang").text($(".sizeranger>input").val());
});

$('#view_mod1').mousedown(
    fontlistDisplayFromName);


$('#view_mod2').mousedown(
    fontlistDisplayFromFamily);


$('#view_mod3').mouseup(
    function ()
    {
        $(".preview_text").css("display", "block");
        fontlistDisplayFromPreview();
    });


$('.preview_text').on("input", fontlistDisplayFromPreview);


function fontlistDisplayFromFamily()
{
    g_vmod = 2;

    $(".preview_text").css("display", "none");
    $(".fontitem:not(.groupItem)>span").text(function ()
    {
        return $(this).parent().attr("font_family") + " " + $(this).parent().attr("font_style");
    });

    //$(".groupItem>span:not(.font_number)").text(function ()
    //{
    //    return $(this).parent().attr("font_family");
    //});


    $(".preview_text").css("display", "none");
}

function fontlistDisplayFromName()
{
    g_vmod = 1;

    $(".preview_text").css("display", "none");
    $(".fontitem:not(.groupItem)>span").text(function ()
    {
        return $(this).parent().attr("font_name");
    });
    //$(".groupItem>span:not(.font_number)").text(function ()
    //{
    //    return $(this).parent().attr("font_family");
    //});


    $(".preview_text").css("display", "none");

}


function fontlistDisplayFromPreview()
{
    g_vmod = 3;
    var box = $(".preview_text");
    var t = box.val();
    if (t != undefined && t != "" && t != " ")
    {
        $(".fontitem>span:not(.font_number)").text(t);
    }
}


//$(".srang").val($(".sizeranger").val());


$(".page1").show();
$(".page2").hide();
$(".page3").hide();

$("#tagbut1,#tagbut2,#tagbut3").bind("click", showTagpage);

function showTagpage(event)
{
    var id = event.toElement.id;

    if ("tagbut1" == id)
    {
        $(".page1").show();
        $(".page2").hide();
        $(".page3").hide();
    }
    else if ("tagbut2" == id)
    {
        $(".page1").hide();
        $(".page2").show();
        $(".page3").hide();
    }
    else if ("tagbut3" == id)
    {
        $(".page1").hide();
        $(".page2").hide();
        $(".page3").show();
    }
}

$(".page1").show();
$(".page2").hide();
$(".page3").hide();


function ttt()
{
    var e = document.getElementById("ctag1");
    alert(e.checked);
}



new Clipboard('.act_copy');