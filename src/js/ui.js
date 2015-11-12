/**
 * Created by 语冰 on 2015/11/8.
 */


$(window).resize(function() {

    $('.fontlist').height($(window).height()-$('.fontlist').offset().top -$('.foot').height());
});





$('.sizeranger').on('mouseup', function(){

    $(".srang").text($(".sizeranger>input").val());
    $(".fontitem").css("font-size",+$(".sizeranger>input").val());
});









fontagasToHTML

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