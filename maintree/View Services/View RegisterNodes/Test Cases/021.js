/*    Test 5.7.5-11 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given a node
            And the node is unregistered
          When UnregisterNodes is called
          Then the server returns ServiceResult Good */

TestUnregisterMultipleNodesTwice( Test.Session.Session, 1, 0 );