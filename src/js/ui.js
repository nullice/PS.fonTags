/**
 * Created by 语冰 on 2015/11/8.
 */




$(".fontitem").on("click",function(){

  if( $(this).hasClass("pick") )
  {
      re
  }



})



$(window).resize(function ()
{

    $('.fontlist').height($(window).height() - $('.fontlist').offset().top - $('.foot').height());
});


$('.sizeranger').on('mouseup', function ()
{

    $(".srang").text($(".sizeranger>input").val());
    $(".fontitem").css("font-size", +$(".sizeranger>input").val());
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

    $(".preview_text").css("display", "none");
    $(".fontitem:not(.groupItem)>span").text(function ()
    {
        return $(this).parent().attr("font_family") + " " + $(this).parent().attr("font_style");
    });

    $(".groupItem>span:not(.font_number)").text(function ()
    {
        return $(this).parent().attr("font_family");
    });


    $(".preview_text").css("display", "none");
}

function fontlistDisplayFromName()
{

    $(".preview_text").css("display", "none");
    $(".fontitem:not(.groupItem)>span").text(function ()
    {
        return $(this).parent().attr("font_name");
    });
    $(".groupItem>span:not(.font_number)").text(function ()
    {
        return $(this).parent().attr("font_family");
    });



    $(".preview_text").css("display", "none");

}


function fontlistDisplayFromPreview()
{


    var box = $(".preview_text");
    var t = box.val();
    if (t != undefined && t != ""  && t != " ")
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

$(".page2").show();
$(".page2").hide();
$(".page3").hide();















function ttt()
{
    var e = document.getElementById("ctag1");
    alert(e.checked);
}

