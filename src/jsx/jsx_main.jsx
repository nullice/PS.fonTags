/**
 * Created by 语冰 on 2015/11/12.
 */
function getFontsJson()
{
    var fontlist = new Object(); // 创建一个要传递的对象
    fontlist.list = [{}];


    if(app.name == "Adobe InDesign")
    {
        fontlist.length = app.fonts.length;
        for (var i=0; i < app.fonts.length; i++)
        {
            fontlist.list[fontlist.list.length]=
            {
                name:app.fonts[i].fullNameNative,
                style:app.fonts[i].fontStyleNameNative,
                typename:"",
                postScriptName:app.fonts[i].postscriptName,
                family:app.fonts[i].fontFamily
            }
        }
    }
    else if(app.name == "Adobe Illustrator")
    {
        fontlist.length = app.textFonts.length;
        for (var i=0; i < app.textFonts.length; i++)
        {
            fontlist.list[fontlist.list.length]= {
                name:app.textFonts[i].family,
                style:app.textFonts[i].style,
                typename:"",
                postScriptName:app.textFonts[i].name,
                family:app.textFonts[i].family
            }
        }
    }
    else
    {//PhotoShop
        //这个例子是获得 PhotoShop 的可用字体列表
        fontlist.length = app.fonts.length;
        for (var i=0; i < app.fonts.length; i++)
        {
            fontlist.list[fontlist.list.length]=
            {
                name:app.fonts[i].name,
                style:app.fonts[i].style,
                typename:app.fonts[i].typename,
                postScriptName:app.fonts[i].postScriptName,
                family:app.fonts[i].family
            }
        }
    }




    return JSON.stringify(fontlist); // 把对象转化成 JSON 字符串并返回
}




function ps_applyLayerFont(fontpsname ,name, fontStyle)
{

    if(app.name == "Adobe InDesign")
    {
        for (var i=0; i<app.selection.length ; i++)
        {
            if(app.selection[i].constructor.name == "TextFrame")
            {
                for(var ii=0; ii<app.selection[i].paragraphs.length; ii++)
                {
                    //app.selection[i].paragraphs[ii].appliedFont =  findFontByPSName(fontpsname);
                    app.selection[i].paragraphs[ii].appliedFont =  app.fonts.item(name);
                    app.selection[i].paragraphs[ii].fontStyle = fontStyle;

                }
            }
            else if(app.selection[i].constructor.name == "Text")
            {
                app.selection[i].appliedFont =  app.fonts.item(name);
                app.selection[i].fontStyle = fontStyle;

               // app.selection[i].appliedFont =  findFontByPSName(fontpsname);
            }
        }
    }
    else if (app.name =="Adobe Illustrator")
    {
        for (var i=0; i<app.selection.length ; i++)
        {
            if(app.selection[i].constructor.name == "TextFrame")
            {
                app.selection[i].textRange.characterAttributes.textFont = app.textFonts.getByName(fontpsname);
            }
        }
    }
    else
    {//PhotoShop

        app.activeDocument.activeLayer.textItem.font=fontpsname;
    }

}


function findFontByPSName(postScriptName)
{
    for(var i=0; i<app.fonts.length; i++)
    {
        if( app.fonts[i].postscriptName == postScriptName)
        {
            return app.fonts[i];
        }
    }
}
