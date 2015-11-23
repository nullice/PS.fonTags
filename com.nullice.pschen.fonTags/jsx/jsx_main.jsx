/**
 * Created by 语冰 on 2015/11/12.
 */
function getFontsJson()
{
    var fontlist = new Object(); // 创建一个要传递的对象
    fontlist.length = app.fonts.length;
    fontlist.list = [{}];

    //这个例子是获得 PhotoShop 的可用字体列表
    for (var i=0; i < app.fonts.length; i++)
    {
        fontlist.list[fontlist.list.length]=
        {
            name:app.fonts[i].name,
            style:app.fonts[i].style,
            typename:fonts[i].typename,
            postScriptName:fonts[i].postScriptName,
            family:fonts[i].family
        }
    }

    return JSON.stringify(fontlist); // 把对象转化成 JSON 字符串并返回
}




function ps_applyLayerFont(fontpsname)
{
    app.activeDocument.activeLayer.textItem.font=fontpsname;

}