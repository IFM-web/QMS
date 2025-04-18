using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;
using Syncfusion.Compression;

namespace QMS.Controllers
{
    public class MasterController : Controller
    {

        db_Utility Util = new db_Utility();
        public IActionResult Vendor()
        {
            return View();
        }

        public JsonResult VendorInsert(string name,string email,string contact,string address)
        {

            var  ds = Util.Fill("select count(Email) from VendorMaster where Email='"+email.Trim()+"'", Util.strElect);
            var  ds2 = Util.Fill("select count(Email) from VendorMaster where ContactNo='" + contact.Trim()+"'", Util.strElect);
            int emailcount = Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString());
            int Contactount = Convert.ToInt32(ds2.Tables[0].Rows[0][0].ToString());
            string msg;
           
            if (emailcount ==0)
            {
                if (Contactount == 0)
                {

               
          
            string query = "INSERT INTO VendorMaster (Name, Email, ContactNo, Address, EntryDate) " +
                   "VALUES (@Name, @Email, @Contact, @Address, GETDATE()); ";
          
            using (SqlConnection conn = new SqlConnection(Util.strElect))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Name", name);
                    cmd.Parameters.AddWithValue("@Email", email);
                    cmd.Parameters.AddWithValue("@Contact", contact);
                    cmd.Parameters.AddWithValue("@Address", address);

                    conn.Open();
                    object result = cmd.ExecuteNonQuery(); 

                  msg = (result != null) ? "Inserted Successfully!" : "Insertion Failed!";

                }
            }
                }
                else
                {
                    msg = "Contact No Already Exist";
                  
                }
            }
            else
            {
                msg = "Email Already Exist";
           
            }

            return Json(JsonConvert.SerializeObject(msg));
        }

        public JsonResult ShowVedor()
        {
            var ds = Util.Fill("select * from VendorMaster", Util.strElect);
            return Json(JsonConvert.SerializeObject(ds.Tables[0]));
        }

        public JsonResult DeleteVendor(string Id)
        {
            var mes = Util.execQuery("Delete from VendorMaster where id='"+Id+"'", Util.strElect);
            if(mes== "Successfull")
            {
                mes = "Vendor Delete Successfull !!";
            }
            return Json(JsonConvert.SerializeObject(mes));
            
        }

        
        public IActionResult ApprovebyVendor() {
            ViewBag.tickit = Util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status='Quotation Submitted by Vendor'", Util.strElect);
            var ds = Util.Fill("select * from AddQoutaion", Util.strElect);
            ViewBag.dt = ds.Tables[0];
            return View();

        }
        public IActionResult ViewAssignedVendor() {
            ViewBag.tickit = Util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status in ('Quotation Submitted by Vendor','Executed by Vendor','Review Quotation Pending from Vendor','Quotation Vendor Approved','Reviewed Quotation Submitted by Vendor')", Util.strElect);

            ViewBag.vendor = Util.PopulateDropDown("select Id,Name from VendorMaster ", Util.strElect);
            return View();

        }

       public JsonResult GetAssignedVendor(string tickitno,string vendor)
        {
            var ds = Util.Fill("exec Udp_GetItemofVendor @ticketno='"+tickitno+ "',@Vendor='"+vendor+"' ", Util.strElect);

            return Json(JsonConvert.SerializeObject(ds.Tables[0]));
        }

       public JsonResult GetItem(string tickitno)
        {
            var ds = Util.Fill("select ItemCode,ItemName,ItemUnit,ItemRate,ItemQty,GrossAmt from AddQoutaion where TicketNo='"+tickitno+"' ", Util.strElect);

            return Json(JsonConvert.SerializeObject(ds.Tables[0]));
        }


        public IActionResult VendorApprove()
        {
            ViewBag.tickit = Util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status='Quotation Vendor Approved'", Util.strElect);
            return View();
            
        }
         
        



    }
}
