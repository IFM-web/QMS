using ifm360Reports.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using QMS.Models;
using QMS;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.Filters;
using QMS.AuthFilter;

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
        [AuthenticationFilter]
        public IActionResult TicketClosure()
        {
            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            ViewBag.tickit = util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status in ('Closed','Closed By Vendor')", util.strElect);
          
            return View();
        }
        [AuthenticationFilter]
        public IActionResult WithoutImageTicketClosure()
        {
            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            ViewBag.tickit = util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status in ('Closed','Closed By Vendor')", util.strElect);

            return View();
        }
        public IActionResult Index()
        {
            return View();
        }
       
        public IActionResult Login()
        {

            return View();
        }
        [HttpPost]
        public IActionResult Login(Adm_User obj)
        {
            if (ModelState.IsValid)
            {

           

			var ds = util.Fill("exec GroupLNewAppTicktingLoginValidate @username='" + obj.uname.Trim() + "',@password='" + obj.pwd.Trim() + "' ", util.strElect);

			//  var userid = ds.Tables[0].Rows[0][0];
			string errmsg = ds.Tables[0].Rows[0][1].ToString();
			if (errmsg != "[]")
			{
				if (errmsg != "Incorrect Password")
				{
					if (errmsg != "Invalid LoginId")
					{
						HttpContext.Session.SetString("UserId", ds.Tables[0].Rows[0]["UserId"].ToString());
						HttpContext.Session.SetString("UserName", ds.Tables[0].Rows[0]["UserName"].ToString());
						

						return RedirectToAction("Dashboard", "Home");
					}
					else
                            TempData["AlertMessage"] = errmsg;

				}
				else if (errmsg == "Incorrect Password")
				{
                        TempData["AlertMessage"] = errmsg;
                    
                }
               
                
            }
              
            }
            return View();


        }
        [AuthenticationFilter]
        public IActionResult Dashboard()
        {
            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            ViewBag.tickettypee = PopulateDropDownComName("exec udp_GetTicketType", util.strElect);
            //ViewBag.tickettypee = PopulateDropDownComName("exec udp_GetTicketType", util.strElect);
            //ViewBag.ticketstatus = PopulateDropDownComName("select distinct status from GroupLNewAppTicketMaster where status  in('New','Quotation Approved')", util.strElect);
            return View();
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "Home");
        }

        public JsonResult bindRegion(string id)
        {
            DataSet ds = util.Fill("exec udp_GetReportPortalRegion @CompanyCode='" + id + "' ", util.strElect);
            DataTable dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }
        public JsonResult bindBranch(string id, string locid)
        {
            DataSet ds = util.Fill("exec udp_GetReportPortalBranch @CompanyCode='" + id + "', @HrLocationCode='" + locid + "' ", util.strElect);
            DataTable dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }

        public List<SelectListItem> PopulateDropDownComName(string Query, string constring, string select = "")
        {
            DataTable dt = new DataTable();
            List<SelectListItem> ddl = new List<SelectListItem>();
            try
            {

                using (SqlConnection con = new SqlConnection(constring))
                using (SqlCommand cmd = new SqlCommand(Query, con))
                {
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        da.Fill(dt);
                }
                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        ddl.Add(new SelectListItem { Text = dt.Rows[i][0].ToString(), Value = dt.Rows[i][0].ToString() });
                    }
                }
                if (select != "")
                {
                    var selddl = ddl.ToList().Where(x => x.Value == select).First();
                    selddl.Selected = true;
                }

            }
            catch (Exception ex)
            {
                throw;
            }
            return ddl;
        }
        //------------------------ User Create Master----------------
        [AuthenticationFilter]
        public IActionResult UserCreation()
        {
            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            ViewBag.Region = util.PopulateDropDown("exec udp_GetReportPortalRegion @CompanyCode='GroupLHelpfulPeo'", util.strElect);
            return View();
        }

        [HttpPost]
        public JsonResult SaveUser(string LoginId ,string UserName,string Password,string Designation,string Company,string Region,string Status,string CompanyName)
        {
            var ds = util.Fill(@$"exec Usp_GroupLNewAppTicketUser 'Insert',@UserName='{UserName}',@LoginId='{LoginId}',@Password='{Password}',@Designation='{Designation}',@CompanyRights='{Company}',@CompanyName='{CompanyName}',@Region='{Region}',@InActive='{Status}' ", util.strElect);
            return Json(JsonConvert.SerializeObject(ds.Tables[0]));

        }
        [AuthenticationFilter]
        public JsonResult ShowUser()
        {
            var User = util.Fill("exec Usp_GroupLNewAppTicketUser 'select'", util.strElect).Tables[0];
            return Json(JsonConvert.SerializeObject(User));
        }
		[HttpPost]
		public JsonResult SaveDeleted(string Id)
		{
			var ds = util.Fill(@$"exec Usp_GroupLNewAppTicketUser 'Delete',@Id='{Id}'", util.strElect);
			return Json(JsonConvert.SerializeObject(ds.Tables[0]));

		}
        [AuthenticationFilter]
        public IActionResult TicketStatusWise()
        {
            ViewBag.Ticket=util.PopulateDropDown("select MannualTicketNo,MannualTicketNo +' ('+Status+')' from GroupLNewAppTicketMaster",util.strElect);

            return View();
        }

	}
}
