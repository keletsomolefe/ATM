using System.Collections.Generic;

namespace ATM.Helpers
{
    /// <summary>
    /// Contains my site's global variables.
    /// </summary>
    public static class GlobalData
    {
        /// <summary>
        /// Global variable storing important stuff.
        /// </summary>
        static List<Card> listCards;

        /// <summary>
        /// Get or set the static important data.
        /// </summary>
        public static List<Card> list
        {
            get
            {
                return listCards;
            }
            set
            {
                listCards = value;
            }
        }
    }
}