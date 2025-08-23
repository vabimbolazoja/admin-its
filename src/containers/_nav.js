import React from "react";
import CIcon from "@coreui/icons-react";
var userRoles = sessionStorage.getItem("roleUser");
let _nav;

switch (userRoles) {
  case "SUPERIOR_ADMIN":
    _nav = [
      {
        _tag: "CSidebarNavItem",
        name: "Dashboard",
        to: "/dashboard",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },

      {
        _tag: "CSidebarNavItem",
        name: "Users",
        to: "/users",
        className: "m2",
        icon: "cil-chart-pie",
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Customer Verification",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Accepted Verification",
            to: "/customer/accepted_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Approved Verification",
            to: "/customer/approved_kyc",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Not-Accepted Verification",
            to: "/customer/not-accepted_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Rejected Verification",
            to: "/customer/rejected_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Due Deligence",
            to: "/customer/due_deligence",
          },
        ],
      },

      {
        _tag: "CSidebarNavDropdown",
        name: "Artisan Verification",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Accepted Verification",
            to: "/artisan/accepted_kyc_artisan",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Approved Verification",
            to: "/artisan/approved_kyc_artisan",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Not-Accepted Verification",
            to: "/artisan/not-accepted_kyc_artisan",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Rejected Verification",
            to: "/artisan/rejected_kyc_artisan",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Due Deligence",
            to: "/artisan/due_deligence_kyc_artisan",
          },
        ],
      },
     
      {
        _tag: "CSidebarNavItem",
        name: "Admins",
        to: "/admins",
        className: "m2",
        icon: "cil-chart-pie",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Category Moderation",
        to: "/category-moderation",
        className: "m2",
        icon: "cil-chart-pie",
      },

      {
        _tag: "CSidebarNavDropdown",
        name: "Moderation",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Customer Addresses",
            to: "/moderation/customer-address",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Artisan Addresses",
            to: "/moderation/artisan-address",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Artisan Portfolios",
            to: "/moderation/artisan-portfolios",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Artisan Categories",
            to: "/moderation/artisan-categories",
          },
         
        ],
      },
 
    
     
      {
        _tag: "CSidebarNavItem",
        name: "Bookings",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },
    

     


      {
        _tag: "CSidebarNavItem",
        name: "System Configuration",
        to: "/system-configurations",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },

   
      {
        _tag: "CSidebarNavItem",
        name: "System Alerts",
        to: "/system-alerts",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },
      

  
    ];
    break;
  case "LEADER_ADMIN":
    _nav = [
      {
        _tag: "CSidebarNavItem",
        name: "Dashboard",
        to: "/dashboard",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },
      {
        _tag: "CSidebarNavItem",
        name: "Admins",
        to: "/admins",
        className: "m2",
        icon: "cil-chart-pie",
      },

      {
        _tag: "CSidebarNavItem",
        name: "Users",
        to: "/users",
        className: "m2",
        icon: "cil-chart-pie",
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Users Verification",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Accepted Verification",
            to: "/accepted_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Approved Verification",
            to: "/approved_kyc",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Not-Accepted Verification",
            to: "/not-accepted_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Rejected Verification",
            to: "/rejected_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Due Deligence",
            to: "/due_deligence",
          },
        ],
      },

      {
        _tag: "CSidebarNavDropdown",
        name: "Configurations",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Settlements",
            to: "/config-settlements",
          },
        ],
      },

      {
        _tag: "CSidebarNavDropdown",
        name: "Transactions",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Exchange",
            to: "/exchange",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Settlements",
            to: "/transaction-settlements",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Fund Wallet",
            to: "/fund-wallet",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Withdrawal",
            to: "/withdrawals",
          },
          ,
        ],
      },

      {
        _tag: "CSidebarNavDropdown",
        name: "Asks",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Ask",
            to: "/asks",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Ask Rate",
            to: "/ask_rate",
          },
        ],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Bids",
        to: "/bids",
        className: "m2",
        icon: "cil-chart-pie",
      },

      {
        _tag: "CSidebarNavItem",
        name: "Jobs",
        to: "/jobs",
        className: "m2",
        icon: "cil-chart-pie",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Waiting List",
        to: "/waiting-lists",
        className: "m2",
        icon: "cil-chart-pie",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Limit Profile",
        to: "/limit-profile",
        className: "m2",
        icon: "cil-chart-pie",
      },
      {
        _tag: "CSidebarNavItem",
        name: "Blogs",
        to: "/blogs",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },

      {
        _tag: "CSidebarNavItem",
        name: "Proxy Transfer",
        to: "/proxy_transfer",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },
    
    ];

    break;
  case "SUPER_ADMIN":
    _nav = [
      {
        _tag: "CSidebarNavItem",
        name: "Dashboard",
        to: "/dashboard",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },

      {
        _tag: "CSidebarNavItem",
        name: "Users",
        to: "/users",
        className: "m2",
        icon: "cil-chart-pie",
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Users Verification",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Accepted Verification",
            to: "/accepted_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Approved Verification",
            to: "/approved_kyc",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Not-Accepted Verification",
            to: "/not-accepted_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Rejected Verification",
            to: "/rejected_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Due Deligence",
            to: "/due_deligence",
          },
        ],
      },

      {
        _tag: "CSidebarNavDropdown",
        name: "Transactions",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Exchange",
            to: "/exchange",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Settlements",
            to: "/transaction-settlements",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Fund Wallet",
            to: "/fund-wallet",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Withdrawal",
            to: "/withdrawals",
          },
        ],
      },

      {
        _tag: "CSidebarNavDropdown",
        name: "Asks",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Ask",
            to: "/asks",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Ask Rate",
            to: "/ask_rate",
          },
        ],
      },
      {
        _tag: "CSidebarNavItem",
        name: "Bids",
        to: "/bids",
        className: "m2",
        icon: "cil-chart-pie",
      },

      {
        _tag: "CSidebarNavItem",
        name: "Blogs",
        to: "/blogs",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },

      {
        _tag: "CSidebarNavItem",
        name: "Reconciliation",
        to: "/reconciliation",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },
    ];

    break;
  case "ADMIN":
    _nav = [
      {
        _tag: "CSidebarNavItem",
        name: "Dashboard",
        to: "/dashboard",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },

      {
        _tag: "CSidebarNavItem",
        name: "Users",
        to: "/users",
        className: "m2",
        icon: "cil-chart-pie",
      },
      {
        _tag: "CSidebarNavDropdown",
        name: "Users Verification",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Accepted Verification",
            to: "/accepted_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Approved Verification",
            to: "/approved_kyc",
          },

          {
            _tag: "CSidebarNavItem",
            name: "Not-Accepted Verification",
            to: "/not-accepted_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Rejected Verification",
            to: "/rejected_kyc",
          },
          {
            _tag: "CSidebarNavItem",
            name: "Due Deligence",
            to: "/due_deligence",
          },
        ],
      },

      {
        _tag: "CSidebarNavDropdown",
        name: "Configurations",
        className: "m2",
        route: "/buttons",
        icon: "cil-cursor",
        _children: [
          {
            _tag: "CSidebarNavItem",
            name: "Settlements",
            to: "/config-settlements",
          },
        ],
      },
    ];

    break;
  case "MARKETING_ADMIN":
    _nav = [
      {
        _tag: "CSidebarNavItem",
        name: "Blogs",
        to: "/blogs",
        icon: (
          <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />
        ),
      },
    ];

    break;

  default:
    _nav = [];
}

export default _nav;
