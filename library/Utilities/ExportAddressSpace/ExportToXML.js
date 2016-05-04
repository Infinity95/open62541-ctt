include( "./library/Utilities/ExportAddressSpace/exportServerAddressSpace.js" );


var outputFilename = "C:/temp/nodeIds_";

/* input parameters:
     - references: array of UaReferenceDescription objects
     - level
*/
function writeToXML( references, level )
{
    if( !isDefined( [ references, level ] ) ){ return; }
    if( !isDefined( references.length ) ){ references = [ references ]; }
    for( var r=0; r<references.length; r++ )
    {
        // we only care about Variable node classes:
        if( references[r].NodeClass & NodeClass.Variable )
        {
            // add a new line
            outputString += "\n\t<Node>";
            // now output the nodeid, browseName, displayName, isForward, nodeClass, referenceTypeId, and typeDefinition 
            // in XML format, with an indent.
            outputString += "\n\t\t<NodeId>" + references[r].NodeId.NodeId.toString() + "</NodeId>"
                + "\n\t\t<BrowseName>" + references[r].BrowseName.Name.toString() + "</BrowseName>"
                + "\n\t\t<DisplayName>" + references[r].DisplayName.Text.toString() + "</DisplayName>"
                + "\n\t\t<IsForward>" + references[r].IsForward.toString() + "</IsForward>"
                + "\n\t\t<NodeClass>" + references[r].NodeClass.toString() + "</NodeClass>"
                + "\n\t\t<ReferenceTypeId>" + references[r].ReferenceTypeId.toString() + "</ReferenceTypeId>"
                + "\n\t\t<TypeDefinition>" + references[r].TypeDefinition.NodeId.toString() + "</TypeDefinition>"
                + "\n\t</Node>";
        }
    }// for r...
}

// this is our string that will be written to the file system. Create our CSV column headers.
var outputString = "<xml>";

try
{
    // define a filename that is based on the server endpoint
    var serverName = readSetting( "/Server Test/Server URL" ).toString();
    serverName = serverName.replace( /([:.-/\\])/g, "_" );
    outputFilename += serverName + ".xml";

    // perform the address-space walk
    walkThroughAddressSpace( { 
            FileOutputFunction:writeToXML,
            Filter:NodeClass.Unspecified,
            Exclude:[ new UaNodeId( Identifier.ViewsFolder ), new UaNodeId( Identifier.TypesFolder ) ],
            MaxDepth:10,
            MaxNodeCount:999 } );
}
catch( e )
{
    print( "FAIL: error occured when 'FileOutputFunction:writeToCsv' was specified. Error '" + e.toString() + "'." ); 
}
finally
{
    // close the XML file
    outputString += "\n</xml>";

    // output the contents of the variable to the file.
    writeFile( outputFilename, outputString );
    print( "\n\n\n\n**** FILE WRITTEN: " + outputFilename + " *****" );
}