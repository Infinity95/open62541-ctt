/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description:
        Script specifies MonitoringMode = Sampling, Filter = PercentDeadband, 
        DeadbandValue = 0. Calls Publish.
        Expected Result: ServiceResult/OperationResults: Good
            - On publish no datachange notification should be received. */

function createMonitoredItems612002() {
    var settings = Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.NumericSettings;
    var item = MonitoredItem.fromSettings( settings, 0 )[0];
    if( item === undefined ) {
        addSkipped( "Static Analog" );
        return( false );
    }

    const DEADBANDVALUE = 0;
    const QUEUESIZE = 0;

    // before we do the test, read the analogType so that we can figure out
    // the data-type of the node. We'll need this information so that we can
    // properly specify the value that we'll WRITE to when seeing if the deadband
    // filters the write or not.
    if( ReadHelper.Execute( { NodesToRead: item } ) ) {
        CreateMonitoredItemDeadbandPercent_VerifyWithPublish( 
            item.NodeSetting, MonitoringMode.Sampling, DEADBANDVALUE, MonitorBasicSubscription,
            PublishHelper, WriteHelper, item.Value.Value.DataType, QUEUESIZE );
    }
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems612002 } );