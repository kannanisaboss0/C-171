//--------------------------------------------------------------------C-168--------------------------------------------------------------------//
//--------------------------------------------------------------------Automobiles Galore--------------------------------------------------------------------//
//--------------------------------------------------------------------marker.js--------------------------------------------------------------------//

//Registering acomponent to handle marker events
AFRAME.registerComponent("handle-marker",{

    //Schema
    schema:{},

    //Calling an init function
    init: async function(){

        //Declaring a variable that is assigned the automobile list
        var automobiles= await this.getAutomobiles();
        
        //Sourcing the button division tag
        div=document.getElementById("div_btn") 
        
        //Finding the automobiles currently in stock
        automobiles_in_stock=automobiles[0]["in_stock"]
            
        //Adding an event listener for when the marker is found
        this.el.addEventListener("markerFound",()=>{

            //Verifying if the integer-onverted value of the automobiles is greater than 0

            ////Case-1 -The integer-onverted value of the automobiles is greater than 0
            if(parseInt(automobiles_in_stock)>0){


                //Making the divsion tag visible
                div.style.display="flex"

                //Souricng hte marker element and making it visible
                marker_el=document.querySelector("#pagani_mrkr_sb")
                marker_el.setAttribute("visible","true")
            }

            ////Case-2 -Else case
            else{
              
                //Displaying an alert, mentioing the inavailability of the autmobile
                window.alert("Sorry, out of stock!","No Problem!")    
            }    
            })

        //Adding an event listener for when the marker is lost
        this.el.addEventListener("markerLost",()=>{

            //Making the divsion tag visible
            div.style.display="none"
        }) 
    },
    
    //Defining a function to avail all automobile lists from the database
    getAutomobiles: async function(){

        //Collecting data from firestore
        return  firebase.firestore().collection("automobiles").get().then((snapshot)=>{
           return snapshot.docs.map((doc)=> doc.data()
            )
        })
    }
})


//--------------------------------------------------------------------marker.js--------------------------------------------------------------------//
//--------------------------------------------------------------------Automobiles Galore--------------------------------------------------------------------//
//--------------------------------------------------------------------C-168--------------------------------------------------------------------//