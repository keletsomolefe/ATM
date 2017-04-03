using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Security.Permissions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using ATM.Helpers;
using ATM.Models;

namespace ATM.Controllers
{
    public class BSLController : Controller
    {
        private BankAuthentication security;
        private List<Card> cards;

        public BSLController()
        {
            cards = GlobalData.list;
            if (cards == null)
            {
                cards = new List<Card>();

                /*Card 1*/
                Card one = new Card();
                one.CardNumber = "12345";
                one.Pin = "2244";
                one.Reported = true;

                /*Card 2*/
                Card two = new Card();
                two.CardNumber = "24680";
                two.Pin = "0011";
                two.Reported = false;

                /*Card 3*/
                Card three = new Card();
                three.CardNumber = "98765";
                three.Pin = "2468";
                three.Reported = false;

                /*Add cards to the list*/
                cards.Add(one);
                cards.Add(two);
                cards.Add(three);

                List<BankAccount> cardOne = new List<BankAccount>();
                BankAccount a = new BankAccount("savings", 10000);
                BankAccount b = new BankAccount("back up", 20000);
                cardOne.Add(a);
                cardOne.Add(b);
                one.LinkedBankAccount = cardOne;

                List<BankAccount> cardTwo = new List<BankAccount>();
                BankAccount c = new BankAccount("savings", 5000);
                BankAccount d = new BankAccount("keletso", 10000);
                cardTwo.Add(c);
                cardTwo.Add(d);
                two.LinkedBankAccount = cardTwo;

                List<BankAccount> cardThree = new List<BankAccount>();
                BankAccount e = new BankAccount("savings", 200);
                BankAccount f = new BankAccount("kids", 500);
                cardThree.Add(e);
                cardThree.Add(f);
                three.LinkedBankAccount = cardThree;

                for (int i = 0; i < cards.Count; i = i + 1)
                {
                    cards[i].PasswordAttempts = 3;
                }

                GlobalData.list = cards;
            }

            security = new BankAuthentication(cards);
        }

        [HttpGet]
        public ActionResult Index()
        {
            if (Session["InsertedCard"] == null)
                return new HttpStatusCodeResult(401, "Error not authorized");

            return PartialView();
        }

        [HttpPost]
        public string Account(ChooseAccount model)
        {
            Session["Account"] = model.Account;

            return model.Account;
        }

        [HttpGet]
        public ActionResult ChooseAmount()
        {
            if (Session["Account"]==null)
                return new HttpStatusCodeResult(401, "Error not authorized");

            string card = (string)Session["CardNumber"];
            string account = (string)Session["Account"];
            ViewBag.Balance = 0;

            var temp = security.GetBankAccounts(card);
            foreach (BankAccount t in temp)
            {
                if (t.AccountName == account)
                {
                    ViewBag.Balance = t.Balance;
                }
            }

            return PartialView();
        }

        [HttpGet]
        public ActionResult ChooseDeposit()
        {
            if (Session["Account"] == null)
                return new HttpStatusCodeResult(401, "Error not authorized");

            return PartialView();
        }

        [HttpGet]
        public ActionResult Withdraw()
        {
            if (Session["CardNumber"]==null)
                return new HttpStatusCodeResult(401, "Error not authorized");

            string card = (string) Session["CardNumber"];
            ViewBag.Accounts = security.GetBankAccounts(card);

            return PartialView();
        }

        [HttpGet]
        public ActionResult CheckBalance()
        {
            string card = (string)Session["CardNumber"];
            string account = (string)Session["Account"];
            var temp = security.GetBankAccounts(card);
            foreach (BankAccount t in temp)
            {
                if (t.AccountName == account)
                {
                    ViewBag.Balance = t.Balance;
                    ViewBag.AccountName = account;
                    return PartialView();
                }
            }
            return new HttpStatusCodeResult(404, "not found");
        }

        [HttpGet]
        public ActionResult Deposit()
        {
            if (Session["CardNumber"] == null)
                return new HttpStatusCodeResult(401, "Error not authorized");

            string card = (string)Session["CardNumber"];
            ViewBag.Accounts = security.GetBankAccounts(card);

            return PartialView();
        }

        [HttpGet]
        public ActionResult Balance()
        {
            if (Session["CardNumber"] == null)
                return new HttpStatusCodeResult(401, "Error not authorized");

            string card = (string)Session["CardNumber"];
            ViewBag.Accounts = security.GetBankAccounts(card);

            return PartialView();
        }

        [HttpPost]
        public ActionResult Withdraw(WithdrawAmountModel model)
        {
            string card = (string)Session["CardNumber"];
            string account = (string)Session["Account"];

            var temp = security.GetBankAccounts(card);
            foreach (BankAccount t in temp)
            {
                if (t.AccountName == account)
                {
                    try
                    {
                        if (model.Status==true)
                            t.Withdraw(model.Amount);
                        return Json(new { withdrew = "everything went well", reply = true, balance= t.Balance, name= account }, JsonRequestBehavior.AllowGet);
                    }
                    catch (ArgumentOutOfRangeException e)
                    {
                        return Json(new { withdrew = e.Message, reply = false, balance= t.Balance, name= account }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            return Json(new { withdrew = "something bad happened", reply = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Deposit(DepositAmountModel model)
        {
            string card = (string)Session["CardNumber"];
            string account = (string)Session["Account"];

            var temp = security.GetBankAccounts(card);
            foreach (BankAccount t in temp)
            {
                if (t.AccountName == account)
                {
                    try
                    {
                        t.Deposit(model.Amount);
                        return Json(new { withdrew = "everything went well", reply = true, balance = t.Balance, name = account }, JsonRequestBehavior.AllowGet);
                    }
                    catch (ArgumentOutOfRangeException e)
                    {
                        return Json(new { withdrew = e.Message, reply = false, balance = t.Balance, name = account }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            return Json(new { withdrew = "something bad happened", reply = false }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Finish()
        {
            if (Session["Account"] == null)
                return new HttpStatusCodeResult(401, "Error not authorized");

            return PartialView();
        }

        [HttpGet]
        public ActionResult Main()
        {
            if (Session["CardNumber"] == null)
                return new HttpStatusCodeResult(401, "Error not authorized");
            return PartialView();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Authenticate(AuthenticateCardModel model)
        {
            var result = security.Authenticate(model.CardNumber, model.Pin);
            var attemps = security.Attempts(model.CardNumber);

            switch (result)
            {
                case true:
                    Session["CardNumber"] = model.CardNumber;
                    return Json(new { result = result, attempts = attemps }, JsonRequestBehavior.AllowGet);
                default:
                    ModelState.AddModelError("","Failed to authenticate");
                    return Json(new { result = result, attempts = attemps }, JsonRequestBehavior.AllowGet);
            }
        }

        // GET: BSL
        [HttpPost]
        [AllowAnonymous]
        public ActionResult InsertCard(InsertCardViewModel model)
        {
            var result = security.Available(model.CardNumber);
            var attemps = security.Attempts(model.CardNumber);

            switch (result)
            {
                case true:
                    if (security.Reported(model.CardNumber))
                        return Json(new { result = false, message= "reported" }, JsonRequestBehavior.AllowGet);
                    Session["InsertedCard"] = model.CardNumber;
                    return Json(new { result = result, attempts = attemps }, JsonRequestBehavior.AllowGet);
                default:
                    ModelState.AddModelError("", "Wrong Card Inserted.");
                    return Json(new { result = result, message= "unavailable" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}