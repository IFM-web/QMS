using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;

using System.Text.Json;
using System.Data;



namespace QMS.Controllers
{
    class QoutatonDetails
    {
        public string? ItemName { get; set; }
        public string? ItemCode { get; set; }
        public string? ItemRate { get; set; }
        public string? ItemUnit { get; set; }
        public string? TicketNo { get; set; }
        public string? TicketNO { get; set; }
        public string? ItemQty { get; set; }
        public string? ItemGst { get; set; }
        public string? ItemGST { get; set; }
        public string? GrossAmt { get; set; }
       // public string Entrydate { get; set; }
        //public int Id { get; set; }
    }
   
	public class CMSController : Controller

	{
		ClsUtility csutil=new ClsUtility();
		db_Utility util =new db_Utility();
        [Route("Quotation")]
        public IActionResult Quotation()
		{
            ViewBag.managefee = util.PopulateDropDown("select * from  dbo.GroupLNewAppManageFeeMaster", util.strElect);
			ViewBag.tickit = util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status='Move For Quotation'", util.strElect);
            ViewBag.itemcode = util.PopulateDropDown("select ItemCode,(ItemCode + ' ('+itemdescription+')') as ItemCode from GroupLNewAppQuotationRateCard", util.strElect);
            return View();
		}
        [Route("ItemsList")]
        public IActionResult ItemsList()
        {

            ViewBag.tickit = util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status='Quotation Prepared'", util.strElect);

            var ds = util.Fill("select * from AddQoutaion", util.strElect);
            ViewBag.dt = ds.Tables[0];
            return View();
        }

        public JsonResult InsertQoutation()
        {
            var recordsJson =  Request.Form["data"].ToString();
            var array = System.Text.Json.JsonSerializer.Deserialize<List<QoutatonDetails>>(recordsJson);
         
            try
            {
                var TicketNO = "";
                string Msg = "";
                int ItemCount = 0;




                using (SqlConnection conn = new SqlConnection(util.strElect))
                {
                    conn.Open();
                    foreach(var roc in array)
                    {

                      

                            string query = "INSERT INTO AddQoutaion   (ItemCode,ItemName,ItemUnit,ItemRate,ItemQty,ItemGST,GrossAmt,TicketNo,Entrydate) VALUES (@ItemCode, @ItemName, @ItemUnit, @ItemRate,@ItemQty,@ItemGST,@GrossAmt,@TicketNo,Getdate())";
                        using (SqlCommand cmd = new SqlCommand(query, conn))
                        {
                            cmd.Parameters.AddWithValue("@ItemCode", roc.ItemCode);
                            cmd.Parameters.AddWithValue("@ItemName", roc.ItemName);
                            cmd.Parameters.AddWithValue("@ItemUnit", roc.ItemUnit);
                            cmd.Parameters.AddWithValue("@ItemRate", roc.ItemRate);
                            cmd.Parameters.AddWithValue("@ItemQty", roc.ItemQty);
                            cmd.Parameters.AddWithValue("@ItemGST", roc.ItemGst);
                            cmd.Parameters.AddWithValue("@GrossAmt", roc.GrossAmt);
                            cmd.Parameters.AddWithValue("@TicketNo", roc.TicketNO);
                           int i= cmd.ExecuteNonQuery();
                            if (i == 1)
                            {
                                TicketNO = roc.TicketNO;

							}
							


						}
                        var ds = util.Fill("Select Count(*) from GroupLNewAppQuotationRateCard where ItemCode='" + roc.ItemCode + "'", util.strElect);
                         ItemCount = Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString());
                        if (ItemCount == 0)
                        {
                            util.execQuery($@"Insert into GroupLNewAppQuotationRateCard(ItemCode,ItemDescription,Make,Unit,Rate)values('{roc.ItemCode}','{roc.ItemName}','','{roc.ItemUnit}','{roc.ItemRate}')", util.strElect);
                        }
                    }

                    util.Fill("update GroupLNewAppTicketMaster set Status='Quotation Prepared' where MannualTicketNo='"+ TicketNO + "' ", util.strElect);
                }
                return Json(new { message = "Quotation Inserted Successfully!" }); 
            }
            catch (Exception ex)
            {
                return Json(new { message = "Error: " + ex.Message });
            }
        }

        [HttpPost]
      
		public JsonResult BindBranch(string tickitnoid)
		{
			

			string sqlquery = "exec udp_GetTicketGeneraterDetails @TicketNo='" + tickitnoid + "' ";
			DataSet ds = util.Fill(sqlquery, util.strElect);
			 var dt = ds.Tables[0];
			var data = JsonConvert.SerializeObject(dt);

            return Json(data);
		}


       

        [HttpPost]
        
        public JsonResult BindCode(string itemcodeid)
        {
            DataTable dt = new DataTable();

            string sqlquery = "select ItemCode,Unit,Rate,itemDescription from GroupLNewAppQuotationRateCard where ItemCode='" + itemcodeid + "' ";
            DataSet ds = util.Fill(sqlquery, util.strElect);

            if (ds.Tables[0].Rows.Count > 0)
            {
                dt = ds.Tables[0];
            }
            return Json(JsonConvert.SerializeObject(dt));
        }
        [HttpPost]
        
        public JsonResult GetDatabyId(string data)
        {
            DataTable dt = new DataTable();
            DataTable dt2 = new DataTable();

            string sqlquery = "select * from AddQoutaion where  TicketNo='" + data + "' ";
            string sqlquery2 = "exec udp_GetTicketGeneraterDetails @TicketNo='" + data + "' ";
            DataSet ds = util.Fill(sqlquery, util.strElect);
            DataSet ds2 = util.Fill(sqlquery2, util.strElect);
            dt = ds.Tables[0];
            dt2 = ds2.Tables[0];
            
            return Json(new { data=JsonConvert.SerializeObject(dt) , data2= JsonConvert.SerializeObject(dt2) });
        }


        //-------------- Review Quotation -------------------------------------------------------------------------------------

        [Route("ReviewedList")]
        public IActionResult ReviewedList()
        {
            ViewBag.managefee = util.PopulateDropDown("select * from  dbo.GroupLNewAppManageFeeMaster", util.strElect);
            ViewBag.tickit = util.PopulateDropDown("select MannualTicketNo ,MannualTicketNo from GroupLNewAppTicketMaster where Status='Quotation Reviewed'", util.strElect);

            ViewBag.itemcode = util.PopulateDropDown("select ItemCode,(ItemCode + ' ('+itemdescription+')') as ItemCode from GroupLNewAppQuotationRateCard", util.strElect);
            return View();

        }

        [HttpPost]
        public JsonResult InsertReviewQoutation()
        {
            var recordsJson = Request.Form["data"].ToString();
            var ticketId = Request.Form["ticketId"].ToString();
            var ManageFeesId = Request.Form["ManageFeesId"].ToString();
            var array = System.Text.Json.JsonSerializer.Deserialize<List<QoutatonDetails>>(recordsJson);

            try
            {
                var TicketNO = "";


                using (SqlConnection conn = new SqlConnection(util.strElect))
                {
                    conn.Open();


                    util.Fill("delete from AddQoutaion where TicketNo = '" + ticketId + "'", util.strElect);
                    foreach (var roc in array)

                    {
                       

                        string query = "INSERT INTO AddQoutaion   (ItemCode,ItemName,ItemUnit,ItemRate,ItemQty,ItemGST,GrossAmt,TicketNo,Entrydate) VALUES (@ItemCode, @ItemName, @ItemUnit, @ItemRate,@ItemQty,@ItemGST,@GrossAmt,@TicketNo,Getdate())";
                        using (SqlCommand cmd = new SqlCommand(query, conn))
                        {
                            cmd.Parameters.AddWithValue("@ItemCode", roc.ItemCode);
                            cmd.Parameters.AddWithValue("@ItemName", roc.ItemName);
                            cmd.Parameters.AddWithValue("@ItemUnit", roc.ItemUnit);
                            cmd.Parameters.AddWithValue("@ItemRate", roc.ItemRate);
                            cmd.Parameters.AddWithValue("@ItemQty", roc.ItemQty);
                            cmd.Parameters.AddWithValue("@ItemGST", roc.ItemGST);
                            cmd.Parameters.AddWithValue("@GrossAmt", roc.GrossAmt);
                            cmd.Parameters.AddWithValue("@TicketNo", roc.TicketNo);
                            int i = cmd.ExecuteNonQuery();
                            if (i == 1)
                            {
                                TicketNO = roc.TicketNo;

                            }



                        }

                        var ds = util.Fill("Select Count(*) from GroupLNewAppQuotationRateCard where ItemCode='" + roc.ItemCode + "'", util.strElect);
                        int ItemCount = Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString());
                        if (ItemCount == 0)
                        {
                            util.execQuery($@"Insert into GroupLNewAppQuotationRateCard(ItemCode,ItemDescription,Make,Unit,Rate)values('{roc.ItemCode}','{roc.ItemName}','','{roc.ItemUnit}','{roc.ItemRate}')", util.strElect);
                        }
                    }

                    util.Fill("update GroupLNewAppTicketMaster set Status='Quotation Prepared',ManageFeesId='"+ ManageFeesId + "' where MannualTicketNo='" + TicketNO + "' ", util.strElect);
                }
                return Json(new { message = "Review Quotation Updated Successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new { message = "Error: " + ex.Message });
            }
        }
    }
}
