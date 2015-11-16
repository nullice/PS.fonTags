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

        _visiable: false,
        _id: 0,
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

Fontages.prototype.add = function (name, family, postScriptName, style, id)
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

        _visiable: true,
        _id: id,
        _type: "font"
    }

    var com = fontGetInc(name, family);
    if (com != null)
    {
        font.tags_com.push(com)
    }

    this.list[this.list.length] = font;
}


Fontages.prototype.index = function (id)
{
    return scanByFontId(this.list, id);

    function scanByFontId(list, id)
    {
        for (var i = 0; i < list.length; i++)
        {

            if (list[i]._type == "font")
            {

                if (list[i]._id == id)
                {
                    return list[i];
                }
            }
            else if (list[i]._type == "group")
            {
                var result = scanByFontId(list[i].fonts, id);
                if (result != undefined)
                {
                    return result;
                }

            }
        }
    }

}

Fontages.prototype.restVisiable = function ()
{
    _restVisiable_0(this.list);

    function _restVisiable_0(list, id)
    {
        for (var i = 0; i < list.length; i++)
        {
            if (list[i]._type == "font")
            {
                list[i]._visiable = true;
            }
            else if (list[i]._type == "group")
            {
                var result = _restVisiable_0(list[i].fonts, id);
            }
        }
    }
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
                    Temp_fontages.add(o.list[i].name, o.list[i].family, o.list[i].postScriptName, o.list[i].style, i);
                }

            }

            fontages = $.extend(true, {}, Temp_fontages);
            arrangeFontGroup();
            fontagasToHTML(fontages);
            tagFliter_barRefur();
            chooserToHTML();
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
            str1 += ' id="fid' + font._id + '" ';
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
    for (var i = 0; i < INCS.length; i++)
    {
        if (family.slice(0, INCS[i].length) == INCS[i])
        {
            return INCS[i];
        }

    }

    return "其他";

}


var pool_com = [];
var pool_lang = [];
var cc = 0;
function tagFliter_barRefur()
{
    pool_com = [];
    pool_lang = [];

    fontTagsToPool(fontages.list, "tags_com", pool_com);
    fontTagsToPool(fontages.list, "tags_lang", pool_lang);

    //---------------------------------------


    function fontTagsToPool(list, tags, pool)
    {

        for (var i = 0; i < list.length; i++)
        {

            if (list[i]._type == "font")
            {

                tagsToPool(list[i][tags], pool);

            }
            else if (list[i]._type == "group")
            {
                fontTagsToPool(list[i].fonts, tags, pool);
            }
        }
        arryUnique(pool)

    }

    function tagsToPool(tags, pool)
    {
        var hash = {};
        for (var i = 0; i < tags.length; i++)
        {
            if (!hash[tags[i]])
            {
                hash[tags[i]] = true;
                pool.push(tags[i]);
            }
        }
    }


}


function chooserToHTML()
{

    chooserToHTML_bar(pool_lang, "#bar_lang>.bottom_bar", "la");
    chooserToHTML_bar(pool_com, "#bar_com>.bottom_bar", "co");

    function chooserToHTML_bar(pool, bar, barName)
    {
        $(bar).html("");
        var o = {"bar": barName};
        $(bar).append($("#tmpl_bar_item_all").tmpl(o));

        for (var i = 0; i < pool.length; i++)
        {
            o = {
                "name": pool[i],
                "bar": barName
            };

            $(bar).append($("#tmpl_bar_item").tmpl(o));
        }

    }

    //-------------绑定事件----------


    //----------------- fontitem------

    $(".fontitem:not(.groupItem)").on("click",
        function ()
        {
            cs.evalScript(
                "ps_applyLayerFont('" + $(this).attr("font_postscriptname") + "')"
            )
        }
    );



    $(".act_buttom").on("mousedown",
        function(e){
            //alert("1");
            //e.stopPropagation();
            return false;
        });


    $(".fontitem").bind("contextmenu", function (e)
    {
        return false;
    });

    $(".fontitem").mousedown(function(e){

        if (e.which == 3)
        {

            if( $(this).hasClass("groupItem") )
            {

                var ev= $(this).parent().parent().children().filter(".fontitem:not(.groupItem)");
                var count= 0;

                ev.each(function(){count += fontItemPick($(this));})
                if(count>0)
                {
                    $(this).addClass("pickG");
                }
                else
                {
                    $(this).removeClass("pickG");
                }
            }
            else
            {

                fontItemPick($(this));

                if($(this).parent().hasClass("group"))
                {

                    //console.log($(this).parent().children().filter(".groupItem"));
                    if($(this).parent().children().hasClass("pick"))
                    {
                        $(this).parent().find(".groupItem").addClass("pickG");
                    }
                    else
                    {
                        $(this).parent().find(".groupItem").removeClass("pickG");
                    }
                }
            }




        }

            function fontItemPick(e){
                if( e.hasClass("pick") )
                {
                    e.removeClass("pick");
                    return 0;
                }
                else
                {
                    e.addClass("pick");
                    return 1;
                }
            }
        }




    )


    //------标签按钮------------------------


    $(".chooser_input").on("change", getbooList);

    $(".chooser_input+label").bind("contextmenu", function (e)
    {
        return false;
    });


    $(".chooser_input+label").mousedown(function (e)
    {
        console.log("点击：" + e.which)
        // alert(e.which);// 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键

        if (e.which == 3)
        {

            if ($("#" + $(this).attr("for")).get(0).checked)
            {
                barChooseReverse($(this));
            }
            else
            {
                barChooseUnique($(this));
            }
        }
    });

    $(".input_all").on("change", function ()
    {


        var bool = $(this).get(0).checked;

        $(this).parent().children().filter(".chooser_input:not(.input_all)").each(function ()
        {
            $(this).get(0).checked = bool;
        });
        getbooList()
    });


    function barChooseUnique(e)
    {
        e.parent().children().filter(".chooser_input:not(#" + e.attr("for") + ")").each(function ()
        {
            $(this).get(0).checked = false;
        });

        $("#" + e.attr("for")).get(0).checked = true;
        getbooList()
    }

    function barChooseReverse(e)
    {
        e.parent().children().filter(".chooser_input:not(#" + e.attr("for") + ")").not(".input_all").each(function ()
        {
            $(this).get(0).checked = true;
        });

        $("#" + e.attr("for")).get(0).checked = false;
        getbooList()
    }


}


function arryUnique(arry)
{
    var hash = {};
    var temp = [];

    for (var i = 0; i < arry.length; i++)
    {
        if (!hash[arry[i]])
        {
            hash[arry[i]] = true;
            temp.push(arry[i]);
        }
    }
    arry.splice(0, arry.length);

    for (var z = 0; z < temp.length; z++)
    {
        arry.push(temp[z]);
    }
}
//---------------------Fliter - UI-----------------------------

var booList_lang = {};
var booList_com = {};


//选择器被改变
function getbooList()
{
    console.log("getbooList");

    fontages.restVisiable();
    booList_lang = {};

    for (var i = 0; i < pool_lang.length; i++)
    {

        booList_lang[pool_lang[i]] = (true == $("#ctag_la_" + pool_lang[i]).get(0).checked);
    }

    booList_com = {};
    for (var z = 0; z < pool_com.length; z++)
    {

        booList_com[pool_com[z]] = (true == $("#ctag_co_" + pool_com[z]).get(0).checked);
    }


    console.log(booList_lang);
    console.log(booList_com);

    refurDisplay()
}


function refurDisplay()
{
    var visible = 0;

    dealFontDisplay(fontages.list, "tags_lang", booList_lang);
    dealFontDisplay(fontages.list, "tags_com", booList_com);


    applyVisible(fontages.list);
    hideEmptyGourp();
    hideUnusedBar();


    //-------------

    function dealFontDisplay(list, tags, booList)
    {
        for (var i = 0; i < list.length; i++)
        {
            if (list[i]._type == "font")
            {
                if (list[i]._visiable == true)
                {
                    list[i]._visiable *= tagIsin(list[i][tags], booList);
                }

            }
            else if (list[i]._type == "group")
            {
                dealFontDisplay(list[i].fonts, tags, booList);
            }
        }
    }

    function tagIsin(tags, booList)
    {

        var b = false;
        for (var i = 0; i < tags.length; i++)
        {
            //console.log("--------------------");
            //console.log(tags[i]);
            //console.log(booList[tags[i]]);
            if (booList[tags[i]] > 0)
            {
                b = true;
                booList[tags[i]]++;

            }
            else if (booList[tags[i]] == 0)
            {
                booList[tags[i]]--;
            }
        }
        //console.log(b);
        return b;

    }


    function applyVisible(list)
    {
        for (var i = 0; i < list.length; i++)
        {
            if (list[i]._type == "font")
            {
                if (list[i]._visiable == true)
                {
                    $("#fid" + list[i]._id).removeClass("hide");
                }
                else
                {
                    $("#fid" + list[i]._id).addClass("hide");
                }

            }
            else if (list[i]._type == "group")
            {
                applyVisible(list[i].fonts);
            }
        }

    }


    function hideEmptyGourp()
    {
        $(".group").each(function ()
        {

            if ($(this).children().filter(":not(.hide)").length <= 1)
            {
                $(this).addClass("hide");
            }
            else
            {
                $(this).removeClass("hide");
            }

        });
    }


}

function hideUnusedBar()
{
    for (var i in booList_com)
    {
        console.log(booList_com[i]);
        if (booList_com[i] == 0 || booList_com[i] == 1)
        {
            //$("#ctag_co_" + i).get(0).checked = false;
            $("#ltag_co_" + i).addClass("hide");
        }
        else if (booList_com[i] != undefined)
        {
            $("#ltag_co_" + i).removeClass("hide");
        }


    }

}
