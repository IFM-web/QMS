using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Syncfusion.Compression;

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


        public IActionResult AllItemStatusWise(string id)
        {
            ViewBag.status = id;
            return View();
        }
        public JsonResult AllItemStatus(string status)
        {
            var ds = util.Fill("exec GrouplNewAppTicketListStatusWise '" + status + "' ", util.strElect);
            return new JsonResult(JsonConvert.SerializeObject( ds.Tables[0]));
        }




    }
}
