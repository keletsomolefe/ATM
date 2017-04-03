using System.Web;
using System.Web.Optimization;

namespace ATM
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                    "~/Scripts/jquery-{version}.js"
                    ));

            bundles.Add(new ScriptBundle("~/bundles/angularjs").Include(
                    "~/Scripts/angular.js",
                    "~/Scripts/angular-animate.js",
                    "~/Scripts/angular-aria.js",
                    "~/Scripts/angular-messages.js",
                    "~/Scripts/angular-route.js",
                    "~/Scripts/angular-material/angular-material.js",
                    "~/Scripts/treasure-overlay-spinner.js"
                )
                .IncludeDirectory("~/Scripts/Controllers", "*.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"
                        ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"
                        ));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                    "~/Content/angular-material.css",
                    "~/Content/treasure-overlay-spinner.css",
                    "~/Content/site.css"
            ));
        }
    }
}
