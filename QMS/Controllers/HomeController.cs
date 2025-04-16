using ifm360Reports.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using QMS.Models;
using QMS;
using System.Data;
using System.Diagnostics;

namespace ifm360Reports.Controllers
{
    public class HomeController : Controller

    {
        db_Utility util = new db_Utility();
        ClsUtility utility = new ClsUtility();
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        public IActionResult TicketClosure()
        {
            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            ViewBag.tickit = util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status='Closed'", util.strElect);
          
            return View();
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public IActionResult Login()
        {

            return View();
        }
        [HttpPost]
        public IActionResult Login(Adm_User obj)
        {

            if (obj.uname=="Admin" && obj.pwd=="Admin")
            {
                return RedirectToAction("Dashboard", "Home");
            }
           
            else
            {
                ViewBag.message = "UserName Or Password Invailed";
            }



            return View();
        }

        public IActionResult Dashboard()
        {
            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            //ViewBag.tickettypee = PopulateDropDownComName("exec udp_GetTicketType", util.strElect);
            //ViewBag.ticketstatus = PopulateDropDownComName("select distinct status from GroupLNewAppTicketMaster where status  in('New','Quotation Approved')", util.strElect);
            return View();
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "Home");
        }
    }
}
