import React from "react";
var userRoles = sessionStorage.getItem("roleUser");

let routes;

const Users = React.lazy(() => import("./views/users/Users"));
const PoolConfig = React.lazy(() => import("./views/PoolsSystem/config"));
const Pools = React.lazy(() => import("./views/PoolsSystem/pools"));
const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const KycAccepetd = React.lazy(() => import("./views/user_kyc/accepted"));
const KycRejected = React.lazy(() => import("./views/user_kyc/rejected"));
const KycNotAccepted = React.lazy(() =>
  import("./views/user_kyc/not_accpeted")
);
const KycApproved = React.lazy(() => import("./views/user_kyc/approved"));
const Deligence = React.lazy(() => import("./views/user_kyc/due_diligence"));

const KycAccepetdArtisan = React.lazy(() => import("./views/artisan-kyc/accepted"));
const KycRejectedArtisan = React.lazy(() => import("./views/artisan-kyc/rejected"));
const KycNotAcceptedArtisan = React.lazy(() =>
  import("./views/artisan-kyc/not_accpeted")
);
const KycApprovedArtisan = React.lazy(() => import("./views/artisan-kyc/approved"));
const DeligenceArtisan = React.lazy(() => import("./views/artisan-kyc/due_diligence"));
const ModerationController = React.lazy(() => import("./views/moderations/base"));
const CategoryModeration = React.lazy(() => import("./views/moderations/category"));
const SkillsModeration = React.lazy(() => import("./views/moderations/skills"));

const ArtisanAddressesModeration = React.lazy(() => import("./views/moderations/artisan-addresses"));
const CustomerAddressModeration = React.lazy(() => import("./views/moderations/customer-addresses"));
const ArtisanCategoriesModeration = React.lazy(() => import("./views/moderations/artisan-categories"));
const ArtisanPortfolioModeration = React.lazy(() => import("./views/moderations/artisan-portolfiols"));


const Asks = React.lazy(() => import("./views/asks/asks"));
const AskRate = React.lazy(() => import("./views/asks/ask_rate"));
const Bids = React.lazy(() => import("./views/bids/bids"));
const Transactions = React.lazy(() =>
  import("./views/transactions/transactions")
);
const WaitingList = React.lazy(() =>
  import("./views/waiting-lists/waiting-list")
);
const TransSettlement = React.lazy(() =>
  import("./views/transactions/settlments")
);
const Withdrawals = React.lazy(() => import("./views/transactions/withdrawal"));
const SpecialAccess = React.lazy(() =>
  import("./views/special_access/special_access")
);
const FundWallet = React.lazy(() => import("./views/transactions/deposits"));
const Exchange = React.lazy(() => import("./views/transactions/exhange"));
const Transfer = React.lazy(() => import("./views/transactions/tranfer"));
const Jobs = React.lazy(() => import("./views/jobs/jobs"));
const InstantSettlement = React.lazy(() =>
  import("./views/instant-settlement/instant-settlement")
);
const UserAsks = React.lazy(() =>
  import("./views/users/userActions/askTransactions")
);
const UserBids = React.lazy(() =>
  import("./views/users/userActions/bidTransactions")
);
const UserDeposits = React.lazy(() =>
  import("./views/users/userActions/fundTransactions")
);
const UserWithdrawals = React.lazy(() =>
  import("./views/users/userActions/withdrawTransactions")
);
const ViewUser = React.lazy(() => import("./views/users/userActions/index"));
const Finance = React.lazy(() => import("./views/finance/finance"));
const Expenses = React.lazy(() => import("./views/expenses/expenses"));
const Reconciliation = React.lazy(() =>
  import("./views/Reconciliation/reconciliation")
);
const configSettlements = React.lazy(() =>
  import("./views/configurations/settlements")
);
const SystemAlerts = React.lazy(() =>
  import("./views/system-alerts/system-alerts")
);
const LimitProfile = React.lazy(() =>
  import("./views/LimitProfile/limit-profile")
);
const Messages = React.lazy(() => import("./views/Messages/messages"));
const Notifications = React.lazy(() =>
  import("./views/Notification-board/notification")
);
const Blog = React.lazy(() => import("./views/Blog/blog"));
const Triggers = React.lazy(() => import("./views/admin-triggers/triggers"));
const ProxyTransfer = React.lazy(() =>
  import("./views/proxy-transfer/proxy-transfer")
);
const ActiveCompanies = React.lazy(() =>
  import("./views/Companies/active_companies")
);

const InactiveCompanies = React.lazy(() =>
  import("./views/Companies/inactive_companies")
);
const LinkedAccounts = React.lazy(() =>
  import("./views/LinkedAccounts/LinkedAccounts")
);
const TestBlog = React.lazy(() => import("./views/Blog/test"));
const SystemConfiguration = React.lazy(() =>
  import("./views/System-Configurations/system-configurations")
);
const USDPayouts = React.lazy(() =>
  import("./views/us-UsdOPayouts/usd-payouts")
);
const RichUsGuys = React.lazy(() =>
  import("./views/rich-us-guys/rich-us-guys")
);
const Admins = React.lazy(() => import("./views/admins/admins"));
const KudaAccount = React.lazy(() => import("./views/kudaAccount/index"));
const KudaAccountInfo = React.lazy(() => import("./views/kudaAccount/info"));
const BusinessPools = React.lazy(() => import("./views/PoolsSystem/businessPool"));


routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/test-blog", name: "Dashboard", component: TestBlog },
  { path: "/users", exact: true, name: "Users", component: Users },
  { path: "/users", exact: true, name: "Users", component: Users },
  { path: "/kuda-account", exact: true, name: "Users", component: KudaAccount },
  { path: "/kuda-bank-info/:id", exact: true, name: "Users", component: KudaAccountInfo },

  { path: "/moderation/artisan-address", exact: true, name: "Users", component: ArtisanAddressesModeration },
  { path: "/moderation/artisan-categories", exact: true, name: "Users", component: ArtisanCategoriesModeration },
  { path: "/moderation/artisan-portfolios", exact: true, name: "Users", component: ArtisanPortfolioModeration },
  { path: "/moderation/customer-address", exact: true, name: "Users", component: CustomerAddressModeration },

  {
    path: "/customer/accepted_kyc",
    exact: true,
    name: "Kyc ",
    component: KycAccepetd,
  },
  {
    path: "/customer/approved_kyc",
    exact: true,
    name: "Kyc ",
    component: KycApproved,
  },
  {
    path: "/category-moderation",
    exact: true,
    name: "Kyc ",
    component: CategoryModeration,
  },
  {
    path: "/skill-moderation",
    exact: true,
    name: "Kyc ",
    component: SkillsModeration,
  },
  {
    path: "/moderation-controller",
    exact: true,
    name: "Kyc ",
    component: ModerationController,
  },
  {
    path: "/system-configurations",
    exact: true,
    name: "Kyc ",
    component: SystemConfiguration,
  },
  {
    path: "/customer/not-accepted_kyc",
    exact: true,
    name: "Kyc ",
    component: KycNotAccepted,
  },
  {
    path: "/customer/rejected_kyc",
    exact: true,
    name: "Kyc ",
    component: KycRejected,
  },
  {
    path: "/customer/due_deligence",
    exact: true,
    name: "Waiting Lists ",
    component: Deligence,
  },

  {
    path: "/artisan/accepted_kyc_artisan",
    exact: true,
    name: "Kyc ",
    component: KycAccepetdArtisan,
  },
  {
    path: "/artisan/approved_kyc_artisan",
    exact: true,
    name: "Kyc ",
    component: KycApprovedArtisan,
  },
 
  {
    path: "/artisan/not-accepted_kyc_artisan",
    exact: true,
    name: "Kyc ",
    component: KycNotAcceptedArtisan,
  },
  {
    path: "/artisan/rejected_kyc_artisan",
    exact: true,
    name: "Kyc ",
    component: KycRejectedArtisan,
  },
  {
    path: "/artisan/due_deligence_kyc_artisan",
    exact: true,
    name: "Waiting Lists ",
    component: DeligenceArtisan,
  },

  {
    path: "/ask_rate",
    exact: true,
    name: "Waiting Lists ",
    component: AskRate,
  },
  {
    path: "/admins",
    exact: true,
    name: "Waiting Lists ",
    component: Admins,
  },

  {
    path: "/special_access",
    exact: true,
    name: "Waiting Lists ",
    component: SpecialAccess,
  },

  {
    path: "/transactions",
    exact: true,
    name: "Transactions ",
    component: Transactions,
  },
  { path: "/asks", exact: true, name: "Asks ", component: Asks },
  { path: "/bids", exact: true, name: "Bids ", component: Bids },
  {
    path: "/transaction-settlements",
    exact: true,
    name: "Waiting Lists ",
    component: TransSettlement,
  },
  {
    path: "/fund-wallet",
    exact: true,
    name: "Waiting Lists ",
    component: FundWallet,
  },
  {
    path: "/withdrawals",
    exact: true,
    name: "Waiting Lists ",
    component: Withdrawals,
  },
  {
    path: "/exchange",
    exact: true,
    name: "Waiting Lists ",
    component: Exchange,
  },
  {
    path: "/transfer",
    exact: true,
    name: "Waiting Lists ",
    component: Transfer,
  },
  { path: "/jobs", exact: true, name: "Waiting Lists ", component: Jobs },
  {
    path: "/waiting-lists",
    exact: true,
    name: "Waiting Lists ",
    component: WaitingList,
  },
  {
    path: "/config-settlements",
    exact: true,
    name: "Waiting Lists ",
    component: configSettlements,
  },
  {
    path: "/rich-us-guys",
    exact: true,
    name: "Waiting Lists ",
    component: RichUsGuys,
  },
  {
    path: "/limit-profile",
    exact: true,
    name: "Waiting Lists ",
    component: LimitProfile,
  },
  {
    path: "/triggers",
    exact: true,
    name: "Waiting Lists ",
    component: Triggers,
  },
  {
    path: "/notification",
    exact: true,
    name: "Waiting Lists ",
    component: Messages,
  },
  { path: "/blogs", exact: true, name: "Waiting Lists ", component: Blog },
  {
    path: "/proxy_transfer",
    exact: true,
    name: "Waiting Lists ",
    component: ProxyTransfer,
  },
  {
    path: "/config-pool",
    exact: true,
    name: "Waiting Lists ",
    component: PoolConfig,
  },
  {
    path: "/business-pool",
    exact: true,
    name: "Waiting Lists ",
    component: BusinessPools,
  },
  {
    path: "/pools",
    exact: true,
    name: "Waiting Lists ",
    component: Pools,
  },
  {
    path: "/linked_accounts",
    exact: true,
    name: "Waiting Lists ",
    component: LinkedAccounts,
  },
  {
    path: "/user-asks-transactions",
    exact: true,
    name: "Waiting Lists ",
    component: UserAsks,
  },
  {
    path: "/instant_settlement",
    exact: true,
    name: "Waiting Lists ",
    component: InstantSettlement,
  },
  {
    path: "/user-bids-transactions",
    exact: true,
    name: "Waiting Lists ",
    component: UserBids,
  },
  {
    path: "/user-deposits-transactions",
    exact: true,
    name: "Waiting Lists ",
    component: UserDeposits,
  },
  {
    path: "/active_companies",
    exact: true,
    name: "Waiting Lists ",
    component: ActiveCompanies,
  },
  {
    path: "/inactive_companies",
    exact: true,
    name: "Waiting Lists ",
    component: InactiveCompanies,
  },
  {
    path: "/user-withdrawal-transactions",
    exact: true,
    name: "Waiting Lists ",
    component: UserWithdrawals,
  },
  {
    path: "/view_user",
    exact: true,
    name: "Waiting Lists ",
    component: ViewUser,
  },
  {
    path: "/finance",
    exact: true,
    name: "Waiting Lists ",
    component: Finance,
  },
  {
    path: "/expenses",
    exact: true,
    name: "Waiting Lists ",
    component: Expenses,
  },
  {
    path: "/reconciliation",
    exact: true,
    name: "Waiting Lists ",
    component: Reconciliation,
  },
  {
    path: "/system-alerts",
    exact: true,
    name: "Waiting Lists ",
    component: SystemAlerts,
  },
  {
    path: "/usd-payouts",
    exact: true,
    name: "Waiting Lists ",
    component: USDPayouts,
  },
  {
    path: "/kuda-account",
    exact: true,
    name: "Kuda Account ",
    component: KudaAccount,
  },
];

export default routes;
