/* This script will connect to the UA Server and will invoke one call of each and every UA Service.
   We are looking for Services that return BadNotImplemented or BadNotSupported. */

include( "./library/ServiceBased/Helpers.js" );

var expectedServiceResults = new ExpectedResults( { Expected: [ StatusCode.BadNotSupported, StatusCode.BadServiceUnsupported, StatusCode.BadNotImplemented, StatusCode.BadServiceUnsupported ], Accepted: [ StatusCode.Good, StatusCode.BadNothingToDo, StatusCode.BadNotReadable, StatusCode.BadSubscriptionIdInvalid ] } );

var UAServicesDetection = new Object();
UAServicesDetection = {
    Discovery: {
        FindServers: function( args ) { 
            var result = TestResult.Implemented
            FindServersHelper.Execute( { EndpointUrl: readSetting( "/Server Test/Server URL" ), ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( FindServersHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        GetEndpoints: function( args ) { 
            var result = TestResult.Implemented;
            GetEndpointsHelper.Execute2( { EndpointUrl: readSetting( "/Server Test/Server URL" ), ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( GetEndpointsHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        RegisterServer: function( args ) { 
            var result = TestResult.Implemented;
            RegisterServerHelper.Execute( { Server: { DiscoveryUrls: [ readSetting( "/Discovery/Endpoint Url" ) ], GatewayServerUri: "", IsOnline: false, ProductUri: "opcfoundation:ctt:test", SemaphoreFilePath: "", ServerNames: [ "UACTT0" ], ServerType: ApplicationType.Server, ServerUri: "urn:localhost:opcfoundation:ctt" }, ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } );
            if( expectedServiceResults.containsExpectedStatus( RegisterServerHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
    },
    Session: {
        CreateSession: function( args )   { return( TestResult.Implemented ); }, //automatic pass, otherwise we couldn't connect!
        ActivateSession: function( args ) { return( TestResult.Implemented ); }, //automatic pass, otherwise we couldn't connect!
        CloseSession: function( args )    { return( TestResult.Implemented ); }, //automatic pass, otherwise we couldn't connect!
        Cancel: function( args ) { 
            var result = TestResult.Implemented;
            CancelHelper.Execute( { RequestHandle: 0, ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( CancelHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
    },
    NodeManagement: {
        AddNodes: function( args ) { 
            var result = TestResult.Implemented;
            AddNodeIdsHelper.Execute( { ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } );
            if( expectedServiceResults.containsExpectedStatus( AddNodeIdsHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        AddReferences: function( args ) { 
            var result = TestResult.Implemented;
            AddReferencesHelper.Execute( { ReferencesToAdd: [ UaAddReferencesItem.New( { IsForward: true, SourceNodeId: new UaNodeId( Identifier.RootFolder ), ReferenceTypeId: new UaNodeId( Identifier.HasChild ) } ) ], ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } );
            if( expectedServiceResults.containsExpectedStatus( AddReferencesHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        DeleteNodes: function( args ) { 
            var result = TestResult.Implemented;
            DeleteNodeIdsHelper.Execute( { ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } )
            if( expectedServiceResults.containsExpectedStatus( DeleteNodeIdsHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        DeleteReferences: function( args ) { 
            var result = TestResult.Implemented;
            DeleteReferencesHelper.Execute( { ReferencesToDelete: [ UaDeleteReferencesItem.New( { IsForward: true, SourceNodeId: new UaNodeId( Identifier.RootFolder ), TargetNodeId: new UaNodeId( Identifier.ObjectNode ), ReferenceTypeId: new UaNodeId( Identifier.HasComponent ) } ) ], ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } ); 
            if( expectedServiceResults.containsExpectedStatus( DeleteReferencesHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
    },
    View: {
        Browse: function( args ) { 
            var result = TestResult.Implemented;
            BrowseHelper.Execute( { NodesToBrowse: MonitoredItem.fromNodeIds( [ new UaNodeId( Identifier.RootFolder ) ] )[0], ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } );
            if( expectedServiceResults.containsExpectedStatus( BrowseHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        BrowseNext: function( args ) { 
            var result = TestResult.Implemented;
            BrowseNextHelper.Execute( { ReleaseContinuationPoints: true, ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } );
            if( expectedServiceResults.containsExpectedStatus( BrowseNextHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        TranslateBrowsePathsToNodeIds: function( args ) { 
            var result = TestResult.Implemented;
            TranslateBrowsePathsToNodeIdsHelper.Execute( { NodeIds: [ MonitoredItem.fromNodeIds( [ UaNodeId( Identifier.RootFolder ) ] )[0] ], BrowsePaths: [ "Objects" ], ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } );
            if( expectedServiceResults.containsExpectedStatus( TranslateBrowsePathsToNodeIdsHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        RegisteredNodes: function( args ) { 
            var result = TestResult.Implemented; 
            RegisterNodesHelper.Execute( { ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( RegisterNodesHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        UnregisterNodes: function( args ) { 
            var result = TestResult.Implemented;
            UnregisterNodesHelper.Execute( { ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( UnregisterNodesHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
    },
    Query: {
        QueryFirst: function( args ) { 
            var result = TestResult.Implemented;
            var qfExpectedResults = expectedServiceResults.clone();
            qfExpectedResults.addAcceptedResult( StatusCode.BadContinuationPointInvalid );
            QueryFirstHelper.Execute( { NodeTypes: [ new UaNodeTypeDescription() ], ServiceResult: qfExpectedResults, SuppressMessaging: true } );
            if( qfExpectedResults.containsExpectedStatus( QueryFirstHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        QueryNext: function( args ) { 
            var result = TestResult.Implemented;
            var qfExpectedResults = expectedServiceResults.clone();
            qfExpectedResults.addAcceptedResult( StatusCode.BadContinuationPointInvalid );
            QueryNextHelper.Execute( { ContinuationPoint: new UaByteString(), ReleaseContinuationPoints: true, ServiceResult: qfExpectedResults, SuppressMessaging: true } );
            if( qfExpectedResults.containsExpectedStatus( QueryNextHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
    },
    Attribute: {
        Read: function( args ) { 
            var result = TestResult.Implemented;
            var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
            ReadHelper.Execute( { NodesToRead: item, ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } );
            if( expectedServiceResults.containsExpectedStatus( ReadHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        HistoryRead: function( args ) { 
            var result = TestResult.Implemented;
            HistoryReadHelper.Execute( { NodesToRead: MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0], 
                    HistoryReadDetails: UaReadRawModifiedDetails.New( { IsReadModified: false, StartTime: UaDateTime.utcNow(), EndTime: UaDateTime.utcNow(), NumValuesPerNode: 0, ReturnBounds: true } ),
                    ReleaseContinuationPoints: true, SuppressMessaging: true, SuppressWarnings: true, SuppressErrors: true, 
                    ServiceResult: expectedServiceResults, 
                    OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.BadNotReadable, StatusCode.BadContinuationPointInvalid, StatusCode.BadHistoryOperationUnsupported ] ) } );
            if( expectedServiceResults.containsExpectedStatus( HistoryReadHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        Write: function( args ) { 
            var result = TestResult.Implemented;
            var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
            UaVariant.SetValueMin( { Value: item.Value, Type: NodeIdSetting.guessType( item.NodeSetting ) } );
            WriteHelper.Execute( { NodesToWrite: item, ServiceResult: expectedServiceResults, OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadTypeMismatch, StatusCode.BadUserAccessDenied ] ), ReadVerification: false, SuppressMessaging: true, SuppressWarnings: true } );
            if( expectedServiceResults.containsExpectedStatus( WriteHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        HistoryUpdate: function( args ) { 
            var result = TestResult.Implemented;
            HistoryUpdateHelper.Execute( { HistoryUpdateDetails: UaUpdateDataDetails.New(), SuppressMessaging: true, ServiceResult: expectedServiceResults } );
            if( expectedServiceResults.containsExpectedStatus( HistoryUpdateHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
    },
    Method: {
        Call: function( args ) { 
            var result = TestResult.Implemented;
            CallHelper.Execute( { MethodsToCall: UaCallMethodRequest.New(), ServiceResult: expectedServiceResults, SuppressMessaging: true, SuppressWarnings: true } );
            if( expectedServiceResults.containsExpectedStatus( CallHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
    },
    MonitoredItem: {
        CreateMonitoredItems: function( args ) {
            var result = TestResult.Implemented;
            var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
            CreateMonitoredItemsHelper.Execute( { SubscriptionId: 0, ItemsToCreate: item, ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( CreateMonitoredItemsHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        ModifyMonitoredItems: function( args ) { 
            var result = TestResult.Implemented;
            var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
            ModifyMonitoredItemsHelper.Execute( { SubscriptionId: 0, ItemsToModify: item, ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( ModifyMonitoredItemsHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        SetMonitoringMode: function( args ) { 
            var result = TestResult.Implemented;
            var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
            SetMonitoringModeHelper.Execute( { SubscriptionId: 0, MonitoredItemIds: item, MonitoringMode: MonitoringMode.Reporting, ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( SetMonitoringModeHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        SetTriggering: function( args ) { 
            var result = TestResult.Implemented;
            var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
            SetTriggeringHelper.Execute( { SubscriptionId: new Subscription(), TriggeringItemId: items[0], LinksToAdd: [ items[1] ], ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( SetTriggeringHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        DeleteMonitoredItems: function( args ) { 
            var result = TestResult.Implemented;
            var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
            DeleteMonitoredItemsHelper.Execute( { SubscriptionId: 0, ItemsToDelete: item, ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( DeleteMonitoredItemsHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
    },
    Subscription: {
        CreateSubscription: function( args ) { 
            var result = TestResult.Implemented; 
            CreateSubscriptionHelper.Execute( { Subscription: new Subscription(), ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( CreateSubscriptionHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        ModifySubscription: function( args ) { 
            var result = TestResult.Implemented;
            ModifySubscriptionHelper.Execute( { SubscriptionId: new Subscription(), ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( ModifySubscriptionHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        SetPublishingMode: function( args ) { 
            var result = TestResult.Implemented; 
            SetPublishingModeHelper.Execute( { PublishingEnabled: true, SubscriptionIds: new Subscription(), ServiceResult: expectedServiceResults, OperationResults: new ExpectedAndAcceptedResults( StatusCode.BadSubscriptionIdInvalid ), SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( SetPublishingModeHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        Publish: function( args ) { 
            var result = TestResult.Implemented;
            PublishHelper.Execute( { ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( PublishHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        Republish: function( args ) { 
            var result = TestResult.Implemented;
            RepublishHelper.Execute( { SubscriptionId: new Subscription(), RetransmitSequenceNumber: 0, ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( RepublishHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        TransferSubscriptions: function( args ) { 
            var result = TestResult.Implemented;
            TransferSubscriptionsHelper.Execute( { SubscriptionIds: new Subscription(), SourceSession: Test.Session, DestinationSession: Test.Session, SendInitialValues: true, ServiceResult: expectedServiceResults, OperationResults: new ExpectedAndAcceptedResults( [ StatusCode.Good, StatusCode.BadSubscriptionIdInvalid ] ), SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( TransferSubscriptionsHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
        DeleteSubscriptions: function( args ) { 
            var result = TestResult.Implemented;
            DeleteSubscriptionsHelper.Execute( { SubscriptionIds: new Subscription(), ServiceResult: expectedServiceResults, SuppressMessaging: true } );
            if( expectedServiceResults.containsExpectedStatus( DeleteSubscriptionsHelper.Response.ResponseHeader.ServiceResult ) ) result = TestResult.NotImplemented;
            return( result ); },
    },
};

var TestResult = { Implemented: 1, NotImplemented: 0 };
TestResult.Set = function( cv, nv ) {
    return( cv > nv ? nv : cv );
}
TestResult.toString = function( obj ) { 
    for( var k in this ) if( obj === this[k] ) return( k );
}

function CheckAllUAServices( args ) {
    if( !isDefined( args ) ) args = new Object();
    if( !isDefined( args.Factory ) ) args.Factory = UAServicesDetection; // if a factory doesn't exist, set it to "UAServicesDetection"
    var result = TestResult.Pass;
    var currentFactory = ( isDefined( args.Pointer ) ? args.Pointer: args.Factory );
    for( var o in currentFactory ) {
        var objectType = typeof currentFactory[o];
        switch( objectType ) {
            case 'object': 
                print( o + " =>" );
                args.Pointer = currentFactory[o];
                result = TestResult.Set( CheckAllUAServices( args ) );
                break;
            case 'function' :
                result = TestResult.Set( currentFactory[o]( args ) );
                print( "\t" + o  + "() => " + TestResult.toString( result ) );
                break;
            default: 
                print( "skip [" + o + "]: type: " + objectType );
                break;
        }
    }//for f in func
    return( true );
}

if( Test.Connect() ) {
    Test.Execute( { Procedure: this.CheckAllUAServices } );
    Test.Disconnect();
}