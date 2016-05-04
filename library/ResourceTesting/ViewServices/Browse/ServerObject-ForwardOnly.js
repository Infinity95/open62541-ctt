/*  RESOURCE TESTING;
    prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        In a loop: 
            Calls Browse() on the Server object in the address-space.

    User Configurable Parameters:
        BROWSEDIRECTION = The browseDirection for the Browse call.

    Revision History
        06-Jan-2010 NP: Initial version.
*/

const BROWSEDIRECTION = BrowseDirection.Forward;

include( "./library/ResourceTesting/repetitiveCall.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse.js" );

// this is the function that will be called repetitvely
function browseServerObject()
{
    if( BrowseHelper.Execute( {
            NodesToBrowse: serverObject 
            } ) )
    {
        print( BrowseHelper.ResultsToString() );
    }
}

function initializeBrowser()
{
    BrowseHelper = new BrowseService( Test.Session.Session );
}

// create the variables needed in this script
var BrowseHelper;
var serverObject = new MonitoredItem( new UaNodeId( Identifier.ServerType ), 1 );
serverObject.BrowseDirection = BROWSEDIRECTION;

// Get the test control parameters from the settings
var loopCount = parseInt( readSetting( "/Advanced/ResourceTesting/SubscriptionServiceSetCallCount" ).toString() );

// Perform the iterative call loop
repetitivelyInvoke( initializeBrowser, browseServerObject, loopCount );

// clean-up
BrowseHelper = null;
serverObject = null;