using System.ComponentModel.DataAnnotations;

namespace ifm360Reports.Models
{
    public class Adm_User
    {
       
        public string uname { get; set; }
        public string pwd { get; set; }
        public string deviceid { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }
        public string address { get; set; }
    }
}
