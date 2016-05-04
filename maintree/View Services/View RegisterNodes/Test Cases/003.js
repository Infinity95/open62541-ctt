/*    Test 5.7.4-3 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given 25 nodes in nodesToRegister[]
            And the nodes exist
          When RegisterNodes is called
          Then the server returns nodes that refers to the given nodes
            (note: the returned nodeIds can be identical to the passed nodeIds or can be different) */

include( "./library/Base/array.js" );

TestRegisterMultipleNodes( Test.Session.Session, 25, 0 );