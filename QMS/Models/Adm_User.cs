using System.ComponentModel.DataAnnotations;

namespace ifm360Reports.Models
{
    public class Adm_User
    {
        [Display(Name = "LoginId")]
        [Required(ErrorMessage = "LoginId is mandatory")]
        public string uname { get; set; }= string.Empty;
        [Required(ErrorMessage = "Password is mandatory")]
        [Display(Name = "Password")]
        public string pwd { get; set; }=string.Empty;
       
    }
}
