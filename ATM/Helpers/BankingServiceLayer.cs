using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace ATM.Helpers
{
    public class Card
    {
        public string CardNumber { get; set; }
        public string Pin { get; set; }
        public bool Reported { get; set; }
        public int PasswordAttempts { get; set; }
        public List<BankAccount> LinkedBankAccount { get; set; }
    }

    public class BankAccount
    {
        public string AccountName { get; set; }
        public double Balance { get; set; }

        public BankAccount(string name, double balance)
        {
            AccountName = name;
            Balance = balance;
        }

        public void Withdraw(double amount)
        {
            if (amount > Balance)
            {
                throw new ArgumentOutOfRangeException($"amount greater than balance");
            }
            if (amount <= 0)
            {
                throw new ArgumentOutOfRangeException($"amount of less than or equal 0");
            }
            Balance = Balance - amount;
        }

        public void Deposit(double amount)
        {
            if (amount <= 0)
            {
                throw new ArgumentOutOfRangeException($"amount of less than or equal 0");
            }
            Balance = Balance + amount;
        }
    }

    public class BankAuthentication
    {
        private List<Card> Cards { get; set; }

        public BankAuthentication(List<Card> cards)
        {
            Cards = cards;
        }

        public bool Reported(string cardNumber)
        {
            for (int i = 0; i < Cards.Count; i = i + 1)
            {
                if (Cards[i].CardNumber == cardNumber)
                {
                    return Cards[i].Reported;
                }
            }
            return true;
        }

        public bool Available(string cardNumber)
        {
            for (int i = 0; i < Cards.Count; i = i + 1)
            {
                if (Cards[i].CardNumber == cardNumber)
                    return true;
            }
            return false;
        }

        public int Attempts(string cardNumber)
        {
            for (int i = 0; i < Cards.Count; i = i + 1)
            {
                if (Cards[i].CardNumber == cardNumber)
                    return Cards[i].PasswordAttempts;
            }
            return 0;
        }

        public List<BankAccount> GetBankAccounts(string cardNumber)
        {
            for (int i = 0; i < Cards.Count; i = i + 1)
            {
                if (Cards[i].CardNumber == cardNumber)
                    return Cards[i].LinkedBankAccount;
            }
            return null;
        }

        public bool Authenticate(string cardNumber, string pin)
        {
            for (int i = 0; i < Cards.Count; i = i + 1)
            {
                if (Cards[i].CardNumber == cardNumber && Cards[i].Pin != pin)
                {
                    if (Cards[i].PasswordAttempts <= 0)
                        return false;
                    Cards[i].PasswordAttempts = Cards[i].PasswordAttempts - 1;
                }
                if (Cards[i].CardNumber == cardNumber && Cards[i].Pin == pin)
                {
                    if (Cards[i].PasswordAttempts <= 0)
                        return false;
                    else
                    {
                        Cards[i].PasswordAttempts = 3;
                        return true;
                    }
                }
            }
            return false;
        }
    }
}