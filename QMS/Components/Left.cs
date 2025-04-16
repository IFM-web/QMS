using System.Data;
using System.Text;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
namespace QMS.Components
{
    public class Left: ViewComponent
    {
        db_Utility Util = new db_Utility();
        ClsUtility ClsUtil = new ClsUtility();

        //public string ProfileId { get; private set; }

        public IViewComponentResult Invoke()
        {
            ViewBag.menu = BindMenu();
            return View("Left");
        }
        public string BindMenu()
        {

            string ProfileId = HttpContext.Session.GetString("ProfileId");
            

   //         string AppPath = "";
   //         AppPath = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}/";
   //         StringBuilder str = new StringBuilder();
			//str.Append("<ul class='list-unstyled components'>");
			//string sql = "[Sp_SetMenu_GetRights_NewElec] @ProfileId = " + ProfileId + ", @PageUrl = '', @AppPath= '" + AppPath + "' ;";
   //         DataSet ds = Util.Fill(sql, Util.strElect);
   //         if (ds.Tables.Count > 0)
   //         {
   //             foreach (DataRow dr in ds.Tables[0].Rows)
   //             {
   //                 str.Append(dr["MenuString"].ToString());
   //             }
   //         }
			//str.Append("</ul>");
			//string str1 = str.ToString();
            return ("");
        }
    }
}
