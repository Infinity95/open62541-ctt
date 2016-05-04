/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Create a MonitoredItem of type String. The value of the string is a number, e.g. �100�. Specify a DeadbandAbsolute of 10.
         Expected Results: ServiceResult = Good. Operation level result = Bad_FilterNotAllowed */

function createMonitoredItems591Err030() {
    if( !MonitorBasicSubscription.SubscriptionCreated ) {
        addError( "Subscription for MonitoredItemsServiceSet was not created." );
        return( false );
    }

    var item = MonitoredItem.fromSetting( "/Server Test/NodeIds/Static/All Profiles/Scalar/String", 0 );
    if( item !== null ) {
        // before we create the monitored item, set the value to a numeric value 
        item.Value.Value.setString( "10" );
        if( WriteHelper.Execute( { NodesToWrite: item } ) ) {
            item.Filter = Event.GetDataChangeFilter( DeadbandType.Absolute, 10, DataChangeTrigger.StatusValue );
            if( !Assert.True( CreateMonitoredItemsHelper.Execute( { 
                        ItemsToCreate: item, 
                        TimestampsToReturn: TimestampsToReturn.Both, 
                        SubscriptionId: MonitorBasicSubscription, 
                        OperationResults: [ new ExpectedAndAcceptedResults( StatusCode.BadFilterNotAllowed ) ]
                        } ), "Expect the filter to fail on the specified data type." ) ) {
                // clean-up
                DeleteMonitoredItemsHelper.Execute( { ItemsToDelete: item, SubscriptionId: MonitorBasicSubscription } );
            }
        }
    }// item!=null
    else {
        _dataTypeUnavailable.store( "String" );
    }
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems591Err030 } );