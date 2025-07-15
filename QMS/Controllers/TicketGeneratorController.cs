using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using QMS.Models;
using Syncfusion.Pdf;
using SelectPdf;
using PdfPageSize = SelectPdf.PdfPageSize;
using Microsoft.VisualBasic;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.CodeAnalysis.Elfie.Serialization;
using System.Numerics;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Drawing.Printing;
using Microsoft.AspNetCore.Mvc.Filters;
using QMS.AuthFilter;


namespace QMS.Controllers
{
    public class TicketGeneratorController : Controller
    {
        db_Utility util = new db_Utility();
        ClsUtility Cls_util = new ClsUtility();

        [Route("GenerateNewTicket")]
        [AuthenticationFilter]
        public IActionResult GenerateNewTicket()
        {
            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            ViewBag.tickettypee = PopulateDropDownComName("exec udp_GetTicketType", util.strElect);
            return View();
        }
        [Route("TicketDashboard")]
        [AuthenticationFilter]
        public IActionResult TicketDashboard()
        {
            ViewBag.tickettypee = PopulateDropDownComName("exec udp_GetTicketType", util.strElect);

            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            ViewBag.ticketstatus = PopulateDropDownComName("select distinct status from GroupLNewAppTicketMaster", util.strElect);
            return View();
        }

        [HttpPost]
        [Route("TicketGenerator/BindCustomer")]
        public JsonResult BindCustomer(string companynameid)
        {
            //string sqlquery = "exec udp_GetCustomerListGroupl @CompanyCode='" + companynameid + "' ";
            string sqlquery = "select Distinct B.ClientCode,B.ClientName +' ('+B.ClientCode +')' as ClientName  from mstSaleClientDetails A  inner join mstSaleClient B on A.ClientCode=B.ClientCode  where LocationAutoID ='" + companynameid + "' ";
            DataSet ds = util.Fill(sqlquery, util.strElect);
            var dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }


        [HttpPost]
        [Route("TicketGenerator/BindCustomerwithcompany")]
        public JsonResult BindCustomerwithcompany(string companynameid)
        {
            //string sqlquery = "exec udp_GetCustomerListGroupl @CompanyCode='" + companynameid + "' ";
            string sqlquery = "select Distinct B.ClientCode,B.ClientName +' ('+B.ClientCode +')' as ClientName  from mstSaleClientDetails A  inner join mstSaleClient B on A.ClientCode=B.ClientCode  where LocationAutoID  in  (select LocationAutoID  from mstLocation where CompanyCode='"+ companynameid + "')";
            DataSet ds = util.Fill(sqlquery, util.strElect);
            var dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }


        [HttpPost]
        [Route("TicketGenerator/BindSite")]
        public JsonResult BindSite(string companynameid, string custmernameid)
        {
            string sqlquery = "exec udp_GetCustomerSiteListGroupl @ClientCode='" + custmernameid + "', @CompanyCode='" + companynameid + "' ";
            DataSet ds = util.Fill(sqlquery, util.strElect);
            var dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }
        [Route("TicketAssignment")]
        [AuthenticationFilter]
        public IActionResult TicketAssignment()
        {
            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            ViewBag.tickettypee = PopulateDropDownComName("exec udp_GetTicketType", util.strElect);
            ViewBag.ticketstatus = PopulateDropDownComName("select distinct status from GroupLNewAppTicketMaster where status  in('Executed Internally','New')", util.strElect);
            return View();
        }


        public JsonResult BindTicketAssigndata(GenerateTicket obj)
        {


            string squery = "exec udp_GetTicketDashboardNew @FromDate='" + obj.fromdate + "' ,@ToDate='" + obj.todate + "' ,@CompanyCode='" + obj.companynameid + "' ,@TicketType= '" + obj.tickettypeid + "',@TicketCategory='" + obj.categoryid + "' ,@Priority= '" + obj.priorityid + "',@ClientCode='" + obj.custmernameid + "' ,@AsmtID='" + obj.sitenameid + "' ,@Status='" + obj.tikitstatus + "' ,@TicketNo= '" + obj.tikitno + "'";



            DataSet ds = util.Fill(squery, util.strElect);
            var dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }

        [HttpPost]
        public JsonResult GetEmpName(string empno)
        {
            DataSet ds = util.Fill("exec udp_GetEmpDetailsGrouplInternal @EmpCode='" + empno + "'", util.strElect);
            var dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }


        [HttpPost]
        [Route("TicketGenerator/BindCategory")]
        public JsonResult BindCategory(string ttype)
        {
            DataTable dt = new DataTable();

            string sqlquery = "exec udp_GetTicketCategory @TicketType='" + ttype + "' ";
            DataSet ds = util.Fill(sqlquery, util.strElect);

            if (ds.Tables[0].Rows.Count > 0)
            {
                dt = ds.Tables[0];
            }
            return Json(JsonConvert.SerializeObject(dt));
        }

        public JsonResult assignRow(string ticketno)
        {
            string sqlquery = "select  MannualTicketNo ,EmpID,EmpName from GroupLNewAppTicketMaster where MannualTicketNo='" + ticketno + "'";
            DataSet ds = util.Fill(sqlquery, util.strElect);
            var dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }



        [Route("GenerateTicketSmartFMWeb")]
        public JsonResult GenerateTicketSmartFMWeb(GenerateTicket obj)
        {
            string UserId = HttpContext.Session.GetString("UserId");
            var ds = util.Fill($"exec udp_GenerateTicketSmartFMWeb @CompanyCode='{obj.companycode}', @TicketType='{obj.ttype}' ,@TicketCategory='{obj.tcate}', @Description='{obj.desc}',@Priority='{obj.priorityid}',@ClientCode='{obj.clientcode}', @asmtID='{obj.asmitid}',@ClientReprentativeName='{obj.CRName}', @ClientReprentativeMobile='{obj.CRMobile}',@ClientReprentativeEmail='{obj.CREmail}',@BranchId='{obj.Branch}',@UserId='{UserId}'", util.strElect);



            var message = ds.Tables[0].Rows[0][1].ToString();
            string GeneratedTicket = ds.Tables[0].Rows[0][0].ToString();
            if (message == "1")
            {
                TicketMail(obj, GeneratedTicket);
                var data = new
                {
                    message = "Ticket Generated Successfully !!!",
                    Status = "Success"
                };
                return Json(data);
            }
            else
            {
                var data = new
                {
                    message = "Error!",
                    Status = "error"
                };
                return Json(data);
            }

        }

        public JsonResult updatestatus(string tikitid, string empcode, string empname)
        {
            var query = "exec udp_AssigmEmployeetoTicket @ticketNo= '" + tikitid + "' , @empID = '" + empcode + "',  @empName = '" + empname + "'";
            var ds = util.Fill(query, util.strElect);

            string clientEmail = ds.Tables[0].Rows[0][1].ToString();
            string clientName = ds.Tables[0].Rows[0][2].ToString();
            string clientmobile = ds.Tables[0].Rows[0][3].ToString();
            if (ds.Tables.Count > 0)
            {
                var message = "";
                var mess = AssignMail(clientEmail, clientName, clientmobile, tikitid, empname);
                if (mess == "Sent")
                {
                    message = "Ticket Assigned SuccessFully !!";
                }

                return Json(message);
            }

            else
            {
                var data = new
                {
                    message = "Error!",
                    Status = "error"
                };
                return Json(data);
            }

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


        public void TicketMail(GenerateTicket obj, string GeneratedTicket)
        {
            var ds = util.Fill("exec udp_GetTicketGeneraterDetails @TicketNo='" + GeneratedTicket + "'", util.strElect);


            string? htmlbody = $@"<!DOCTYPE html><html lang=""en"">
                      <head><style>
                    body {{
                        font-family: 'Arial', sans-serif;
                        background-color: #f3f4f6;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }}

                    .card {{
                        background: #fff;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        border-radius: 12px;
                        text-align: left;
                    }}

                    .card h1 {{
                        font-size: 18px;
                        color: #333;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #4CAF50;
                        padding-bottom: 10px;
                    }}    

                    </style>
                </head>
                <body>
                    <div class=""card"">
                        
                        <p>Dear {obj.CRName},</p>
                        <p>Namaste!</p>
                        <p>Thank you for reaching out. We acknowledge receipt of your complaint, which has been logged into our system under:</p>
        
                            <p style='font-weight:bold;'><span>Ticket Number:</span> {GeneratedTicket}<p>
                              <p style='font-weight:bold;'><span>Customer Name:</span> {ds.Tables[0].Rows[0]["ClientName"].ToString()}</p>
                              <p style='font-weight:bold;'><span>Site Name:</span> {ds.Tables[0].Rows[0]["AsmtName"].ToString()}</p>
                              <p style='font-weight:bold;'><span>Ticket Type:</span> {obj.ttype}</p>
                              <p style='font-weight:bold;'><span>Ticket Category:</span> {obj.tcate}</p>
                              <p style='font-weight:bold;'><span>Ticket Description:</span> {obj.desc}</p>         
                              <p style='font-weight:bold;'><span>Priority:</span> {obj.priorityid}</p>
<br/>
                       We take all concerns seriously and are currently reviewing the matter to ensure it is addressed appropriately. Our team has started investigating the issue and will update you with findings or next steps within 2 business days.
<br/>
<br/>
Thank you for choosing <b>Group<span style='color:red'>L</span> </b> & assuring you best of our services. 
<br/>
<br/>
Warm regards,<br/>
<b>Service Excellence Team</b><br/>
<b>Group<span style='color:red'>L</span> Services</b><br/>

                    </div>
                </body>
                </html>
                ";


            var MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", "" + obj.CREmail + "", "", "", "GroupL Acknowledgement : Ticket #" + GeneratedTicket + "", htmlbody.ToString(), "qglnwhqumptscpgf", "smtp.gmail.com", "");

        }


        public string AssignMail(string clientEmail, string clientName, string clientmobile, string tickedtno, string empname)
        {

            string assignhtml = $@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Email Template</title>
</head>
<body style=""font-family: Arial, sans-serif; line-height: 1.5;"">
    <p>Dear {clientName},</p>

I hope this message finds you well. <br/>
    <p>
        We would like to inform you that your ticket - {tickedtno}, has been assigned to {empname} for resolution.
    </p>

    <p>Details of the assigned member:</p>
  
        <p>Name: {empname}</p>
        <p>Mobile No.: {clientmobile}</p>
    

    <p>
        {empname} will be working on your concern and will keep you updated on the progress. <br/><br/>
Should you have any further details to share or questions regarding this ticket, feel free to reach out directly to  {empname} or contact our support team at 
        <a href=""mailto:first-impressions@group1.in"">first-impressions@groupL.in</a> or 8100432758.
    </p>

    <p>
       Thank you for choosing <b>Group<span style='color:red'>L</span></b> & assuring you best of our services. 
    </p>
<br/>
<br/>
Warm regards,<br/>
<b>Service Excellence Team</b><br/>
<b>Group<span style='color:red'>L</span> Services </b><br/>
</body>
</html>

";

            var MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", "" + clientEmail + "", "", "", "GroupL Update: Technician Assigned – Ticket #" + tickedtno + "", assignhtml.ToString(), "qglnwhqumptscpgf", "smtp.gmail.com", "");

            return MailStatus;
        }





        public static string ToFixedTruncate(double value, int digits)
        {
            double factor = Math.Pow(10, digits);
            double truncated = Math.Truncate(value * factor) / factor;
            return truncated.ToString("F" + digits);
        }


        [AuthenticationFilter]
        public IActionResult QuotationtoClientPDF1(string tickitnoid, string baseUrl, string pageSize = "A4", string orientation = "portrait", int webPageWidth = 1024, int webPageHeight = 0)

        {

            DataTable dt = new DataTable();
            DataTable dt2 = new DataTable();

            string sqlquery = "select * from AddQoutaion where  TicketNo='" + tickitnoid + "' ";
            string sqlquery2 = "exec udp_GetTicketGeneraterDetails @TicketNo='" + tickitnoid + "' ";
            DataSet ds = util.Fill(sqlquery, util.strElect);
            DataSet ds2 = util.Fill(sqlquery2, util.strElect);
            dt = ds.Tables[0];
            dt2 = ds2.Tables[0];

            double total = 0.0;

            string htmldesign = $@"
    <!DOCTYPE html>
    <html lang=""en"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Quotation</title>
<style>
   ol li{{margin: 10px 0;
      
  }}
</style>   </head>
    <body style=""font-family: Arial, sans-serif; margin: 40px; padding: 0;"">
        <!-- Logo and Header -->
        <div style=""text-align: center;"">
            <img src=""https://ifm360.in/grouplreportingportal/grouplreportingportal/GroupL.jfif"" alt=""Group L Logo"" style=""max-width: 150px;"">
        </div>
<div style=""text-align: center; margin-bottom: 20px;"">
GroupL Services Private Limited
<br/>
W-31 3rd floor Okhla industrial area phase-2 New Delhi 110020
</div><br/><br/>
        <h2 style=""text-align: center; margin: 10px 0;"">Quotation</h2>

        <!-- Customer Details -->
        <div style=""display: flex; justify-content: space-between; margin: 10px 0;"">
            <div>
                <p style=""margin: 0;""><strong>Customer Name:</strong> {dt2.Rows[0]["ClientName"]}</p>
                <p style=""margin: 0;""><strong>Branch:</strong> {dt2.Rows[0]["AsmtName"]}</p>
            </div>
            <div>
                <p style=""margin: 0;""><strong>Ticket No.:</strong> {tickitnoid}</p>
                <p style=""margin: 0;""><strong>Ticket Date:</strong> {dt2.Rows[0]["TicketDate"]}</p>
  <p style=""margin: 0;""><strong>Quotation Date:</strong> {Convert.ToDateTime(dt.Rows[0]["Entrydate"]).ToString("dd MMM yyyy")}</p>
            </div>
        </div>

        <!-- Table -->
        <table style=""width: 100%; border-collapse: collapse; margin-top: 20px;"">
            <thead>
                <tr>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">S.NO</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Item Code</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Item Name</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">GST</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Qty</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Unit</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Rate</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Gross Amount</th>
                </tr>
            </thead>
            <tbody>";

            // Loop through the DataTable rows and add data to the table dynamically
            for (int i = 0; i < dt.Rows.Count; i++)
            {

                int quantity = Convert.ToInt32(dt.Rows[i]["ItemQty"]);
                double rate = Convert.ToDouble(dt.Rows[i]["ItemRate"]);

                htmldesign += $@"
        <tr>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{i + 1}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemCode"]}</td>
            <td style=""border: 1px solid #000; padding: 8px;"">{dt.Rows[i]["ItemName"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemGST"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemQty"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemUnit"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemRate"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{(rate * quantity)}</td>
        </tr>";

                string v = dt.Rows[i]["ItemRate"].ToString();
                double itemRate = Convert.ToDouble(v);


                total += quantity * itemRate;

                double grossAmount = itemRate * quantity;


            }

            string MagagePercent = dt2.Rows[0]["ManagePercent"].ToString();
            int percent = Convert.ToInt32(MagagePercent.Replace("%", ""));
            double ManageAmt = total * percent / 100;

            double gst = (total + ManageAmt) * 18 / 100;
            double finalamt = Convert.ToDouble(ToFixedTruncate((gst + total + ManageAmt), 2));

            string words = ConvertRupeesPaise(finalamt);




            htmldesign += $@"
            </tbody>
            <tfoot>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Total</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{total}</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Management Fee ({MagagePercent})</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{ManageAmt}</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>GST 18%</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{ToFixedTruncate(gst, 2)}</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Grand Total</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{finalamt}</td>
                </tr>
            </tfoot>
        </table>
 <div style=""margin-top: 10px; font-style: italic;"">
        Amount in Words: {words}    </div>
<div><br/>

<p><b>Terms and Conditions:</b></p>
<ol>
  <li>This quotation is valid for 30 days from the date of issue.</li>
  <li>Scope of work will be clearly defined, including both inclusions and exclusions.</li>
  <li>Quantity, unit price, and applicable taxes will be mentioned for each item/service.</li>
  <li>Payment terms will include advance percentage, balance payment timeline, and any applicable penalties for delay.</li>
  <li>Taxes and duties (e.g., GST) will be specified as either inclusive or exclusive.</li>
  <li>Labour charges will either be included or mentioned separately, if applicable.</li>
  <li>Responsibility for transportation costs will be defined—either borne by the vendor or the client.</li>
  <li>Delivery will be made within a specified number of working days from order confirmation.</li>
  <li>Items will be delivered to the location specified by the client.</li>
  <li>Installation will either be included or quoted separately with relevant terms.</li>
  <li>Warranty details for materials and/or installation will be provided, including duration and conditions.</li>
  <li>Client will ensure access to necessary utilities like water, electricity, and site access during execution.</li>
  <li>All required municipal or statutory permits and approvals shall be obtained by the client.</li>
  <li>Any variation in quantity or specifications after approval will be subject to revised quotation and client confirmation.</li>
  <li>Delays caused by force majeure events (e.g., natural disasters, strikes) will not be considered the vendor's responsibility.</li>
  <li>Work shall be considered complete only after formal sign-off by the client.</li>
</ol>

</div><br/>
<p>Prepared by: {dt2.Rows[0]["Preparedby"]}</p>
<p>Employee Id: {dt2.Rows[0]["LoginId"]}</p> 
<p>Designation: {dt2.Rows[0]["Designation"]}</p>


<div style='margin-top:50px; text-align:center;'><b>This is a system-generated quotation. Signature is not required.<br/>
Thank you for your Business<b></div>


    </body>
    </html>";








            PdfPageSize pdfPageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), pageSize, true);
            SelectPdf.PdfPageOrientation pdfOrientation = (SelectPdf.PdfPageOrientation)Enum.Parse(typeof(SelectPdf.PdfPageOrientation), orientation, true);


            HtmlToPdf converter = new HtmlToPdf();

            converter.Options.PdfPageSize = pdfPageSize;
            converter.Options.PdfPageOrientation = pdfOrientation;
            converter.Options.WebPageWidth = webPageWidth;
            converter.Options.WebPageHeight = webPageHeight;
            converter.Options.MarginTop = 20;
    

            // Convert HTML string to PDF
            SelectPdf.PdfDocument doc = converter.ConvertHtmlString(htmldesign, baseUrl);
            // SelectPdf.PdfDocument doc = converter.ConvertUrl(baseUrl);

            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/QuotationPDF/");

            // Ensure the directory exists
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            DateTime date = DateTime.Now;
            var namedate = date.ToString("dd-mm-yyyy-HH-mm-ss-fff");
            // Define the file name and path
            string fileName = tickitnoid + namedate.ToString() + ".pdf";
            string filePath = Path.Combine(folderPath, fileName);

            // Save the PDF to the file system
            doc.Save(filePath);
            doc.Close();

            DataSet ds3 = util.Fill("select ClientName,ClientEmail from GroupLNewAppTicketMaster where MannualTicketNo='" + tickitnoid + "'", util.strElect);

            string ClientName = ds3.Tables[0].Rows[0][0].ToString();
            string ClientEmail = ds3.Tables[0].Rows[0][1].ToString();

            string tbody = $@"<!DOCTYPE html>
<html lang = ""en"">
<head><meta charset = ""UTF-8""><meta name = ""viewport"" content = ""width=device-width, initial-scale=1.0"">
   </head>
<body style = ""font-family: Arial, sans-serif; line-height: 1.6;""><p> Dear {ClientName},</p>
<p>Namaste!</p>

    <p>Please find attached the quotation for your review and approval, as per the requirement raised under Ticket #{tickitnoid}. The quotation includes detailed pricing, scope of work, and applicable terms and conditions.<br/><br/>
Kindly review and confirm your approval at the earliest convenience so we may proceed accordingly. If there are any clarifications or modifications required, please feel free to let us know. <p>

    <div style = ""margin: 20px 0;""><a href = ""https://ifm360.in/Ticketing/QMS/ApprovedAndReview?type=Approved&&ticketno={tickitnoid}""
           style = ""display: inline-block; padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 4px; margin-right:10px;"">Approve</a>
        <a href = ""https://ifm360.in/Ticketing/QMS/ApprovedAndReview?type=Reviewed&&ticketno={tickitnoid}""
           style = ""display: inline-block; padding: 10px 20px; color: #fff; background-color: red; text-decoration: none; border-radius: 4px;"">
           Reject  </a></div>

 <p>
       Thank you for choosing <b>Group<span style='color:red'>L</span></b> & assuring you best of our services. 
    </p>
<br/>
<br/>
Warm regards,<br/>
<b>Service Excellence Team</b><br/>
<b>Group<span style='color:red'>L</span> Services </b><br/>

</body></html>";



            var MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", ClientEmail, "", "", "GroupL Update: Quotation Submission for Approval for Ticket No #" + tickitnoid, tbody, "qglnwhqumptscpgf", "smtp.gmail.com", filePath);

            // Return a success message or file path to the client
            return Json(new { success = "PDF Attachment send to the Client Mail SuccessFully !!" });
        }

        static string[] ones = { "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine" };
        static string[] teens = { "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };
        static string[] tens = { "", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };
        static string[] thousands = { "", "Thousand", "Lakh", "Crore" };

        public static string NumberToWords(int num)
        {
            if (num == 0) return "Zero";

            string numStr = num.ToString();
            string word = "";
            int n = numStr.Length;

            if (n > 9) return "Overflow"; // max 9 digits

            numStr = numStr.PadLeft(9, '0');

            string crore = numStr.Substring(0, 2);
            string lakh = numStr.Substring(2, 2);
            string thousand = numStr.Substring(4, 2);
            string hundred = numStr.Substring(6, 1);
            string ten = numStr.Substring(7, 2);

            if (int.Parse(crore) > 0)
                word += $"{ConvertTwoDigits(int.Parse(crore))} Crore ";
            if (int.Parse(lakh) > 0)
                word += $"{ConvertTwoDigits(int.Parse(lakh))} Lakh ";
            if (int.Parse(thousand) > 0)
                word += $"{ConvertTwoDigits(int.Parse(thousand))} Thousand ";
            if (int.Parse(hundred) > 0)
                word += $"{ones[int.Parse(hundred)]} Hundred ";
            if (int.Parse(ten) > 0)
                word += $"{(word != "" ? "and " : "")}{ConvertTwoDigits(int.Parse(ten))}";

            return word.Trim();
        }

        public static string ConvertTwoDigits(int num)
        {
            if (num == 0) return "";
            if (num < 10) return ones[num];
            if (num == 10) return "Ten";
            if (num > 10 && num < 20) return teens[num - 11];

            int unit = num % 10;
            int ten = num / 10;
            return $"{tens[ten]} {ones[unit]}".Trim();
        }

        public static string ConvertRupeesPaise(double amount)
        {
            string[] parts = amount.ToString("0.00").Split('.');
            string rupeesInWords = NumberToWords(int.Parse(parts[0]));
            string paiseInWords = ConvertTwoDigits(int.Parse(parts[1]));

            string result = "";
            if (!string.IsNullOrEmpty(rupeesInWords))
                result += $"{rupeesInWords} Rupees";
            if (!string.IsNullOrEmpty(paiseInWords) && paiseInWords != "Zero")
                result += $" and {paiseInWords} Paise";

            return result.Trim();
        }

        [Route("QMS/ApprovedAndReview")]
     
        public IActionResult ApprovedAndReview(string type, string ticketno)

        {

            var st = "Quotation " + type.Replace("'", "");

            var ds = util.Fill("select status from GroupLNewAppTicketMaster  where MannualTicketNo='" + ticketno + "' ", util.strElect);
            string stmes = ds.Tables[0].Rows[0][0].ToString();

            if (stmes != "Quotation Reviewed")
            {
                if (stmes != "Quotation Approved")
                {

                    util.Fill("update GroupLNewAppTicketMaster set Status='" + st + "'  where MannualTicketNo='" + ticketno + "' ", util.strElect);

                    ViewBag.mass = st;
                    return View();
                }
                else
                {
                    ViewBag.mass = "Already Quotation Approved ";
                    return View();
                }


            }
            else
            {
                ViewBag.mass = "Already Quotation Reviewed";
                return View();
            }


        }

        [Route("QMS/ApprovedAndReview1")]
        public JsonResult ApprovedAndReview1(string type, string ticketno)

        {

            var st = "Quotation " + type.Replace("'", "");
            var data = "";
          

           
            var ds = util.Fill("select a.status,b.clientName,c.AsmtName[SiteName],CAST(REPLACE(ISNULL(m.FeePercent, '0%'), '%', '') AS INT)FeePercent from GroupLNewAppTicketMaster a join mstSaleClient b on a.clientcode=b.clientcode join mstSaleClientDetails c on a.clientcode=c.clientcode and a.AsmtId=c.AsmtId left join GroupLNewAppManageFeeMaster m on a.ManageFeesId=m.Id  where a.MannualTicketNo='" + ticketno + "' ", util.strElect);

            string stmes = ds.Tables[0].Rows[0]["status"].ToString();
            string CleintName = ds.Tables[0].Rows[0]["clientName"].ToString();
            string SiteName = ds.Tables[0].Rows[0]["SiteName"].ToString();
            string MagagePercent = ds.Tables[0].Rows[0]["FeePercent"].ToString();
            int percent = Convert.ToInt32(MagagePercent.Replace("%", ""));
           

            if (stmes != "Quotation Reviewed")
            {
                if (stmes != "Quotation Approved" )
                {
                    
                    
                   if (st == "Quotation Reviewed")
                        {
                            util.Fill("update GroupLNewAppTicketMaster set Status='" + st + "',ReviewedDate=getdate()  where MannualTicketNo='" + ticketno + "' ", util.strElect);
                        }
                        else if (st == "Quotation Approved")
                        {

                            var ds1 = util.Fill("select sum(amt) as Amount from (SELECT (cast(b.ItemRate as numeric(18,2))* cast(b.ItemQty as numeric(18,0))) as amt from GroupLNewAppTicketMaster a\r\nJOIN AddQoutaion b ON a.MannualTicketNo = b.TicketNo\r\nWHERE a.MannualTicketNo = '" + ticketno + "')a;", util.strElect);
                            double amount = Convert.ToDouble(ds1.Tables[0].Rows[0]["Amount"]);
                            double ManageAmt = amount * percent / 100;
                            double gst = (amount + ManageAmt) * 18 / 100;


                            double totalamt = Convert.ToDouble(ToFixedTruncate((amount + gst + ManageAmt), 2));
                            if (totalamt > 20000.00)
                            {
                                string msg = ForApprovalQuation(CleintName, SiteName, ticketno, totalamt);
                                if (msg == "Sent")
                                {
                                    // util.Fill("update GroupLNewAppTicketMaster set Status='Quotation Sent For Approval',ForApprovalDate=getdate()  where MannualTicketNo='" + ticketno + "' ", util.strElect);
                                    data = "Quotation Sent For Approval";
                                }

                            }
                            else
                            {
                                util.Fill("update GroupLNewAppTicketMaster set Status='" + st + "',ApproveDate=getdate()  where MannualTicketNo='" + ticketno + "' ", util.strElect);
                            }

                           
                        }
                        else if(st == "Quotation Vendor Approved")
                        {
                            util.Fill("update GroupLNewAppTicketMaster set Status='" + st + "',Vendor_Approve_Date=getdate()  where MannualTicketNo='" + ticketno + "' ", util.strElect);
                        }
                      

                        data = st;

                 }
                   

                
                else
                {
                    data = "Already Quotation Approved ";

                }


            }
            else
            {
                data = "Already Quotation Reviewed ";

            }

            return Json(new { message = data });
        }




        [Route("QMS/ReviewToMail")]
        public JsonResult ReviewToMail(string type, string ticketno)
        {

            var st = "Quotation " + type.Replace("'", "");
            var data = "";

            var ds = util.Fill("select b.Name,b.Email from GroupLNewAppTicketMaster a join VendorMaster b on a.VendorId=b.Id where MannualTicketNo='" + ticketno + "' ", util.strElect);

            string Name = ds.Tables[0].Rows[0][0].ToString();
            string Email = ds.Tables[0].Rows[0][1].ToString();
            string tbody = $@"<p>Dear {Name},</p>

<p>We kindly request you to Review Quotation for <strong>Group L</strong>.</p>

<p>Please click the button below to access the quotation page:</p>

<p>
  <a href=""https://ifm360.in/Ticketing/TicketGenerator/ReviewedVendorItem/?ticketno={ticketno}"" style=""display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"">
                Review Quotation
  </a>
</p>


<p>Best regards,<br>GroupL Team</p>";

            var MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", Email, "", "", "Review Quotation", tbody, "qglnwhqumptscpgf", "smtp.gmail.com", "");

            data = util.execQuery("Update GroupLNewAppTicketMaster set status='Review Quotation Pending from Vendor',Vendor_Reviewed_Date=getdate()  where MannualTicketNo='" + ticketno + "' ", util.strElect);


            return Json(new { message = "Quotation Sent To Vendor For Review" });


        }



        [Route("QMS/Quotationexecute")]
        public JsonResult Quotationexecute(string type, string ticketno)

        {


            var data = "";

            var ds = util.Fill("select status from GroupLNewAppTicketMaster  where MannualTicketNo='" + ticketno + "' ", util.strElect);
            string stmes = ds.Tables[0].Rows[0][0].ToString();

            if (stmes != "Executed Internally")
            {
                if (stmes != "Executed by Vendor")
                {

                    util.Fill("update GroupLNewAppTicketMaster set Status='" + type + "',ExecutedInternally_Date=getdate()  where MannualTicketNo='" + ticketno + "' ", util.strElect);

                    data = type;

                }
                else
                {
                    data = "Already Executed by Vendor";

                }


            }
            else
            {
                data = "Already Executed Internally";

            }

            return Json(new { message = data });
        }


        //------------------------dashboard-------------------------------
        public JsonResult ShowDashboard(GenerateTicket obj)
        {


            string query = "exec udp_GetTicketDashboardNew @FromDate='" + obj.fromdate + "' ,@ToDate='" + obj.todate + "' ,@CompanyCode='" + obj.companycode + "' ,@TicketType= '" + obj.ttype + "',@TicketCategory='" + obj.tcate + "' ,@Priority= '" + obj.priorityid + "',@ClientCode='" + obj.clientcode + "' ,@AsmtID='" + obj.asmitid + "' ,@Status='" + obj.status + "' ,@TicketNo= '" + obj.ticketno + "'";
            var ds = util.Fill(query, util.strElect);


            var dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }


        public JsonResult GetDataToReview(string TicketNo)
        {

            var ds = util.Fill("select a.* from AddQoutaion a join GroupLNewAppTicketMaster b on a.TicketNo=b.MannualTicketNo where b.Status='Quotation Reviewed' and b.MannualTicketNo='" + TicketNo + "'", util.strElect);


            var dt = ds.Tables[0];
            return Json(JsonConvert.SerializeObject(dt));
        }

        public JsonResult binddashboard(string companynameid, string zone, string branch,string Customer,string TicketType)
        {
            DataTable dt = new DataTable();

            string sqlquery = "exec udp_GetTicketDashboardGrouplNewApp @CompanyCode='" + companynameid + "',@Region='"+zone+ "',@Branch='"+branch+ "',@Customer='"+Customer+ "' ,@TicketType ='"+TicketType+"'";
            DataSet ds = util.Fill(sqlquery, util.strElect);

            if (ds.Tables[0].Rows.Count > 0)
            {
                dt = ds.Tables[0];
            }
            return Json(JsonConvert.SerializeObject(dt));
        }


        public JsonResult TicketClosureBind(string ticketno)
        {
            string sqlquery = "select * from GroupLNewAppTicketMaster where MannualTicketNo='" + ticketno + "'";
            DataSet ds = util.Fill(sqlquery, util.strElect);
            var dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }


        public JsonResult GetDataToReviewdd(string TicketNo)
        {

            var ds = util.Fill("select a.* from AddQoutaion a join GroupLNewAppTicketMaster b on a.TicketNo=b.MannualTicketNo where b.Status='Quotation Reviewed' and b.MannualTicketNo='" + TicketNo + "'", util.strElect);


            var dt = ds.Tables[0];
            return Json(JsonConvert.SerializeObject(dt));
        }
        public JsonResult GetDataToReviewddclose(string TicketNo)
        {

            var ds = util.Fill("select a.* from AddQoutaion a join GroupLNewAppTicketMaster b on a.TicketNo=b.MannualTicketNo where b.Status='Closed' and b.MannualTicketNo='" + TicketNo + "'", util.strElect);


            var dt = ds.Tables[0];
            return Json(JsonConvert.SerializeObject(dt));
        }

        #region Vendor List

        [AuthenticationFilter]
        public IActionResult VendorLists(string? TicketNo)

        {
            var ds = util.Fill("select * from VendorMaster", util.strElect);
            ViewBag.TicketNo = TicketNo;
            ViewBag.dt = ds.Tables[0];
            return View("VendorList");
        }

        public JsonResult SendToVendor(string Id, string TicketNo)
        {
            var ds = util.Fill("select Name,Email from VendorMaster where id='" + Id + "'", util.strElect);
            string Name = ds.Tables[0].Rows[0][0].ToString();
            string Email = ds.Tables[0].Rows[0][1].ToString();
            string mes = "";

            if (Email != "")
            {
                mes = util.execQuery("Update GroupLNewAppTicketMaster set status='Executed by Vendor',ExecutedbyVendor_Date=getdate(),VendorId='" + Id + "' where MannualTicketNo='" + TicketNo + "' ", util.strElect);

                string tbody = $@"<p>Dear {Name},</p>

<p>We kindly request you to update the item prices for <strong>Group L</strong>.</p>

<p>Please click the button below to access the quotation page:</p>

<p>
  <a href=""https://ifm360.in/Ticketing/TicketGenerator/SubmitbyVendor/?ticketno={TicketNo}"" style=""display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"">
                Update Prices
  </a>
</p>


<p>Best regards,<br>GroupL Team</p>
";



                var MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", Email, "", "", "Update Items Price GroupL", tbody, "qglnwhqumptscpgf", "smtp.gmail.com", "");

            }
            if (mes == "Successfull")
            {
                mes = "Quotation Sent To Vendor  !!";
            }
            else
            {
                mes = "Failed To Sent";
            }

            return Json(JsonConvert.SerializeObject(mes));

        }

        [AuthenticationFilter]
        public IActionResult SubmitbyVendor(string ticketno)
        {
            var ds = util.Fill("select Id,ItemCode,ItemName,ItemUnit,isnull(ItemRate,'0')ItemRate,isnull(ItemQty,0)ItemQty from AddQoutaion a join GroupLNewAppTicketMaster b on a.TicketNo=b.MannualTicketNo where Status='Executed by Vendor' and TicketNo='" + ticketno + "'", util.strElect);
            ViewBag.dt = ds.Tables[0];
            ViewBag.ticketNo = ticketno;
            return View("SubmitbyVendor");
        }


        [HttpPost]
        public JsonResult UpdatebyVendor()
        {
            string JsonData = Request.Form["JsonData"].ToString();
            string ticketNO = Request.Form["ticketNO"].ToString();
            string msg = "";
            var obj = JArray.Parse(JsonData);
            foreach (var item in obj)
            {
                msg = util.execQuery("Update AddQoutaion set ItemRate='" + item["rate"] + "',GrossAmt='" + item["toatal"] + "' where  Id='" + item["Id"] + "' ", util.strElect);
            }
            if (msg == "Successfull")
            {
                msg = util.execQuery("update GroupLNewAppTicketMaster set Status='Quotation Submitted by Vendor',Quotation_Submitted_by_Vendor_Date=getdate() where MannualTicketNo='" + ticketNO + "' ", util.strElect);
            }
            return Json(JsonConvert.SerializeObject(msg));
        }
        [HttpPost]
        public JsonResult UpdatebyVendorReview()
        {
            string JsonData = Request.Form["JsonData"].ToString();
            string ticketNO = Request.Form["ticketNO"].ToString();
            string msg = "";
            var obj = JArray.Parse(JsonData);
            foreach (var item in obj)
            {
                msg = util.execQuery("Update AddQoutaion set ItemRate='" + item["rate"] + "',GrossAmt='" + item["toatal"] + "' where  Id='" + item["Id"] + "' ", util.strElect);
            }
            if (msg == "Successfull")
            {
                msg = util.execQuery("update GroupLNewAppTicketMaster set Status='Reviewed Quotation Submitted by Vendor',Reviewed_Q_SubmittedbyVendorDate=getdate() where MannualTicketNo='" + ticketNO + "' ", util.strElect);
            }
            return Json(JsonConvert.SerializeObject(msg));
        }


        #endregion


        public IActionResult ReviewedVendorItem(string ticketno)
        {
            var ds = util.Fill("select Id,ItemCode,ItemName,ItemUnit,isnull(ItemRate,'0')ItemRate,isnull(ItemQty,0)ItemQty,GrossAmt from AddQoutaion a join GroupLNewAppTicketMaster b on a.TicketNo=b.MannualTicketNo where Status='Review Quotation Pending from Vendor' and TicketNo='" + ticketno + "'", util.strElect);
            ViewBag.dt = ds.Tables[0];
            ViewBag.ticketNo = ticketno;
            return View();
        }


        public JsonResult AssigntoVendor(string ticketNO)
        {
            DataTable dt = new DataTable();
            DataTable dt2 = new DataTable();

            string sqlquery = "select * from AddQoutaion where  TicketNo='" + ticketNO + "' ";
            string sqlquery2 = "exec udp_GetTicketGeneraterDetails @TicketNo='" + ticketNO + "' ";

            DataSet ds = util.Fill(sqlquery, util.strElect);
            DataSet ds2 = util.Fill(sqlquery2, util.strElect);
            dt = ds.Tables[0];
            dt2 = ds2.Tables[0];

            var ds3 = util.Fill("select b.Name,b.Email,a.Observation,a.Description from GroupLNewAppTicketMaster a join VendorMaster b on a.VendorId=b.Id where MannualTicketNo='" + ticketNO + "' ", util.strElect);

            //string Name = ds3.Tables[0].Rows[0][0].ToString();
            string Email = ds3.Tables[0].Rows[0][1].ToString();
            string Observation = ds3.Tables[0].Rows[0][2].ToString();
            string Description = ds3.Tables[0].Rows[0][3].ToString();

            double total = 0;

            string htmldesign = $@"
    <!DOCTYPE html>
    <html lang=""en"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Quotation</title>
<style>ol li{{margin: 10px 0;
       
  }}</style>
    </head>
    <body style=""font-family: Arial, sans-serif; margin: 40px; padding: 0;"">
        <!-- Logo and Header -->
        <div style=""text-align: center; margin-bottom: 0px;"">
            <img src=""https://ifm360.in/grouplreportingportal/grouplreportingportal/GroupL.jfif"" alt=""Group L Logo"" style=""max-width: 150px;"">
        </div>
        <h2 style=""text-align: center; margin: 10px 0;"">Quotation</h2>

        <!-- Customer Details -->
        <div style=""margin:5px 0;"">
            <div>
                <p style=""margin: 0;""><strong>Customer Name:</strong> {dt2.Rows[0]["ClientName"]}</p>
                <p style=""margin: 0;""><strong>Branch:</strong> {dt2.Rows[0]["AsmtName"]}</p>
            </div>
            <div style='margin-right:10px;'>
                <p style=""margin: 0;""><strong>Ticket No.:</strong> {ticketNO}</p>
              
            </div>
 
        </div>
<p style=""margin: 0;""><strong>Observation:</strong> {Observation}</p>
                <p style=""margin: 0;""><strong>Description:</strong> {Description}</p>
        <!-- Table -->
        <table style=""width: 100%; border-collapse: collapse; margin-top: 20px;"">
            <thead>
                <tr>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">SrNO</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Item Code</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Item Name</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">GST</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Qty</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Unit</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Rate</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Gross Amount</th>
                </tr>
            </thead>
            <tbody>";

            // Loop through the DataTable rows and add data to the table dynamically
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                string v = dt.Rows[i]["ItemRate"].ToString();
                double itemRate = Convert.ToDouble(v);

                int quantity = Convert.ToInt32(dt.Rows[i]["ItemQty"]);

                htmldesign += $@"
        <tr>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{i + 1}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemCode"]}</td>
            <td style=""border: 1px solid #000; padding: 8px;"">{dt.Rows[i]["ItemName"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemGST"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemQty"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemUnit"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemRate"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{itemRate * quantity}</td>
        </tr>";



                total += quantity * itemRate;

                double grossAmount = itemRate * quantity;


            }

            //string MagagePercent = dt2.Rows[0]["ManagePercent"].ToString();
            //int percent = Convert.ToInt32(MagagePercent.Replace("%", ""));
            //double ManageAmt = total * percent / 100;

            double gst = (total) * 18.0 / 100;
            double finalamt = Convert.ToDouble(ToFixedTruncate((gst + total), 2));

            string words = ConvertRupeesPaise(finalamt);



            htmldesign += $@"
            </tbody>
            <tfoot>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Total</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{total}</td>
                </tr>
              
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>GST 18%</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{ToFixedTruncate(gst, 2)}</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Grand Total</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{finalamt}</td>
                </tr>
            </tfoot>
        </table>
 <div style=""margin-top: 10px; font-style: italic;"">
        Amount in Words: {words}    </div>
<div><br/>

<p><b>Terms and Conditions:</b></p>
<ol>
  <li>This quotation is valid for 30 days from the date of issue.</li>
  <li>Scope of work will be clearly defined, including both inclusions and exclusions.</li>
  <li>Quantity, unit price, and applicable taxes will be mentioned for each item/service.</li>
  <li>Payment terms will include advance percentage, balance payment timeline, and any applicable penalties for delay.</li>
  <li>Taxes and duties (e.g., GST) will be specified as either inclusive or exclusive.</li>
  <li>Labour charges will either be included or mentioned separately, if applicable.</li>
  <li>Responsibility for transportation costs will be defined—either borne by the vendor or the client.</li>
  <li>Delivery will be made within a specified number of working days from order confirmation.</li>
  <li>Items will be delivered to the location specified by the client.</li>
  <li>Installation will either be included or quoted separately with relevant terms.</li>
  <li>Warranty details for materials and/or installation will be provided, including duration and conditions.</li>
  <li>Client will ensure access to necessary utilities like water, electricity, and site access during execution.</li>
  <li>All required municipal or statutory permits and approvals shall be obtained by the client.</li>
  <li>Any variation in quantity or specifications after approval will be subject to revised quotation and client confirmation.</li>
  <li>Delays caused by force majeure events (e.g., natural disasters, strikes) will not be considered the vendor's responsibility.</li>
  <li>Work shall be considered complete only after formal sign-off by the client.</li>
</ol>

</div><br/>
<p>Prepared by: {dt2.Rows[0]["Preparedby"]}</p>
<p>Employee Id: {dt2.Rows[0]["LoginId"]}</p> 
<p>Designation: {dt2.Rows[0]["Designation"]}</p>

        <br/>
<div style='margin-top:50px; text-align:center;'><b>This is a system-generated quotation. Signature is not required.<br/>
Thank you for your Business<b></div>


    </body>
    </html>";

            string path = AttachedPdf(ticketNO);

            var MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", Email, "", "", "Ticket Assign-" + ticketNO, htmldesign, "qglnwhqumptscpgf", "smtp.gmail.com", "");
            if (MailStatus == "Sent")
            {
                util.execQuery("update GroupLNewAppTicketMaster set Status='Assign To Vendor', VendorAssignDate=GETDATE() where MannualTicketNo='" + ticketNO + "'", util.strElect);
            }

            return Json(JsonConvert.SerializeObject(MailStatus));

        }


        public string ForApprovalQuation(string CleintName,string SiteName,string TicketNo,double Amount)
        {
            string _body = $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset=""UTF-8"">
  <title>Quotation Approval Request</title>
</head>
<body style=""font-family: Arial, sans-serif; font-size: 15px; color: #333333; line-height: 1.6;"">
  <p>Dear <strong>Naval</strong>,</p>

  <p>Namaste!</p>

  <p>
    I am writing to seek your approval for the attached quotation amounting to 
    <strong>₹{Amount}</strong>, which exceeds the ₹20,000 threshold.
  </p>

  <p>
    I have reviewed the quotation and found it to be competitive and in line with our requirements.
    Kindly review the attached quotation and provide your approval to proceed.
  </p>

  <p>Thank you for your time and consideration.</p>

  <p>
    Thank you for choosing <strong>Group<span style='color:red'>L</span></strong> & assuring you best of our services.
  </p>

 <div style = ""margin: 20px 0;""><a href = ""https://ifm360.in/Ticketing/QMS/ApprovedAndReview?type=Approved&&ticketno={TicketNo}""
           style = ""display: inline-block; padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 4px; margin-right:10px;"">Approve</a>
        <a href = ""https://ifm360.in/Ticketing/QMS/ApprovedAndReview?type=Reviewed&&ticketno={TicketNo}""
           style = ""display: inline-block; padding: 10px 20px; color: #fff; background-color: red; text-decoration: none; border-radius: 4px;"">
           Reject  </a></div>
  <p style=""margin-top: 30px;"">
    <strong>Warm regards,</strong><br>
    <strong>Service Excellence Team</strong><br>
   <strong> Group<span style='color:red'>L</span> Services </strong>
  </p>
</body>
</html>
";
          //  string tomail = "technical.del@groupl.in";


            string path = AttachedPdf(TicketNo);
                      string MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", "Nadeemali.bsd@gmail.com", "", "", "Subject: GroupL Update: Approval Request for Quotation Above ₹20,000 || "+CleintName+" || "+SiteName+" || "+TicketNo+" ||", _body, "qglnwhqumptscpgf", "smtp.gmail.com", path);
            return MailStatus;
        }
        //---------------------------Attached pdf--------------


        public string AttachedPdf(string tickitnoid)

        {

            DataTable dt = new DataTable();
            DataTable dt2 = new DataTable();

            string sqlquery = "select * from AddQoutaion where  TicketNo='" + tickitnoid + "' ";
            string sqlquery2 = "exec udp_GetTicketGeneraterDetails @TicketNo='" + tickitnoid + "' ";
            DataSet ds = util.Fill(sqlquery, util.strElect);
            DataSet ds2 = util.Fill(sqlquery2, util.strElect);
            dt = ds.Tables[0];
            dt2 = ds2.Tables[0];

            double total = 0.0;

            string htmldesign = $@"
    <!DOCTYPE html>
    <html lang=""en"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Quotation</title>
<style>
   ol li{{margin: 10px 0;
      
  }}
</style>   </head>
    <body style=""font-family: Arial, sans-serif; margin: 40px; padding: 0;"">
        <!-- Logo and Header -->
        <div style=""text-align: center;"">
            <img src=""https://ifm360.in/grouplreportingportal/grouplreportingportal/GroupL.jfif"" alt=""Group L Logo"" style=""max-width: 150px;"">
        </div>
<div style=""text-align: center; margin-bottom: 20px;"">
GroupL Services Private Limited
<br/>
W-31 3rd floor Okhla industrial area phase-2 New Delhi 110020
</div><br/><br/>
        <h2 style=""text-align: center; margin: 10px 0;"">Quotation</h2>

        <!-- Customer Details -->
        <div style=""display: flex; justify-content: space-between; margin: 10px 0;"">
            <div>
                <p style=""margin: 0;""><strong>Customer Name:</strong> {dt2.Rows[0]["ClientName"]}</p>
                <p style=""margin: 0;""><strong>Branch:</strong> {dt2.Rows[0]["AsmtName"]}</p>
            </div>
            <div>
                <p style=""margin: 0;""><strong>Ticket No.:</strong> {tickitnoid}</p>
                <p style=""margin: 0;""><strong>Ticket Date:</strong> {dt2.Rows[0]["TicketDate"]}</p>
  <p style=""margin: 0;""><strong>Quotation Date:</strong> {Convert.ToDateTime(dt.Rows[0]["Entrydate"]).ToString("dd MMM yyyy")}</p>
            </div>
        </div>

        <!-- Table -->
        <table style=""width: 100%; border-collapse: collapse; margin-top: 20px;"">
            <thead>
                <tr>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">S.NO</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Item Code</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Item Name</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">GST</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Qty</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Unit</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Rate</th>
                    <th style=""border: 1px solid #000; padding: 8px; text-align: center; background-color: #f2f2f2;"">Gross Amount</th>
                </tr>
            </thead>
            <tbody>";

            // Loop through the DataTable rows and add data to the table dynamically
            for (int i = 0; i < dt.Rows.Count; i++)
            {

                int quantity = Convert.ToInt32(dt.Rows[i]["ItemQty"]);
                double rate = Convert.ToDouble(dt.Rows[i]["ItemRate"]);

                htmldesign += $@"
        <tr>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{i + 1}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemCode"]}</td>
            <td style=""border: 1px solid #000; padding: 8px;"">{dt.Rows[i]["ItemName"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemGST"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemQty"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemUnit"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemRate"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{(rate * quantity)}</td>
        </tr>";

                string v = dt.Rows[i]["ItemRate"].ToString();
                double itemRate = Convert.ToDouble(v);


                total += quantity * itemRate;

                double grossAmount = itemRate * quantity;


            }

            string MagagePercent = dt2.Rows[0]["ManagePercent"].ToString();
            int percent = Convert.ToInt32(MagagePercent.Replace("%", ""));
            double ManageAmt = total * percent / 100;

            double gst = (total + ManageAmt) * 18 / 100;
            double finalamt = Convert.ToDouble(ToFixedTruncate((gst + total + ManageAmt), 2));

            string words = ConvertRupeesPaise(finalamt);




            htmldesign += $@"
            </tbody>
            <tfoot>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Total</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{total}</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Management Fee ({MagagePercent})</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{ManageAmt}</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>GST 18%</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{ToFixedTruncate(gst, 2)}</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Grand Total</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{finalamt}</td>
                </tr>
            </tfoot>
        </table>
 <div style=""margin-top: 10px; font-style: italic;"">
        Amount in Words: {words}    </div>
<div><br/>

<p><b>Terms and Conditions:</b></p>
<ol>
  <li>This quotation is valid for 30 days from the date of issue.</li>
  <li>Scope of work will be clearly defined, including both inclusions and exclusions.</li>
  <li>Quantity, unit price, and applicable taxes will be mentioned for each item/service.</li>
  <li>Payment terms will include advance percentage, balance payment timeline, and any applicable penalties for delay.</li>
  <li>Taxes and duties (e.g., GST) will be specified as either inclusive or exclusive.</li>
  <li>Labour charges will either be included or mentioned separately, if applicable.</li>
  <li>Responsibility for transportation costs will be defined—either borne by the vendor or the client.</li>
  <li>Delivery will be made within a specified number of working days from order confirmation.</li>
  <li>Items will be delivered to the location specified by the client.</li>
  <li>Installation will either be included or quoted separately with relevant terms.</li>
  <li>Warranty details for materials and/or installation will be provided, including duration and conditions.</li>
  <li>Client will ensure access to necessary utilities like water, electricity, and site access during execution.</li>
  <li>All required municipal or statutory permits and approvals shall be obtained by the client.</li>
  <li>Any variation in quantity or specifications after approval will be subject to revised quotation and client confirmation.</li>
  <li>Delays caused by force majeure events (e.g., natural disasters, strikes) will not be considered the vendor's responsibility.</li>
  <li>Work shall be considered complete only after formal sign-off by the client.</li>
</ol>

</div><br/>
<p>Prepared by: {dt2.Rows[0]["Preparedby"]}</p>
<p>Employee Id: {dt2.Rows[0]["LoginId"]}</p> 
<p>Designation: {dt2.Rows[0]["Designation"]}</p>


<div style='margin-top:50px; text-align:center;'><b>This is a system-generated quotation. Signature is not required.<br/>
Thank you for your Business<b></div>


    </body>
    </html>";








            PdfPageSize pdfPageSize = (PdfPageSize)Enum.Parse(typeof(PdfPageSize), "A4", true);
            SelectPdf.PdfPageOrientation pdfOrientation = (SelectPdf.PdfPageOrientation)Enum.Parse(typeof(SelectPdf.PdfPageOrientation), "portrait", true);


            HtmlToPdf converter = new HtmlToPdf();

            converter.Options.PdfPageSize = pdfPageSize;
            converter.Options.PdfPageOrientation = pdfOrientation;
            converter.Options.WebPageWidth = 1024;
            converter.Options.WebPageHeight = 0;
            converter.Options.MarginTop = 20;


            // Convert HTML string to PDF
            SelectPdf.PdfDocument doc = converter.ConvertHtmlString(htmldesign, "");
            // SelectPdf.PdfDocument doc = converter.ConvertUrl(baseUrl);

            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/QuotationPDF/");

            // Ensure the directory exists
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            DateTime date = DateTime.Now;
            var namedate = date.ToString("dd-mm-yyyy-HH-mm-ss-fff");
            // Define the file name and path
            string fileName = tickitnoid + namedate.ToString() + ".pdf";
            string filePath = Path.Combine(folderPath, fileName);

            // Save the PDF to the file system
            doc.Save(filePath);
            doc.Close();

                    

            return filePath;

           

            
        }

        public IActionResult ForApproveandReviewed()
        {
            return View();
        }




    }




}

