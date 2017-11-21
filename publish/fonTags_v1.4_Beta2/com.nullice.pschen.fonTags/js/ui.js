/**
 * Created by 语冰 on 2015/11/8.
 */

//----------------


function refWindowSize()
{
    setTimeout(function ()
    {
        if(  $('.fontlist').is(":hidden") )
        {
            $('.fontlist_search').height($(window).height() - $('.fontlist_search').offset().top - $('.foot').height());
        }
        else
        {
            $('.fontlist').height($(window).height() - $('.fontlist').offset().top - $('.foot').height());
            $('.fontlist_search').height($(window).height() - $('.fontlist_search').offset().top - $('.foot').height());
        }
    }, 100);

}
refWindowSize()









$(".fontlist, .fontlist_search").niceScroll({
    cursorcolor:"rgba(0,0,0,0.2)",
    cursorborder:"none",
    cursorwidth: "8px",
    cursorborderradius: "3px",
    mousescrollstep: 8
});

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
    refWindowSize();

});


$(document).on('click', ".filter_buttom", function ()
{
    toggleTagsFilter()
});


function toggleTagsFilter()
{

    $(".chosebar_box").toggleClass("hide");
    $(".fontlist_box").toggleClass("top7");
    $(".topsl").toggleClass("hide");
    refWindowSize();
}

$(window).resize(function ()
{
    refWindowSize();
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

    //$(".groupItem>label>.groupItem>span:not(.font_number)").text(function ()
    //{
    //    return $(this).parent().parent().siblings()[0].attr("id")
    //    fontages.index()
    //        attr("font_family") + " " + $(this).parent().attr("font_style");
    //});

    $(".groupItem>span:not(.font_number)").text(function ()
    {
        return $(this).parent().attr("font_group_name");
    });


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

    $(".groupItem>span:not(.font_number)").text(function ()
    {
        return $(this).parent().attr("font_group_name");
    });


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




$("#setting_buttom").bind("click", function(){
    $(".page1").hide();
    $(".page2").hide();
    $(".page3").show();
});


$(".return_buttom").bind("click", function(){
    $(".page1").show();
    $(".page2").hide();
    $(".page3").hide();
});


$("#reflist").bind("click", function(){
    nowLoad();
    showfontages();
    $(".page1").show();
    $(".page2").hide();
    $(".page3").hide();
});



$("#author_url").bind("click", function(){
    cs.openURLInDefaultBrowser("http://nullice.com/about");
});

$("#home_page_url").bind("click", function(){
    cs.openURLInDefaultBrowser("http://nullice.com/ps/fontags");
});

$("#home_help_url").bind("click", function(){
    cs.openURLInDefaultBrowser("http://styletin.com/archives/751");
});




