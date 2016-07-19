/*    Test 5.7.4-1 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node in nodesToRegister[]
            And the node exists
          When RegisterNodes is called
          Then the server returns a node that refers to the given node
            (note: the returned nodeId can be identical to the passed nodeId or can be different) */

function register574001() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.NumericSettings )[0];
    if( item === undefined || item === null ) {
        addSkipped( "Unable to perform test. No numeric nodes configured for testing." );
        return( false );
    }
    TestRegisterNodes( Test.Session.Session, [ item.NodeId ], 0 );
    TestRegisterNodes( Test.Session.Session, [ item.NodeId ], 0x3ff );
    return( true );
}

Test.Execute( { Procedure: register574001 } );