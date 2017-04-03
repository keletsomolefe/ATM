using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using ATM.Helpers;

namespace ATM.Controllers
{
    
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            Session["Account"] = null;
            Session["InsertedCard"] = null;
            Session["CardNumber"] = null;
            return View();
        }

        public ActionResult Home()
        {
            Session["Account"] = null;
            Session["InsertedCard"] = null;
            Session["CardNumber"] = null;
            return PartialView();
        }
    }
}