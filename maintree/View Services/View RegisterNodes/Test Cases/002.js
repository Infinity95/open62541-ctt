/*    Test 5.7.4-2 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given five nodes in nodesToRegister[]
            And the nodes exist
          When RegisterNodes is called
          Then the server returns nodes that refers to the given nodes
            (note: the returned nodeIds can be identical to the passed nodeIds or can be different) */

TestRegisterMultipleNodes( Test.Session.Session, 5, 0 );