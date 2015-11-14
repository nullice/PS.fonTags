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

        firstName: "",
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
        groupName: "",
        fonts: [{}],
        _type: "group"
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
        tags_lang: [fontGetLang(name + family)],       //语言
        tags_com: [],        //发行商
        tags_type: [],       //类型
        tags_weight: [],     //字重
        tags_user: [],       //用户自定义
        tags_other: [],      //其他

        _type: "font"
    }

    var com =fontGetInc(name,family);
    if(com != null)
    {
        font.tags_com.push(com)
    }

    this.list[this.list.length] = font;
}


Fontages.prototype.createGroup = function (name)
{
    var fontGroup =
    {
        groupName: name,
        fonts: [],
        _type: "group"
    }
    this.list[this.list.length] = fontGroup;
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
            arrangeFontGroup();
            fontagasToHTML(fontages);
        }
    )
}


function arrangeFontGroup()
{
    var temp = new Fontages();
    for (var i = 0; i < fontages.length; i++)
    {

        if (temp.list[temp.list.length - 1] != undefined)
        {

            if (temp.list[temp.list.length - 1]._type == "font" && temp.list[temp.list.length - 1].family == fontages.list[i].family)
            {

                var pre = temp.list.pop();
                temp.createGroup(fontages.list[i].family)

                temp.list[temp.list.length - 1].fonts.push($.extend(true, {}, pre));
                temp.list[temp.list.length - 1].fonts.push($.extend(true, {}, fontages.list[i]));
                temp.length++;
                continue;

            }

            if (temp.list[temp.list.length - 1]._type == "group" && temp.list[temp.list.length - 1].groupName == fontages.list[i].family)
            {
                temp.list[temp.list.length - 1].fonts.push($.extend(true, {}, fontages.list[i]));
                temp.length++;
                continue;
            }


        }


        temp.list[temp.list.length] = $.extend(true, {}, fontages.list[i]);
        temp.length++;
    }


//else if (i == 0)
//{
//    temp.list[temp.list.length] = $.extend(true, {}, fontages.list[i]);
//    console.log(temp);
//}
//else if (temp.list[temp.list.length - 1]._type == "group")
//{
//    if(temp.list[temp.list.length - 1].groupName==fontages.list[i].family)
//    {
//        temp.list[temp.list.length-1].fonts.push($.extend(true, {}, fontages.list[i])) ;
//    }
//}else
//{
//    temp.list[temp.list.length] = $.extend(true, {}, fontages.list[i]);
//}

    fontages = $.extend(true, {}, temp);
}


refurFontags();


function fontagasToHTML(fontagesIn)
{

    $(".fontlist").html("");
    var groupCounter = 0;

    for (var i = 0; i < fontagesIn.list.length; i++)
    {

        function fontTOHTML(parent, font)
        {
            var str1 = ' font_name="' + font.name + '" ';
            str1 += ' font_family="' + font.family + '" ';
            str1 += ' font_postscriptname="' + font.postScriptName + '" ';
            str1 += ' font_style="' + font.style + '" ';
            str1 += ' id="fid' + i + '" ';
            var strf = "font-family: '" + font.name + "', '" + font.postScriptName + "', '" + font.family + "' ;";
            str1 += ' style="' + strf + '" ';

            var html =
                '<div class="fontitem"' + str1 + ">\n" +
                '<span>' + font.name + '<\/span> ' +

                ' <div class="opbar"><i class="fa fa-sticky-note  act_buttom act_copy" title="复制字体名"><\/i><i class="fa fa-check  act_buttom act_apply" title="应用字体"><\/i><i class="fa fa-info act_buttom act_info" title="字体信息"><\/i> <\/div>'
                + '<\/div>';

            $(parent).append(html);
        }

        if (fontagesIn.list[i]._type == "font")
        {
            fontTOHTML(".fontlist", fontagesIn.list[i])
        }

        if (fontagesIn.list[i]._type == "group" && fontagesIn.list[i].fonts.length > 0)
        {
            groupCounter++;
            var groupHtml = "";
            var o =
            {
                group_id: groupCounter,
                font_name: fontagesIn.list[i].fonts[0].name,
                font_family: fontagesIn.list[i].fonts[0].family,
                font_postscriptname: fontagesIn.list[i].fonts[0].postScriptName,
                group_style: " '" + fontagesIn.list[i].fonts[0].name + "', '" + fontagesIn.list[i].fonts[0].postScriptName + "', '" + fontagesIn.list[i].fonts[0].family + "' ",


                font_group_name: fontagesIn.list[i].groupName,
                font_number: fontagesIn.list[i].fonts.length

            }

            groupHtml = $("#tmpl_fontlist_group").tmpl(o);


            $(".fontlist").append(groupHtml);

            for (var z = 0; z < fontagesIn.list[i].fonts.length; z++)
            {
                fontTOHTML("#group" + groupCounter, fontagesIn.list[i].fonts[z]);
            }

        }


    }


    $(".act_info").click(act_info);

}


function act_info()
{

    if ($(this).hasClass("info_open"))
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

        $(this).parent().after($('#tmpl_info_box').tmpl(o));
    }

}


//U+3040–U+309F 平假名
//U+30A0–U+30FF 片假名
//U+31F0-U+31FF 日文片假名拼音扩展
//U+1100-U+11FF 韩文字母
//U+4E00–U+9FBF 汉字

function fontGetLang(fontText)
{
    var reg = /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/;
    if (reg.test(fontText))
    {
        return "日文";
    }

    reg = /[\u1100-\u11FF]/;
    if (reg.test(fontText))
    {
        return "韩文";
    }

    reg = /[\u4E00-\u9FA5]/;
    if (reg.test(fontText))
    {
        return "中文";
    }

    return "英文";

}

var INCS = ["方正", "汉仪", "华文", "造字工房", "迷你", "汉仪", "新蒂", "叶根友", "张海山", "Adobe", "Microsoft"];
function fontGetInc(name, family)
{
    for (var i=0; i < INCS.length; i++)
    {
        if(family.slice(0,INCS[i].length)==INCS[i])
        {
            return INCS[i];
        }

    }

    return null;

}


function tagFliter_barRefur()
{
    

}

