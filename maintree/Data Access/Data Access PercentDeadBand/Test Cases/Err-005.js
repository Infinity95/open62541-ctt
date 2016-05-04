/*  Test prepared by Kevin Herron: kevin@inductiveautomation.ocm
    Description: Create a monitoredItem of type AnalogType, specify a PercentDeadband value of -1.
    Expected results: ServiceLevel=Good.�; OperationLevel result = Bad_DeadbandFilterInvalid. */

function createMonitoredItemErr612005()
{
    const DEADBANDVALUE = -1;

    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings;
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings )[0];
    if( item === undefined )
    {
        addSkipped( "Static AnalogItem" );
        return( false );
    }

    // Set the filter to PercentDeadband
    item.Filter = Event.GetDataChangeFilter( DeadbandType.Percent, DEADBANDVALUE, DataChangeTrigger.StatusValue );

    // create the monitored item, which we expect to fail
    var expectedResult = [ new ExpectedAndAcceptedResults( StatusCode.BadDeadbandFilterInvalid ) ];
    CreateMonitoredItemsHelper.Execute( { 
            ItemsToCreate: item, 
            TimestampsToReturn: TimestampsToReturn.Both, 
            SubscriptionId: MonitorBasicSubscription, 
            OperationResults: expectedResult
            } );

    // delete the monitored item, which we expect to also fail!
    expectedResult = new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo );
    DeleteMonitoredItemsHelper.Execute( {
            ItemsToDelete: item, 
            SubscriptionId: MonitorBasicSubscription, 
            ServiceResult: expectedResult } );

    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItemErr612005 } );