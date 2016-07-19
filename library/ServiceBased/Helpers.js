/* GLOBAL USE SCRIPT:
        Defines an instance of ALL UA Service Call helpers, including: 
            Attribute Service Set:             Read, Write.
            Method Service Set:               Call.
            MonitoredItem Service Set:    CreateMonitoredItems, ModifyMonitoredItems, SetMonitoringMode, SetTriggering, DeleteMonitoredItems.
            Subscription Service Set:        CreateSubscription, ModifySubscription, Publish, TransferSubscriptions, DeleteSubscription. */

// Base objects
include( "./library/Base/assertions.js" );
include( "./library/Base/Objects/subscription.js" );
include( "./library/Base/Objects/expectedResults.js" );
include( "./library/Base/Objects/monitoredItem.js" );
include( "./library/Base/serviceRegister.js" );
include( "./library/Base/settings.js" );

// Class Helper objects
include( "./library/RunOnce/redefiners.js" );
include( "./library/ClassBased/UaA.js" );
include( "./library/ClassBased/UaB.js" );
include( "./library/ClassBased/UaD.js" );
include( "./library/ClassBased/UaE.js" );
include( "./library/ClassBased/UaH.js" );
include( "./library/ClassBased/UaI.js" );
include( "./library/ClassBased/UaM.js" );
include( "./library/ClassBased/UaN.js" );
include( "./library/ClassBased/UaO.js" );
include( "./library/ClassBased/UaP.js" );
include( "./library/ClassBased/UaQ.js" );
include( "./library/ClassBased/UaR.js" );
include( "./library/ClassBased/UaS.js" );
include( "./library/ClassBased/UaU.js" );
include( "./library/ClassBased/UaV.js" );
include( "./library/ClassBased/UaW.js" );

// Secure Channel
include( "./library/ServiceBased/SecureChannel/OpenSecureChannel.js" );
include( "./library/ServiceBased/SecureChannel/CloseSecureChannel.js" );
var OpenSecureChannelHelper = new OpenSecureChannelService(), CloseSecureChannelHelper = new CloseSecureChannelService();

// Attribute Service Set
include( "./library/ServiceBased/AttributeServiceSet/Read.js" );
include( "./library/ServiceBased/AttributeServiceSet/Write.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryRead.js" );
include( "./library/ServiceBased/AttributeServiceSet/HistoryUpdate.js" );
var ReadHelper, WriteHelper, HistoryReadHelper, HistoryUpdateHelper;

// Discovery Service Set 
include( "./library/ServiceBased/DiscoveryServiceSet/FindServers.js" );
include( "./library/ServiceBased/DiscoveryServiceSet/GetEndpoints.js" );
include( "./library/ServiceBased/DiscoveryServiceSet/RegisterServer.js" );
var FindServersHelper, GetEndpointsHelper, RegisterServerHelper;

// Method Service Set 
include( "./library/ServiceBased/MethodServiceSet/Call.js" );
var CallHelper;

// Monitored Item Service Set 
include( "./library/ServiceBased/MonitoredItemServiceSet/CreateMonitoredItems.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/ModifyMonitoredItems.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/DeleteMonitoredItems.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/SetMonitoringMode.js" );
include( "./library/ServiceBased/MonitoredItemServiceSet/SetTriggering.js" );
var CreateMonitoredItemsHelper, ModifyMonitoredItemsHelper, SetMonitoringModeHelper, SetTriggeringHelper, DeleteMonitoredItemsHelper;

// NodeManagement Service Set
include( "./library/ServiceBased/NodeManagementServiceSet/DeleteNodes.js" );
include( "./library/ServiceBased/NodeManagementServiceSet/AddNodes.js" );
include( "./library/ServiceBased/NodeManagementServiceSet/AddReferences.js" );
include( "./library/ServiceBased/NodeManagementServiceSet/DeleteReferences.js" );
var AddNodeIdsHelper, DeleteNodeIdsHelper, AddReferencesHelper, DeleteReferencesHelper;

// Session Service Set 
include( "./library/ServiceBased/SessionServiceSet/ActivateSession.js" );
include( "./library/ServiceBased/SessionServiceSet/Cancel.js" );
include( "./library/ServiceBased/SessionServiceSet/CloseSession.js" );
include( "./library/ServiceBased/SessionServiceSet/CreateSession.js" );
var CancelHelper, CreateSessionHelper, CloseSessionHelper, ActivateSessionHelper;

// Subscription Service Set
include( "./library/ServiceBased/SubscriptionServiceSet/CreateSubscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/ModifySubscription.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/DeleteSubscriptions.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/Publish.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/Republish.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/SetPublishingMode.js" );
include( "./library/ServiceBased/SubscriptionServiceSet/TransferSubscriptions.js");
var CreateSubscriptionHelper, ModifySubscriptionHelper, PublishHelper, RepublishHelper, SetPublishingModeHelper, TransferSubscriptionsHelper, DeleteSubscriptionsHelper;

// View Service Set 
include( "./library/ServiceBased/ViewServiceSet/Browse.js" );
include( "./library/ServiceBased/ViewServiceSet/BrowseNext.js" );
include( "./library/ServiceBased/ViewServiceSet/TranslateBrowsePathsToNodeIds.js" );
include( "./library/ServiceBased/ViewServiceSet/RegisterNodes.js" );
include( "./library/ServiceBased/ViewServiceSet/UnregisterNodes.js" );
var BrowseHelper, BrowseNextHelper, TranslateBrowsePathsToNodeIdsHelper, RegisterNodesHelper, UnregisterNodesHelper;

// Query Service Set 
include( "./library/ServiceBased/Query/QueryFirst.js" );
include( "./library/ServiceBased/Query/QueryNext.js" );

// Instanciate objects that are intended to exist globally (without a session context)
CloseSecureChannelHelper = new CloseSecureChannelService();
ActivateSessionHelper = new ActivateSessionService();
CloseSessionHelper = new CloseSessionService();

// Instanciate all helpers (except GetEndpoints)
function InstanciateHelpers( args ) { 
    if( !isDefined( args ) ) throw( "InstanciateHelpers() args not specified." );
    if( !isDefined( args.Session ) ) throw( "InstanciateHelpers() Session not specified." );
    
    // Attribute Service Set
    ReadHelper = new ReadService( { Session: args.Session } );
    WriteHelper = new WriteService( { Session: args.Session } );
    HistoryReadHelper = new HistoryReadService( { Session: args.Session } );
    HistoryUpdateHelper = new HistoryUpdateService( { Session: args.Session } );

    // Discovery Service Set 
    var discoverySession = new UaDiscovery( { Channel: args.Session.Channel } );
    if( isDefined( args.DiscoverySession ) ) {
        FindServersHelper = new FindServersService( { Session: args.DiscoverySession } );
        GetEndpointsHelper = new GetEndpointsService( { Session: args.DiscoverySession } );
        RegisterServerHelper = new RegisterServer( { Session: args.DiscoverySession } );
    }

    // Method Service Set 
    CallHelper = new CallService( { Session: args.Session } );
    
    // Monitored Item Service Set 
    CreateMonitoredItemsHelper = new CreateMonitoredItemsService( { Session: args.Session } );
    ModifyMonitoredItemsHelper = new ModifyMonitoredItemsService( { Session: args.Session } );
    SetMonitoringModeHelper = new SetMonitoringModeService( { Session: args.Session } );
    SetTriggeringHelper = new SetTriggeringService( { Session: args.Session } );
    DeleteMonitoredItemsHelper = new DeleteMonitoredItemsService( { Session: args.Session } );

    // NodeManagement Service Set
    AddNodeIdsHelper = new AddNodeIdsService( { Session: args.Session } );
    DeleteNodeIdsHelper = new DeleteNodeIdsService( { Session: args.Session } );
    AddReferencesHelper = new AddReferencesService( { Session: args.Session } );
    DeleteReferencesHelper = new DeleteReferencesService( { Session: args.Session } );

    // Session Service Set 
    CancelHelper = new CancelService( { Session: args.Session } );

    // Subscription Service Set
    CreateSubscriptionHelper = new CreateSubscriptionService( { Session: args.Session } );
    ModifySubscriptionHelper = new ModifySubscriptionService( { Session: args.Session } );
    PublishHelper = new PublishService( { Session: args.Session } );
    RepublishHelper = new RepublishService( { Session: args.Session } );
    SetPublishingModeHelper = new SetPublishingModeService( { Session: args.Session } );
    TransferSubscriptionsHelper = new TransferSubscriptionsService();
    DeleteSubscriptionsHelper = new DeleteSubscriptionService( { Session: args.Session } );

    // View Service Set 
    BrowseHelper = new BrowseService( { Session: args.Session } );
    BrowseNextHelper = new BrowseNextService( { Session: args.Session } );
    TranslateBrowsePathsToNodeIdsHelper = new TranslateBrowsePathsToNodeIdsService( { Session: args.Session } );
    RegisterNodesHelper = new RegisterNodesService( { Session: args.Session } );
    UnregisterNodesHelper = new UnregisterNodesService( { Session: args.Session } );

    // Query Service Set 
    QueryFirstHelper = new QueryFirstService( { Session: args.Session } );
    QueryNextHelper = new QueryNextService( { Session: args.Session } );
}//InstanciateHelpers()