using Microsoft.AspNetCore.Mvc;
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
    }
}
