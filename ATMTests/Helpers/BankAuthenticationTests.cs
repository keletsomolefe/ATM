using Microsoft.VisualStudio.TestTools.UnitTesting;
using ATM.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ATM.Helpers.Tests
{
    [TestClass()]
    public class BankAuthenticationTests
    {
        [TestMethod()]
        public void WrongPasswordTest()
        {
            List<Card> cards = new List<Card>();

            /*Card 1*/
            Card one = new Card();
            one.CardNumber = "12345";
            one.Pin = "2244";

            /*Card 2*/
            Card two = new Card();
            two.CardNumber = "24680";
            two.Pin = "0011";

            /*Card 3*/
            Card three = new Card();
            three.CardNumber = "98765";
            three.Pin = "2468";

            /*Add cards to the list*/
            cards.Add(one);
            cards.Add(two);
            cards.Add(three);

            for (int i = 0; i < cards.Count; i = i + 1)
            {
                cards[i].PasswordAttempts = 3;
            }

            BankAuthentication auth = new BankAuthentication(cards);
            Assert.AreEqual(auth.Authenticate("24680", "0000"), false);
        }

        [TestMethod()]
        public void CorrentPasswordTest()
        {
            List<Card> cards = new List<Card>();

            /*Card 1*/
            Card one = new Card();
            one.CardNumber = "12345";
            one.Pin = "2244";

            /*Card 2*/
            Card two = new Card();
            two.CardNumber = "24680";
            two.Pin = "0011";

            /*Card 3*/
            Card three = new Card();
            three.CardNumber = "98765";
            three.Pin = "2468";

            /*Add cards to the list*/
            cards.Add(one);
            cards.Add(two);
            cards.Add(three);

            for (int i = 0; i < cards.Count; i = i + 1)
            {
                cards[i].PasswordAttempts = 3;
            }

            BankAuthentication auth = new BankAuthentication(cards);
            Assert.AreEqual(auth.Authenticate("24680", "0011"), true);
        }

        [TestMethod()]
        public void WrongUsernameTest()
        {
            List<Card> cards = new List<Card>();

            /*Card 1*/
            Card one = new Card();
            one.CardNumber = "12345";
            one.Pin = "2244";

            /*Card 2*/
            Card two = new Card();
            two.CardNumber = "24680";
            two.Pin = "0011";

            /*Card 3*/
            Card three = new Card();
            three.CardNumber = "98765";
            three.Pin = "2468";

            /*Add cards to the list*/
            cards.Add(one);
            cards.Add(two);
            cards.Add(three);

            for (int i = 0; i < cards.Count; i = i + 1)
            {
                cards[i].PasswordAttempts = 3;
            }

            BankAuthentication auth = new BankAuthentication(cards);
            Assert.AreEqual(auth.Authenticate("10101", "0011"), false);
        }

        [TestMethod()]
        public void AttemptsTest()
        {
            List<Card> cards = new List<Card>();

            /*Card 1*/
            Card one = new Card();
            one.CardNumber = "12345";
            one.Pin = "2244";

            /*Add cards to the list*/
            cards.Add(one);

            for (int i = 0; i < cards.Count; i = i + 1)
            {
                cards[i].PasswordAttempts = 3;
            }

            BankAuthentication auth = new BankAuthentication(cards);
            auth.Authenticate("12345", "0010");
            auth.Authenticate("12345", "0010");
            auth.Authenticate("12345", "0010");

            Assert.AreEqual(auth.Authenticate("12345", "2244"), false);
        }
    }
}