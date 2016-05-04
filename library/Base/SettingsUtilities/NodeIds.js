include( "./library/Base/SettingsUtilities/NodeIdSetting.js" );

function NodeIdSettings()
{
}

// Returns an array of NodeIds that have been safely generated from the 
// Static node settings
// Parameters:
//     - maxNumberNeeded (optional) = reduces the array size to meet he need
NodeIdSettings.GetScalarStaticNodeIds = function( maxNumberNeeded )
{
    return( this.getMaxNoNodeIds( Settings.ServerTest.NodeIds.Static.AllProfiles.Scalar.Settings, maxNumberNeeded ) );
};

/*  Returns an array of NodeIds that have been safely generated from the
    static Array node settings.
    Parameters:
        - maxNumberNeeded (optional) = reduces the array size to meet he need */
NodeIdSettings.GetScalarStaticArrayNodeIds = function( maxNumberNeeded )
{
    return( this.getMaxNoNodeIds( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings, maxNumberNeeded ) );
};

/*  Returns an array of NodeIds that have been safely generated from the
    static Static/DA Profile node settings.
    Parameters:
        - maxNumberNeeded (optional) = reduces the array size to meet he need */
NodeIdSettings.GetDAAnalogStaticNodeIds = function( maxNumberNeeded )
{
    return( this.getMaxNoNodeIds( Settings.ServerTest.NodeIds.Static.DAProfile.AnalogType.Settings, maxNumberNeeded ) );
};

// Intended for internal use only, not to be called directly by scripts.
NodeIdSettings.getMaxNoNodeIds = function( nodeIdsFunctionPointer, maxNumberNeeded )
{
    if( maxNumberNeeded === undefined || maxNumberNeeded === null )
    {
        return( this.getNodes( nodeIdsFunctionPointer, true ) );
    }
    else
    {
        var nodes = this.getNodes( nodeIdsFunctionPointer, true );
        while( nodes.length > maxNumberNeeded )
        {
            nodes.pop(); // removes the first item from the array
        }
        return( nodes );
    }
};


NodeIdSettings.GetNodeIdsFromSettings = function ( settingNames, keepUnique )
{
    if( keepUnique !== undefined )
    {
        return( this.getNodes( settingNames ) );
    }
    else
    {
        return( this.getNodes( settingNames, keepUnique ) );
    }
};


// internal helper function used by GetScalarStaticNodeIds, 
// GetArrayStaticNodeIds.
NodeIdSettings.getNodes = function( settingsArray, keepUnique )
{
    var nodes = [];
    var nodeIdValue;
    if( settingsArray !== undefined )
    {
        // an array?
        if( settingsArray.length !== undefined )
        {
            for( var i=0; i<settingsArray.length; i++ )
            {
                if( keepUnique )
                {
                    AddNodeIdSettingToUniqueArray( nodes, settingsArray[i], settingsArray.length );
                }
                else
                {
                    nodeIdValue = UaNodeId.fromString( readSetting( settingsArray[i] ).toString() );
                    if( nodeIdValue !== undefined )
                    {
                        nodes.push( nodeIdValue );
                    }
                }
            }
        }
        else
        {
            addError( "NodeIdSettings.getNodes(): settingsArray does not have length" );
        }
    }
    return( nodes );
};

NodeIdSettings.getScalarStaticUniqueNodeIds = function( maxLength )
{
    var nodeIds = this.getNodes( this.ScalarStaticAll(), true );
    while( nodeIds.length > maxLength )
    {
        nodeIds.pop();
    }
    return nodeIds;
};

NodeIdSettings.GetMultipleVariableUniqueNodeIds = function( maxLength )
{
    var nodeSettingGetters = [ 
        this.ScalarStatic,
        this.ScalarDynamic,
        this.ScalarStatic1OneType ];
    
    var nodeIds = this.getNodes( nodeSettingGetters[0](), true );
    for( var i = 1; i < nodeSettingGetters.length && nodeIds.length < maxLength; i++ )
    {
        nodeIds = nodeIds.concat( this.getNodes( nodeSettingGetters[i], true ) );
    }
    while( nodeIds.length > maxLength )
    {
        nodeIds.pop();
    }
    return nodeIds;
};


NodeIdSettings.getAllNodeIdSettings = function()
{
    var allSettings = NodeIdSettings.ScalarStatic()
        .concat( Settings.ServerTest.NodeIds.Static.AllProfiles.Arrays.Settings )
        .concat( NodeIdSettings.ArraysDAAnalogType() )
        .concat( NodeIdSettings.DAAStaticDataItem() )
        .concat( NodeIdSettings.DAStaticAnalog() )
        .concat( NodeIdSettings.DAStaticTwoStateDiscreteItems() )
        .concat( NodeIdSettings.DAStaticMultiStateDiscreteItems() )
        .concat( NodeIdSettings.DAStaticArrayItemTypeValueItems() )
        .concat( NodeIdSettings.getNodeWithReferencesInBothDirections() )
        .concat( NodeIdSettings.UnknownNodeIds() )
        .concat( NodeIdSettings.InvalidNodeIds() )
        .concat( NodeIdSettings.Paths() );
    return( allSettings );
}