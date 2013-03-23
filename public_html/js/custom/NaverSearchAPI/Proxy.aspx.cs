using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using MSXML2;

public partial class Proxy : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            XMLHTTP60Class xmlhttp = new XMLHTTP60Class();

            string procstr = "http://openapi.naver.com/search?key=48eec0d77f3b62bfc702c6d31a6760e6";

            for (int i = 0; i < Page.Request.Form.Count; i++)
            {
                if (Page.Request.Form[i].Length == 0) break;
                procstr += "&" + System.Web.HttpUtility.UrlEncode(Page.Request.Form.GetKey(i)) + "=" + System.Web.HttpUtility.UrlEncode(Page.Request.Form[i]);
            }

            xmlhttp.open("GET",
                procstr 
                , false);
            //xmlhttp.setRequestHeader("referer", "http://localhost:57403/NaverSearchAPI/");
            xmlhttp.send();

            string value = xmlhttp.responseText;
            Response.AddHeader("content-type", "application/xml"); // IE에서 이부분 추가가 안되는 경우 jquery에서 XML로 인식이 안되서 작동안함. 무조건 해줄것
            Response.Write(value);
        }
        catch (Exception exc)
        {
            Response.Write(exc.Message);
            
        }
        //xmlhttp.Open("GET", "http://openapi.naver.com/search?query=" + "&display=10&start=1&target=movie" + "&key=" + this.APIKey);
    }
}