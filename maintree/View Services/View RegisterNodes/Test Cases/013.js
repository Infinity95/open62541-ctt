/*    Test 5.7.5-3 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given 25 nodes in nodesToUnregister[]
            And the nodes exist
          When UnregisterNodes is called
          Then the server returns ServiceResult Good
            And unregisters the nodes */

include( "./library/Base/array.js" );

function registerNodes013() {
    TestUnregisterMultipleNodes( Test.Session.Session, 25, 0 );
    return( true );
}

Test.Execute( { Procedure: registerNodes013 } );