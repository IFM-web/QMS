using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using static System.Net.Mime.MediaTypeNames;

namespace QMS.Controllers
{
    public class ReportController : Controller
    {
        db_Utility util = new db_Utility();
        public IActionResult SoftServices()
        {
            ViewBag.cust = util.PopulateDropDown("select distinct a.ClientCode,a.ClientName +' ('+a.ClientCode+')' as ClientName from mstsaleclient a join  mstSaleClientDetails b on a.ClientCode=b.ClientCode where b.LocationAutoID in (select   LocationAutoID from mstlocation where CompanyCode in ('GroupLHelpfulPeo','GroupL-InternalN','mmpl','GroupLNewApp') )", util.strElect);
            
            return View();
        }

        public JsonResult GetSoftServices(string visitdate,string Customer,string site,string type)
        {
          
           var ds= util.Fill("exec GrouplNewAppRnMChecklistReport 'Audit',@visitDate='"+visitdate+"',@Customer='" + Customer+ "',@siteName='"+ site + "',@type='"+type+"'", util.strElect);
            var dt1 = ds.Tables[0];
           // var dt2 = ds.Tables[1];
            var dt3 = ds.Tables[1];
            var data = new
            {
                dt1 = dt1,
                //dt2 = dt2,
                dt3 = dt3
            };
            return Json(JsonConvert.SerializeObject(data));
        }
        public JsonResult AuditValueAdd(string visitdate,string Customer,string site,string type,string typesub)
        {
          
           var ds= util.Fill("exec GrouplNewAppRnMChecklistReport 'AuditValueAdd',@visitDate='" + visitdate+"',@Customer='" + Customer+ "',@siteName='"+ site + "',@type='"+type+ "',@typesub='"+ typesub + "'", util.strElect);
            var dt1 = ds.Tables[0];
           // var dt2 = ds.Tables[1];
            var dt3 = ds.Tables[1];
            var data = new
            {
                dt1 = dt1,
                //dt2 = dt2,
                dt3 = dt3
            };
            return Json(JsonConvert.SerializeObject(data));
        }

        public JsonResult GetServiceslist(string Customer, string site, string type,string fromdate,string todate)
        {

            var ds = util.Fill("exec GrouplNewAppRnMChecklistReport 'List', @Customer='" + Customer + "',@siteName='" + site + "',@type='" + type + "',@fromdate='"+ fromdate + "',@todate='" + todate + "'", util.strElect);
            var data = ds.Tables[0];
           
           
            return Json(JsonConvert.SerializeObject(data));
        }

        public JsonResult GetServiceslistheader(string Customer, string site, string type,string subtype, string fromdate, string todate)
        {

            var ds = util.Fill("exec GrouplNewAppRnMChecklistReport 'ListValueadd', @Customer='" + Customer + "',@siteName='" + site + "',@type='" + type + "',@typesub='" + subtype + "',@fromdate='" + fromdate + "',@todate='" + todate + "'", util.strElect);
            var data = ds.Tables[0];


            return Json(JsonConvert.SerializeObject(data));
        }
        public JsonResult Bindsite(string Id)
        {
            var site = util.PopulateDropDown("select AsmtId,AsmtName +' ('+AsmtId+')' from mstsaleclientdetails where clientCode='"+Id+"'", util.strElect);
            return Json(JsonConvert.SerializeObject(site));
        }


        public IActionResult RepairandMaintenanceActivities()
        {
            ViewBag.cust = util.PopulateDropDown("select distinct a.ClientCode,a.ClientName +' ('+a.ClientCode+')' as ClientName from mstsaleclient a join  mstSaleClientDetails b on a.ClientCode=b.ClientCode where b.LocationAutoID in (select   LocationAutoID from mstlocation where CompanyCode in ('GroupLHelpfulPeo','GroupL-InternalN','mmpl','GroupLNewApp') )", util.strElect);

            return View();
        }

        public IActionResult LuxLevelReport()
        {
            ViewBag.cust = util.PopulateDropDown("select distinct a.ClientCode,a.ClientName +' ('+a.ClientCode+')' as ClientName from mstsaleclient a join  mstSaleClientDetails b on a.ClientCode=b.ClientCode where b.LocationAutoID in (select   LocationAutoID from mstlocation where CompanyCode in ('GroupLHelpfulPeo','GroupL-InternalN','mmpl','GroupLNewApp') )", util.strElect);

            return View();
        }
        public IActionResult Thermography()
        {
            ViewBag.cust = util.PopulateDropDown("select distinct a.ClientCode,a.ClientName +' ('+a.ClientCode+')' as ClientName from mstsaleclient a join  mstSaleClientDetails b on a.ClientCode=b.ClientCode where b.LocationAutoID in (select   LocationAutoID from mstlocation where CompanyCode in ('GroupLHelpfulPeo','GroupL-InternalN','mmpl','GroupLNewApp') )", util.strElect);

            return View();
        }
        public IActionResult EarthingTestReportFormat()
        {
            ViewBag.cust = util.PopulateDropDown("select distinct a.ClientCode,a.ClientName +' ('+a.ClientCode+')' as ClientName from mstsaleclient a join  mstSaleClientDetails b on a.ClientCode=b.ClientCode where b.LocationAutoID in (select   LocationAutoID from mstlocation where CompanyCode in ('GroupLHelpfulPeo','GroupL-InternalN','mmpl','GroupLNewApp') )", util.strElect);

            return View();
        }
        public IActionResult ElectricalHealthCheckupReport()
        {
            ViewBag.cust = util.PopulateDropDown("select distinct a.ClientCode,a.ClientName +' ('+a.ClientCode+')' as ClientName from mstsaleclient a join  mstSaleClientDetails b on a.ClientCode=b.ClientCode where b.LocationAutoID in (select   LocationAutoID from mstlocation where CompanyCode in ('GroupLHelpfulPeo','GroupL-InternalN','mmpl','GroupLNewApp') )", util.strElect);

            return View();
        }

    }

}
