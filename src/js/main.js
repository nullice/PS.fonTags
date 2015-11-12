/**
 * Created by 语冰 on 2015/11/7.
 */

$(".act_info").click(act_info);









var Fontages = function ()
{
    this.length = 0;

    this.font =
    {
        name: "",
        family: "",
        postScriptName: "",
        style: "",

        firstname: "",
        tags_lang: [],       //语言
        tags_com: [],        //发行商
        tags_type: [],       //类型
        tags_weight: [],     //字重
        tags_user: [],       //用户自定义
        tags_other: [],      //其他

        _type: "Font"
    }


    this.list = [];

    var fontGroup =
    {
        font: {},
        _type: "FontGroup"
    }


}

Fontages.prototype.add = function (name, family, postScriptName, style)
{
    var font =
    {
        name: name,
        family: family,
        postScriptName: postScriptName,
        style: style,

        firstname: "",
        tags_lang: [],       //语言
        tags_com: [],        //发行商
        tags_type: [],       //类型
        tags_weight: [],     //字重
        tags_user: [],       //用户自定义
        tags_other: [],      //其他

        _type: "Font"
    }

    this.list[this.list.length] = font;
}


//----------------------------------------------------fromJSX

var fontages = new Fontages();
var cs = new CSInterface();

function loadJSX(fileName)
{
    var extensionRoot = cs.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    cs.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
}
loadJSX("json2.js");


function refurFontags()
{
    cs.evalScript('getFontsJson()',
        function (result)
        {
            var o = JSON.parse(result);
            var Temp_fontages = new Fontages();


            for (var i = 0; i < o.length; i++)
            {
                if ("" != o.list[i].name && undefined != o.list[i].name)
                {

                    Temp_fontages.length++;
                    Temp_fontages.add(o.list[i].name, o.list[i].family, o.list[i].postScriptName, o.list[i].style);
                }

            }

            fontages = $.extend(true, {}, Temp_fontages);
            fontagasToHTML(fontages);
        }
    )
}


refurFontags();


function fontagasToHTML(fontagesIn)
{
    console.log("fontagasToHTML\n")
    $(".fontlist").html("");

    for (var i = 0; i < fontagesIn.length; i++)
    {
        var str1 = ' font_name="' + fontagesIn.list[i].name + '" ';
        str1 += ' font_family="' + fontagesIn.list[i].family + '" ';
        str1 += ' font_postscriptname="' + fontagesIn.list[i].postScriptName + '" ';
        str1 += ' font_style="' + fontagesIn.list[i].style + '" ';
        var strf = "font-family: '" + fontagesIn.list[i].name + "', '" + fontagesIn.list[i].postScriptName + "', '" + fontagesIn.list[i].family + "' ;";
        str1 += ' style="' + strf + '" ';


        var html =
            '<div class="fontitem"' + str1 + ">\n" +
            '<span>' + fontagesIn.list[i].name + '<\/span> ' +

            ' <div class="opbar"><i class="fa fa-sticky-note  act_buttom act_copy" title="复制字体名"><\/i><i class="fa fa-check  act_buttom act_apply" title="应用字体"><\/i><i class="fa fa-info act_buttom act_info" title="字体信息"><\/i> <\/div>'
            + '<\/div>';




        $(".fontlist").append(html);
    }


    $(".act_info").click(act_info);

}



function act_info()
{

    if( $(this).hasClass("info_open"))
    {
        $(this).removeClass("info_open");
        $(this).parent().removeClass("info_open");
        $(this).parent().siblings().filter(".info_box").remove();
    }
    else
    {
        $(this).addClass("info_open");
        $(this).parent().addClass("info_open");
        var o =
        {
            name: $(this).parent().parent().attr("font_name"),
            family: $(this).parent().parent().attr("font_family"),
            PostScriptName: $(this).parent().parent().attr("font_postscriptname"),
            style: $(this).parent().parent().attr("font_style"),
        }

        $(this).parent().after( $('#tmpl_info_box').tmpl(o));
    }

}