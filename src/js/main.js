/**
 * Created by 语冰 on 2015/11/7.
 */







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


    this.list[this.list.length]=1;

}



















