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


namespace QMS.Controllers
{
    public class TicketGeneratorController : Controller
    {
        db_Utility util = new db_Utility();
        ClsUtility Cls_util = new ClsUtility();

        [Route("GenerateNewTicket")]
        public IActionResult GenerateNewTicket()
        {
            ViewBag.companyname = util.PopulateDropDown("exec udp_GetCompanyGroupl", util.strElect);
            ViewBag.tickettypee = PopulateDropDownComName("exec udp_GetTicketType", util.strElect);
            return View();
        }
        [Route("TicketDashboard")]
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
            string sqlquery = "exec udp_GetCustomerListGroupl @CompanyCode='" + companynameid + "' ";
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
            var ds = util.Fill($"exec udp_GenerateTicketSmartFMWeb @CompanyCode='{obj.companycode}', @TicketType='{obj.ttype}' ,@TicketCategory='{obj.tcate}', @Description='{obj.desc}',@Priority='{obj.priorityid}',@ClientCode='{obj.clientcode}', @asmtID='{obj.asmitid}',@ClientReprentativeName='{obj.CRName}', @ClientReprentativeMobile='{obj.CRMobile}',@ClientReprentativeEmail='{obj.CREmail}'", util.strElect);

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
                        padding: 20px 30px;
                        width: 400px;
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
                        
                        <p><b>Dear {obj.CRName}</b>,</p>
                        <p style='font-weight:bold;'>We have received a ticket with the following details:</p>
        
                            <p style='font-weight:bold;'><span>Ticket Number:</span> {GeneratedTicket}<p>
                              <p style='font-weight:bold;'><span>Customer Name:</span> {obj.clientcode}</p>
                              <p style='font-weight:bold;'><span>Site Name:</span> {obj.asmitid}</p>
                              <p style='font-weight:bold;'><span>Ticket Type:</span> {obj.ttype}</p>
                              <p style='font-weight:bold;'><span>Ticket Category:</span> {obj.tcate}</p>
                              <p style='font-weight:bold;'><span>Ticket Description:</span> {obj.desc}</p>         
                              <p style='font-weight:bold;'><span>Priority:</span> {obj.priorityid}</p>
                        </ul>
                    </div>
                </body>
                </html>
                ";


            var MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", "" + obj.CREmail + "", "", "", "The Service Request/Complaint Raised - " + GeneratedTicket + "", htmlbody.ToString(), "qglnwhqumptscpgf", "smtp.gmail.com", "");

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

    <p>
        We would like to inform you that your ticket - {tickedtno}, has been assigned to {empname} for resolution.
    </p>

    <p>Details of the Assigned Staff:</p>
  
        <p>Name: {empname}</p>
        <p>Mobile No.: {clientmobile}</p>
    

    <p>
        {empname} will be working on your concern and will keep you updated on the progress. Should you have any further details to share or questions regarding this ticket, feel free to reach out directly to {empname} or contact our support team at 
        <a href=""mailto:first-impressions@group1.in"">first-impressions@groupL.in</a> or 8100432758.
    </p>

    <p>
        Thank you for choosing GroupL. We are committed to resolving your concerns promptly and efficiently.
    </p>

    <p>Best regards,<br>IFM360 Tech</p>
</body>
</html>

";

            var MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", "" + clientEmail + "", "", "", "Technician Assigned for Analysis/Job Estimation - " + tickedtno + "", assignhtml.ToString(), "qglnwhqumptscpgf", "smtp.gmail.com", "");

            return MailStatus;
        }








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

            double total = 0;

            string htmldesign = $@"
    <!DOCTYPE html>
    <html lang=""en"">
    <head>
        <meta charset=""UTF-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Quotation</title>
    </head>
    <body style=""font-family: Arial, sans-serif; margin: 40px; padding: 0;"">
        <!-- Logo and Header -->
        <div style=""text-align: center; margin-bottom: 20px;"">
            <img src=""https://ifm360.in/grouplreportingportal/grouplreportingportal/GroupL.jfif"" alt=""Group L Logo"" style=""max-width: 150px;"">
        </div>
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
                htmldesign += $@"
        <tr>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{i + 1}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemCode"]}</td>
            <td style=""border: 1px solid #000; padding: 8px;"">{dt.Rows[i]["ItemName"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemGST"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemQty"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemUnit"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["ItemRate"]}</td>
            <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{dt.Rows[i]["GrossAmt"]}</td>
        </tr>";

                string v = dt.Rows[i]["ItemRate"].ToString();
                double itemRate = Convert.ToDouble(v);

                int quantity = Convert.ToInt32(dt.Rows[i]["ItemQty"]);

                total += quantity * itemRate;

                double grossAmount = itemRate * quantity;


            }

            double gst = total * 18 / 100;
            string words = ConvertRupeesPaise(gst + total);



            htmldesign += $@"
            </tbody>
            <tfoot>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Total</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{total}</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Management Fee</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">0</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>GST 18%</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{gst}</td>
                </tr>
                <tr>
                    <td colspan=""7"" style=""border: 1px solid #000; padding: 8px; text-align: right;""><strong>Grand Total</strong></td>
                    <td style=""border: 1px solid #000; padding: 8px; text-align: center;"">{gst + total}</td>
                </tr>
            </tfoot>
        </table>
 <div style=""margin-top: 10px; font-style: italic;"">
        Amount in Words: {words}    </div>

        
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
    <p> Please find attached quotation.</p>
    <p> Kindly review and approve at your earliest convenience.</p>
    <div style = ""margin: 20px 0;""><a href = ""https://ifm360.in/Ticketing/QMS/ApprovedAndReview?type=Approved&&ticketno={tickitnoid}""
           style = ""display: inline-block; padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 4px; margin-right:10px;"">Approve</a>
        <a href = ""https://ifm360.in/Ticketing/QMS/ApprovedAndReview?type=Reviewed&&ticketno={tickitnoid}""
           style = ""display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 4px;"">
           Reviewed  </a></div><p> Best regards,</p><p> GroupL Team </p></body></html>";



            var MailStatus = Cls_util.SendMailViaIIS_htmls("serviceexcellence@groupl.in", ClientEmail, "", "", "Quotation Submission for Approval for Ticket No - " + tickitnoid, tbody, "qglnwhqumptscpgf", "smtp.gmail.com", filePath);

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

            if (n > 9) return "Overflow"; // number out of bounds

            // Pad the number with leading zeros for easier parsing
            numStr = numStr.PadLeft(9, '0');

            // Split the number into groups
            string crore = numStr.Substring(0, 2);
            string lakh = numStr.Substring(2, 2);
            string thousand = numStr.Substring(4, 2);
            string hundred = numStr.Substring(6, 1);
            string ten = numStr.Substring(7, 2);

            if (int.Parse(crore) > 0)
            {
                word += $"{ConvertTwoDigits(int.Parse(crore))} Crore ";
            }
            if (int.Parse(lakh) > 0)
            {
                word += $"{ConvertTwoDigits(int.Parse(lakh))} Lakh ";
            }
            if (int.Parse(thousand) > 0)
            {
                word += $"{ConvertTwoDigits(int.Parse(thousand))} Thousand ";
            }
            if (int.Parse(hundred) > 0)
            {
                word += $"{ones[int.Parse(hundred)]} Hundred ";
            }
            if (int.Parse(ten) > 0)
            {
                word += ConvertTwoDigits(int.Parse(ten));
            }

            return word.Trim();
        }

        public static string ConvertTwoDigits(int num)
        {
            if (num < 10) return ones[num];
            if (num >= 10 && num < 20) return teens[num - 11];

            int unit = num % 10;
            int ten = num / 10;
            return $"{tens[ten]} {ones[unit]}".Trim();
        }

        public static string ConvertRupeesPaise(double amount)
        {
            string[] parts = amount.ToString().Split('.');
            string rupeesInWords = NumberToWords(int.Parse(parts[0]));
            string paiseInWords = parts.Length > 1 ? ConvertTwoDigits(int.Parse(parts[1].PadRight(2, '0'))) : "";

            string result = "";
            if (!string.IsNullOrEmpty(rupeesInWords))
            {
                result += $"{rupeesInWords} Rupees";
            }
            if (!string.IsNullOrEmpty(paiseInWords))
            {
                result += $" and {paiseInWords} Paise";
            }

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

            var ds = util.Fill("select status from GroupLNewAppTicketMaster  where MannualTicketNo='" + ticketno + "' ", util.strElect);
            string stmes = ds.Tables[0].Rows[0][0].ToString();

            if (stmes != "Quotation Reviewed")
            {
                if (stmes != "Quotation Approved")
                {

                    util.Fill("update GroupLNewAppTicketMaster set Status='" + st + "'  where MannualTicketNo='" + ticketno + "' ", util.strElect);

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

                    util.Fill("update GroupLNewAppTicketMaster set Status='" + type + "'  where MannualTicketNo='" + ticketno + "' ", util.strElect);

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


            /*  string query = "exec udp_GetTicketDashboardNew @FromDate='" + obj.fromdate + "' ,@ToDate='" + obj.todate + "' ,@CompanyCode='" + obj.companycode + "' ,@TicketType= '" + obj.ttype + "',@TicketCategory='" + obj.tcate + "' ,@Priority= '" + obj.priorityid + "',@ClientCode='" + obj.clientcode + "' ,@AsmtID='" + obj.asmitid + "' ,@Status='" + obj.status + "' ,@TicketNo= '" + obj.ticketno + "'";
              var ds = util.Fill(query, util.strElect); */

            string query = "exec udp_GetTicketDashboardNew @FromDate='" + obj.fromdate + "' ,@ToDate='" + obj.todate + "' ,@CompanyCode='" + obj.companycode + "' ,@TicketType= '" + obj.ttype + "',@TicketCategory='" + obj.tcate + "' ,@Priority= '" + obj.priorityid + "',@ClientCode='" + obj.clientcode + "' ,@AsmtID='" + obj.asmitid + "' ,@Status='" + obj.status + "' ,@TicketNo= '" + obj.ticketno + "'";
            var ds = util.Fill(query, util.strElect);


            var dt = ds.Tables[0];
            var data = JsonConvert.SerializeObject(dt);
            return Json(data);
        }



    //    var dt = ds.Tables[0];
    //    var data = JsonConvert.SerializeObject(dt);
    //        return Json(data);
    //}

    public JsonResult GetDataToReview(string TicketNo)
    {

        var ds = util.Fill("select a.* from AddQoutaion a join GroupLNewAppTicketMaster b on a.TicketNo=b.MannualTicketNo where b.Status='Quotation Reviewed' and b.MannualTicketNo='" + TicketNo + "'", util.strElect);


        var dt = ds.Tables[0];
        return Json(JsonConvert.SerializeObject(dt));
    }

        public JsonResult binddashboard(string companynameid)
        {
            DataTable dt = new DataTable();

            string sqlquery = "exec udp_GetTicketDashboardGrouplNewApp @CompanyCode='" + companynameid + "' ";
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

            var ds = util.Fill("select a.* from AddQoutaion a join GroupLNewAppTicketMaster b on a.TicketNo=b.MannualTicketNo where /*b.Status='Quotation Reviewed' and*/ b.MannualTicketNo='" + TicketNo + "'", util.strElect);


            var dt = ds.Tables[0];
            return Json(JsonConvert.SerializeObject(dt));
        }

        #region Vendor List

      
        public IActionResult VendorLists(string? TicketNo)

        {
            var ds = util.Fill("select * from VendorMaster", util.strElect);
            ViewBag.TicketNo = TicketNo;
            ViewBag.dt = ds.Tables[0];
            return View("VendorList");
        }
   
        public JsonResult SendToVendor(string Id, string TicketNo)
        {
            var ds = util.Fill("select Name,Email from VendorMaster where id='"+Id+"'", util.strElect);
            string Name = ds.Tables[0].Rows[0][0].ToString();
            string Email = ds.Tables[0].Rows[0][1].ToString();
            string mes = "";

            if(Email != "")
            {
                 mes = util.execQuery("Update GroupLNewAppTicketMaster set status='Executed by Vendor',VendorId='"+Id+"' where MannualTicketNo='"+TicketNo+"' ", util.strElect);
             
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
            if(mes== "Successfull")
            {
                mes = "Quotation Sent To Vendor  !!";
            }
            else
            {
                mes = "Failed To Sent";
            }

            return Json(JsonConvert.SerializeObject(mes));

        }

       
        public IActionResult SubmitbyVendor(string ticketno)
        {
            var ds = util.Fill("select Id,ItemCode,ItemName,ItemUnit,ItemRate,ItemQty from AddQoutaion a join GroupLNewAppTicketMaster b on a.TicketNo=b.MannualTicketNo where Status='Executed by Vendor' and TicketNo='"+ ticketno + "'", util.strElect);
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
                 msg = util.execQuery("Update AddQoutaion set ItemRate='" + item["rate"] + "',GrossAmt='" + item["toatal"] +"' where  Id='" + item["Id"] + "' ", util.strElect);
            }
            if (msg == "Successfull")
            {
               msg= util.execQuery("update GroupLNewAppTicketMaster set Status='Quotation Submitted by Vendor' where MannualTicketNo='"+ticketNO+"' ", util.strElect);
            }
            return Json(JsonConvert.SerializeObject(msg));
        }


       
           







        #endregion



    }




}

