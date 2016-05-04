/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create MonitoredItems of the following types: String, Boolean, ByteString, LocalizedText, GUID, XmlElement, and QualifiedName.
            For each, specify a DeadbandAbsolute of 10
         Expected Results: ServiceResult = Good. Operation level result = Bad_FilterNotAllowed */

function createMonitoredItems591Err029() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
        return( false );
    }

    var settings = [
        "/Server Test/NodeIds/Static/All Profiles/Scalar/String",
        "/Server Test/NodeIds/Static/All Profiles/Scalar/Bool",
        "/Server Test/NodeIds/Static/All Profiles/Scalar/ByteString",
        "/Server Test/NodeIds/Static/All Profiles/Scalar/LocalizedText",
        "/Server Test/NodeIds/Static/All Profiles/Scalar/Guid",
        "/Server Test/NodeIds/Static/All Profiles/Scalar/XmlElement",
        "/Server Test/NodeIds/Static/All Profiles/Scalar/QualifiedName"
        ];

    // define the items and expected results variables
    var items = MonitoredItem.fromSettings( settings );
    var expectedResults = [];
	for( var i=0; i<items.length; i++ ) {
		items[i].Filter = Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue );
		expectedResults[i] = new ExpectedAndAcceptedResults( [ StatusCode.BadFilterNotAllowed, StatusCode.BadMonitoredItemFilterUnsupported ] );
	}
    // we've defined our items, now add them!
    if( CreateMonitoredItemsHelper.Execute( { 
                ItemsToCreate: items, 
                TimestampsToReturn: TimestampsToReturn.Both, 
                SubscriptionId: MonitorBasicSubscription, 
                OperationResults: expectedResults
                } ) ) {
        if( createMonItemsResp.Results[0].StatusCode.StatusCode === StatusCode.BadMonitoredItemFilterUnsupported ) {
            addNotSupported( "DeadbandAbsolute" );
        }
        // clean-up
        // no items should exist, so the call should fail.
        expectedResult = new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo );
        DeleteMonitoredItemsHelper.Execute( {
            ItemsToDelete: items, 
            SubscriptionId: MonitorBasicSubscription,
            ServiceResult: expectedResult 
            } );
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591Err029 } );