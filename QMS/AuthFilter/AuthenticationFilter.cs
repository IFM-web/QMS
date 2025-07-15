using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace QMS.AuthFilter
{
  
        public class AuthenticationFilter : ActionFilterAttribute
        {
            public override void OnActionExecuting(ActionExecutingContext context)
            {
                var userId = context.HttpContext.Session.GetString("UserId");

                if (string.IsNullOrEmpty(userId))
                {
                    var controller = (Controller)context.Controller;

                //context.Result = new RedirectResult("~/Home/Login");
                context.Result = new RedirectToActionResult("Login", "Home", null);
            }
            //else
            //{
            //    db_Utility uti = new db_Utility();
            //    var ds1 = uti.Fill("select ProfileId from Adm_user where Userid='" + context.HttpContext.Session.GetString("UserId") + "'", uti.strElect);
            //    if (ds1.Tables.Count > 0)
            //    {
            //        context.HttpContext.Session.SetString("ProfileId", ds1.Tables[0].Rows[0]["ProfileId"].ToString());
            //    }
            //    else
            //    {
            //        throw new Exception("You Are Ofline, Please Try Again");
            //    }
            //    var ds = uti.Fill("select FlagAdd from GridRights where ProfileId='" + context.HttpContext.Session.GetString("ProfileId") + "'", uti.strElect);
         
            //    if (ds.Tables.Count > 0)
            //    {
            //        if (ds.Tables[0].Rows.Count > 0)
            //        {
            //            context.HttpContext.Session.SetString("FlagAdd", ds.Tables[0].Rows[0][0].ToString());
            //        }
                    
            //    }
                
            //}


        }
        }
    
}

