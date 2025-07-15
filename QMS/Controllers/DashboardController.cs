using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Syncfusion.Compression;
using System.Drawing;
using Microsoft.AspNetCore.Mvc.Filters;
using QMS.AuthFilter;
namespace QMS.Controllers
{
    public class DashboardController : Controller
    {
        db_Utility util = new db_Utility();
        public IActionResult DashboardApproved()
        {
            ViewBag.tickit = util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status in ('Quotation Approved')", util.strElect);
            return View();
        }

        [AuthenticationFilter]
        public IActionResult AllItemStatusWise()
        {
            return View();
        }
        public JsonResult AllItemStatus(string status,string CompnayCode,string Region,string Branch,string Customer,string TicketType)
        {
            var ds = util.Fill("exec GrouplNewAppTicketListStatusWise '" + status + "',@CompanyCode='"+CompnayCode+ "',@Region='"+Region+ "',@Branch='"+Branch+ "',@Customer='"+Customer+ "',@TicketType='"+ TicketType + "' ", util.strElect);
            return new JsonResult(JsonConvert.SerializeObject( ds.Tables[0]));
        }






    }
}
