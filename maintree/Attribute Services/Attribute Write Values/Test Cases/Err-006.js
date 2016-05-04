/*  Test prepared by Nathan Pocock; nathan.pocock@opcfoundation.org
    Description: Write to an invalid attribute of a valid node, multiple times in the same call. */

function write582Err008() {
const INVALIDATTRIBUTEID = 0x999;
    var items = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, 0, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, true );
    if( items == null || items.length == 0 ) {
        addSkipped( SETTING_UNDEFINED_SCALARSTATIC );
        return( false );
    }
    while( items.length > 5 ) items.pop();
    var expectedResults = [];
    for( var i=0; i<items.length; i++ ) {
        items[i].Value.Value.setDouble( 13.523 );
        items[i].AttributeId = 0x999;
        expectedResults.push( new ExpectedAndAcceptedResults( StatusCode.BadAttributeIdInvalid ) );
    }//for i...
    return( WriteHelper.Execute( { NodesToWrite: items, OperationResults: expectedResults, ReadVerification: false } ) );
}

Test.Execute( { Procedure: write582Err008 } );