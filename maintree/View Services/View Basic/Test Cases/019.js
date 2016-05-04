/*    Test 5.7.1-20 prepared by Dale Pope dale.pope@matrikon.com
      Description:
          Given one node to browse
            And the node has a reference
            And the ResultMask is set to one a combination
          When Browse is called
          Then the server returns Reference Description fields matching the ResultMask

          Validation is accomplished by first browsing all Reference Description
          fields of a node, storing the found fields, and comparing them to the
          requested fields.
*/

include( "./library/ServiceBased/ViewServiceSet/Browse/result_mask_test.js" );

// The test
function Test571020() {
    var nodeToBrowse = NodeIdSettings.getMaxNoNodeIds( NodeIdSettings.References, 1 )[0];
    if( !isDefined( nodeToBrowse ) ) {
        addSkipped( SETTING_UNDEFINED_REFERENCES );
        return( false );
    }
    TestBrowseOneNodeWithResultMask( Test.Session.Session, nodeToBrowse, 0x00, 0 );
    TestBrowseOneNodeWithResultMask( Test.Session.Session, nodeToBrowse, 0x3E, 0 );
    TestBrowseOneNodeWithResultMask( nodeToBrowse, 0x15, 0 );
    TestBrowseOneNodeWithResultMask( Test.Session.Session, nodeToBrowse, 0x2B, 0 );
    TestBrowseOneNodeWithResultMask( Test.Session.Session, nodeToBrowse, 0x07, 0 );
    TestBrowseOneNodeWithResultMask( Test.Session.Session, nodeToBrowse, 0x39, 0 );
    TestBrowseOneNodeWithResultMask( Test.Session.Session, nodeToBrowse, 0x1A, 0 );
    TestBrowseOneNodeWithResultMask( Test.Session.Session, nodeToBrowse, 0x24, 0 );
    return( true );
}

Test.Execute( { Procedure: Test571020 } );