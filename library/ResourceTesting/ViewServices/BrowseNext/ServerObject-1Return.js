/*  RESOURCE TESTING;
    prepared by Nathan Pocock; nathan.pocock@opcfoundation.org

    Description:
        In a loop: 
            Calls BrowseNext() on the Server object in the address-space.
            The max # of references to return is 1, to ensure "paging" is possible.

    User Configurable Parameters:
        BROWSEDIRECTION = The browseDirection for the Browse call.

    Revision History
        06-Jan-2010 NP: Initial version.
*/

const BROWSEDIRECTION = BrowseDirection.Forward;

include( "./library/ResourceTesting/repetitiveCall.js" );
include( "./library/ServiceBased/ViewServiceSet/Browse.js" );
include( "./library/ServiceBased/ViewServiceSet/BrowseNext.js" );

// this is the function that will be called repetitvely
function browseNextServerObject()
{
    if( browseNextHelper.Execute( {
            ContinuationPoints: serverObject, 
            ReleaseContinuationPoints: false 
            } ) )
    {
        print( browseNextHelper.ResultsToString() );
        // check if there is a continuationPoint, if not then we need to start
        // over by calling Browse().
        if( serverObject.ContinuationPoint.isEmpty() )
        {
            print( "*** END OF References Reached... starting test over by calling Browse()..." );
            BrowseHelper.Execute( {
                    NodesToBrowse: serverObject, 
                    MaxReferencesToReturn: 1
                    } );
        }
    }
}

function initializeBrowser()
{
    BrowseHelper = new BrowseService( Test.Session.Session );
    if( !BrowseHelper.Execute( {
            NodesToBrowse: serverObject, 
            MaxReferencesToReturn: 1 
            } ) )
    {
        throw( "Browse failed, cannot move onto BrowseNext testing." );
    }
    browseNextHelper = new BrowseNextService( Test.Session.Session );
}

// create the variables needed in this script
var BrowseHelper;
var browseNextHelper;

var serverObject = new MonitoredItem( new UaNodeId( Identifier.ServerType ), 1 );
serverObject.BrowseDirection = BROWSEDIRECTION;

// Get the test control parameters from the settings
var loopCount = parseInt( readSetting( "/Advanced/ResourceTesting/SubscriptionServiceSetCallCount" ).toString() );

// Perform the iterative call loop
repetitivelyInvoke( initializeBrowser, browseNextServerObject, loopCount );

// clean-up
BrowseHelper = null;
serverObject = null;