/*    Test 5.7.5-5 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given 100 nodes in nodesToUnregister[]
            And the nodes exist
          When UnregisterNodes is called
          Then the server returns ServiceResult Good
            And unregisters the nodes */

function registerNodes015() {
    TestUnregisterMultipleNodes( Test.Session.Session, 100, 0 );
    return( true );
}

Test.Execute( { Procedure: registerNodes015 } );