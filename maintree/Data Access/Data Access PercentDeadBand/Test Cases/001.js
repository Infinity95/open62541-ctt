/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Creates a Disabled monitoredItem with a deadbandPercent=0. */

function createMonitoredItems612001() {
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
            item.NodeSetting, MonitoringMode.Disabled, DEADBANDVALUE, MonitorBasicSubscription,
            PublishHelper, WriteHelper, item.Value.Value.DataType, QUEUESIZE );
    }
    PublishHelper.Clear();
    return( true );
}

Test.Execute( { Procedure: createMonitoredItems612001 } );