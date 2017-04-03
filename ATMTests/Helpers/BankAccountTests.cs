using Microsoft.VisualStudio.TestTools.UnitTesting;
using ATM.Helpers;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATM.Helpers.Tests
{
    [TestClass()]
    public class BankAccountTests
    {
        [TestMethod()]
        public void WithdrawMoreAmountTest()
        {
            BankAccount account = new BankAccount("Test Name",250);
            try
            {
                account.Withdraw(260);
            }
            catch (ArgumentOutOfRangeException e)
            {
                StringAssert.Contains(e.Message, "amount greater than balance");
                return;
            }

            Assert.Fail("No exception thrown");
        }

        [TestMethod()]
        public void WithdrawNegativeAmountTest()
        {
            BankAccount account = new BankAccount("Test Name", 250.0);
            try
            {
                account.Withdraw(-1);
            }
            catch (ArgumentOutOfRangeException e)
            {
                StringAssert.Contains(e.Message, "amount of less than or equal 0");
                return;
            }

            Assert.Fail("No exception thrown");
        }

        [TestMethod()]
        public void WithdrawAmountTest()
        {
            BankAccount account = new BankAccount("Test Name", 250.0);
            account.Withdraw(20);
            Assert.AreEqual(account.Balance, 230);
        }

        [TestMethod()]
        public void DepostAmountTest()
        {
            BankAccount account = new BankAccount("Test Name", 250.0);
            account.Deposit(20);
            Assert.AreEqual(account.Balance, 270);
        }

        [TestMethod()]
        public void DepositNegativeAmountTest()
        {
            BankAccount account = new BankAccount("Test Name", 250.0);
            try
            {
                account.Deposit(-100);
            }
            catch (ArgumentOutOfRangeException e)
            {
                StringAssert.Contains(e.Message, "amount of less than or equal 0");
                return;
            }

            Assert.Fail("No exception thrown");
        }
    }
}