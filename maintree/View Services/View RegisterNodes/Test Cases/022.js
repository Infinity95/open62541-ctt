/*    Test 5.7.5-12 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given multiple nodes
            And the nodes are unregistered
          When UnregisterNodes is called
          Then the server returns ServiceResult Good
            And ignores the unregistered nodes */

TestUnregisterMultipleNodesTwice( Test.Session.Session, 10, 0 );