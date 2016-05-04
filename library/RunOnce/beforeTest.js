/*  SettingsValidation.js
    This script will read the Settings configured with the COMPLIANCE project, which is used for compliance testing
    OPC UA Servers. */

include( "./library/ServiceBased/Helpers.js" );
include( "./library/Base/settings.js" );

/* Validation of the settings include:
    . Make sure all REQUIRED settings contain a value 
    . Make sure all numeric values are within a reasonable range
    . NodeIds: minimum number configured, each setting is valid meets criteria
    . Connectivity: channel, session, and related settings
    . NodeIds actually exist and meets criteria
*/

// STEP 1: check all ESSENTIAL settings contain a value 
if( Assert.StringNotNullOrEmpty( Settings.ServerTest.ServerUrl ) ) Assert.True( Settings.ServerTest.ServerUrl.indexOf( "opc.tcp://" ) == 0 || Settings.ServerTest.ServerUrl.indexOf( "https://" ) == 0, "EndpointUrl does not begin with 'opc.tcp://' or 'https://'" )
Assert.StringNotNullOrEmpty( Settings.ServerTest.Session.LoginNameGranted1 );
Assert.StringNotNullOrEmpty( Settings.ServerTest.Session.LoginNameGranted2 );
Assert.StringNotNullOrEmpty( Settings.ServerTest.Session.LoginNameAccessDenied, "/Server Test/Session/LoginNameAccessDenied" );
Assert.StringNotNullOrEmpty( Settings.ServerTest.NodeIds.Paths.StartingNode, "/Server Test/NodeIds/Paths/StartingNode" );
Assert.StringNotNullOrEmpty( Settings.ServerTest.NodeIds.NodeClasses.Variable, "/Server Test/NodeIds/NodeClasses/Variable" );
Assert.StringNotNullOrEmpty( Settings.ServerTest.NodeIds.NodeClasses.Object );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.TrustListLocation );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.RevocationListLocation );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.Certificate );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.PrivateKey );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.Expired);
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.ExpiredPrivateKey );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.IncorrectlySigned );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.IncorrectlySignedPrivateKey );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.NotTrusted );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.NotTrustedPrivateKey );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.Revoked );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.RevokedPrivateKey );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.NotYetValid );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.NotYetValidPrivateKey );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.IssuerUnknown );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.IssuerUnknownPrivateKey );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.HostnameInvalid );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.HostnameInvalidPrivateKey );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.User );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.Authority );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.ExpiredNotTrusted );
Assert.StringNotNullOrEmpty( Settings.Advanced.Certificates.ExpiredNotTrustedPrivateKey );
Assert.StringNotNullOrEmpty( Settings.Advanced.NodeIds.Invalid.NodeId1 );
Assert.StringNotNullOrEmpty( Settings.Advanced.NodeIds.Invalid.NodeId2 );
Assert.StringNotNullOrEmpty( Settings.Advanced.NodeIds.Invalid.Unknown1 );
Assert.StringNotNullOrEmpty( Settings.Advanced.NodeIds.Invalid.Unknown2 );
Assert.StringNotNullOrEmpty( Settings.Advanced.NodeIds.Invalid.Unknown3 );
Assert.StringNotNullOrEmpty( Settings.Advanced.NodeIds.Invalid.Unknown4 );
Assert.StringNotNullOrEmpty( Settings.Advanced.NodeIds.Invalid.Unknown5 );
Assert.StringNotNullOrEmpty( Settings.Advanced.NodeIds.Invalid.Invalid1 );
Assert.StringNotNullOrEmpty( Settings.Advanced.NodeIds.Invalid.Invalid2 );
Assert.StringNotNullOrEmpty( Settings.Discovery.EndpointUrl );

// STEP 2: Numeric Settings have a value within an acceptable range
Assert.InRange( 1, 10001,  Settings.ServerTest.DefaultSubscriptionPublishInterval, "Server Test > Default Subscription Publish Interval" );
Assert.InRange( 0, 30000,  Settings.ServerTest.TimeTolerance,                      "Server Test > Time Tolerance" );
Assert.InRange( 1, 120,    Settings.ServerTest.SubscriptionTimeout,                "Server Test > Subscription Timeout" );
Assert.InRange( 0, 3000,   Settings.ServerTest.Capabilities.MaxStringLength,            "Server Test > Capabilities > Max String Length" );
Assert.InRange( 0, 65535,  Settings.ServerTest.Capabilities.MaxSupportedSubscriptions,  "Server Test > Capabilities > Max Supported Subscriptions" );
Assert.InRange( 0, 65535,  Settings.ServerTest.Capabilities.MaxSupportedMonitoredItems, "Server Test > Capabilities > Max Supported Monitored Items" );
Assert.InRange( 1, 65535,  Settings.ServerTest.Capabilities.RetransmissionQueueSizePerSession,  "Server Test > Capabilities > Retransmission QeueSize per Session" );
Assert.InRange( 0, 30000,  Settings.ServerTest.Capabilities.FastestPublishIntervalSupported,    "Server Test > Capabilities > Fastest Publishing Interval Supported" );
Assert.InRange( 0, 30000,  Settings.ServerTest.Capabilities.FastestSamplingIntervalSupported,   "Server Test > Capabilities > Fastest Sampling Interval Supported" );
Assert.InRange( 1, 1000,   Settings.ServerTest.Capabilities.MaxPublishRequestsPerSession,       "Server Test > Capabilities > Max Publish Requests per Session" );
Assert.InRange( 0, 65535,  Settings.ServerTest.Capabilities.MaxSecureChannels,                  "Server Test > Capabilities > Max Secure Channels" );
Assert.InRange( 1, 120000, Settings.ServerTest.SecureChannel.NetworkTimeout,     "Server Test > Secure Channel > Network Timeout" );
Assert.InRange( 0, 2,      Settings.ServerTest.Session.UserAuthenticationPolicy, "Server Test > Session > User Authentication Policy" );

// STEP 3: NodeIds are configured (some settings are absolutely required)
Assert.GreaterThan( 0, Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings.length, "Server Test > NodeIds > Static > All Profiles > Scalar" );
Assert.GreaterThan( 0, Settings.ServerTest.NodeIds.References.Settings.length, "Server Test > NodeIds > References" );
Assert.GreaterThan( 0, Settings.ServerTest.NodeIds.NodeClasses.Settings.length, "Server Test > NodeIds > NodeClasses" );

// STEP 4: Connect to the Server using the endpoint and session settings (default connectivity)
function checkAccessRights( items, settingsName ) {
    if( items === undefined || items === null ) return;
    for( item in items ) items[item].AttributeId = Attribute.Value;
    Assert.True( ReadHelper.Execute( { NodesToRead:  items } ), settingsName + ": some can't be read" );
    for( item in items ) items[item].AttributeId = Attribute.AccessLevel;
    if( Assert.True( ReadHelper.Execute( { NodesToRead:  items } ), settingsName + ": some AccessLevel's couldn't be read" ) ) {
        for( item in items ) Assert.Equal( AccessLevel.CurrentRead | AccessLevel.CurrentWrite, items[item].Value.Value.toByte() & AccessLevel.CurrentRead | AccessLevel.CurrentWrite, "Item '" + items[item].NodeId + "' (Setting: " + items[item].NodeSetting + ") is not Read/Write" );
    }
}

if( Test.Connect() ) {

    // STEP 5: Check all NodeIds actually exist.
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( items.length > 0 ) checkAccessRights( items, "Scalar Nodes" );
    items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings );
    if( items.length > 0 ) checkAccessRights( items, "Scalar Array Nodes" );
    items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings );
    if( items.length > 0 ) checkAccessRights( items, "Data Item Nodes" );
    items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DataItem.Settings );
    if( items.length > 0 ) checkAccessRights( items, "Analog Type Nodes" );
    items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.DiscreteType.Settings )
    if( items.length > 0 ) checkAccessRights( items, "Discrete Type Nodes" );
    items =  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.MultiStateValueDiscreteType.Settings )
    if( items.length > 0 ) checkAccessRights( items, "MultiStateValueDiscrete Type Nodes" );
    items =  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.ArrayItemType.Settings )
    if( items.length > 0 ) checkAccessRights( items, "ArrayItem Type Nodes" );
    items =  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.HAProfile.Scalar.Settings )
    if( items.length > 0 ) checkAccessRights( items, "History Scalar Nodes" );
    items =  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.HAProfile.Arrays.Settings )
    if( items.length > 0 ) checkAccessRights( items, "History Array Nodes" );
    items =  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.HAProfile.AccessRights.Settings )
    if( items.length > 0 ) checkAccessRights( items, "History AccessRights Nodes" );
    items =  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.References.Settings )
    for( var i in items ) items[i].AttributeId = Attribute.BrowseName;
    if( items.length > 0 ) Assert.True( ReadHelper.Execute( { NodesToRead: items } ), "References Nodes: some can't be read" );
    items =  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.NodeClasses.Settings )
    for( item in items ) items[item].AttributeId = Attribute.NodeId;
    if( items.length > 0 ) Assert.True( ReadHelper.Execute( { NodesToRead: items } ), "NodeClasses Nodes: some can't be read" );
    items =  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.SecurityAccess.Settings )
    if( items.length > 0 ) {
        var expectedResults = [];
        for( item in items ) {
            items[item].AttributeId = Attribute.Value;
            if( items[item].NodeSetting == "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead" ||
                items[item].NodeSetting == "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead_Write" ||
                items[item].NodeSetting == "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentRead_NotUser" ||
                items[item].NodeSetting == "/Server Test/NodeIds/SecurityAccess/AccessLevel_CurrentWrite_NotcurrentRead" )
                expectedResults.push( new ExpectedAndAcceptedResults( [ StatusCode.BadUserAccessDenied, StatusCode.BadNotReadable ] ) );
            else expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.Good ) );
        }
        Assert.True( !ReadHelper.Execute( { NodesToRead: items, OperationResults: expectedResults } ), "SecurityAccess Nodes: some can't be read" );
    }
    items =  MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Methods.Settings )
    for( item in items ) items[item].AttributeId = Attribute.BrowseName;
    if( items.length > 0 ) Assert.True( ReadHelper.Execute( { NodesToRead: items } ), "Methods Nodes: some can't be read" );

    Test.Disconnect();
}
else stopCurrentUnit();