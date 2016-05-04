include( "./library/Utilities/ExportAddressSpace/exportServerAddressSpace.js" );


var outputFilename = "C:/temp/nodeIds_";
var indentEachLevel = true;

/* input parameters:
     - references: array of UaReferenceDescription objects
     - level
*/
function writeToCSV( references, level )
{
    if( !isDefined( [ references, level ] ) ){ return; }
    if( !isDefined( references.length ) ){ references = [ references ]; }
    for( var r=0; r<references.length; r++ )
    {
        // remove any undesirables
        if( references[r].NodeId.NodeId === new UaNodeId() )
        {
            continue;
        }
        // we only care about Variable node classes:
        if( references[r].NodeClass & NodeClass.Variable )
        {
            // add a new line, and an applicable # of tabs (one tab per level)
            outputString += "\n";
            // add indents, to make readable;
            for( var l=0; l<level-1; l++ ){ outputString += "\t"; }
            // now output the nodeid, browseName, displayName, isForward, nodeClass, referenceTypeId, and typeDefinition 
            outputString += references[r].NodeId.NodeId.toString() + ","
                + references[r].BrowseName.Name.toString() + ","
                + references[r].DisplayName.Text.toString() + ","
                + references[r].IsForward.toString() + ","
                + references[r].NodeClass.toString() + ","
                + references[r].ReferenceTypeId.toString() + ","
                + references[r].TypeDefinition.NodeId.toString()
        }
    }// for r...
}

// this is our string that will be written to the file system. Create our CSV column headers.
var outputString = "NodeId,BrowseName,DisplayName,IsForward,NodeClass,ReferenceTypeId,TypeDefinition";

try
{
    // define a filename that is based on the server endpoint
    var serverName = readSetting( "/Server Test/Server URL" ).toString();
    serverName = serverName.replace( /([:.-/\\])/g, "_" );
    outputFilename += serverName + ".csv";

    // comment-out line below to prevent each line from indenting to show the level
    //indentEachLevel = false;

    // perform the address-space walk
    walkThroughAddressSpace( { 
            FileOutputFunction:writeToCSV,
            Filter:NodeClass.Unspecified,
            MaxDepth:10,
            Exclude:[ new UaNodeId( Identifier.ViewsFolder ), new UaNodeId( Identifier.TypesFolder ) ],
            MaxNodeCount:999
            } );
}
catch( e )
{
    print( "FAIL: error occured when 'FileOutputFunction:writeToCsv' was specified. Error '" + e.toString() + "'." ); 
}
finally
{
    // output the contents of the variable to the file.
    writeFile( outputFilename, outputString );
    print( "\n\n\n\n**** FILE WRITTEN: " + outputFilename + " *****" );
}