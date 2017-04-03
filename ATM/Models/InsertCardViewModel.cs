using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ATM.Models
{
    public class InsertCardViewModel
    {
        public string CardNumber { get; set; }
    }

    public class AuthenticateCardModel
    {
        public string CardNumber { get; set; }
        public string Pin { get; set; }
    }

    public class WithdrawAmountModel
    {
        public double Amount { get; set; }
        public bool Status { get; set; }
    }

    public class DepositAmountModel
    {
        public double Amount { get; set; }
    }

    public class ChooseAccount
    {
        public string Account { get; set; }
    }
}