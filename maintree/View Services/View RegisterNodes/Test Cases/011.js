/*    Test 5.7.5-1 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node in nodesToUnregister[]
            And the node exists
          When UnregisterNodes is called
          Then the server returns ServiceResult Good
            And unregisters the node */

function test011() {
    var item = MonitoredItem.fromSettings( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings )[0];
    TestUnregisterNodes( Test.Session.Session, [ item.NodeId ], 0 );
    TestUnregisterNodes( Test.Session.Session, [ item.NodeId ], 0x3ff );
    return( true );
}

Test.Execute( { Procedure: test011 } );