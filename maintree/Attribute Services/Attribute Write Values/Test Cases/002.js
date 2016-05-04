/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to the Value attribute for multiple valid nodes.  */

Test.Execute( { Procedure: function test() {
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings );
    if( items == null || items.length < 2 ) { addSkipped( SETTING_UNDEFINED_SCALARSTATIC ); return( false ); }
    // read the values first, and we'll increment later
    ReadHelper.Execute( { NodesToRead: items } );
    // setup some expectations that would allow the write to succeed or fail if writes are not supported
    var readResults = [];
    for( var i=0; i<items.length; i++ ) {
        readResults[i] = new ExpectedAndAcceptedResults( StatusCode.Good );
        readResults[i].addExpectedResult( StatusCode.BadWriteNotSupported );
        UaVariant.Increment( { Value: items[i].Value } );
    }//for i...
    // write the new values, pass-in the expected results
    WriteHelper.Execute( { NodesToWrite: items, OperationResults: readResults, CheckNotSupported: true } );
    return( true );
} } );