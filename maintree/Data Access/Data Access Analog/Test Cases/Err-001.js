/*  Test prepared by Anand Taparia; ataparia@kepware.com
    Description: Write a complex structure (incorrect type) to an analog item. */

function write613Err001() {
    // Get handle to an analog node
    var monitoredItems = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings, 1 );
    if( monitoredItems.length == 0 ) {
        addSkipped( "Static Analog" );
        return( false );
    }

    // We are interested in a single item for this test
    var writeMonitoredItem = monitoredItems[0];
    
    // Write
    print ( "Writing an 'XmlElement' to analog node '" + writeMonitoredItem.NodeSetting + "' of datatype '" + BuiltInType.toString ( UaNodeId.GuessType( writeMonitoredItem.NodeSetting ) ) + "'." );
    var xmle = new UaXmlElement();
    xmle.setString( "<xml1>6.3-Err-001</xml1>" );
    writeMonitoredItem.SafelySetValueTypeKnown( xmle, BuiltInType.XmlElement );
    // Expected result
    var results = [];
    results[0] = new ExpectedAndAcceptedResults( StatusCode.BadTypeMismatch );
    if( WriteHelper.Execute( { NodesToWrite: writeMonitoredItem, OperationResults: results } ) == false ) {
        addError( "Write failed for node: '" + writeMonitoredItem.NodeSetting + "'." );
    }
    return( true );
}// function write613Err001()

Test.Execute( { Procedure: write613Err001 } );