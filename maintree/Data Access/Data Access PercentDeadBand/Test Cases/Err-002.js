/*  Test prepared by Kevin Herron: kevin@inductiveautomation.ocm
    Description:
        Create a MonitoredItem and specify a PercentDeadband with a value of 125%.
    Expected results:
        ServiceLevel: �Good�.
        OperationLevel: Bad_DeadbandFilterInvalid */

function createMonitoredItemErr612002()
{
    const DEADBANDVALUE = 125;

    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings;
    var item = MonitoredItem.fromSettings( settings )[0];
    if( item === undefined )
    {
        addSkipped( "Static Analog" );
        return( false );
    }
    
    // Set the filter to PercentDeadband
    item.Filter = Event.GetDataChangeFilter(DeadbandType.Percent, DEADBANDVALUE, DataChangeTrigger.StatusValue);
    
    // create the monitored items, which we expect to fail
    var expectedResult = [new ExpectedAndAcceptedResults(StatusCode.BadDeadbandFilterInvalid)];
    CreateMonitoredItemsHelper.Execute( {
            ItemsToCreate: item, 
            TimestampsToReturn: TimestampsToReturn.Both, 
            SubscriptionId: MonitorBasicSubscription, 
            OperationResults: expectedResult
            } );

    // delete the monitored items, which should fail.
    expectedResult = new ExpectedAndAcceptedResults( StatusCode.BadNothingToDo );
    DeleteMonitoredItemsHelper.Execute( {
                ItemsToDelete: item, 
                SubscriptionId: MonitorBasicSubscription, 
                ServiceResult: expectedResult 
                } );

    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItemErr612002 } );