/*  Test prepared by Nathan Pocock nathan.pocock@opcfoundation.org
    Description:Browse a node of this type requesting all Forward references.
    Expectations:
        Service and operation level results are good.
        HasTypeDefinition reference points to NodeId 2376 (Identifier. MultiStateDiscreteType 2376).
        If a HasModelParent reference is returned then verify its validity. */

function browse65007()
{
    BrowseHelper.Execute( { NodesToBrowse: multiStateItems[0] } );
    AssertReferencesContainsBrowseName( BrowseHelper.Response.Results[0].References, "MultiStateDiscreteType", "Expected to find a Forward Reference of type 'MultiStateDiscreteType'", undefined, "Found a Forward Reference to 'MultiStateDiscreteType' - as expected." );
    AssertReferencesContainsReferenceTypeId( BrowseHelper.Response.Results[0].References, new UaNodeId( Identifier.HasModelParent ), "Skipping validation of 'HasModelParent' reference, which is not defined for this node.", true, "Found a Forward Reference to 'HasModelParent' - which is optional." );
    return( true );
}

Test.Execute( { Procedure: browse65007 } );