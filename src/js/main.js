/**
 * Created by 语冰 on 2015/11/7.
 */
var cs = new CSInterface();
var g_vmod = 2;
var g_fsize = 14;

var g_pickfont = {};
var g_pickLastGroup;
var g_pickLastGroup_element;

var g_diyTagsname = {lang: "", com: "", type: "", weight: "", user: ""};

function alert(text)
{
    cs.evalScript('alert("'+text+'")');
}



//------------------------------Fontages------------------------------------
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
    };
    this.list = [];

    var fontGroup =
    {
        groupName: "",
        fonts: [{}],
        _type: "group"
    }
};

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
        tags_weight: fontGetWeigth(style),     //字重
        tags_user: [],       //用户自定义
        tags_other: [],      //其他

        _visiable: true,
        _id: id,
        _type: "font"
    };

    var com = fontGetInc(name, family);
    if (com != null)
    {
        font.tags_com.push(com)
    }


    this.list[this.list.length] = font;
};

Fontages.prototype.index = function (id, indexmod)
{
    var nowGroup = -1;
    return scanByFontId(this.list, id);

    function scanByFontId(list, id)
    {
        for (var i = 0; i < list.length; i++)
        {
            if (list[i]._type == "font")
            {
                if (list[i]._id == id)
                {
                    if (indexmod)
                    {
                        return {font: i, group: nowGroup};
                    }
                    return list[i];
                }
            }
            else if (list[i]._type == "group")
            {
                nowGroup = i;
                var result = scanByFontId(list[i].fonts, id);
                nowGroup = -1;
                if (result != undefined)
                {
                    return result;
                }
            }
        }
    }
}
Fontages.prototype.findByPSName = function (PSName)
{
    return scanByPSName(this.list, PSName);

    function scanByPSName(list, PSName)
    {
        for (var i = 0; i < list.length; i++)
        {
            if (list[i]._type == "font")
            {
                if (list[i].postScriptName == PSName)
                {
                    return list[i];
                }
            }
            else if (list[i]._type == "group")
            {
                var result = scanByPSName(list[i].fonts, PSName);
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
};

Fontages.prototype.createGroup = function (name, pos)
{
    var fontGroup =
    {
        groupName: name,
        fonts: [],
        _type: "group"
    };
    if (pos == undefined)
    {
        this.list[this.list.length] = fontGroup;
        return (this.list.length);
    }
    else
    {
        this.list.splice(pos, 0, fontGroup);
        return (pos);
    }

};


Fontages.prototype.dismissEmptyGroup = function (group)
{
    for (var i = 0; i < this.length; i++)
    {
        if (list[i]._type == "group")
        {
            if (list[i].fonts.length <= 0)
            {
                this.list.splice(i, 1);
                i--;
            }
        }

    }
}

Fontages.prototype.removeFontFromGroup = function (fid)
{

    var o = this.index(fid, true);
    if (o != undefined)
    {
        if (o.group >= 0)
        {
            var font = $.extend(true, {}, this.index(fid));
            //console.log(font);
            this.list[o.group].fonts.splice(o.font, 1);
            this.list.splice(o.group + 1, 0, font);


            //console.log(o);
        }
    }
    else
    {
        //console.log("Index 未找到");
    }
}


Fontages.prototype.moveFontToGroup = function (fid, group)
{

    var o = this.index(fid, true);
    if (o != undefined)
    {
        if (o.group >= 0)
        {
            if (o.group != group)
            {
                var font = $.extend(true, {}, this.index(fid));
                this.list[o.group].fonts.splice(o.font, 1);
                this.list[group].fonts.push(font);
            }
        }
        else
        {
            var font = $.extend(true, {}, this.index(fid));

            this.list[group].fonts.push(font);
            this.list.splice(o.font, 1);
        }
    }
    else
    {
        //console.log("Index 未找到");
    }
}


//----------------------------------------------------fromJSX


function loadJSX(fileName)
{
    var extensionRoot = cs.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    cs.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
}
loadJSX("json2.js");


function refurFontags(addmod)
{
    cs.evalScript('getFontsJson()',
        function (result)
        {
            var o = JSON.parse(result);
            var Temp_fontages = new Fontages();

            for (var i = 0; i < o.length; i++)
            {
                if ("" !== o.list[i].name && undefined != o.list[i].name)
                {
                    if (addmod)
                    {
                        if (fontages.findByPSName(o.list[i].postScriptName) === undefined)
                        {
                            Temp_fontages.length++;
                            Temp_fontages.add(o.list[i].name, o.list[i].family, o.list[i].postScriptName, o.list[i].style, i);
                        }
                    }
                    else
                    {
                        Temp_fontages.length++;
                        Temp_fontages.add(o.list[i].name, o.list[i].family, o.list[i].postScriptName, o.list[i].style, i);
                    }
                }

            }

            if (addmod)
            {
                Temp_fontages = arrangeFontGroup(Temp_fontages);
                fontages.list = fontages.list.concat(Temp_fontages.list);

            }
            else
            {
                fontages = $.extend(true, {}, Temp_fontages);
                fontages = arrangeFontGroup(fontages);
            }


            showfontages();
        }
    )
}

function showfontages()
{
    fontagasToHTML(fontages);
    tagFliter_barRefur();
    chooserToHTML();
    setTimeout(function ()
    {
        showOverHeightBut();
    }, 2000);
}

function showOverHeightBut()
{
    //console.log("showOverHeightBut");
    $(".bottom_bar").each(function ()
    {

        if ($(this).get(0).scrollHeight > 25)
        {
            $(this).siblings().filter(".bar_switch").removeClass("hide");
        }
        else
        {
            $(this).siblings().filter(".bar_switch").addClass("hide");
        }

    })
}


function arrangeFontGroup(fonts)
{
    var temp = new Fontages();
    for (var i = 0; i < fonts.length; i++)
    {
        if (temp.list[temp.list.length - 1] != undefined)
        {
            if (temp.list[temp.list.length - 1]._type == "font" && temp.list[temp.list.length - 1].family == fonts.list[i].family)
            {
                var pre = temp.list.pop();
                temp.createGroup(fonts.list[i].family);

                temp.list[temp.list.length - 1].fonts.push($.extend(true, {}, pre));
                temp.list[temp.list.length - 1].fonts.push($.extend(true, {}, fonts.list[i]));
                temp.length++;
                continue;
            }

            if (temp.list[temp.list.length - 1]._type == "group" && temp.list[temp.list.length - 1].groupName == fonts.list[i].family)
            {
                temp.list[temp.list.length - 1].fonts.push($.extend(true, {}, fonts.list[i]));
                temp.length++;
                continue;
            }
        }

        temp.list[temp.list.length] = $.extend(true, {}, fonts.list[i]);
        temp.length++;
    }

    fonts = $.extend(true, {}, temp);
    return fonts;
}


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

                ' <div class="opbar"><i class="fa fa-sticky-note  act_buttom act_copy" title="复制字体名" data-clipboard-text="' +font.family+" "+font.style+'" ><\/i><i class="fa fa-check  act_buttom act_apply" title="应用字体"><\/i><i class="fa fa-info act_buttom act_info" title="字体信息"><\/i> <\/div>'
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
            var mid = fontagesIn.list[i].fonts.length / 2;
            mid = Math.floor(mid);

            var o =
            {
                group_id: groupCounter,
                font_name: fontagesIn.list[i].fonts[mid].name,
                font_family: fontagesIn.list[i].fonts[mid].family,
                font_postscriptname: fontagesIn.list[i].fonts[mid].postScriptName,
                group_style: " '" + fontagesIn.list[i].fonts[mid].name + "', '" + fontagesIn.list[i].fonts[0].postScriptName + "', '" + fontagesIn.list[i].fonts[0].family + "' ",

                font_group_name: fontagesIn.list[i].groupName,
                font_number: fontagesIn.list[i].fonts.length

            };

            groupHtml = $("#tmpl_fontlist_group").tmpl(o);


            $(".fontlist").append(groupHtml);

            for (var z = 0; z < fontagesIn.list[i].fonts.length; z++)
            {
                fontTOHTML("#group" + groupCounter, fontagesIn.list[i].fonts[z]);
            }
        }
    }


    rufSetting();
    $(".act_info").on("click", act_info);



    $(".fontitem").bind("contextmenu", function (e)
    {
        return false;
    });


    $(".fontitem:not(.groupItem)").on("click",

        function (e)
        {
            if($(e.target).hasClass("act_copy"))
            {
                return;
            }
            cs.evalScript(
                "ps_applyLayerFont('" + $(this).attr("font_postscriptname") + "')"
            )
        }
    );


    $(".fontitem").on("mousedown", function (e)
        {

            if (e.which == 3)
            {
                if ($(this).hasClass("groupItem"))
                {

                    var ev = $(this).parent().parent().children().filter(".fontitem:not(.groupItem)");
                    var count = 0;
                   // console.log(ev);

                    ev.each(function ()
                    {
                        count += fontItemPick($(this));
                    });
                    if (count > 0)
                    {
                        $(this).addClass("pickG");

                        g_pickLastGroup = fontages.index($(this).parent().siblings().attr("id").slice(3), true).group;
                        g_pickLastGroup_element = $(this);
                        refPickfont();
                    }
                    else
                    {
                        $(this).removeClass("pickG");
                        g_pickLastGroup = -1;
                        g_pickLastGroup_element = -1;
                        refPickfont();
                    }
                }
                else
                {

                    fontItemPick($(this));

                    if ($(this).parent().hasClass("group"))
                    {

                        //console.log($(this).parent().children().filter(".groupItem"));
                        if ($(this).parent().children().hasClass("pick"))
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

            function fontItemPick(e)
            {
                if (e.hasClass("pick"))
                {
                    e.removeClass("pick");
                    refPickfont();
                    return 0;
                }
                else
                {
                    e.addClass("pick");
                    refPickfont();
                    return 1;
                }
            }
        }
    );


}

//---

function act_info(event)
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

        var fid = $(this).parent().parent().attr("id").slice(3);
        console.log(fid)
        var o = {
            name: fontages.index(fid).name,
            family: fontages.index(fid).family,
            PostScriptName: fontages.index(fid).postScriptName,
            style: fontages.index(fid).style,
            lang: fontages.index(fid).tags_lang.join(),
            com: fontages.index(fid).tags_com.join(),
            weight: fontages.index(fid).tags_weight.join(),
            user: fontages.index(fid).tags_user.join(),
            type: fontages.index(fid).tags_type.join()

        };

        $(this).parent().after($('#tmpl_info_box').tmpl(o));
    }


    $(".info_box").on("click", function ()
    {
        return false;
    })
    return false;
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

var INCS = {
    "方正": "",
    "汉仪": "",
    "华文": "",
    "造字工房": "",
    "迷你": "",
    "汉仪": "",
    "新蒂": "",
    "叶根友": "",
    "张海山": "",
    "Adobe": "",
    "Microsoft": "微软",
    "微软": "",
    "ＭＳ": "微软",
    "MS ": "微软",
    "微軟": "微软",
}


function fontGetInc(name, family)
{
    for (var i in INCS)
    {
        if (family.slice(0, i.length) == i)
        {
            if (INCS[i] === "")
            {
                return i;
            }
            else
            {
                return INCS[i];
            }
        }
    }
    return "其他";
}


var WEIGHT = {
    极粗: [/Heavy/i, /ExBold/i, /Extra-bold/i, /^H$/i, /^W[8-9]$/i, /Black/i],
    粗: [/^Bold$/i, /Semibold/i, /^B$/i, /Demibold/i, /^W[6-7]$/i, /Semi-bold/i, /^Bold/i],
    中等: [/Medium/i, /Regular/i, /Normal/i, /^M$/i, /^R$/i, /^W[4-5]$/i, /Book/i],
    细: [/Semilight/i, /^Light$/i, /^L$/i, /^W[2-3]$/i],
    极细: [/ExtraLight/i, /ExLight/i, /Extra-light/i, /Thin/i, /UltLight/i, /UltraLight/i, /^EL$/i, /Ultra Light/i],
    窄: [/\BCom/, /\BCond/, /Condensed/i, /Narrow/i],
    宽: [/Expanded/i],
    斜: [/Italic/i, /Slanted/i],
}

function fontGetWeigth(style)
{
    var result = [];
    var bool = false;
    for (var i in WEIGHT)
    {
        bool = false;
        for (var z = 0; z < WEIGHT[i].length; z++)
        {
            bool = WEIGHT[i][z].test(style);
            if (bool)
            {
                result.push(i);
                break;
            }
        }
    }
    return result;
}

//----------------------------------------------------

var pool_com = [];
var pool_lang = [];
var pool_type = [];
var pool_weight = [];
var pool_user = [];


var cc = 0;
function tagFliter_barRefur()
{
    pool_com = [];
    pool_lang = [];
    pool_type = [];
    pool_weight = []
    pool_user = [];

    fontTagsToPool(fontages.list, "tags_com", pool_com);
    fontTagsToPool(fontages.list, "tags_lang", pool_lang);
    fontTagsToPool(fontages.list, "tags_type", pool_type);
    fontTagsToPool(fontages.list, "tags_weight", pool_weight);
    fontTagsToPool(fontages.list, "tags_user", pool_user);

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
        if (0 == tags.length)
        {
            tags.push("无");
        }
        if (1 == tags.length && tags[0] === "")
        {
            tags[0] = "无";
        }


        for (var i = 0; i < tags.length; i++)
        {
            if (tags[i] !== "")
            {
                if (!hash[tags[i]])
                {
                    hash[tags[i]] = true;
                    pool.push(tags[i]);
                }
            }

        }
    }


}


function chooserToHTML()
{

    chooserToHTML_bar(pool_lang, "#bar_lang>.bottom_bar", "la");
    chooserToHTML_bar(pool_com, "#bar_com>.bottom_bar", "co");
    chooserToHTML_bar(pool_type, "#bar_type>.bottom_bar", "ty");
    chooserToHTML_bar(pool_weight, "#bar_weight>.bottom_bar", "we");
    chooserToHTML_bar(pool_user, "#bar_user>.bottom_bar", "us");
    showOverHeightBut();
    refPickfont();

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


        $(bar).children().filter(".chooser_input").each(function ()
        {
            $(this)[0].checked = true;
        })

        if (pool.length == 1 && pool[0] == "无")
        {
            $(bar).parent().addClass("hide");

        }
        else
        {
            $(bar).parent().removeClass("hide");
        }

    }

    //-------------绑定事件----------


    //----------------- fontitem------


    $(".act_buttom").on("mousedown",
        function (e)
        {
            return false;
        });




    //------------------------


    //------标签按钮------------------------

    $(".chooser_input:not(.input_all)").on("change", getbooList);

    $(".chooser_input+label").bind("contextmenu", function (e)
    {
        return false;
    });


    $(".chooser_input+label").mousedown(function (e)
    {
        //console.log("点击：" + e.which);
        // alert(e.which);// 1 = 鼠标左键 left; 2 = 鼠标中键; 3 = 鼠标右键

        if (e.which == 3)
        {

            if ($("#" + $(this).attr("for")).get(0).checked)
            {
                // 反选 barChooseReverse($(this));
                barChooseUnique($(this));
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


function refPickfont()
{
    g_pickfont = {};
    $(".pick").each(function ()
    {
        g_pickfont[$(this).attr("id").slice(3)] = $(this).attr("id").slice(3);
    });

    var len = Object.getOwnPropertyNames(g_pickfont).length;
    $(".picknumber").text(len);
    if (len > 0)
    {

        $(".editmod").css("bottom", "5px");
        $(".editmod").css("height", "64px");
    }
    else
    {
        $(".editmod").css("bottom", "-95px");
        $(".editmod").css("height", "0px");
    }


    if (g_pickLastGroup != undefined && g_pickLastGroup >= 0)
    {
        $(".gname_edit").val(fontages.list[g_pickLastGroup].groupName);
    }
    else
    {
        $(".gname_edit").val("");
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


function arryDeletFrom(arr, delFrom)
{
    var hash = {};
    var temp = []
    for (var i = 0; i < delFrom.length; i++)
    {
        hash[delFrom[i]] = true;
    }

    for (var z = 0; z < arr.length; z++)
    {
        if (hash[arr[z]] !== true)
        {
            temp.push(arr[z]);
        }
    }
    //console.log(hash)

    arr.splice(0, arr.length);
    for (var x = 0; x < temp.length; x++)
    {
        arr.push(temp[x]);
    }

}

//---------------------Fliter - UI-----------------------------

var booList_lang = {};
var booList_com = {};
var booList_type = {};
var booList_weight = {};
var booList_user = {};

//选择器被改变
function getbooList()
{
/*    console.log("getbooList");
    console.log(fontages);*/
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

    booList_type = {};
    for (var z1 = 0; z1 < pool_type.length; z1++)
    {
        booList_type[pool_type[z1]] = (true == $("#ctag_ty_" + pool_type[z1]).get(0).checked);
    }


    booList_weight = {};
    for (var z2 = 0; z2 < pool_weight.length; z2++)
    {
        booList_weight[pool_weight[z2]] = (true == $("#ctag_we_" + pool_weight[z2]).get(0).checked);
    }

    booList_user = {};
    for (var z3 = 0; z3 < pool_user.length; z3++)
    {
        booList_user[pool_user[z3]] = (true == $("#ctag_us_" + pool_user[z3]).get(0).checked);
    }


/*    console.log(booList_lang);
    console.log(booList_com);
    console.log(booList_type);
    console.log(booList_weight);
    console.log(booList_user);
    console.log("---------------------");*/

    refurDisplay();


    input_allRef();
/*    console.log(booList_lang);
    console.log(booList_com);
    console.log(booList_type);
    console.log(booList_weight);
    console.log(booList_user);*/


    function input_allRef()
    {
       /* console.log($(this).siblings().filter(".chooser_input"));*/
        $(".input_all").each(function ()
        {
            var bool = true;
            $(this).siblings().filter(".chooser_input").each(function ()
            {
                bool *= $(this).get(0).checked;
            });

            $(this)[0].checked = bool;

        })
    }

}


function refurDisplay()
{
    var visible = 0;

    dealFontDisplay(fontages.list, "tags_lang", booList_lang);
    //console.log(fontages.list[0]._visiable + "tags_lang");
    dealFontDisplay(fontages.list, "tags_com", booList_com);
   // console.log(fontages.list[0]._visiable + "tags_com");
    dealFontDisplay(fontages.list, "tags_type", booList_type);
   // console.log(fontages.list[0]._visiable + "tags_type");
    dealFontDisplay(fontages.list, "tags_weight", booList_weight);
   // console.log(fontages.list[0]._visiable + "tags_weight");
    dealFontDisplay(fontages.list, "tags_user", booList_user);
   // console.log(fontages.list[0]._visiable + "tags_user");

    applyVisible(fontages.list);
    hideEmptyGourp();
    hideUnusedBar();
    showOverHeightBut();


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

    _hideUnusedBar_0(booList_com, "co");
    _hideUnusedBar_0(booList_type, "ty");
    _hideUnusedBar_0(booList_weight, "we");
    _hideUnusedBar_0(booList_user, "us");

    function _hideUnusedBar_0(booList, barName)
    {
        for (var i in booList)
        {
            console.log(booList[i]);
            if (booList[i] == 0 || booList[i] == 1)
            {
                $("#ltag_" + barName + "_" + i).addClass("hide");
            }
            else if (booList[i] != undefined)
            {
                $("#ltag_" + barName + "_" + i).removeClass("hide");
            }
        }
    }


    for (var i in booList_com)
    {
        //console.log(booList_com[i]);
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
//---------------------SAVE--------------


//window.cep.fs.makedir ( __dirname + "/UserData")

function saveFontages(fileName)
{
    var data = JSON.stringify(fontages);
    var result = window.cep.fs.writeFile(fileName, data);
    if (0 == result.err)
    {
       // console.log("保存到：" + fileName);
    }
    else
    {
        alert("保存错误\n" + fileName + "\nerr code:" + result.err);
    }
}


function loadFontages(fileName)
{
    var result = window.cep.fs.readFile(fileName);
    if (0 == result.err)// err 为 0 读取成功
    {
        fontages = $.extend(true, new Fontages(), JSON.parse(result.data));
        //fontages = JSON.parse(result.data);
        return true;
    }
    else
    {
        alert("读取错误\n" + fileName + "\nerr code:" + result.err);
        return false;
    }
}

function nowSave()
{
    var p1= cs.getSystemPath(SystemPath.USER_DATA)+"/nullice.psex";
    window.cep.fs.makedir(p1);
    var fileName = p1 +"/fontages.json";
    saveFontages(fileName);


}

function nowLoad()
{

    var p1= cs.getSystemPath(SystemPath.USER_DATA)+"/nullice.psex";
    var fileName = p1 +"/fontages.json";

    if (loadFontages(fileName))
    {
        showfontages();
        return true;
    }
    else
    {
        return false;
    }

}


function reloadChooserBar()
{
    tagFliter_barRefur();
    chooserToHTML();
    getbooList()
    setTimeout(function ()
    {
        showOverHeightBut();
    }, 2000);
}


function rufSetting()
{
    if (g_vmod == 1)
    {
        $("#view_mod1_inp")[0].checked = true;
        fontlistDisplayFromName();
    }

    if (g_vmod == 2)
    {
        $("#view_mod2_inp")[0].checked = true;
        fontlistDisplayFromFamily();
    }

    if (g_vmod == 3)
    {
        $("#previewON")[0].checked = true;
        $(".preview_text").css("display", "block");
        fontlistDisplayFromPreview();
    }

    $(".srang").text(g_fsize);
    $(".fontitem").css("font-size", g_fsize);
    $(".sizeranger>input").val(g_fsize);
}

function saveSetting()
{

    var p1= cs.getSystemPath(SystemPath.USER_DATA)+"/nullice.psex";
    window.cep.fs.makedir(p1);
    var fileName = p1 +"/setting.json";

    var setObj = {
        "g_vmod": g_vmod,
        "diyTagsname": g_diyTagsname
    }

    var data = JSON.stringify(setObj);
    var result = window.cep.fs.writeFile(fileName, data);
    if (0 == result.err)
    {
        console.log("保存到：" + fileName);
    }
    else
    {
        alert("保存错误\n" + fileName + "\nerr code:" + result.err);
    }
}

function loadSetting()
{

    var p1= cs.getSystemPath(SystemPath.USER_DATA)+"/nullice.psex";

    var fileName = p1 +"/setting.json";
    var result = window.cep.fs.readFile(fileName);

    if (0 == result.err)// err 为 0 读取成功
    {
        result = JSON.parse(result.data);
        g_vmod = result.g_vmod;
        g_diyTagsname = result.diyTagsname;

        $("#diyt_lang").val(g_diyTagsname.lang );
        $("#diyt_com").val(g_diyTagsname.com );
        $("#diyt_type").val(g_diyTagsname.type );
        $("#diyt_weight").val(g_diyTagsname.weight);
        $("#diyt_user").val(g_diyTagsname.user );

        return true;
    }
    else
    {
        alert("读取错误\n" + fileName + "\nerr code:" + result.err);

        return false;
    }
}


//------------------main---------

loadSetting();
displayDIYTagsName();

$(document).on("change", ".edit_inl", function (e)
{
    var fid = $(this).parent().parent().parent().parent().attr("id").slice(3);
    if (fid != undefined)
    {
        if ($(this).hasClass("edit_tags"))
        {
            fontages.index(fid)[$(this).attr("inp_for")] = $(this)[0].value.split(",");
        }
        else
        {
            fontages.index(fid)[$(this).attr("inp_for")] = $(this)[0].value;
            $("#fid" + fid).attr("font_" + $(this).attr("inp_for"), $(this)[0].value);

        }

        nowSave();
        rufSetting();
        reloadChooserBar();
        //console.log(fontages.index(fid));
    }
});


var fontages = new Fontages();
$(".act_info").click(act_info);

if (nowLoad())
{

}
else
{
    refurFontags();
}
//-------选中字体操作--------------------------------


$(document).on("click", ".act_out_group", function ()
{
    pf_dismissFonts();
    showfontages();
});


$(document).on("click", ".act_creat_group", function ()
{
    pf_newGroup();
    showfontages();
});


$(document).on("click", ".act_push_group", function ()
{
    if (g_pickLastGroup != undefined && g_pickLastGroup >= 0)
    {
        pf_pushToGroup();
        showfontages();
    }

});

$(document).on("change", ".gname_edit", function ()
{
    if (g_pickLastGroup != undefined && g_pickLastGroup >= 0)
    {
        fontages.list[g_pickLastGroup].groupName = $(this).val();
        g_pickLastGroup_element.children("span:not(.font_number)").text($(this).val());
        nowSave();
    }
});


$(document).on("change", ".setg_group_inp", function ()
{

    if ($(this)[0].checked === true)
    {
        $(".tagcook").removeClass("hide");
    }
    else
    {
        $(".tagcook").addClass("hide");
    }
});

$(document).on("click", ".cook_add", function ()
{
    pf_addPicksTag();
});

$(document).on("click", ".cook_del", function ()
{
    pf_removePicksTag();
});


function pf_dismissFonts()
{//Object.getOwnPropertyNames(g_pickfont).length
    for (var i in g_pickfont)
    {
        fontages.removeFontFromGroup(g_pickfont[i])
    }
    nowSave();
}


function pf_newGroup()
{
    var d = 0;
    var pos = 0;
    for (var i in g_pickfont)
    {
        if (0 == d)
        {
            var o = fontages.index(i, true);
            if (o != undefined)
            {
                if (o.group < 0)
                {
                    pos = fontages.createGroup(fontages.index(i).name, o.font);
                }
                else
                {
                    pos = fontages.createGroup(fontages.index(i).name, o.group);
                }
            }
        }
        d = 1;

        if (fontages.list[pos]._type == "group")
        {
            fontages.moveFontToGroup(g_pickfont[i], pos);
        }

    }
    nowSave();
}


function pf_pushToGroup()
{
    var pos = 0;


    if (g_pickLastGroup != undefined && g_pickLastGroup >= 0)
    {
        var cc = fontages.list[g_pickLastGroup].fonts[0];
        for (var i in g_pickfont)
        {
            fontages.moveFontToGroup(g_pickfont[i], fontages.index(cc._id, true).group);
        }
    }
    nowSave();
}
function pf_addPicksTag()
{
    for (var i in g_pickfont)
    {
        var arr = $(".cook_lang").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            fontages.index(i).tags_lang = fontages.index(i).tags_lang.concat(arr);
            arryUnique(fontages.index(i).tags_lang);
        }

        var arr = $(".cook_com").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            fontages.index(i).tags_com = fontages.index(i).tags_com.concat(arr);
            arryUnique(fontages.index(i).tags_com);
        }

        var arr = $(".cook_type").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            fontages.index(i).tags_type = fontages.index(i).tags_type.concat(arr);
            arryUnique(fontages.index(i).tags_type);
        }

        var arr = $(".cook_weight").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            fontages.index(i).tags_weight = fontages.index(i).tags_weight.concat(arr);
            arryUnique(fontages.index(i).tags_weight);
        }
        var arr = $(".cook_user").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            fontages.index(i).tags_user = fontages.index(i).tags_user.concat(arr);
            arryUnique(fontages.index(i).tags_user);
        }
    }
    rufSetting();
    reloadChooserBar();
    nowSave();
}

function pf_removePicksTag()
{
    for (var i in g_pickfont)
    {
        var arr = $(".cook_lang").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            arryDeletFrom(fontages.index(i).tags_lang, arr);
        }

        var arr = $(".cook_com").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            arryDeletFrom(fontages.index(i).tags_com, arr);
        }

        var arr = $(".cook_type").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            arryDeletFrom(fontages.index(i).tags_type, arr);
        }

        var arr = $(".cook_weight").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            arryDeletFrom(fontages.index(i).tags_weight, arr);
        }
        var arr = $(".cook_user").val().split(",");
        if (arr !== undefined && arr.length > 0)
        {
            arryDeletFrom(fontages.index(i).tags_user, arr);
        }
    }
    rufSetting();
    reloadChooserBar();
    nowSave();
}

//------------------setting page-----------
$(document).on("click", "#addfonts", function ()
{
    refurFontags(true);
    nowSave();
    $("#tagbut1")[0].checked = true;
    $(".page1").show();
    $(".page2").hide();
    $(".page3").hide();


});

$(document).on("click", "#reloadfonts", function ()
{
    refurFontags();
    nowSave();
    $("#tagbut1")[0].checked = true;
    $(".page1").show();
    $(".page2").hide();
    $(".page3").hide();
});





$(document).on("click", "#fontlist_out", function ()
{
    saveFontages(__dirname + "/UserData/fontages.json");
});


$(document).on("change", "#diyt_lang", function ()
{
    g_diyTagsname.lang = $(this).val();
    saveSetting();
    displayDIYTagsName();
});

$(document).on("change", "#diyt_com", function ()
{
    g_diyTagsname.com = $(this).val();
    saveSetting();
    displayDIYTagsName();
});

$(document).on("change", "#diyt_type", function ()
{
    g_diyTagsname.type = $(this).val();
    saveSetting();
    displayDIYTagsName();
});

$(document).on("change", "#diyt_weight", function ()
{
    g_diyTagsname.weight = $(this).val();
    saveSetting();
    displayDIYTagsName();
});


$(document).on("change", "#diyt_user", function ()
{
    g_diyTagsname.user = $(this).val();
    saveSetting();
    displayDIYTagsName();
});




function displayDIYTagsName()
{
    if(g_diyTagsname.lang != "")
    {
        $("#bar_lang>.title>span").text(g_diyTagsname.lang);
    }
    if(g_diyTagsname.com != "")
    {
        $("#bar_com>.title>span").text(g_diyTagsname.com);
    }
    if(g_diyTagsname.type != "")
    {
        $("#bar_type>.title>span").text(g_diyTagsname.type);
    }
    if(g_diyTagsname.weight != "")
    {
        $("#bar_weight>.title>span").text(g_diyTagsname.weight);
    }
    if(g_diyTagsname.user != "")
    {
        $("#bar_user>.title>span").text(g_diyTagsname.user);
    }
}

